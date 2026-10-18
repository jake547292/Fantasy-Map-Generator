# Expandable world: implementation plan

This branch starts with coordinate primitives in `src/services/world-chunks.ts`. They support signed chunk addresses, including west/north of the original origin, and bounded viewport queries. They are not yet wired into Azgaar's map editor.

## Existing architecture constraints

- `src/generators/grid-generator.ts` generates a single jittered point grid and Voronoi graph for a fixed width and height.
- Cell identifiers are array positions; the packed graph, state ownership, features, rivers, and settlements refer to those positions.
- `src/controllers/submap-tool.ts` resamples a selected region destructively. It is not a safe extension mechanism.
- Save/load must preserve existing edits and world coordinates.

## Next milestones

1. Introduce chunk storage with persistent chunk IDs and a legacy-map adapter.
2. Generate neighboring chunks deterministically without changing old points or their IDs.
3. Reconcile seams, coastal topology, climate and rivers across adjacent chunks.
4. Support country ownership and political borders across chunk boundaries.
5. Render only visible chunks, implement an expansion control, and version the save schema.
6. Add regression tests for loading existing maps, edits, border continuity and round-trip saving.

A chunk-based world is effectively unbounded in ordinary use, not literally infinite. Coordinate precision, disk space and rendering impose practical limits.

Do not regenerate existing terrain or renumber existing cells as a shortcut.
