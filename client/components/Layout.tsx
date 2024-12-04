import { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isIndexPage = router.pathname === '/';

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: 'url("/images/background.jpg")', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}>
      <div className="min-h-screen">
        <header className={`${isIndexPage ? 'text-center py-8' : ''}`}>
          <div className={`${isIndexPage ? 'flex justify-center' : 'absolute top-4 left-4'}`}>
            <Image
              src="/images/logo.png"
              alt="App Logo"
              width={isIndexPage ? 300 : 150}
              height={isIndexPage ? 100 : 50}
              priority
              className="h-auto"
            />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 