import { exists, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { markdownToDataObject } from "@okandship/h3kv";
import { z } from "zod";
import { ModelCoreSchema } from "../schemas/model";
import {
  DATA_DIR,
  getAvatarPath,
  getDescriptionPath,
  getProvidersApiEndpointsDirPath,
  getTweetsPath,
} from "./data-paths";

const ProviderApiEndpointsSchema = z.object({
  any: z.string().optional(),
  "text to image": z.string().optional(),
  "image to image": z.string().optional(),
  "text to video": z.string().optional(),
  "image to video": z.string().optional(),
  "video to video": z.string().optional(),
  "reference to video": z.string().optional(),
  "video reference to video": z.string().optional(),
  "text to 3d": z.string().optional(),
  "image to 3d": z.string().optional(),
  "3d to 3d": z.string().optional(),
  "text to speech": z.string().optional(),
  "audio to video": z.string().optional(),
  "text to video (standard)": z.string().optional(),
  "image to video (standard)": z.string().optional(),
  "reference to video (standard)": z.string().optional(),
  "video to video (standard)": z.string().optional(),
  "video reference to video (standard)": z.string().optional(),
  "text to 3d (pro)": z.string().optional(),
  "image to 3d (pro)": z.string().optional(),
  "3d to 3d (part)": z.string().optional(),
  "text to speech (turbo)": z.string().optional(),
  "text to speech (small)": z.string().optional(),
  "audio to video (distilled)": z.string().optional(),
  "image to video (transition)": z.string().optional(),
});
type ProviderApiEndpoints = z.output<typeof ProviderApiEndpointsSchema>;
type ProvidersApiEndpoints = Record<string, ProviderApiEndpoints>;
const ModelAvatarSchema = z.object({
  "avatar url": z.string().optional(),
});
const TweetsSchema = z.object({
  tweets: z.array(z.string()),
});
export type ModelOutput = z.output<typeof ModelCoreSchema> & {
  "providers api endpoints"?: ProvidersApiEndpoints;
  "avatar generated": boolean;
};

// async function loadProvider(providerId: string) {
//   const providerPath = `providers/${providerId}.md`;
//   const provider = await Bun.file(providerPath).text();

//   return markdownToDataObject(provider, ProviderSchema);
// }

async function loadProvidersApiEndpoints(
  modelId: string
): Promise<ProvidersApiEndpoints | undefined> {
  const dirPath = getProvidersApiEndpointsDirPath(modelId);

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

async function hasGeneratedAvatar(modelId: string): Promise<boolean> {
  const avatarPath = getAvatarPath(modelId);

  if (!(await exists(avatarPath))) {
    return false;
  }

  const content = await Bun.file(avatarPath).text();
  const avatarData = markdownToDataObject(content, ModelAvatarSchema);
  const avatarUrl = avatarData["avatar url"];

  return typeof avatarUrl === "string" && avatarUrl.trim().length > 0;
}

async function loadModelTweets(modelId: string): Promise<string[] | undefined> {
  const tweetsPath = getTweetsPath(modelId);
  const tweetsFile = Bun.file(tweetsPath);

  if (!(await tweetsFile.exists())) {
    return;
  }

  const data = markdownToDataObject(await tweetsFile.text(), TweetsSchema);
  return data.tweets.length ? data.tweets : undefined;
}

async function loadModelDescription(
  modelId: string
): Promise<string | undefined> {
  const descriptionPath = getDescriptionPath(modelId);
  const descriptionFile = Bun.file(descriptionPath);

  if (!(await descriptionFile.exists())) {
    return;
  }

  return await descriptionFile.text();
}

const models: ModelOutput[] = [];
const tweets: Record<string, string[]> = {};
const descriptions: Record<string, string> = {};

const glob = new Bun.Glob(path.join(DATA_DIR, "*/core.md"));

console.log("🔮 scanning model files...");

for await (const filePath of glob.scan()) {
  const modelId = path.basename(path.dirname(filePath));
  const content = await Bun.file(filePath).text();
  const data = markdownToDataObject(content, ModelCoreSchema);
  const avatarGenerated = await hasGeneratedAvatar(data.id);
  const model: ModelOutput = { ...data, "avatar generated": avatarGenerated };

  if (model.id !== modelId) {
    throw new Error(`Model ID mismatch: ${model.id} !== ${modelId}`);
  }

  const providersApiEndpoints = await loadProvidersApiEndpoints(model.id);

  if (providersApiEndpoints) {
    model["providers api endpoints"] = providersApiEndpoints;
  }

  const modelTweets = await loadModelTweets(model.id);
  if (modelTweets) {
    tweets[model.id] = modelTweets;
  }

  const modelDescription = await loadModelDescription(model.id);
  if (modelDescription) {
    descriptions[model.id] = modelDescription;
  }

  models.push(model);
}

// sort: upcoming models first (no release date), then by release date desc
models.sort((a, b) => {
  const aDate = a["release date"];
  const bDate = b["release date"];

  if (!(aDate || bDate)) {
    return a.name.localeCompare(b.name);
  }
  if (!aDate) {
    return -1;
  }
  if (!bDate) {
    return 1;
  }

  return bDate.getTime() - aDate.getTime();
});

const outputDir = "public/api";
await mkdir(outputDir, { recursive: true });
const outputPath = `${outputDir}/models.json`;
await Bun.write(outputPath, JSON.stringify(models, null, 2));

console.log(`👑 api built: ${models.length} models -> ${outputPath}`);

const tweetsOutputPath = `${outputDir}/tweets.json`;
await Bun.write(tweetsOutputPath, JSON.stringify(tweets, null, 2));

console.log(
  `🐦 tweets built: ${Object.keys(tweets).length} models -> ${tweetsOutputPath}`
);

// build individual description files
const descriptionsDir = `${outputDir}/descriptions`;
await rm(descriptionsDir, { recursive: true, force: true });
await mkdir(descriptionsDir, { recursive: true });

for (const [modelId, content] of Object.entries(descriptions)) {
  const outputFile = `${descriptionsDir}/${modelId}.json`;

  await Bun.write(outputFile, JSON.stringify({ id: modelId, content }));
}

console.log(
  `📝 descriptions built: ${Object.keys(descriptions).length} models -> ${descriptionsDir}/`
);
