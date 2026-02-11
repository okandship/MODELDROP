import { S3Client } from "bun";

// Collect valid model IDs from models/ directory
const modelIds = new Set<string>();
const glob = new Bun.Glob("models/*.md");

for await (const filePath of glob.scan()) {
  const id = filePath.replace("models/", "").replace(".md", "");
  modelIds.add(id);
}

console.log(`Found ${modelIds.size} models\n`);

// List all S3 objects under models/avatars/ (includes raw/ subdirectory)
const orphans: string[] = [];
let startAfter: string | undefined;
let hasMore = true;

while (hasMore) {
  const result = await S3Client.list({
    prefix: "models/avatars/",
    maxKeys: 1000,
    ...(startAfter ? { startAfter } : {}),
  });

  const contents = result.contents ?? [];

  for (const object of contents) {
    const key = object.key;

    // Skip non-png files
    if (!key.endsWith(".png")) {
      continue;
    }

    // Skip the style reference image
    if (key === "models/avatars/style/reference.png") {
      continue;
    }

    // Extract model ID from key (e.g. "models/avatars/raw/foo.bar.png" → "foo.bar")
    const filename = key.split("/").pop();
    if (!filename) {
      continue;
    }

    const modelId = filename.replace(".png", "");

    if (!modelIds.has(modelId)) {
      orphans.push(key);
    }
  }

  hasMore = result.isTruncated ?? false;
  if (hasMore && contents.length > 0) {
    startAfter = contents[contents.length - 1].key;
  }
}

if (orphans.length === 0) {
  console.log("No orphaned avatars found.");
  process.exit(0);
}

console.log(`Found ${orphans.length} orphaned avatar(s):\n`);
for (const key of orphans) {
  console.log(`  ${key}`);
}

// Prompt for confirmation
const answer = prompt("\nDelete these files from S3? (y/N)");

if (answer?.toLowerCase() !== "y") {
  console.log("Aborted.");
  process.exit(0);
}

// Delete orphans
let deleted = 0;
for (const key of orphans) {
  try {
    await S3Client.delete(key);
    console.log(`  Deleted ${key}`);
    deleted++;
  } catch (error) {
    console.error(`  Failed to delete ${key}:`, error);
  }
}

console.log(`\nDone. Deleted ${deleted}/${orphans.length} files.`);
