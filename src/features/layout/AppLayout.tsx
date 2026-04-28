import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, CheckSquare, Settings, Shirt, Archive, Tags, Users, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '../../shared/utils';
import { useAuth } from '../../AuthProvider';

export function AppLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, role, logOut } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const navItems = [
    { name: 'نقطة البيع (الكاشير)', path: '/', icon: ShoppingCart },
    { name: 'لوحة الإنتاج (كانبان)', path: '/kanban', icon: LayoutDashboard },
    { name: 'الجودة والجاهزية', path: '/qc', icon: CheckSquare },
    { name: 'سجل الطلبات', path: '/history', icon: Archive },
    { name: 'إدارة العملاء', path: '/customers', icon: Users },
    { name: 'إدارة الخدمات', path: '/services', icon: Tags },
    ...(role === 'admin' ? [{ name: 'تقارير الإدارة', path: '/admin', icon: Settings }] : []),
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 dark:bg-slate-700 text-white p-2 rounded-lg">
            <Shirt size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">نظام الكي الذكي</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-30 w-64 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-slate-100 dark:border-slate-700">
          <div className="bg-slate-900 dark:bg-slate-700 text-white p-2 rounded-lg">
            <Shirt size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">نظام الكي الذكي</h1>
        </div>
        
        <div className="md:hidden p-4 flex justify-end border-b border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon size={18} className={isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{user?.displayName || user?.email}</p>
            <div className="flex gap-1">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors hidden md:block" 
                title={isDarkMode ? "الوضع الفاتح" : "الوضع الداكن"}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={logOut} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="تسجيل الخروج">
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <p>الدور: {role === 'admin' ? 'مدير' : 'موظف'}</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
