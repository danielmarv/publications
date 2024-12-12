import React, { ReactNode } from 'react';
import Navbar from './_components/Navbar';
import Footer from './_components/footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Section */}
      <Navbar />

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Layout;
