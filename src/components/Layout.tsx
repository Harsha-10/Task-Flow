import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Bug, Clock, BarChart3, Zap, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItems = () => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60 hover:scale-105'
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <BarChart3 className="h-4 w-4" />
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink
        to="/bugs"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60 hover:scale-105'
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Bug className="h-4 w-4" />
        <span>Issues</span>
      </NavLink>
      
      <NavLink
        to="/time-tracker"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60 hover:scale-105'
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Clock className="h-4 w-4" />
        <span>Time Logs</span>
      </NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Zap className="h-8 w-8 text-indigo-600 transform group-hover:scale-110 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">Issue Tracker</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                <NavItems />
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <NavItems />
                  </nav>
                </SheetContent>
              </Sheet>

              {/* User Profile - Hide on mobile */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-slate-700">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.role}</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="hover:scale-105 transition-transform duration-200 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>

              {/* Mobile User Profile */}
              <div className="flex sm:hidden items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
