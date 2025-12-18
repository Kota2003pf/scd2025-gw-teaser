'use client';

import { useGLTF } from '@react-three/drei';
import { RigidBody, RapierRigidBody, interactionGroups } from '@react-three/rapier';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

type BouncingBallProps = {
  modelPath: string;
};

type VelocityArray = [number, number, number];

export default function BouncingBall({ modelPath }: BouncingBallProps) {
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

  const initialData = useMemo(() => {
    const x = (Math.random() - 0.5) * 50; 
    const z = (Math.random() - 0.5) * 30; 
    const y = (Math.random() * 20) - 5; 
    
    const position: [number, number, number] = [x, y, z];

    const speed = 20 + Math.random() * 10; 
    const direction = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.2, 
      Math.random() - 0.5
    ).normalize();

    const linvel: VelocityArray = [
      direction.x * speed,
      direction.y * speed, 
      direction.z * speed
    ];

    const angvel: VelocityArray = [
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10
    ];

    return { position, linvel, angvel };
  }, []);

  return (
    <RigidBody
      ref={rigidBody}
      colliders="ball"
      collisionGroups={interactionGroups(1, [1])}
      // ▼▼ 変更: 反発係数を落とす（1.2 -> 0.95） ▼▼
      // 1.0未満にすることで、徐々に落ち着いた動きになります。
      restitution={0.95} 
      friction={0.0}
      linearDamping={0} 
      angularDamping={0}
      position={initialData.position}
      linearVelocity={initialData.linvel}
      angularVelocity={initialData.angvel}
    >
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </RigidBody>
  );
}