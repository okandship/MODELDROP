import { dataObjectToMarkdown, markdownToDataObject } from "@okandship/h3kv";
import { ModelCoreSchema } from "./schemas/model";

const markdown = `### main modality

image

### edition

standard

### creator

Google

### name

Gemini 2.5 Flash Image

### nickname

Nano Banana

### family

Gemini

### version

2.5

### variant

Flash
Image

### aka

_No response_

### release date

2025-10-02

### is preview release

no

### base model

_No response_`;

const dataObject = markdownToDataObject(markdown, ModelCoreSchema);
console.log(dataObject);

const newMarkdown = dataObjectToMarkdown(dataObject, ModelCoreSchema);
console.log(newMarkdown);

console.log(dataObject);

const nanoBanana = {
  creator: "Google",
  name: "Gemini 2.5 Flash Image",
  nickname: "Nano Banana",
  family: "Gemini",
  version: "2.5",
  variant: ["Flash", "Image"],

  "release date": new Date("2025-10-02"),
  "is preview release": false,
};

console.log(nanoBanana);
