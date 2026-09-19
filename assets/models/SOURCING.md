# Book / diary source handoff

Source: https://polyhaven.com/a/binder_notebook — **Binder Notebook**, DaDrood.
Both files are different poses from this one source, not independent original models.

- `diary.glb`: source mesh 0, open; 0.36524 × 0.01785 × 0.19996 m (XYZ).
- `book.glb`: source mesh 1, closed; 0.17065 × 0.02529 × 0.19996 m (XYZ).

Both are ~2.14 MB, flat in XZ, Y-up, centered XZ and minY=0. No rotation required.
Source closed node's +0.26733 X display offset was replaced by centering translation.
Bounds were read from POSITION accessors and applied node translations, not game tested.

License verified 2026-09-12 by fetching https://polyhaven.com/license:
“Our assets are all licensed as CC0” and “You do not need to give credit”.
Exact license: https://creativecommons.org/publicdomain/zero/1.0/ . Attribution retained
voluntarily: DaDrood / Poly Haven. API evidence and source MD5 values are in
`sources/binder-notebook-files.json`; final SHA256 hashes in `MODEL_SOURCES.json`.

Original mesh, texture files, API metadata, and unmodified packaged
`binder-notebook-1k.glb` are retained. Derivatives select a single active mesh pose,
embed the same textures, remove the small turquoise PH emblem using adjacent leather,
and set nonmetal roughness 0.94 with a subtle warm material tint. Both share the same
brown leather/paper appearance, not a fake second model or cloth claim.

Visual inspection: source diffuse atlas shows worn leather, stitching, warm blank paper
and no printed text other than the removed PH emblem. Adapted atlas inspected locally.
No rendered model screenshot, browser interaction, or gameplay test was performed.
Suitability under project lighting remains for Lead/Harvey's visual review.

Other researched candidate: Decorative Book Set 01 by James Ray Cock, same CC0 site,
offers blend/FBX but no glTF in fetched API; not downloaded. Encyclopedia set offers
glTF but was not downloaded because the notebook already includes both required poses.

## Bread sourcing handoff — 2026-09-19
+
Quick candidate check: Kenney Food Kit, https://kenney.nl/assets/food-kit. The page
explicitly links https://creativecommons.org/publicdomain/zero/1.0/ and describes the
package as CC0. The download endpoint was reachable, but the transfer in this workspace
returned an incomplete ZIP and the archive could not be inspected reliably. The partial
download was removed; no bread file is claimed or included.

Lead candidate for a later verified fetch: Kenney Food Kit, with the exact package
contents and selected bread/loaf GLB name recorded after a successful download. Do not
add a registry record until that file, its hash, and its package path are verified.

Local manifest proposal once verified: `id: model.bread`, `kind: model`,
`filename: assets/models/bread.glb`, source set to the Kenney package page above,
license `CC0-1.0`, and the downloaded package URL/hash recorded as provenance. The
scene integration is already prepared to accept this resolved URL as
`RoomAssets.breadModel`; the loader places it on the bakery bench and emits raw
`bread`.
