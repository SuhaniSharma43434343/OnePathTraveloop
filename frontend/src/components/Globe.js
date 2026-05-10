import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

export default function Globe() {
  const globeRef = useRef();

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      globeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Sphere ref={globeRef} args={[2.5, 64, 64]} visible>
        <MeshDistortMaterial
          color="#1e1b4b"
          emissive="#4f46e5"
          emissiveIntensity={0.5}
          attach="material"
          distort={0.2}
          speed={1.2}
          roughness={0.4}
          metalness={0.8}
          wireframe
        />
      </Sphere>
      {/* Some glowing markers representing cities could go here */}
    </group>
  );
}
