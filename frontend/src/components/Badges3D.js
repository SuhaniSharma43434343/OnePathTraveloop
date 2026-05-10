import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, ContactShadows } from '@react-three/drei';

function BadgeMesh({ color, label, position }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </mesh>
      </Float>
    </group>
  );
}

export default function Badges3D() {
  return (
    <div className="w-full h-64 bg-gray-900 rounded-3xl overflow-hidden shadow-inner relative border border-white/10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />
        
        <BadgeMesh position={[-2, 0.5, 0]} color="#fbbf24" label="First Trip Planner" />
        <BadgeMesh position={[0, 0.5, 0]} color="#3b82f6" label="Globetrotter" />
        <BadgeMesh position={[2, 0.5, 0]} color="#10b981" label="Budget Master" />
        
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
