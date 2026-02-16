[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

# MODELDROP

<img width="1200" height="630" alt="opengraph-image" src="https://github.com/user-attachments/assets/011e4619-6dd6-4d91-b190-b01e5d400f17" />

**Open data for generative AI models.** Structured metadata, provider API endpoints, and generated avatars for image, video, audio, and 3D models — all public domain.

```
curl -s https://data.modeldrop.fyi/api/models.json | jq '.[0]'
```

## Why

There's no single source of truth for generative media model metadata. Model names, capabilities, and API endpoints are scattered across provider docs, blog posts, and social media. MODELDROP collects this into version-controlled, machine-readable data that anyone can use.

## Data format

Model data lives in markdown files parsed with [H3KV](https://github.com/okandship/H3KV). Human-readable, git-diffable, and trivially parseable:

```markdown
### id
bytedance-seed.seedream-4.5

### main modality
- image

### creator
ByteDance Seed

### name
Seedream 4.5

### release date
2025-12-03
```

Provider API endpoints map model IDs to provider-specific identifiers:

```markdown
### text to image
fal-ai/bytedance/seedream/v4.5/text-to-image

### image to image
fal-ai/bytedance/seedream/v4.5/edit
```

## Using the data

**Public API** — no auth, no rate limits:

```
https://data.modeldrop.fyi/api/models.json
```

**Raw files** — clone the repo and read directly from `data/` (for example `data/<model-id>/core.md` and `data/<model-id>/providers api endpoints/*.md`).

**Model ID format** — `<creator-slug>.<model-slug>`:

```bash
bun run scripts/get-model-id.ts "Black Forest Labs" "FLUX.2 [dev]"
# black-forest-labs.flux.2-dev
```

## Repository structure

```
data/                          Per-ID folders for models and creators (core, description, providers, avatar, tweets)
prompts/                       Avatar generation prompt templates
schemas/                       Zod validation schemas
scripts/                       Build, generation, and maintenance scripts
```

## Contributing

**Fastest way** — submit through the [issue form](https://github.com/okandship/MODELDROP/issues/new?template=add-model.yml). A curator reviews and merges.

**Direct PRs** — see [CONTRIBUTING.md](CONTRIBUTING.md) for file naming conventions and data format.

## Community

- [Discussions](https://github.com/okandship/modeldrop/discussions)
- [@okandship on X](https://x.com/okandship)

## License

[CC0 1.0 Universal](LICENSE) — public domain. Use the data however you want.
