# Test card and reused desk models

The original generated raster card is `assets/stimuli/inkblot-test-v1.png`, produced via the imagegen skill CLI using the user-authorized OpenDev gpt-image-2 service. Prompt: `assets/prompts/inkblot-test-v1.txt`. It appears before test associations and in the later “What do you see?” callback, with click-to-enlarge. Its appearance does not change by cognition phase. Budget reservation now USD14; actual billed amount unknown.

`assets/models/diary.glb` and `book.glb` are the open and closed poses from DaDrood's [Binder Notebook](https://polyhaven.com/a/binder_notebook), [CC0](https://polyhaven.com/license). They share one source, not two independently authored models. Embedded local textures were made matte, color-adjusted and the small source emblem patched using adjacent leather. Source geometry proportions retained; objects bottom-aligned to desk using uniform scale. See `assets/models/MODEL_SOURCES.json` for hashes and dimensions.

Warm cream paper and worn brown leather were selected to fit the existing palette. Diffuse texture visually inspected; rendered model appearance and gameplay are awaiting user review. Loader preserves book/paper hotspot identities, disposes model resources and keeps clickable blockouts if loading fails. No functional/browser interaction tests were run for this iteration.

User-facing progression steps are in `docs/HOW_TO_CONTINUE.md`. Earlier diary spelling/handwriting and physical bread pickup feedback remains deferred.
