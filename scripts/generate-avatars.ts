import { dataObjectToMarkdown, markdownToDataObject } from "@okandship/h3kv";
import { generateText, Output } from "ai";
import { z } from "zod";
import { getCreatorId, type ModelCoreSchema } from "../schemas/model";
import { getApiData, readPrompt, requireEnv, withPrefix } from "../utils";
import type { ModelOutput } from "./build-api";

const CreatorIdentitySchema = z.object({
  monster: z.string(),
  palette: z.array(z.string()),
  reasoning: z.string(),
});

const CreatorIdentityCacheSchema = z.object({
  ...CreatorIdentitySchema.shape,

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

const ModelIdentitySchema = z.object({
  item: z.string(),
  material: z.string(),
  reasoning: z.string(),
});

const ModelIdentityCacheSchema = z.object({
  ...ModelIdentitySchema.shape,

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
});

// interface ModelCache {
//   modelId: string;
//   creator: string;
//   item?: string;
//   material?: string;
//   itemReasoning?: string;
//   createImage?: {
//     provider: "fal";
//     model: string;
//     r2Key: string;
//     url: string;
//     generatedAt: string;
//   };
//   restyleImage?: {
//     provider: "fal";
//     model: string;
//     r2Key: string;
//     url: string;
//     generatedAt: string;
//   };
//   updatedAt: Date;
// }

// interface GeneratedImage {
//   uint8Array: Uint8Array;
//   mimeType?: string;
//   contentType?: string;
// }

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

async function getCreatorIdentity(
  name: string
): Promise<z.output<typeof CreatorIdentitySchema>> {
  const id = getCreatorId(name);
  const cache = Bun.file(`avatars/${id}.md`);

  if (await cache.exists()) {
    return markdownToDataObject(await cache.text(), CreatorIdentitySchema);
  }

  const model = requireEnv("AVATAR_TEXT_MODEL");
  const system = await readPrompt("get-creator-monster-palette");
  const prompt = createPromptString({ name });

  const { output } = await generateText({
    model,
    output: Output.object({
      schema: CreatorIdentitySchema,
    }),
    system,
    prompt,
  });

  await cache.write(
    dataObjectToMarkdown(
      CreatorIdentityCacheSchema.parse({
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
      } satisfies z.output<typeof CreatorIdentityCacheSchema>),
      CreatorIdentityCacheSchema
    )
  );

  return output;
}

function createPromptString(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

async function getModelIdentity(
  id: string,
  name: string,
  size: string,
  modality: string,
  monster: string
): Promise<z.output<typeof ModelIdentitySchema>> {
  const cache = Bun.file(`avatars/${id}.md`);

  if (await cache.exists()) {
    return markdownToDataObject(await cache.text(), ModelIdentitySchema);
  }

  const model = requireEnv("AVATAR_TEXT_MODEL");
  const system = await readPrompt("get-model-item-material");
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
      schema: ModelIdentitySchema,
    }),
    system,
    prompt,
  });

  await cache.write(
    dataObjectToMarkdown(
      ModelIdentityCacheSchema.parse({
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
      } satisfies z.output<typeof ModelIdentityCacheSchema>),
      ModelIdentityCacheSchema
    )
  );

  return output;
}

// async function createModelAvatar({
//   falModelId,
//   monster,
//   item,
// }: {
//   falModelId: string;
//   monster: string;
//   item: string;
// }) {
//   const promptTemplate = await readPrompt("create-model-avatar");
//   const prompt = promptTemplate
//     .replaceAll("{monster}", monster)
//     .replaceAll("{item}", item);

//   const { image } = await generateImage({
//     model: fal.image(falModelId),
//     prompt,
//     providerOptions: {
//       fal: {
//         syncMode: true,
//         enableSafetyChecker: false,
//         outputFormat: "png",
//       },
//     },
//   });

//   const imageData = image as GeneratedImage;

//   return {
//     bytes: imageData.uint8Array,
//     contentType: getImageContentType(imageData),
//   };
// }

// async function restyleModelAvatar({
//   monster,
//   item,
//   material,
//   palette,
//   imageUrl,
// }: {
//   monster: string;
//   item: string;
//   material: string;
//   palette: [string, string];
//   imageUrl: string;
//   styleUrl: string;
// }) {
//   const promptTemplate = await readPrompt("restyle-model-avatar");
//   const prompt = promptTemplate
//     .replaceAll("{material}", material)
//     .replaceAll("{monster}", monster)
//     .replaceAll("{item}", item)
//     .replaceAll("{palette}", toPaletteString(palette));

//   const styleUrl = requireEnv("AVATAR_STYLE_REFERENCE_IMAGE_URL");

//   const { image } = await generateImage({
//     model: fal.image(SEEDREAM_EDIT_MODEL),
//     prompt,
//     providerOptions: {
//       fal: {
//         imageUrls: [imageUrl, styleUrl],
//         syncMode: true,
//         enableSafetyChecker: false,
//         outputFormat: "png",
//       },
//     },
//   });

//   const imageData = image as GeneratedImage;

//   return {
//     bytes: imageData.uint8Array,
//     contentType: getImageContentType(imageData),
//   };
// }
//

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

const models: ModelOutput[] = await getApiData("models");

for await (const model of models) {
  const modality = pickPrimaryModality(model["main modality"]);
  if (!(modality && ["image", "video", "audio"].includes(modality))) {
    console.warn(
      `Skipping ${model.id}: unsupported modality ${model["main modality"].join(", ")}`
    );
    continue;
  }

  const creatorIdentity = await getCreatorIdentity(model.creator);
  const modelIdentity = await getModelIdentity(
    model.id,
    model.nickname ?? model.name,
    mapEditionToSize(model.edition),
    modality,
    creatorIdentity.monster
  );

  console.log("☀️", modelIdentity);

  // const itemMaterial =
  //   cachedModel?.item && cachedModel?.material && !force
  //     ? cachedModel
  //     : await getModelItemMaterial(model.edition, modality, model.id);

  // let falTextToImageModelEndpoint: string | undefined;

  // if (modality === "image") {
  //   falTextToImageModelEndpoint = findFalTextToImageEndpoint(model);
  // }

  // if (!falTextToImageModelEndpoint) {
  //   falTextToImageModelEndpoint =
  //     findFalTextToImageEndpoint(fallbackImageModel);
  // }

  // if (!falTextToImageModelEndpoint) {
  //   throw new Error(
  //     `No fal text to image model endpoint found for ${model.id} (fallback: ${fallbackImageModel.id})`
  //   );
  // }

  // const modelCache: ModelCache = {
  //   modelId: model.id,
  //   creator: model.creator,
  //   item: itemMaterial.item,
  //   material: itemMaterial.material,
  //   itemReasoning: itemMaterial.itemReasoning,
  //   createImage: cachedModel?.createImage,
  //   restyleImage: cachedModel?.restyleImage,
  //   updatedAt: new Date(),
  // };

  // if (!modelCache.createImage || force) {
  //   const { bytes, contentType } = await createModelAvatar({
  //     falModelId: falTextToImageModelEndpoint,
  //     monster: creatorIdentity.monster,
  //     item: itemMaterial.item ?? "",
  //   });

  //   const key = `avatars/${model.id}/create.png`;
  //   const url = await uploadToS3(key, bytes, contentType);

  //   modelCache.createImage = {
  //     provider: "fal",
  //     model: falTextToImageModelEndpoint,
  //     r2Key: key,
  //     url,
  //     generatedAt: new Date(),
  //   };
  // }

  // if (modelCache.createImage && (!modelCache.restyleImage || force)) {
  //   const { bytes, contentType } = await restyleModelAvatar({
  //     monster: creatorIdentity.monster,
  //     item: itemMaterial.item ?? "",
  //     material: itemMaterial.material ?? "",
  //     palette: creatorIdentity.palette,
  //     imageUrl: modelCache.createImage.url,
  //     styleUrl: styleReferenceUrl,
  //   });

  //   const key = `avatars/${model.id}/restyle.png`;
  //   const url = await uploadToS3(key, bytes, contentType);

  //   modelCache.restyleImage = {
  //     provider: "fal",
  //     model: SEEDREAM_EDIT_MODEL,
  //     r2Key: key,
  //     url,
  //     generatedAt: new Date(),
  //   };
  // }

  // await writeJson(modelCachePath, modelCache);
  // console.info(`✅ avatar updated: ${model.id}`);
}
