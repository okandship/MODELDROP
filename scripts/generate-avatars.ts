import { fal } from "@ai-sdk/fal";
import { dataObjectToMarkdown, markdownToDataObject } from "@okandship/h3kv";
import { generateImage, generateText, Output } from "ai";
import { z } from "zod";
import { getCreatorId, type ModelCoreSchema } from "../schemas/model";
import { getApiData, readPrompt, requireEnv, withPrefix } from "../utils";
import type { ModelOutput } from "./build-api";

const CreatorAvatarIdentitySchema = z.object({
  monster: z.string(),
  palette: z.array(z.string()),
  reasoning: z.string(),
});

const CreatorAvatarIdentityCacheSchema = z.object({
  ...CreatorAvatarIdentitySchema.shape,

  ...withPrefix("creator ", {
    id: z.string(),
    name: z.string(),
  }),

  ...withPrefix("generation ", {
    model: z.string(),
    system: z.string(),
    prompt: z.string(),
  }),
});

const ModelAvatarIdentitySchema = z.object({
  item: z.string(),
  material: z.string(),
  reasoning: z.string(),
});

const ModelAvatarIdentityCacheSchema = z.object({
  ...ModelAvatarIdentitySchema.shape,

  monster: z.string(),

  ...withPrefix("model ", {
    id: z.string(),
    name: z.string(),
    size: z.string(),
    modality: z.string(),
  }),

  ...withPrefix("generation ", {
    model: z.string(),
    system: z.string(),
    prompt: z.string(),
  }),

  ...withPrefix("avatar raw ", {
    url: z.url().optional(),
    model: z.string().optional(),
    prompt: z.string().optional(),
  }),

  ...withPrefix("avatar ", {
    url: z.url().optional(),
    styleUrl: z.url().optional(),
    model: z.string().optional(),
    prompt: z.string().optional(),
  }),
});

function pickPrimaryModality(
  modalities: z.output<typeof ModelCoreSchema>["main modality"]
) {
  if (modalities.includes("image")) {
    return "image";
  }

  if (modalities.includes("video")) {
    return "video";
  }

  if (modalities.includes("audio")) {
    return "audio";
  }

  return modalities[0];
}

async function uploadToS3(key: string, data: Uint8Array, contentType: string) {
  await Bun.s3.write(key, data, { type: contentType });

  const baseUrl = requireEnv("S3_PUBLIC_BASE_URL");
  return new URL(key, baseUrl).toString();
}

async function getCreatorAvatarIdentity(
  name: string
): Promise<z.output<typeof CreatorAvatarIdentitySchema>> {
  const id = getCreatorId(name);
  const cache = Bun.file(`models avatars/${id}.md`);

  if (await cache.exists()) {
    return markdownToDataObject(
      await cache.text(),
      CreatorAvatarIdentitySchema
    );
  }

  const model = requireEnv("AVATAR_TEXT_MODEL");
  const system = await readPrompt("get-creator-avatar-identity");
  const prompt = createPromptString({ name });

  const { output } = await generateText({
    model,
    output: Output.object({
      schema: CreatorAvatarIdentitySchema,
    }),
    system,
    prompt,
  });

  await cache.write(
    dataObjectToMarkdown(
      CreatorAvatarIdentityCacheSchema.parse({
        ...output,

        ...withPrefix("creator ", {
          id,
          name,
        }),

        ...withPrefix("generation ", {
          model,
          system,
          prompt,
        }),
      } satisfies z.output<typeof CreatorAvatarIdentityCacheSchema>),
      CreatorAvatarIdentityCacheSchema
    )
  );

  return output;
}

function createPromptString(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function interpolatePrompt(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

async function getModelAvatarIdentity(
  id: string,
  name: string,
  size: string,
  modality: string,
  monster: string
): Promise<z.output<typeof ModelAvatarIdentitySchema>> {
  const cache = Bun.file(`models avatars/${id}.md`);

  if (await cache.exists()) {
    return markdownToDataObject(await cache.text(), ModelAvatarIdentitySchema);
  }

  const model = requireEnv("AVATAR_TEXT_MODEL");
  const system = await readPrompt("get-model-avatar-identity");
  const prompt = createPromptString({
    ...withPrefix("model ", {
      name,
      size,
      modality,
    }),
    monster,
  });

  const { output } = await generateText({
    model,
    output: Output.object({
      schema: ModelAvatarIdentitySchema,
    }),
    system,
    prompt,
  });

  await cache.write(
    dataObjectToMarkdown(
      ModelAvatarIdentityCacheSchema.parse({
        ...output,

        ...withPrefix("model ", {
          id,
          name,
          size,
          modality,
        }),

        monster,

        ...withPrefix("generation ", {
          model,
          system,
          prompt,
        }),
      } satisfies z.output<typeof ModelAvatarIdentityCacheSchema>),
      ModelAvatarIdentityCacheSchema
    )
  );

  return output;
}

function mapEditionToSize(edition: ModelOutput["edition"]): string {
  switch (edition) {
    case "nano":
      return "small";
    case "max":
      return "large";
    default:
      return "medium";
  }
}

function findFalTextToImageEndpoint(model: ModelOutput) {
  const endpoints = model["providers api endpoints"]?.fal;

  if (!endpoints) {
    return;
  }

  return endpoints["text to image"] ?? endpoints.any;
}

async function createModelAvatar(
  modelId: string,
  monster: string,
  item: string,
  falTextToImageEndpoint: string | undefined
): Promise<string | undefined> {
  const cache = Bun.file(`models avatars/${modelId}.md`);

  if (!(await cache.exists())) {
    console.warn(
      `No identity cache for ${modelId}, skipping avatar generation`
    );
    return;
  }

  const existing = markdownToDataObject(
    await cache.text(),
    ModelAvatarIdentityCacheSchema
  );

  if (existing["avatar raw url"]) {
    console.log(`Avatar already exists for ${modelId}`);
    return existing["avatar raw url"];
  }

  const imageModelId =
    falTextToImageEndpoint ?? requireEnv("AVATAR_FALLBACK_IMAGE_MODEL_FAL");

  const promptTemplate = await readPrompt("create-model-avatar");
  const prompt = interpolatePrompt(promptTemplate, { monster, item });

  console.log(`Generating avatar for ${modelId} using ${imageModelId}`);

  const { image } = await generateImage({
    model: fal.image(imageModelId),
    prompt,
    size: "1024x1024",
    providerOptions: {
      fal: {
        syncMode: true,
        enableSafetyChecker: false,
        outputFormat: "png",
      },
    },
  });

  const s3Key = `models/avatars/raw/${modelId}.png`;
  const avatarUrl = await uploadToS3(s3Key, image.uint8Array, "image/png");

  await cache.write(
    dataObjectToMarkdown(
      ModelAvatarIdentityCacheSchema.parse({
        ...existing,

        ...withPrefix("avatar raw ", {
          url: avatarUrl,
          model: imageModelId,
          prompt,
        }),
      }),
      ModelAvatarIdentityCacheSchema
    )
  );

  return avatarUrl;
}

async function restyleModelAvatar(
  modelId: string,
  avatarRawUrl: string,
  monster: string,
  item: string,
  material: string,
  palette: string[]
): Promise<string | undefined> {
  const cache = Bun.file(`models avatars/${modelId}.md`);

  if (!(await cache.exists())) {
    console.warn(`No identity cache for ${modelId}, skipping avatar restyling`);
    return;
  }

  const existing = markdownToDataObject(
    await cache.text(),
    ModelAvatarIdentityCacheSchema
  );

  if (existing["avatar url"]) {
    console.log(`Restyled avatar already exists for ${modelId}`);
    return existing["avatar url"];
  }

  const imageModelId = requireEnv("AVATAR_RESTYLE_IMAGE_MODEL_FAL");
  const styleUrl = requireEnv("AVATAR_STYLE_REFERENCE_IMAGE_URL");

  const promptTemplate = await readPrompt("restyle-model-avatar");
  const prompt = interpolatePrompt(promptTemplate, {
    monster,
    item,
    material,
    palette: palette.join(", "),
  });

  console.log(`Restyling avatar using ${imageModelId}`);

  const { image } = await generateImage({
    model: fal.image(imageModelId),
    prompt,
    size: "1024x1024",
    providerOptions: {
      fal: {
        imageUrls: [avatarRawUrl, styleUrl],
        syncMode: true,
        enableSafetyChecker: false,
        outputFormat: "png",
      },
    },
  });

  const s3Key = `models/avatars/${modelId}.png`;
  const restyledAvatarUrl = await uploadToS3(
    s3Key,
    image.uint8Array,
    "image/png"
  );

  await cache.write(
    dataObjectToMarkdown(
      ModelAvatarIdentityCacheSchema.parse({
        ...existing,

        ...withPrefix("avatar ", {
          url: restyledAvatarUrl,
          styleUrl,
          model: imageModelId,
          prompt,
        }),
      }),
      ModelAvatarIdentityCacheSchema
    )
  );

  return restyledAvatarUrl;
}

const models: ModelOutput[] = await getApiData("models");

for await (const model of models) {
  const modality = pickPrimaryModality(model["main modality"]);
  if (!(modality && ["image", "video", "audio"].includes(modality))) {
    console.warn(
      `Skipping ${model.id}: unsupported modality ${model["main modality"].join(", ")}`
    );
    continue;
  }

  const creatorIdentity = await getCreatorAvatarIdentity(model.creator);
  const modelIdentity = await getModelAvatarIdentity(
    model.id,
    model.nickname ?? model.name,
    mapEditionToSize(model.edition),
    modality,
    creatorIdentity.monster
  );

  const falEndpoint = findFalTextToImageEndpoint(model);
  const avatarRawUrl = await createModelAvatar(
    model.id,
    creatorIdentity.monster,
    modelIdentity.item,
    falEndpoint
  );

  if (!avatarRawUrl) {
    console.warn(`Skipping ${model.id}: no avatar image exists`);
    continue;
  }

  const avatarUrl = await restyleModelAvatar(
    model.id,
    avatarRawUrl,
    creatorIdentity.monster,
    modelIdentity.item,
    modelIdentity.material,
    creatorIdentity.palette
  );

  console.log(`✅ ${model.id}: ${avatarUrl ?? "skipped"}`);
}
