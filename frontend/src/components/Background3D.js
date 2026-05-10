import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';

const AnimatedSphere = ({ isDark }) => {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if(sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere visible args={[1, 100, 200]} scale={2} ref={sphereRef}>
      <MeshDistortMaterial
        color={isDark ? '#4f46e5' : '#818cf8'}
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
      />
    </Sphere>
  );
};

export default function Background3D() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedSphere isDark={isDark} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
