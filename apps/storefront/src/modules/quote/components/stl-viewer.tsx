"use client"

import { Bounds, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useMemo } from "react"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

type StlViewerProps = {
  data: ArrayBuffer
  color?: string
}

function StlMesh({ data, color }: StlViewerProps) {
  const geometry = useMemo(() => {
    const g = new STLLoader().parse(data)
    g.computeVertexNormals()
    g.center()
    // STL files are Z-up; three.js is Y-up
    g.rotateX(-Math.PI / 2)
    // Rest the part on the print bed (grid)
    g.computeBoundingBox()
    g.translate(0, -g.boundingBox!.min.y, 0)
    return g
  }, [data])

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

export default function StlViewer({ data, color = "#f97316" }: StlViewerProps) {
  return (
    // preserveDrawingBuffer lets the canvas be captured as a part thumbnail
    <Canvas
      camera={{ position: [120, 120, 120], fov: 40 }}
      gl={{ preserveDrawingBuffer: true }}
      shadows
    >
      <color attach="background" args={["#f4f4f5"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 200, 100]} intensity={1.2} castShadow />
      <Bounds fit clip observe margin={1.4}>
        <StlMesh data={data} color={color} />
      </Bounds>
      <gridHelper args={[400, 40, "#a1a1aa", "#d4d4d8"]} />
      <OrbitControls makeDefault />
    </Canvas>
  )
}
