import { describe, expect, it } from "vitest";
import { chunkAt, chunkBounds, chunkKey, chunksInBounds } from "./world-chunks";

describe("world chunk coordinates", () => {
  it("addresses positive and negative world positions", () => {
    expect(chunkAt({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(chunkAt({ x: -1, y: -1024 })).toEqual({ x: -1, y: -1 });
    expect(chunkAt({ x: 1024, y: 2048 })).toEqual({ x: 1, y: 2 });
  });

  it("computes stable bounds and keys", () => {
    expect(chunkKey({ x: -2, y: 3 })).toBe("-2,3");
    expect(chunkBounds({ x: -1, y: 2 })).toEqual({
      minX: -1024, minY: 2048, maxX: 0, maxY: 3072
    });
  });

  it("enumerates only chunks overlapping the viewport", () => {
    expect(chunksInBounds({ minX: -10, minY: -10, maxX: 10, maxY: 10 }, 10)).toEqual([
      { x: -1, y: -1 }, { x: 0, y: -1 },
      { x: -1, y: 0 }, { x: 0, y: 0 }
    ]);
    expect(chunksInBounds({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 10)).toEqual([{ x: 0, y: 0 }]);
  });

  it("rejects invalid or excessive requests", () => {
    expect(() => chunkAt({ x: Number.NaN, y: 0 })).toThrow(RangeError);
    expect(() => chunkAt({ x: 0, y: 0 }, 0)).toThrow(RangeError);
    expect(() => chunksInBounds({ minX: 0, minY: 0, maxX: 100000, maxY: 100000 }, 10)).toThrow(RangeError);
  });
});
