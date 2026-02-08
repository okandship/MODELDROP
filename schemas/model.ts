import slugify from "@sindresorhus/slugify";
import { z } from "zod";

const AvailabilityEnum = z.enum(["full", "partial", "none"]);
const EditionEnum = z.enum(["nano", "standard", "max"]);
const CreatorEnum = z.enum([
  "Google DeepMind",
  "Black Forest Labs",
  "fal",
  "ByteDance Seed",
]);
const ModalityEnum = z.enum(["text", "image", "video", "audio", "3d", "pdf"]);
const AccessTypeEnum = z.enum(["api", "web app", "discord", "local"]);
const CapabilityTypeEnum = z.enum([
  "image reference",
  "video reference",
  "image editing",
  "video editing",
  "first frame animation",
  "first-last frame interpolation",
  "audio generation from video",
  "multi-turn chat editing",
  "web search",
  "multi-reference editing",
  "multi-shot video generation",
  "inpainting",
  "outpainting",
  "upscaling",
  "true transparency",
  "multi-image sequence generation",
  "negative prompt",
  "color codes understanding",
  "gps coordinates understanding",
  "style reference",
  "content reference",
  "character reference",
  "prompt rewriter",
  "video extension",
  "safety checker",
  "inference steps",
  "guidance scale",
  "streaming results",
  "lora",
]);
// format: <creator>.<name>
const ModelIdString = z.stringFormat("model id", /^[a-z0-9_-]+\.[a-z0-9._-]+$/);

export function getCreatorId(creator: string) {
  return slugify(creator, { preserveCharacters: ["_"], decamelize: false });
}

export function getModelId(creator: string, name: string) {
  return [
    getCreatorId(creator),
    slugify(name, { preserveCharacters: [".", "_"], decamelize: false }),
  ].join(".");
}

export const ModelCoreSchema = z
  .object({
    id: ModelIdString.default(""), // see overwrite below

    "main modality": z.array(ModalityEnum),
    edition: EditionEnum,

    creator: CreatorEnum,
    name: z.string(),
    nickname: z.string().optional(),
    family: z.string(),
    version: z.string().optional(),
    variant: z.array(z.string()).optional(),
    aka: z.array(z.string()).optional(),

    "release date": z.coerce.date().optional(),
    "is preview release": z.stringbool().or(z.boolean()),

    "base model": ModelIdString.optional(),
    "new version": ModelIdString.optional(),
  })
  .overwrite((data) => ({
    ...data,
    id: getModelId(data.creator, data.name),
  }));

export const ModelExtendedSchema = z.object({
  "access type": z.array(AccessTypeEnum),
  capabilities: z.array(CapabilityTypeEnum),
  "nsfw level": AvailabilityEnum,
  "knowledge cutoff": z.coerce.date(),
});

export const ModelLicenseSchema = z.object({
  license: z.string(),
  "commercial use allowed": z.stringbool().or(z.boolean()),

  "weights available": AvailabilityEnum,
  "inference code available": AvailabilityEnum,
  "training code available": AvailabilityEnum,
  "training data available": AvailabilityEnum,
  "architecture disclosed": AvailabilityEnum,
});

export const ModelLinksSchema = z.object({
  "license url": z.url(),
  "readme url": z.url(),
  "model card url": z.url(),
  "official website url": z.url(),
  "hugging face url": z.url(),
  "github url": z.url(),
});

export const ModelDescriptionSchema = z.object({
  "key features": z.array(z.string()),
  "ideal prompt formats": z.array(z.string()),
  "strongest visual styles": z.array(z.string()),
  "use cases": z.array(z.string()),
});

export const ModelIOSchema = z.object({
  "modalities (input)": z.array(ModalityEnum),
  "modalities (output)": z.array(ModalityEnum),

  "min tokens (input)": z.number(),
  "max tokens (input)": z.number(),
  "min tokens (output)": z.number(),
  "max tokens (output)": z.number(),

  "min images (input)": z.number(),
  "max images (input)": z.number(),
  "min images (output)": z.number(),
  "max images (output)": z.number(),

  "min image resolution (input)": z.string(),
  "max image resolution (input)": z.string(),
  "min image resolution (output)": z.string(),
  "max image resolution (output)": z.string(),

  "image aspect ratios (input)": z.array(z.string()),
  "image aspect ratios (output)": z.array(z.string()),

  "min videos (input)": z.number(),
  "max videos (input)": z.number(),
  "min videos (output)": z.number(),
  "max videos (output)": z.number(),

  "min video resolution (input)": z.string(),
  "max video resolution (input)": z.string(),
  "min video resolution (output)": z.string(),
  "max video resolution (output)": z.string(),

  "min video seconds (input)": z.number(),
  "max video seconds (input)": z.number(),
  "min video seconds (output)": z.number(),
  "max video seconds (output)": z.number(),

  "min video frame rate (input)": z.number(),
  "max video frame rate (input)": z.number(),
  "min video frame rate (output)": z.number(),
  "max video frame rate (output)": z.number(),

  "video aspect ratios (input)": z.array(z.string()),
  "video aspect ratios (output)": z.array(z.string()),

  "file formats (input)": z.array(z.string()),
  "file formats (output)": z.array(z.string()),
});
