'use client';

import { Canvas } from '@react-three/fiber';
import { Physics, CuboidCollider, interactionGroups } from '@react-three/rapier';
import { Environment, useGLTF } from '@react-three/drei';
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
    // 1. まず現在の画面サイズでスマホかどうか判定
    const checkMobile = () => window.innerWidth <= 768;
    const mobile = checkMobile();
    setIsMobile(mobile);

    // 2. モードを決定（スマホなら転がりを除外）
    if (mobile) {
      // スマホ: 1(Bouncing) か 2(Floating) のどちらか
      setMode(Math.floor(Math.random() * 2) + 1);
    } else {
      // PC: 0(Rolling), 1(Bouncing), 2(Floating) の3択
      setMode(Math.floor(Math.random() * 3));
    }

    // リサイズ監視（レイアウト調整用）
    const handleResize = () => {
      setIsMobile(checkMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  const floorY = isMobile ? -3 : -8; // PC版Rolling用の設定（スマホでは使われませんが維持）

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
            if (mode === 0) return <RollingBall key={index} modelPath={path} xRange={xRange} floorY={floorY} />;
            if (mode === 1) return <BouncingBall key={index} modelPath={path} xRange={xRange} />;
            if (mode === 2) return <FloatingBall key={index} modelPath={path} xRange={xRange} />;
            return null;
          })}

          {/* === グループ0: 転がるボール用（PCのみ使用） === */}
          <group>
            <CuboidCollider 
              position={[0, floorY, 0]} 
              args={[200, 1, 200]} 
              restitution={0} 
              friction={3.0}
              collisionGroups={interactionGroups(0, [0])} 
            />
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