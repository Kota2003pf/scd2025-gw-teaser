'use client';

import { useEffect, useRef } from 'react';

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -500;
    let mouseY = -500;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    let rafId: number;
    const animate = () => {
      if (cursor) {
        // SVGでも座標の丸め込みは有効です
        const x = Math.round(mouseX);
        const y = Math.round(mouseY);
        
        // 180pxの半分 = 90
        const offsetX = 90; 
        const offsetY = 90;

        cursor.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', moveCursor);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="scdlogo" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        
        // 表示サイズ
        width: '300px',   
        height: '300px',
        
        // 描画最適化
        backfaceVisibility: 'hidden',
        transform: 'translate3d(-500px, -500px, 0)', 
      }}
    >
      {/* ▼▼ 変更: PNGからSVGへ書き換え ▼▼ */}
      <img 
        src="/scdlogo.svg" 
        alt="Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', 
          // SVGの場合は画質劣化がないので特別なレンダリング設定は不要ですが、
          // 念のためブロックノイズを防ぐ設定を入れておきます
          filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))', 
        }} 
      />
    </div>
  );
}