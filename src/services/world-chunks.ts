/**
 * Coordinate primitives for a future expandable world.
 * These do not modify the legacy grid or pack.
 */
export interface WorldPoint {
  x: number;
  y: number;
}

export interface ChunkAddress {
  x: number;
  y: number;
}

export interface ChunkBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const DEFAULT_CHUNK_SIZE = 1024;

function assertChunkSize(size: number): void {
  if (!Number.isSafeInteger(size) || size <= 0) throw new RangeError("Chunk size must be a positive safe integer");
}

export function chunkAt(point: WorldPoint, size = DEFAULT_CHUNK_SIZE): ChunkAddress {
  assertChunkSize(size);
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new RangeError("World coordinates must be finite");
  return { x: Math.floor(point.x / size), y: Math.floor(point.y / size) };
}

export function chunkKey(address: ChunkAddress): string {
  if (!Number.isSafeInteger(address.x) || !Number.isSafeInteger(address.y)) {
    throw new RangeError("Chunk indices must be safe integers");
  }
  return `${address.x},${address.y}`;
}

export function chunkBounds(address: ChunkAddress, size = DEFAULT_CHUNK_SIZE): ChunkBounds {
  assertChunkSize(size);
  chunkKey(address);
  const minX = address.x * size;
  const minY = address.y * size;
  if (![minX, minY, minX + size, minY + size].every(Number.isSafeInteger)) {
    throw new RangeError("Chunk bounds exceed safe integer precision");
  }
  return { minX, minY, maxX: minX + size, maxY: minY + size };
}

export function chunksInBounds(bounds: ChunkBounds, size = DEFAULT_CHUNK_SIZE): ChunkAddress[] {
  assertChunkSize(size);
  const values = [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY];
  if (!values.every(Number.isFinite) || bounds.maxX <= bounds.minX || bounds.maxY <= bounds.minY) {
    throw new RangeError("Expected finite bounds with positive area");
  }
  const first = chunkAt({ x: bounds.minX, y: bounds.minY }, size);
  const last = chunkAt({ x: bounds.maxX - Number.EPSILON * Math.max(1, Math.abs(bounds.maxX)), y: bounds.maxY - Number.EPSILON * Math.max(1, Math.abs(bounds.maxY)) }, size);
  const count = (last.x - first.x + 1) * (last.y - first.y + 1);
  if (!Number.isSafeInteger(count) || count > 10000) throw new RangeError("Too many chunks requested at once");
  const result: ChunkAddress[] = [];
  for (let y = first.y; y <= last.y; y++) {
    for (let x = first.x; x <= last.x; x++) result.push({ x, y });
  }
  return result;
}
