[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

# MODELDROP

<img width="1200" height="630" alt="opengraph-image" src="https://github.com/user-attachments/assets/011e4619-6dd6-4d91-b190-b01e5d400f17" />

> open data repository for generative media AI models metadata + providers API endpoints.

## What's in here

```
models/                      # Model definitions (markdown with structured data)
avatars/                     # Generated models avatars metadata (used by modeldrop.fyi)
providers api endpoints/     # API endpoints names per model per provider
```

## Model ID format

Models IDs use the format `<creator-slug>.<model-slug>`. Generate one with:

```bash
bun run scripts/get-model-id.ts "Google DeepMind" "Gemini 2.5 Flash Image"
# google-deepmind.gemini-2.5-flash-image
```

Each model file is markdown with structured key-value data, parsed using [H3KV](https://github.com/okandship/H3KV).

## Using the data

The built API is available at:
```
https://data.modeldrop.fyi/api/models.json
```

Or access the raw markdown files directly from the `models/` directory.

## Contributing

The easiest way to add a model is through the [issue form](https://github.com/okandship/MODELDROP/issues/new?template=add-model.yml).

For other contributions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Community

- [Discussions](https://github.com/okandship/modeldrop/discussions)
- [@okandship on X](https://x.com/okandship)

## License

[CC0 1.0 Universal](LICENSE) - Public Domain
