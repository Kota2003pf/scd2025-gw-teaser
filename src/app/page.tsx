import Experience from '../components/Experience';
import CursorFollower from '../components/CursorFollower';

export default function Home() {
  return (
    <main 
      style={{ 
        width: '100%',     
        height: '100dvh',
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: 'white' 
      }}
    >
      
      {/* 背景レイヤー */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <iframe
          src="https://www.kisode.com"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: 0.1,
            pointerEvents: 'none',
            filter: 'blur(2px) grayscale(20%)',
          }}
        />
      </div>

      {/* ▼▼ 3Dレイヤー：ここには <Experience /> だけがあればOK！ ▼▼ */}
      {/* もしここに <RollingBall /> などが残っていたら、それがエラーの原因です */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Experience />
      </div>

      {/* テキストレイヤー */}
      <div 
        className="center-text-container"
        style={{ 
          position: 'relative', 
          zIndex: 10,
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto', textAlign: 'center' }}>
          <h1 
            className="
              center-text
              hide-cursor-target 
              cursor-none
              text-[22px] 
              text-[#d9d9d9] 
              hover:text-[#0a2b6f]
              font-normal           
              antialiased       
              leading-[2.0]
            "
            style={{ 
              fontFamily: 'YuGothic, "游ゴシック体", "Yu Gothic", "Yu Gothic Medium", "游ゴシック", sans-serif',
              fontWeight: 550, 
            }}
          >
            2025年度 卒業・修了制作展<br />
            武蔵野美術大学基礎デザイン学科<br />
            <span className="block mt-4">会期 2026 1/15〜1/18</span>
            武蔵野美術大学鷹の台キャンパス
          </h1>
        </div>
      </div>

      {/* カーソル追従 */}
      <CursorFollower />

    </main>
  );
}