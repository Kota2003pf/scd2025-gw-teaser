import Experience from '../components/Experience';
import CursorFollower from '../components/CursorFollower';

export default function Home() {
  return (
    <main 
      style={{ 
        width: '100%',     
        height: '100dvh',  // スマホのアドレスバー対策（dvh）
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: 'white' 
      }}
    >
      
      {/* 背景レイヤー：学科サイト（iframe） */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0, // 一番後ろ
          overflow: 'hidden',
        }}
      >
        <iframe
          src="https://www.kisode.com"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: 0.1,           // 透明度
            pointerEvents: 'none',  // クリックを貫通させる
            filter: 'blur(2px) grayscale(20%)', // 少しぼかして背景らしくする
          }}
        />
      </div>

      {/* 3Dレイヤー：跳ねるボール */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Experience />
      </div>

      {/* テキストレイヤー：展覧会情報 */}
      <div 
        className="center-text-container"
        style={{ 
          position: 'relative', 
          zIndex: 10, // 一番手前
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          pointerEvents: 'none' // テキスト周りの余白をクリックしても反応しないようにする
        }}
      >
        <div style={{ pointerEvents: 'auto', textAlign: 'center' }}>
          <h1 
            className="
              center-text
              hide-cursor-target 
              cursor-none
              text-[23px] 
              text-[#d9d9d9] 
              hover:text-[#0a2b6f]
              font-normal           
              antialiased       
              leading-[2.0]
            "
            // ■ フォント設定
            // Mac(Safari)用に "YuGothic" を先頭、Windows用に "Yu Gothic Medium"
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

      {/* カーソル追従コンポーネント（最前面・クリック透過・ぼやけ対策済み） */}
      <CursorFollower />

    </main>
  );
}