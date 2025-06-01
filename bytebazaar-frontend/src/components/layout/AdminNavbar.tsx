
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ChevronDown, User, Settings, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/store/api/authApi';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/slices/authSlice';
import Logo from '../branding/Logo';

const AdminNavbar = () => {
  const user = useAppSelector(selectUser);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-background border-b border-border shadow-sm py-3">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Logo size="sm" withText={true} />
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-md text-sm font-medium">
              Admin Panel
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-foreground">
                <span className="font-medium">{user?.name || 'Admin User'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/admin/profile" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link to="/admin/settings" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <div className="border-t border-border my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
            
            <Link to="/" className="flex items-center text-foreground hover:text-primary transition-colors">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
