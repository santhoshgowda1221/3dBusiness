import { MedusaError } from "@medusajs/framework/utils"

export type StlGeometry = {
  triangle_count: number
  // Enclosed volume in cubic millimetres (STL units are assumed to be mm)
  volume_mm3: number
  bounding_box_mm: { x: number; y: number; z: number }
}

const HEADER_BYTES = 80
const TRIANGLE_BYTES = 50

function isBinaryStl(buffer: Buffer): boolean {
  if (buffer.length < HEADER_BYTES + 4) {
    return false
  }
  const count = buffer.readUInt32LE(HEADER_BYTES)
  // Many binary exporters still start the header with "solid", so the size
  // check is the reliable signal
  return buffer.length === HEADER_BYTES + 4 + count * TRIANGLE_BYTES
}

function* binaryVertices(buffer: Buffer): Generator<number[]> {
  const count = buffer.readUInt32LE(HEADER_BYTES)
  for (let i = 0; i < count; i++) {
    // Skip the 12-byte normal, then read three vertices of 3 floats each
    const offset = HEADER_BYTES + 4 + i * TRIANGLE_BYTES + 12
    const v: number[] = []
    for (let j = 0; j < 9; j++) {
      v.push(buffer.readFloatLE(offset + j * 4))
    }
    yield v
  }
}

function* asciiVertices(buffer: Buffer): Generator<number[]> {
  const pattern =
    /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g
  let current: number[] = []
  for (const match of buffer.toString("utf8").matchAll(pattern)) {
    current.push(Number(match[1]), Number(match[2]), Number(match[3]))
    if (current.length === 9) {
      yield current
      current = []
    }
  }
}

export function parseStl(buffer: Buffer): StlGeometry {
  const triangles = isBinaryStl(buffer)
    ? binaryVertices(buffer)
    : asciiVertices(buffer)

  let count = 0
  let signedVolume = 0
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]

  for (const [ax, ay, az, bx, by, bz, cx, cy, cz] of triangles) {
    if ([ax, ay, az, bx, by, bz, cx, cy, cz].some((n) => !Number.isFinite(n))) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "STL contains invalid vertex coordinates"
      )
    }
    count++
    // Signed volume of the tetrahedron formed with the origin
    signedVolume +=
      (ax * (by * cz - bz * cy) -
        ay * (bx * cz - bz * cx) +
        az * (bx * cy - by * cx)) /
      6
    for (const [x, y, z] of [
      [ax, ay, az],
      [bx, by, bz],
      [cx, cy, cz],
    ]) {
      min[0] = Math.min(min[0], x)
      min[1] = Math.min(min[1], y)
      min[2] = Math.min(min[2], z)
      max[0] = Math.max(max[0], x)
      max[1] = Math.max(max[1], y)
      max[2] = Math.max(max[2], z)
    }
  }

  if (count === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "STL file contains no triangles"
    )
  }

  return {
    triangle_count: count,
    volume_mm3: Math.abs(signedVolume),
    bounding_box_mm: {
      x: max[0] - min[0],
      y: max[1] - min[1],
      z: max[2] - min[2],
    },
  }
}
