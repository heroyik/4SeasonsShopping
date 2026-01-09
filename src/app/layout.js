import './globals.css';
import { getAssetPath } from '@/config';
import Header from '@/components/dom/Header';

export const metadata = {
  title: 'Four Seasons Concept Store',
  description: 'A premium 3D shopping experience.',
  icons: {
    icon: getAssetPath('favicon.svg'),
    apple: getAssetPath('logo.svg'),
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
