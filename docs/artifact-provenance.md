# Artifact provenance and recovery status

The referenced ChatGPT conversation, **Mapping Technology Architecture** (`6ae8619f-cd48-83e9-b9a0-9f32c9c8f392`), records that the following files were generated in assistant message `e323a0f9-7958-458b-8644-8398123826cb`:

- `GMG-A_interactive_prototype_v0.1.html`
- `GMG-A_specification_draft_v0.1.md`
- `GMG-A_prototype_and_specification_v0.1.zip`

The message exposes only expired/inaccessible `sandbox:/mnt/data/...` links. The thread API returned no downloadable attachments, the files were not present in the Codex workspace or the user's Downloads folder, and browser recovery could not be safely completed because the automation layer could not verify the current browser URL.

Accordingly:

- This repository does **not** contain reconstructed files under those names.
- The v0.2 specification is preserved from the actual preceding assistant response.
- The current browser demonstrator is a separately identified v0.2 experimental implementation built from the preserved specification, not a substitute represented as the original v0.1 artifact.
- When the original files become available, add them without modification under `archive/v0.1/`, record SHA-256 hashes here, and compare their geometry/state contract against the v0.2 implementation before merging changes.

## Expected recovery record

| Artifact | Expected destination | SHA-256 | Status |
|---|---|---|---|
| `GMG-A_interactive_prototype_v0.1.html` | `archive/v0.1/` | pending | inaccessible |
| `GMG-A_specification_draft_v0.1.md` | `archive/v0.1/` | pending | inaccessible |
| `GMG-A_prototype_and_specification_v0.1.zip` | `archive/v0.1/` | pending | inaccessible |
