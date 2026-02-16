# Contributing to MODELDROP

Thanks for your interest in contributing to MODELDROP.

## Adding a model

The easiest way to add a new model is through the [issue form](https://github.com/okandship/MODELDROP/issues/new?template=add-model.yml). Fill out the form and a curator will review and approve your submission.

## Suggesting corrections

If you notice incorrect data or want to suggest improvements:

- Open a [discussion](https://github.com/okandship/MODELDROP/discussions/categories/%E1%9A%B1meta)

## Direct contributions

If you're submitting a PR directly:

1. Model core files go in `data/<model-id>/core.md`
2. Provider endpoints go in `data/<model-id>/providers api endpoints/<provider>.md`
3. Follow the existing data format (markdown with key-value pairs) - see `schemas/model.ts` for the schema definition

## Model ID format

Model IDs use the format `<creator-slug>.<model-slug>`. Generate one with:

```bash
bun run scripts/get-model-id.ts "Google DeepMind" "Gemini 2.5 Flash Image"
# google-deepmind.gemini-2.5-flash-image
```

## Code of conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.
