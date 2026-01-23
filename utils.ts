import { join } from "node:path";

export function requireEnv(name: string) {
  const value = Bun.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function getApiData(endpoint: string) {
  const base = requireEnv("MD_API_BASE_URL_OR_PATH");
  const isLocalPath = !base.startsWith("https://");
  const full = `${base}/${endpoint}.json`;

  if (isLocalPath) {
    const file = Bun.file(full);
    return await file.json();
  }

  const response = await fetch(full);
  if (!response.ok) {
    throw new Error(`Failed to fetch model data: ${response.statusText}`);
  }
  return await response.json();
}

export async function readPrompt(filename: string) {
  const file = Bun.file(join("prompts", `${filename}.md`));
  return await file.text();
}

type Prefixed<P extends string, T> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

export function withPrefix<P extends string, T extends Record<string, unknown>>(
  prefix: P,
  obj: T
): Prefixed<P, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${prefix}${k}`, v])
  ) as unknown as Prefixed<P, T>;
}
