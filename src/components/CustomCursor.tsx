'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX - 195;
      const y = e.clientY - 22;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      // ■ 重要チェック: ここに "pointer-events-none" が必ず必要です！
      // これがないとマウスの入力をカーソルが遮ってしまい、下の文字が反応しません。
      // アニメーション設定（transitionなど）はここには書きません。
      className="custom-cursor fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        width: '390px',   
        height: '44px',
      }}
    >
      <img 
        src="/scdlogo.png" 
        alt="cursor" 
        // ■ アニメーション設定は「画像(img)」の方に書きます
        // これで「移動はキビキビ、変化はふわっと」になります
        className="w-full h-full object-contain transition-opacity duration-500 ease-out"
      />
    </div>
  );
}