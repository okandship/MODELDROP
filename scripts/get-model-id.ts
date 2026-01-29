import { getModelId } from "../schemas/model.ts";

const [creator, name] = Bun.argv.slice(2);

if (!creator || !name) {
  console.error("Usage: bun run scripts/get-model-id.ts <creator> <name>");
  console.error('Example: bun run scripts/get-model-id.ts "Google DeepMind" "Gemini 2.5 Flash Image"');
  process.exit(1);
}

console.log(getModelId(creator, name));
