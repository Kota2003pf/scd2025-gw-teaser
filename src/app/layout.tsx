import './globals.css';
import type { Metadata } from 'next';
// ■ 削除: Inter のインポートを消す
// import { Inter } from 'next/font/google';
import CustomCursor from '../components/CustomCursor';

// ■ 削除: Inter の設定を消す
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '卒業制作展 2025',
  description: '武蔵野美術大学基礎デザイン学科',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* ■ 修正: className={inter.className} を削除してシンプルにする */}
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}