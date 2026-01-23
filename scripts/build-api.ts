import { exists, mkdir } from "node:fs/promises";
import path from "node:path";
import { markdownToDataObject } from "@okandship/h3kv";
import { z } from "zod";
import { ModelCoreSchema } from "../schemas/model";

const ProviderApiEndpointsSchema = z.object({
  any: z.string().optional(),
  "text to image": z.string().optional(),
  "image to image": z.string().optional(),
});
type ProviderApiEndpoints = z.output<typeof ProviderApiEndpointsSchema>;
type ProvidersApiEndpoints = Record<string, ProviderApiEndpoints>;
export type ModelOutput = z.output<typeof ModelCoreSchema> & {
  "providers api endpoints"?: ProvidersApiEndpoints;
};

// async function loadProvider(providerId: string) {
//   const providerPath = `providers/${providerId}.md`;
//   const provider = await Bun.file(providerPath).text();

//   return markdownToDataObject(provider, ProviderSchema);
// }

async function loadProvidersApiEndpoints(
  modelId: string
): Promise<ProvidersApiEndpoints | undefined> {
  const dirPath = `providers api endpoints/${modelId}`;

  if (!(await exists(dirPath))) {
    return;
  }

  const providersGlob = new Bun.Glob(`${dirPath}/*.md`);
  const providers: ProvidersApiEndpoints = {};

  for await (const filePath of providersGlob.scan()) {
    const providerId = path.parse(filePath).name;
    // const providerData = await loadProvider(providerId);
    const content = await Bun.file(filePath).text();

    const endpoints = markdownToDataObject(content, ProviderApiEndpointsSchema);

    if (!Object.keys(endpoints).length) {
      continue;
    }

    providers[providerId] = endpoints;
  }

  return Object.keys(providers).length ? providers : undefined;
}

const models: ModelOutput[] = [];

const glob = new Bun.Glob("models/*.md");

console.log("🔮 scanning model files...");

for await (const filePath of glob.scan()) {
  const content = await Bun.file(filePath).text();
  const data = markdownToDataObject(content, ModelCoreSchema);
  const model: ModelOutput = { ...data };

  const providersApiEndpoints = await loadProvidersApiEndpoints(model.id);

  if (providersApiEndpoints) {
    model["providers api endpoints"] = providersApiEndpoints;
  }

  models.push(model);
}

// sort by release date desc
models.sort((a, b) => {
  return b["release date"].getTime() - a["release date"].getTime();
});

const outputDir = "public/api";
await mkdir(outputDir, { recursive: true });
const outputPath = `${outputDir}/models.json`;
await Bun.write(outputPath, JSON.stringify(models, null, 2));

console.log(`👑 api built: ${models.length} models -> ${outputPath}`);
