# Home 3D house: parts, timing and GLB swap-in

The home hero (`src/components/home/HeroStory`) assembles a house as the visitor scrolls. Each **part** is
animated from an exploded pose to its home pose by `AssemblyPart`, using the windows in `assemblyConfig.ts`.

## Retuning the choreography

| What | Where |
|---|---|
| When each part flies in, its exploded pose, holds (roof lift, upper-floor ghost) | `assemblyConfig.ts` |
| Copy windows, stage labels, pinned length (`STORY_LENGTH_VH`), scrub lag | `../../components/home/HeroStory/storyContent.ts` |
| Camera path (keys at progress values) | `../CameraRig.tsx` → `KEYS` |
| Sun, sky, glow across the day | `../TimeOfDay.tsx` → `KEYS`; background keys in `storyAtmosphere.ts` |
| Spec chips | `../SpecChips.tsx` → `CHIPS` |

Open the home page with `?debug=1` for a live progress readout, or `?p=0.45` to freeze the story at a value.

## Swapping in a designer model

1. Export the house as **`public/models/house.glb`** (1 unit = 1 m, origin at the centre of the ground-floor
   slab at grade, front elevation facing **+Z**).
2. Name the top-most node of each part exactly as below. A part can be a mesh or a group; anything under it
   moves with it. Parts you leave out are simply skipped.

   | Node name | Part | Notes |
   |---|---|---|
   | `plot` | Land slab | Top surface at y = 0 |
   | `foundation` | Slab + footing | Scales up from the ground |
   | `walls_ground` | Ground-floor walls | Rises from y = 0.35 (its base) |
   | `walls_upper` | Upper storey (incl. its floor slab) | Ghosts to 15% for the interior cutaway |
   | `roof` | Roof planes and gables | Lifts aside for the cutaway |
   | `chimney` | Chimney | Optional; lifts with the roof |
   | `frames` | Window and door frames | Optional |
   | `glazing` | Glass | Use a transparent material; it glows warm at dusk |
   | `cladding` | Stone cladding | Optional; wipes across from x = −8.2 |
   | `interior_*` | Furniture, floors, lights | Every node starting with `interior` joins the interior part |
   | `deck` | Deck, porch, outdoor furniture | |
   | `pool` | Pool basin and water | |
   | `landscape` | Trees, planting, paths | Appears with the landscape stage (no per-item growth) |
   | `lights` | Path lights | |

3. Compress with **meshopt** (decoded by the bundled decoder; Draco is not used because drei loads its decoder
   from a CDN). Target **under 3 MB**:

   ```bash
   npx gltfpack -i house-source.glb -o public/models/house.glb -cc
   # or: npx @gltf-transform/cli optimize house-source.glb public/models/house.glb --compress meshopt
   ```

4. Restart `npm run dev` (the file is detected at server start via `__HOUSE_GLB__` in `vite.config.ts`).
   Delete the file to return to the procedural house.

Materials named with `userData.role` of `glass`, `glow` or `poolGlow` (glTF `extras`) are driven by the
time-of-day lighting; others keep their authored look. Adjust `assemblyConfig.ts` pivots if your geometry's
proportions differ from the procedural house (16 × 10 m footprint).

## Poster image

`public/house-poster.webp` is a still of the finished house, shown while the 3D chunk loads and as the
no-WebGL fallback. Regenerate it after visual changes with the dev server running:

```bash
npm run poster            # or: npm run poster -- --url http://localhost:5174
```
