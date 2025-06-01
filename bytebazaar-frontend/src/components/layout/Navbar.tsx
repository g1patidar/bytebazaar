import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '../branding/Logo';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectIsAuthenticated, logoutUser } from '@/store/slices/authSlice';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItemCount = useAppSelector(selectCartItemCount);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-xl bg-background/95 shadow-lg py-3' 
        : 'bg-background py-4'
    }`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Logo size="md" withText={true} />
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors duration-200">Home</Link>
            <div className="relative group">
              <button className="flex items-center text-foreground hover:text-primary font-medium transition-colors duration-200">
                {/* Products <ChevronDown className="h-4 w-4 ml-1" /> */}
                <Link to="/projects/category/all">Projects</Link>
              </button>
              {/* <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/projects/category/all" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">All Projects</Link>
                <Link to="/projects/category/web" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">Web Templates</Link>
                <Link to="/projects/category/mobile" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">Mobile Apps</Link>
              </div> */}
            </div>
            <div className="relative group">
              <button className="flex items-center text-foreground hover:text-primary font-medium transition-colors duration-200">
                Resources <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/documentation" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">Documentation</Link>
                <Link to="/blog" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">Blog</Link>
                <Link to="/support" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">Support</Link>
              </div>
            </div>
            <Link to="/pricing" className="text-foreground hover:text-primary font-medium transition-colors duration-200">Pricing</Link>
            <Link to="/contact" className="text-foreground hover:text-primary font-medium transition-colors duration-200">Contact</Link>
            
            <Link 
              to="/cart" 
              className="relative inline-flex items-center p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 rounded-md hover:bg-accent hover:text-primary font-medium">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/purchases" className="cursor-pointer">My Purchases</Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-md hover:bg-accent hover:text-primary font-medium">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
          
          {/* Mobile menu button - Now opens a Sheet from the right */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative inline-flex items-center p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[85%] sm:w-[350px] border-l border-border bg-background">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <Link to="/" className="flex items-center">
                        <Logo size="sm" withText={true} />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto py-2">
                    <div className="flex flex-col space-y-1 p-2">
                      <Link 
                        to="/" 
                        className="flex items-center p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                      >
                        <span>Home</span>
                      </Link>
                      <div className="p-3 rounded-md">
                        <div className="flex items-center justify-between hover:text-primary cursor-pointer">
                          <span className="font-medium">Products</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                        <div className="mt-2 ml-4 flex flex-col space-y-1">
                          <Link to="/projects/category/all" className="p-2 hover:bg-accent rounded-md">All Projects</Link>
                          <Link to="/projects/category/web" className="p-2 hover:bg-accent rounded-md">Web Templates</Link>
                          <Link to="/projects/category/mobile" className="p-2 hover:bg-accent rounded-md">Mobile Apps</Link>
                        </div>
                      </div>
                      <div className="p-3 rounded-md">
                        <div className="flex items-center justify-between hover:text-primary cursor-pointer">
                          <span className="font-medium">Resources</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                        <div className="mt-2 ml-4 flex flex-col space-y-1">
                          <Link to="/documentation" className="p-2 hover:bg-accent rounded-md">Documentation</Link>
                          <Link to="/blog" className="p-2 hover:bg-accent rounded-md">Blog</Link>
                          <Link to="/support" className="p-2 hover:bg-accent rounded-md">Support</Link>
                        </div>
                      </div>
                      <Link 
                        to="/pricing" 
                        className="flex items-center p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                      >
                        <span>Pricing</span>
                      </Link>
                      <Link 
                        to="/contact" 
                        className="flex items-center p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                      >
                        <span>Contact</span>
                      </Link>
                      <Link 
                        to="/cart" 
                        className="flex items-center justify-between p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                      >
                        <span>Cart</span>
                        <div className="flex items-center">
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                            {cartItemCount}
                          </span>
                        </div>
                      </Link>
                      
                      {isAuthenticated && user && (
                        <>
                          <Link 
                            to="/dashboard" 
                            className="flex items-center p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                          >
                            <span>Dashboard</span>
                          </Link>
                          <Link 
                            to="/purchases" 
                            className="flex items-center p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                          >
                            <span>My Purchases</span>
                          </Link>
                          {user.isAdmin && (
                            <Link 
                              to="/admin" 
                              className="flex items-center p-3 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 font-medium"
                            >
                              <span>Admin Panel</span>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-border">
                    {isAuthenticated && user ? (
                      <div className="grid gap-2">
                        <div className="flex items-center p-2 border rounded-md">
                          <User className="h-5 w-5 mr-2 text-primary" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <Button 
                          variant="destructive" 
                          className="w-full rounded-md font-medium"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Link to="/login">
                          <Button variant="outline" className="w-full rounded-md hover:bg-accent hover:text-primary font-medium">
                            Log in
                          </Button>
                        </Link>
                        <Link to="/register">
                          <Button className="w-full rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
                            Sign up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
