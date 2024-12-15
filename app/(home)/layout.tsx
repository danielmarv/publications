import { Inter } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import { MainNav } from '@/components/MainNav';

import '../../app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Scholar Interface',
  description: 'A scholarly search interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="relative flex min-h-screen w-full flex-col">
            <Header />
            <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
              <MainNav />
              <main className="relative w-full py-6">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
