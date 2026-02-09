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

async function hasGeneratedAvatar(modelId: string): Promise<boolean> {
  const avatarPath = `models avatars/${modelId}.md`;

  if (!(await exists(avatarPath))) {
    return false;
  }

  const content = await Bun.file(avatarPath).text();
  const avatarData = markdownToDataObject(content, ModelAvatarSchema);
  const avatarUrl = avatarData["avatar url"];

  return typeof avatarUrl === "string" && avatarUrl.trim().length > 0;
}

async function loadTweets(): Promise<Record<string, string[]>> {
  const tweets: Record<string, string[]> = {};
  const glob = new Bun.Glob("tweets/*.md");

  for await (const filePath of glob.scan()) {
    const modelId = path.parse(filePath).name;
    const content = await Bun.file(filePath).text();
    const data = markdownToDataObject(content, TweetsSchema);

    if (data.tweets.length) {
      tweets[modelId] = data.tweets;
    }
  }

  return tweets;
}

const models: ModelOutput[] = [];

const glob = new Bun.Glob("models/*.md");

console.log("🔮 scanning model files...");

for await (const filePath of glob.scan()) {
  const content = await Bun.file(filePath).text();
  const data = markdownToDataObject(content, ModelCoreSchema);
  const avatarGenerated = await hasGeneratedAvatar(data.id);
  const model: ModelOutput = { ...data, "avatar generated": avatarGenerated };

  const providersApiEndpoints = await loadProvidersApiEndpoints(model.id);

  if (providersApiEndpoints) {
    model["providers api endpoints"] = providersApiEndpoints;
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

const tweets = await loadTweets();
const tweetsOutputPath = `${outputDir}/tweets.json`;
await Bun.write(tweetsOutputPath, JSON.stringify(tweets, null, 2));

console.log(
  `🐦 tweets built: ${Object.keys(tweets).length} models -> ${tweetsOutputPath}`
);

// build individual description files
const descriptionsDir = `${outputDir}/descriptions`;
await mkdir(descriptionsDir, { recursive: true });

const descriptionsGlob = new Bun.Glob("descriptions/*.md");
let descriptionsCount = 0;

for await (const filePath of descriptionsGlob.scan()) {
  const modelId = path.parse(filePath).name;
  const content = await Bun.file(filePath).text();
  const outputFile = `${descriptionsDir}/${modelId}.json`;

  await Bun.write(outputFile, JSON.stringify({ id: modelId, content }));
  descriptionsCount++;
}

console.log(
  `📝 descriptions built: ${descriptionsCount} models -> ${descriptionsDir}/`
);
