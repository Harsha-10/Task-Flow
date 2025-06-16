    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { LogOut, Bug, Clock, BarChart3, Zap } from 'lucide-react';
    import { NavLink } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';

    const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
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
                
                <nav className="flex space-x-2">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60 hover:scale-105'
                    }`
                    }
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
                >
                    <Clock className="h-4 w-4" />
                    <span>Time Logs</span>
                </NavLink>
                </nav>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="text-sm">
                <div className="flex items-center space-x-3">
                    <div className="text-right">
                    <p className="font-medium text-slate-700">{user?.name}</p>
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
            </div>
        </div>
        </header>
    );
    };

    export default Header;