'use client';

import { Canvas } from '@react-three/fiber';
import { Physics, CuboidCollider, interactionGroups } from '@react-three/rapier';
import { Environment, useGLTF } from '@react-three/drei'; // Loaderは削除
import { Suspense, useEffect, useState, useMemo } from 'react';
import BouncingBall from './BouncingBall';
import RollingBall from './RollingBall';
import FloatingBall from './FloatingBall';

const DEPARTMENT_URL = 'https://www.kisode.com';

const SOURCE_FILES = Array.from({ length: 9 }, (_, i) => `/scdball${i + 1}.glb`);

SOURCE_FILES.forEach(path => useGLTF.preload(path));

export default function Experience() {
  const [mode, setMode] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMode(Math.floor(Math.random() * 3));

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeBallFiles = useMemo(() => {
    if (isMobile) {
      return [...SOURCE_FILES]; // スマホは9個
    } else {
      return [
        ...SOURCE_FILES, 
        ...SOURCE_FILES, 
        ...SOURCE_FILES, 
        ...SOURCE_FILES
      ]; // PCは36個
    }
  }, [isMobile]);

  const xRange = isMobile ? 6 : 32;

  const handleBackgroundClick = () => {
    window.location.href = DEPARTMENT_URL;
  };

  return (
    <Canvas 
      orthographic
      camera={{ position: [0, 0, 100], zoom: 45 }}
      onPointerMissed={handleBackgroundClick}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          
          {mode !== null && activeBallFiles.map((path, index) => {
            if (mode === 0) return <RollingBall key={index} modelPath={path} xRange={xRange} />;
            if (mode === 1) return <BouncingBall key={index} modelPath={path} xRange={xRange} />;
            if (mode === 2) return <FloatingBall key={index} modelPath={path} xRange={xRange} />;
            return null;
          })}

          {/* === グループ0: 転がるボール用 === */}
          <group>
            <CuboidCollider 
              position={[0, -8, 0]} 
              args={[200, 1, 200]} 
              restitution={0} 
              friction={3.0}
              collisionGroups={interactionGroups(0, [0])} 
            />
            {/* 壁の位置はスマホ判定で可変(xRange) */}
            <CuboidCollider position={[-xRange, 0, 0]} args={[1, 50, 50]} collisionGroups={interactionGroups(0, [0])} />
            <CuboidCollider position={[xRange, 0, 0]} args={[1, 50, 50]} collisionGroups={interactionGroups(0, [0])} />
            <CuboidCollider position={[0, 0, -20]} args={[50, 50, 1]} collisionGroups={interactionGroups(0, [0])} />
            <CuboidCollider position={[0, 0, 20]} args={[50, 50, 1]} collisionGroups={interactionGroups(0, [0])} />
          </group>

          {/* === グループ1: バウンドボール用 === */}
          <group>
            <CuboidCollider 
              position={[0, -8, 0]} 
              args={[200, 1, 200]} 
              restitution={1.0} 
              friction={0}
              collisionGroups={interactionGroups(1, [1])} 
            />
            <CuboidCollider 
              position={[0, 25, 0]} 
              args={[200, 1, 200]} 
              restitution={1.0} 
              friction={0}
              collisionGroups={interactionGroups(1, [1])} 
            />
            <CuboidCollider position={[-xRange, 10, 0]} args={[1, 50, 50]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
            <CuboidCollider position={[xRange, 10, 0]} args={[1, 50, 50]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
            <CuboidCollider position={[0, 10, -20]} args={[50, 50, 1]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
            <CuboidCollider position={[0, 10, 20]} args={[50, 50, 1]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
          </group>

        </Physics>
      </Suspense>
    </Canvas>
  );
}