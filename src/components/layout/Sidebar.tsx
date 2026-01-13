import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, GitBranch, BarChart3, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import oddoLogo from '@/assets/oddo-bhf-logo.svg';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/news-flow', label: 'News Flow', icon: Newspaper },
  { path: '/funnel', label: 'Engagement Funnel', icon: GitBranch },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/copilot', label: 'AI Copilot', icon: Bot },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      {/* Logo Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex flex-col items-center gap-3">
          <img 
            src={oddoLogo} 
            alt="ODDO BHF" 
            className="h-12 w-auto"
          />
          <div className="text-center">
            <div className="text-sm font-semibold text-sidebar-foreground">
              Client Intent Radar
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-nav-item',
                isActive && 'sidebar-nav-item-active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/50 text-center leading-relaxed">
          ODDO BHF Corporates & Markets
          <br />
          <span className="text-sidebar-primary">Prototype v1.0</span>
        </div>
      </div>
    </aside>
  );
};
