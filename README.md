# MODELDROP

[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

open data repository for generative media AI models metadata + providers API endpoints.

## What's in here

```
models/                      # Model definitions (markdown with structured data)
avatars/                     # Generated avatar metadata
providers api endpoints/     # API endpoint configs per model per provider
```

## Model ID format

Model IDs use the format `<creator-slug>.<model-slug>`. Generate one with:

```bash
bun run scripts/get-model-id.ts "Google DeepMind" "Gemini 2.5 Flash Image"
# google-deepmind.gemini-2.5-flash-image
```

Each model file is markdown with structured key-value data, parsed using [@okandship/h3kv](https://jsr.io/@okandship/h3kv).

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
