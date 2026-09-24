import { ReduxProvider } from '@/store/ReduxProvider';
import "./globals.css";

export const metadata = {
  title: "E-Ticaret Projesi",
  description: "Next.js & Express Monorepo E-Commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}