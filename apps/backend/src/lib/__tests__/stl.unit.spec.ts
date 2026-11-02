import { parseStl } from "../stl"

// Axis-aligned box from (0,0,0) to (sx,sy,sz) as 12 outward-facing triangles
function boxTriangles(sx: number, sy: number, sz: number): number[][] {
  const p = (x: number, y: number, z: number) => [x * sx, y * sy, z * sz]
  const quads = [
    [p(0, 0, 0), p(0, 1, 0), p(1, 1, 0), p(1, 0, 0)],
    [p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)],
    [p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)],
    [p(0, 1, 0), p(0, 1, 1), p(1, 1, 1), p(1, 1, 0)],
    [p(0, 0, 0), p(0, 0, 1), p(0, 1, 1), p(0, 1, 0)],
    [p(1, 0, 0), p(1, 1, 0), p(1, 1, 1), p(1, 0, 1)],
  ]
  return quads.flatMap(([a, b, c, d]) => [
    [...a, ...b, ...c],
    [...a, ...c, ...d],
  ])
}

function toBinary(triangles: number[][]): Buffer {
  const buffer = Buffer.alloc(84 + triangles.length * 50)
  buffer.write("solid exported-as-binary", 0)
  buffer.writeUInt32LE(triangles.length, 80)
  triangles.forEach((t, i) => {
    t.forEach((n, j) => buffer.writeFloatLE(n, 84 + i * 50 + 12 + j * 4))
  })
  return buffer
}

function toAscii(triangles: number[][]): Buffer {
  const facets = triangles.map(
    (t) =>
      `facet normal 0 0 0\nouter loop\n` +
      `vertex ${t[0]} ${t[1]} ${t[2]}\nvertex ${t[3]} ${t[4]} ${t[5]}\n` +
      `vertex ${t[6]} ${t[7]} ${t[8]}\nendloop\nendfacet`
  )
  return Buffer.from(`solid box\n${facets.join("\n")}\nendsolid box\n`)
}

describe("parseStl", () => {
  const box = boxTriangles(20, 30, 10)

  it("reads binary STL even when the header starts with 'solid'", () => {
    const g = parseStl(toBinary(box))
    expect(g.triangle_count).toBe(12)
    expect(g.volume_mm3).toBeCloseTo(6000, 3)
    expect(g.bounding_box_mm).toEqual({ x: 20, y: 30, z: 10 })
  })

  it("reads ASCII STL", () => {
    const g = parseStl(toAscii(box))
    expect(g.volume_mm3).toBeCloseTo(6000, 3)
  })

  it("rejects files with no triangles", () => {
    expect(() => parseStl(Buffer.from("not an stl"))).toThrow()
  })
})
