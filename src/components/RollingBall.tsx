'use client';

import { useGLTF } from '@react-three/drei';
import { RigidBody, RapierRigidBody, interactionGroups } from '@react-three/rapier';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FLOOR_SURFACE = -7; 
const BASE_RADIUS = 0.5;

type RollingBallProps = {
  modelPath: string;
  xRange: number; // 追加
};

type VelocityArray = [number, number, number];

export default function RollingBall({ modelPath, xRange }: RollingBallProps) {
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
  
  const actualRadius = BASE_RADIUS * scale;
  const exactY = FLOOR_SURFACE + actualRadius;

  const initialData = useMemo(() => {
    // ▼▼ 修正: 渡された xRange の範囲内で出現させる ▼▼
    const x = (Math.random() - 0.5) * (xRange * 2); 
    const z = (Math.random() - 0.5) * 30; 
    
    const position: [number, number, number] = [x, exactY, z];

    const startPos = new THREE.Vector3(x, exactY, z);
    const targetPos = new THREE.Vector3(
      x + (Math.random() - 0.5),
      exactY,
      z + (Math.random() - 0.5)
    );
    const direction = targetPos.sub(startPos).normalize();
    
    const speed = 8 + Math.random() * 7; 
    
    const linvel: VelocityArray = [
      direction.x * speed,
      0,
      direction.z * speed
    ];

    const rotationAxis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const angularSpeed = speed / actualRadius;
    const angvel: VelocityArray = [
      rotationAxis.x * angularSpeed,
      rotationAxis.y * angularSpeed,
      rotationAxis.z * angularSpeed
    ];

    return { position, linvel, angvel };
  }, [exactY, actualRadius, xRange]);

  useFrame(() => {
    if (!rigidBody.current) return;
    const vel = rigidBody.current.linvel();
    const speed = Math.sqrt(vel.x ** 2 + vel.z ** 2);
    if (speed < 5) {
      const angle = Math.random() * Math.PI * 2;
      const impulseStrength = 10 * scale; 
      rigidBody.current.applyImpulse(
        { x: Math.cos(angle) * impulseStrength, y: 0, z: Math.sin(angle) * impulseStrength },
        true
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      colliders="ball"
      collisionGroups={interactionGroups(0, [0])}
      canSleep={false}
      restitution={0.0} 
      friction={3.0}    
      linearDamping={0} 
      angularDamping={0.1}
      position={initialData.position}
      linearVelocity={initialData.linvel}
      angularVelocity={initialData.angvel}
    >
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </RigidBody>
  );
}