import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0a1f2e]">
      <Sidebar />
      <main className="ml-64 min-h-screen bg-gradient-to-br from-[#0a1f2e] via-[#0d2a3a] to-[#0f3d4a] relative overflow-hidden">
        {/* Aurora-like gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00b4b8]/5 to-[#2dd4bf]/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#10b981]/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};
