'use client';

import { Canvas } from '@react-three/fiber';
import { Physics, CuboidCollider, interactionGroups } from '@react-three/rapier';
import { Environment, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import BouncingBall from './BouncingBall';
import RollingBall from './RollingBall';
import FloatingBall from './FloatingBall'; // 追加

const DEPARTMENT_URL = 'https://www.kisode.com';

const SOURCE_FILES = Array.from({ length: 9 }, (_, i) => `/scdball${i + 1}.glb`);
const BALL_FILES = [
  ...SOURCE_FILES, 
  ...SOURCE_FILES, 
  ...SOURCE_FILES, 
  ...SOURCE_FILES
];

SOURCE_FILES.forEach(path => useGLTF.preload(path));

export default function Experience() {
  // 0: Rolling, 1: Bouncing, 2: Floating
  const [mode, setMode] = useState<number | null>(null);

  useEffect(() => {
    // 3パターンからランダムに選択
    setMode(Math.floor(Math.random() * 3));
  }, []);

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
          
          {mode !== null && BALL_FILES.map((path, index) => {
            if (mode === 0) return <RollingBall key={index} modelPath={path} />;
            if (mode === 1) return <BouncingBall key={index} modelPath={path} />;
            if (mode === 2) return <FloatingBall key={index} modelPath={path} />;
            return null;
          })}

          {/* ====================================================
             グループ0: 転がるボール用 (Layer 0)
             ==================================================== */}
          <group>
            <CuboidCollider 
              position={[0, -8, 0]} 
              args={[200, 1, 200]} 
              restitution={0} 
              friction={3.0}
              collisionGroups={interactionGroups(0, [0])} 
            />
            {/* 転がる用の壁 */}
            <CuboidCollider position={[-32, 0, 0]} args={[1, 50, 50]} collisionGroups={interactionGroups(0, [0])} />
            <CuboidCollider position={[32, 0, 0]} args={[1, 50, 50]} collisionGroups={interactionGroups(0, [0])} />
            <CuboidCollider position={[0, 0, -20]} args={[50, 50, 1]} collisionGroups={interactionGroups(0, [0])} />
            <CuboidCollider position={[0, 0, 20]} args={[50, 50, 1]} collisionGroups={interactionGroups(0, [0])} />
          </group>


          {/* ====================================================
             グループ1: バウンドボール用 (Layer 1)
             ==================================================== */}
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
            {/* バウンド用の壁 */}
            <CuboidCollider position={[-32, 10, 0]} args={[1, 50, 50]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
            <CuboidCollider position={[32, 10, 0]} args={[1, 50, 50]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
            <CuboidCollider position={[0, 10, -20]} args={[50, 50, 1]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
            <CuboidCollider position={[0, 10, 20]} args={[50, 50, 1]} restitution={1.0} friction={0} collisionGroups={interactionGroups(1, [1])} />
          </group>
          
          {/* グループ2 (Floating) は物理的な壁が不要（Kinematicなので突き抜けるため）ですが、
              表示上画面の外に行き過ぎないように制御するのは FloatingBall 内の計算で行っています。 */}

        </Physics>
      </Suspense>
    </Canvas>
  );
}