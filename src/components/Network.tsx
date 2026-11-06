import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Graph({ light }: { light: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const { nodes, lines } = useMemo(() => {
    const n: THREE.Vector3[] = []
    for (let i = 0; i < 46; i++) n.push(new THREE.Vector3((Math.random() - .5) * 9, (Math.random() - .5) * 6, (Math.random() - .5) * 4 - 1))
    const pts: number[] = []
    n.forEach((a, i) => n.forEach((b, j) => { if (j > i && a.distanceTo(b) < 2.1) pts.push(a.x, a.y, a.z, b.x, b.y, b.z) }))
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const p = new THREE.BufferGeometry().setFromPoints(n)
    return { nodes: p, lines: g }
  }, [])
  useFrame((s, dt) => {
    group.current.rotation.y += (s.pointer.x * 0.25 - group.current.rotation.y) * Math.min(1, dt * 2)
    group.current.rotation.x += (-s.pointer.y * 0.15 - group.current.rotation.x) * Math.min(1, dt * 2)
  })
  return (
    <group ref={group}>
      <lineSegments geometry={lines}><lineBasicMaterial color={light ? '#4f7d00' : '#c6ff3d'} transparent opacity={light ? 0.28 : 0.16} /></lineSegments>
      <points geometry={nodes}><pointsMaterial color={light ? '#14150f' : '#f2efe6'} size={0.06} sizeAttenuation /></points>
    </group>
  )
}
export default function Network({ light = false }: { light?: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: false, powerPreference: 'low-power' }} aria-hidden>
      <Graph light={light} />
    </Canvas>
  )
}
