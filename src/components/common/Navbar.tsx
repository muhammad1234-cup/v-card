import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { 
  CreditCard, 
  Users, 
  Settings, 
  QrCode, 
  Radio, 
  LogOut, 
  User as UserIcon, 
  ExternalLink,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, employee, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Company Brand', path: '/admin/company', icon: Settings },
  ];

  const employeeNavItems = [
    { label: 'My Card', path: '/employee/dashboard', icon: CreditCard },
    { label: 'Edit Profile', path: '/employee/profile', icon: UserIcon },
    { label: 'QR Code', path: '/employee/qrcode', icon: QrCode },
    { label: 'NFC Writer', path: '/employee/nfc', icon: Radio },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav(isAdmin ? '/admin/dashboard' : '/employee/dashboard')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-zinc-100 text-base flex items-center gap-2">
                  TapCard
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {isAdmin ? 'Admin' : 'Employee'}
                  </span>
                </span>
                <span className="text-[11px] text-zinc-400 block -mt-0.5">NFC & Digital Cards</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-zinc-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {employee && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink className="w-3.5 h-3.5 text-blue-400" />}
                onClick={() => handleNav(`/card/${employee.slug}`)}
                className="text-xs"
              >
                View Public Card
              </Button>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
              <div className="text-right">
                <div className="text-sm font-medium text-zinc-200">{user?.name}</div>
                <div className="text-xs text-zinc-400">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            {employee && (
              <button
                onClick={() => handleNav(`/card/${employee.slug}`)}
                className="p-2 text-blue-400 bg-blue-500/10 rounded-lg text-xs flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-200">{user?.name}</div>
              <div className="text-xs text-zinc-400">{user?.email}</div>
            </div>
            <Button variant="danger" size="sm" leftIcon={<LogOut className="w-4 h-4" />} onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
