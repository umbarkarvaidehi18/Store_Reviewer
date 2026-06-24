import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Menu, X, LogOut, LayoutDashboard, Users, Store, Key, Star, Shield, User as UserIcon
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define sidebar navigation items based on user role
  const getNavItems = () => {
    if (user?.role === 'Admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Stores', path: '/admin/stores', icon: Store },
      ];
    } else if (user?.role === 'Store Owner') {
      return [
        { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
      ];
    } else {
      // Regular User
      return [
        { name: 'Browse Stores', path: '/stores', icon: Store },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/70 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button 
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
            <Star className="text-brand-500 fill-brand-500 animate-pulse" size={24} />
            <span>StoreReview</span>
          </Link>
        </div>

        {/* User Info / Profile Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
            <span className="text-xs text-brand-400 font-medium flex items-center gap-1 justify-end">
              {user?.role === 'Admin' && <Shield size={12} />}
              {user?.role}
            </span>
          </div>

          <div className="relative group">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-brand-600 transition border border-slate-700 font-bold text-white uppercase shadow-lg">
              {user?.name?.substring(0, 2) || 'US'}
            </button>
            
            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-in-out transform origin-top-right border border-slate-800 bg-slate-900/95">
              <div className="px-4 py-2 border-b border-slate-800 sm:hidden">
                <p className="text-sm font-semibold truncate text-slate-200">{user?.name}</p>
                <p className="text-xs text-brand-400">{user?.role}</p>
              </div>
              <Link to="/change-password" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition">
                <Key size={16} />
                Change Password
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-900 bg-slate-950/40 p-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-600/20 text-brand-400 border-l-4 border-brand-500 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </aside>

        {/* Sidebar for Mobile */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            
            {/* Drawer */}
            <div className="relative flex flex-col w-64 max-w-xs bg-slate-950 border-r border-slate-850 p-4 gap-2 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-2">
                <span className="font-bold text-slate-200">Navigation</span>
                <button 
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-600/20 text-brand-400 border-l-4 border-brand-500 font-semibold' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
