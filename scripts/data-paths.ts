import path from "node:path";

export const DATA_DIR = "data";
export const CORE_FILENAME = "core.md";
export const DESCRIPTION_FILENAME = "description.md";
export const TWEETS_FILENAME = "tweets.md";
export const AVATAR_FILENAME = "avatar.md";
export const PROVIDERS_API_ENDPOINTS_DIRNAME = "providers api endpoints";

export function getDataDirPath(id: string): string {
  return path.join(DATA_DIR, id);
}

export function getCorePath(modelId: string): string {
  return path.join(getDataDirPath(modelId), CORE_FILENAME);
}

export function getDescriptionPath(modelId: string): string {
  return path.join(getDataDirPath(modelId), DESCRIPTION_FILENAME);
}

export function getTweetsPath(modelId: string): string {
  return path.join(getDataDirPath(modelId), TWEETS_FILENAME);
}

export function getAvatarPath(id: string): string {
  return path.join(getDataDirPath(id), AVATAR_FILENAME);
}

export function getProvidersApiEndpointsDirPath(modelId: string): string {
  return path.join(getDataDirPath(modelId), PROVIDERS_API_ENDPOINTS_DIRNAME);
}
