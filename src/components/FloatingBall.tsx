'use client';

import { useGLTF } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type FloatingBallProps = {
  modelPath: string;
  xRange: number; // 追加
};

export default function FloatingBall({ modelPath, xRange }: FloatingBallProps) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const rigidBody = useRef<RapierRigidBody>(null);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        const oldMaterial = mesh.material as THREE.MeshStandardMaterial;
        mesh.material = new THREE.MeshBasicMaterial({
          map: oldMaterial.map || null,
          color: oldMaterial.map ? 0xffffff : oldMaterial.color,
          transparent: oldMaterial.transparent,
        });
      }
    });
  }, [clonedScene]);

  const scale = useMemo(() => 0.9 + Math.random() * 0.2, []);

  const moveData = useMemo(() => {
    // ▼▼ 修正: 横の振れ幅(ampX)の上限を xRange に合わせる ▼▼
    // xRangeよりも少しだけ小さくして、完全に壁ギリギリにならないように調整
    const maxAmp = Math.max(2, xRange - 2); 
    
    return {
      speed: 0.5 + Math.random() * 0.5,
      
      // xRangeに基づいて振れ幅を決定
      ampX: (maxAmp * 0.5) + Math.random() * (maxAmp * 0.5), 
      
      ampY: 5 + Math.random() * 10,  
      ampZ: 10 + Math.random() * 10, 
      
      offsetX: Math.random() * 100,
      offsetY: Math.random() * 100,
      offsetZ: Math.random() * 100,
      
      rotSpeedX: (Math.random() - 0.5) * 4,
      rotSpeedY: (Math.random() - 0.5) * 4,
      rotSpeedZ: (Math.random() - 0.5) * 4,
    };
  }, [xRange]);

  const initialPos = useMemo(() => {
    const t = 0;
    const x = Math.sin(t * moveData.speed + moveData.offsetX) * moveData.ampX;
    const y = Math.sin(t * moveData.speed * 0.5 + moveData.offsetY) * moveData.ampY + 5; 
    const z = Math.cos(t * moveData.speed * 0.8 + moveData.offsetZ) * moveData.ampZ;
    return [x, y, z] as [number, number, number];
  }, [moveData]);

  useFrame(({ clock }) => {
    if (!rigidBody.current) return;

    const t = clock.getElapsedTime();
    const { speed, ampX, ampY, ampZ, offsetX, offsetY, offsetZ, rotSpeedX, rotSpeedY, rotSpeedZ } = moveData;

    const nextX = Math.sin(t * speed + offsetX) * ampX;
    const nextY = Math.sin(t * speed * 0.5 + offsetY) * ampY + 5; 
    const nextZ = Math.cos(t * speed * 0.8 + offsetZ) * ampZ;

    rigidBody.current.setNextKinematicTranslation({ x: nextX, y: nextY, z: nextZ });

    const currentRot = rigidBody.current.rotation();
    rigidBody.current.setNextKinematicRotation({
      x: currentRot.x + rotSpeedX * 0.01,
      y: currentRot.y + rotSpeedY * 0.01,
      z: currentRot.z + rotSpeedZ * 0.01,
      w: 1, 
    });
  });

  return (
    <RigidBody
      ref={rigidBody}
      type="kinematicPosition"
      colliders="ball"
      position={initialPos}
    >
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </RigidBody>
  );
}