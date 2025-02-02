import { Inter } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainNav } from '@/components/MainNav';
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

import '../../app/globals.css';
import {HomeHeader} from '@/components/HomeHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BU Scholar',
  description: 'A scholarly search interface',
};

 export const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentUser = await getCurrentUser();
  
    if (!currentUser) return redirect("/sign-in");
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="relative flex min-h-screen w-full flex-col">
            <HomeHeader />
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

export default RootLayout;
