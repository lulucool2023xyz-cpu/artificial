import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { smoothScrollTo } from '@/utils/scroll';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
}

const menuStructure: MenuItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'Product',
    path: '/product',
    children: [
      { label: 'Features', path: '/product/features' },
      { label: 'Demo', path: '/product/demo' },
      { label: 'Use Cases', path: '/product/use-cases' },
      { label: 'Playground', path: '/product/playground' },
    ],
  },
  {
    label: 'Resources',
    path: '/resources',
    children: [
      { label: 'Documentation', path: '/resources/documentation' },
      { label: 'Blog', path: '/resources/blog' },
    ],
  },
  {
    label: 'Company',
    path: '/company',
    children: [
      { label: 'About', path: '/company/about' },
      { label: 'Careers', path: '/company/careers' },
      { label: 'Privacy', path: '/company/privacy' },
      { label: 'Terms', path: '/company/terms' },
    ],
  },
];

interface NavigationBarProps {
  onGetStartedClick?: () => void;
}

export function NavigationBar({ onGetStartedClick }: NavigationBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleGetStarted = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      setAuthModalTab("login");
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
      }
    };

    if (openDropdown || openUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, openUserMenu]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleDropdownToggle = (menuPath: string) => {
    setOpenDropdown(openDropdown === menuPath ? null : menuPath);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[1000] transition-all duration-300',
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      )}
      role="navigation"
      aria-label="Main navigation"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold font-heading text-white hover:text-glow transition-all"
            aria-label="Go to homepage"
          >
            AI Platform
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6" style={{ pointerEvents: 'auto', zIndex: 1001 }}>
            {menuStructure.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const itemIsActive = isActive(item.path);

              if (hasChildren) {
                return (
                  <div
                    key={item.path}
                    className="relative"
                    ref={(el) => {
                      dropdownRefs.current[item.path] = el;
                    }}
                    onMouseEnter={() => setOpenDropdown(item.path)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    style={{ pointerEvents: 'auto', zIndex: 1002 }}
                  >
                    <button
                      onClick={() => handleDropdownToggle(item.path)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 font-medium rounded-md transition-all duration-300 cursor-pointer",
                        itemIsActive
                          ? "text-white bg-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                      aria-expanded={openDropdown === item.path}
                      aria-haspopup="true"
                      style={{ pointerEvents: 'auto' }}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          openDropdown === item.path && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={cn(
                        "absolute top-full left-0 mt-2 min-w-[200px] bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-[1003]",
                        openDropdown === item.path
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                      style={{ pointerEvents: openDropdown === item.path ? 'auto' : 'none' }}
                    >
                      <div className="py-2">
                        {item.children?.map((child) => {
                          const childIsActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "block px-4 py-2 text-sm transition-colors duration-300 cursor-pointer",
                                childIsActive
                                  ? "text-white bg-indonesian-gold/20 border-l-2 border-indonesian-gold"
                                  : "text-gray-300 hover:text-white hover:bg-white/5"
                              )}
                              onClick={() => setOpenDropdown(null)}
                              style={{ pointerEvents: 'auto' }}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 font-medium rounded-md transition-all duration-300 cursor-pointer",
                    itemIsActive
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                  aria-label={`Navigate to ${item.label} page`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
              aria-label="Toggle theme"
              style={{ pointerEvents: 'auto' }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu / Get Started Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef} style={{ pointerEvents: 'auto', zIndex: 1002 }}>
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
                  aria-label="User menu"
                  style={{ pointerEvents: 'auto' }}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name || user?.email}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      openUserMenu && "rotate-180"
                    )}
                  />
                </button>

                {/* User Dropdown Menu */}
                {openUserMenu && (
                  <div
                    className="absolute top-full right-0 mt-2 min-w-[200px] bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden z-[1003]"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10">
                        <div className="font-medium text-white">{user?.name}</div>
                        <div className="text-xs text-gray-400">{user?.email}</div>
                      </div>
                      <Link
                        to="/get-started"
                        onClick={() => setOpenUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/company/about"
                        onClick={() => setOpenUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                          setOpenUserMenu(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                style={{
                  transform: 'scale(1)',
                  willChange: 'transform, background-color',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Get Started"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 z-[1001]",
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
          style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
        >
          <div
            className="pb-4 border-t border-white/10 bg-black/95 backdrop-blur-md"
            role="menu"
            aria-label="Mobile navigation menu"
            style={{ pointerEvents: 'auto' }}
          >
            {menuStructure.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const itemIsActive = isActive(item.path);
              const isMobileDropdownOpen = openMobileDropdown === item.path;

              if (hasChildren) {
                return (
                  <div key={item.path}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown(
                          isMobileDropdownOpen ? null : item.path
                        )
                      }
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-300 cursor-pointer",
                        itemIsActive
                          ? "text-white bg-white/5"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                      aria-expanded={isMobileDropdownOpen}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          isMobileDropdownOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isMobileDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      {item.children?.map((child) => {
                        const childIsActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                            className={cn(
                              "block pl-8 pr-4 py-2 text-sm transition-all duration-300",
                              childIsActive
                                ? "text-white bg-indonesian-gold/20 border-l-2 border-indonesian-gold"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                            role="menuitem"
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block w-full text-left px-4 py-3 transition-all duration-300 cursor-pointer",
                    itemIsActive
                      ? "text-white bg-white/5"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                  role="menuitem"
                  aria-label={`Navigate to ${item.label} page`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Theme Toggle - Mobile */}
            <div className="mt-2 border-t border-white/10 pt-2">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
                role="menuitem"
                aria-label="Toggle theme"
                style={{ pointerEvents: 'auto' }}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* User Menu / Get Started Button */}
            {isAuthenticated ? (
              <div className="mt-2 space-y-2">
                <div className="px-4 py-3 text-sm text-gray-300 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || user?.email}</span>
                  </div>
                </div>
                <Link
                  to="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
                  role="menuitem"
                  style={{ pointerEvents: 'auto' }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
                  role="menuitem"
                  aria-label="Logout"
                  style={{ pointerEvents: 'auto' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 mt-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                style={{
                  transform: 'scale(1)',
                  willChange: 'transform, background-color',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                role="menuitem"
                aria-label="Get Started"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </nav>
  );
}

