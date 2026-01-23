# modeldrop-data

Data repository for AI model metadata, provider API endpoints, and avatar generation.

## Project Structure

```
models/           # Model definition files (markdown with structured data)
avatars/          # Generated avatar metadata for models and creators
prompts/          # Prompt templates for avatar generation
providers api endpoints/  # API endpoint configs per model per provider
schemas/          # Zod schemas for data validation
scripts/          # Build and generation scripts
```

## Key Concepts

- **Model IDs**: Format is `<creator-slug>.<model-slug>` (e.g., `black-forest-labs.flux.2-dev`)
- **Data Format**: Uses `@okandship/h3kv` to convert between markdown and structured data objects
- **Schemas**: Zod schemas define model metadata structure (core, extended, license, links, IO)

## Scripts

```bash
bun run scripts/build-api.ts       # Build JSON API from markdown files → public/api/models.json
bun run scripts/add-model.ts       # Add a new model
bun run scripts/generate-avatars.ts # Generate avatar metadata for models
```

## Adding a Model

1. Create `models/<creator-slug>.<model-slug>.md` with required fields from `ModelCoreSchema`
2. Optionally add provider endpoints in `providers api endpoints/<model-id>/<provider>.md`
3. Run `bun run scripts/build-api.ts` to rebuild the API

## Environment Variables

See `.env.example` for required variables:
- `MD_API_BASE_URL_OR_PATH` - API base URL or local path for fetching model data
- `AVATAR_TEXT_MODEL` - Model ID for generating avatar metadata
- `S3_PUBLIC_BASE_URL` - Base URL for S3-hosted assets

## Code Style

Uses Ultracite (Biome preset). See `AGENTS.md` for full standards.

```bash
bun x ultracite fix    # Format and fix
bun x ultracite check  # Check for issues
```
