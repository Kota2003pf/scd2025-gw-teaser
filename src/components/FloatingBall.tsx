'use client';

import { useGLTF } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type FloatingBallProps = {
  modelPath: string;
};

export default function FloatingBall({ modelPath }: FloatingBallProps) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const rigidBody = useRef<RapierRigidBody>(null);

  // マテリアル設定（他と同じフラットな見た目）
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

  // ■ 変則的な動きのためのパラメータをランダム生成
  const moveData = useMemo(() => {
    return {
      // 動きの速さ（個体差をつける）
      speed: 0.5 + Math.random() * 0.5,
      
      // X, Y, Z それぞれの可動範囲（振幅）
      ampX: 15 + Math.random() * 15, // 横幅広め
      ampY: 5 + Math.random() * 10,  // 上下
      ampZ: 10 + Math.random() * 10, // 奥行き
      
      // 周期のズレ（これがないと全員同じ動きになる）
      offsetX: Math.random() * 100,
      offsetY: Math.random() * 100,
      offsetZ: Math.random() * 100,
      
      // 回転の速さ
      rotSpeedX: (Math.random() - 0.5) * 4,
      rotSpeedY: (Math.random() - 0.5) * 4,
      rotSpeedZ: (Math.random() - 0.5) * 4,
    };
  }, []);

  // ■ 初期位置の計算（マウント時の瞬間移動防止）
  const initialPos = useMemo(() => {
    const t = 0; // 時間0の時の座標
    const x = Math.sin(t * moveData.speed + moveData.offsetX) * moveData.ampX;
    const y = Math.sin(t * moveData.speed * 0.5 + moveData.offsetY) * moveData.ampY + 5; // 少し高めにオフセット
    const z = Math.cos(t * moveData.speed * 0.8 + moveData.offsetZ) * moveData.ampZ;
    return [x, y, z] as [number, number, number];
  }, [moveData]);

  // ■ 毎フレームの座標更新（物理法則無視）
  useFrame(({ clock }) => {
    if (!rigidBody.current) return;

    const t = clock.getElapsedTime();
    const { speed, ampX, ampY, ampZ, offsetX, offsetY, offsetZ, rotSpeedX, rotSpeedY, rotSpeedZ } = moveData;

    // 複雑なサイン波の組み合わせで「有機的かつ予測不能」な軌道を作る
    // 時間tに対する係数(周波数)をXYZでバラバラにすることで、単純な円運動を防ぐ
    const nextX = Math.sin(t * speed + offsetX) * ampX;
    
    // Y軸はふわふわ上下させる (Center Y = 5付近)
    const nextY = Math.sin(t * speed * 0.5 + offsetY) * ampY + 5; 
    
    const nextZ = Math.cos(t * speed * 0.8 + offsetZ) * ampZ;

    // KinematicTranslation: 物理演算を無視して、次のフレームで「絶対にここにいろ」という命令
    rigidBody.current.setNextKinematicTranslation({ x: nextX, y: nextY, z: nextZ });

    // 回転も計算で回す
    const currentRot = rigidBody.current.rotation();
    rigidBody.current.setNextKinematicRotation({
      x: currentRot.x + rotSpeedX * 0.01,
      y: currentRot.y + rotSpeedY * 0.01,
      z: currentRot.z + rotSpeedZ * 0.01,
      w: 1, // Quaternion w (簡易計算のため自動正規化に任せる)
    });
  });

  return (
    <RigidBody
      ref={rigidBody}
      // ▼▼ 重要: kinematicPosition = 力の影響を受けず、位置を直接制御するモード ▼▼
      type="kinematicPosition"
      colliders="ball" // 当たり判定はあるので、他の「動くボール」を弾き飛ばすことはある
      position={initialPos}
    >
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </RigidBody>
  );
}