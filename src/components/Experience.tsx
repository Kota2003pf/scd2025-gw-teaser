'use client';

import { Canvas } from '@react-three/fiber';
import { Physics, CuboidCollider, interactionGroups } from '@react-three/rapier';
import { Environment, useGLTF, Loader } from '@react-three/drei'; // Loaderを追加
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
    <>
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

      {/* ▼▼ 追加: ローディング画面 ▼▼ */}
      <Loader 
        containerStyles={{ 
          backgroundColor: '#ffffff', // 背景: 白
          zIndex: 9999, // 最前面に表示
        }}
        innerStyles={{ 
          backgroundColor: '#f0f0f0', // バーの背景: 薄いグレー
          width: '200px', // バーの幅
          height: '4px', // バーの太さ
        }}
        barStyles={{ 
          backgroundColor: '#0a2b6f', // バーの色: 紺色
          height: '100%',
        }}
        dataStyles={{ 
          color: '#0a2b6f', // 文字色: 紺色
          fontSize: '12px',
          fontFamily: 'YuGothic, "Yu Gothic", sans-serif',
          fontWeight: 'normal',
          marginTop: '10px',
        }}
      />
    </>
  );
}