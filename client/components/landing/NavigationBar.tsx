import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard, CreditCard } from 'lucide-react';
import { ToggleTheme } from '@/components/ui/ToggleTheme';
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
  {
    label: 'Home',
    path: '/',
    children: [
      { label: 'Intelligent Capabilities', path: '/#intelligent-capabilities' },
      { label: 'Set in Action', path: '/#set-in-action' },
      { label: 'Visual Showcase', path: '/#visual-showcase' },
      { label: 'Ready to Explore', path: '/#ready-to-explore' },
    ],
  },
  {
    label: 'Product',
    path: '/product',
    children: [
      { label: 'Demo', path: '/product/demo' },
      { label: 'Use Cases', path: '/product/use-cases' },
      { label: 'Playground', path: '/product/playground' },
    ],
  },
  { label: 'Pricing', path: '/chat/subscription' },
  {
    label: 'Resources',
    path: '/resources',
    children: [
      { label: 'Documentation', path: '/resources/documentation' },
      { label: 'Status & Changelog', path: '/resources/status' },
      { label: 'Blog', path: '/resources/blog' },
      { label: 'Support', path: '/resources/support' },
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

  // Theme toggle is now handled by ToggleTheme component

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
          ? theme === 'dark'
            ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
            : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
          : 'bg-transparent'
      )}
      role="navigation"
      aria-label="Main navigation"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 sm:h-20 relative">
          {/* Logo - positioned on the left */}
          <Link
            to="/"
            className="absolute left-0 flex items-center gap-2 text-xl sm:text-2xl font-bold font-heading hover:text-glow transition-all"
            aria-label="Go to homepage"
          >
            <span className={cn(
              theme === 'dark' ? "text-white" : "text-black"
            )}>Orenax</span>
          </Link>

          {/* Desktop Navigation - Centered */}
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
                          ? theme === 'dark'
                            ? "text-white bg-white/10"
                            : "text-black bg-gray-100"
                          : theme === 'dark'
                            ? "text-gray-300 hover:text-white hover:bg-white/5"
                            : "text-gray-700 hover:text-black hover:bg-gray-100"
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
                        "absolute top-full left-0 mt-2 min-w-[200px] backdrop-blur-md border rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-[1003]",
                        theme === 'dark'
                          ? "bg-black/95 border-white/10"
                          : "bg-white/95 border-gray-200/50",
                        openDropdown === item.path
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                      style={{ pointerEvents: openDropdown === item.path ? 'auto' : 'none' }}
                    >
                      <div className="py-2">
                        {item.children?.map((child) => {
                          const childIsActive = location.pathname === child.path;
                          const isHashLink = child.path.startsWith('/#');

                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "block px-4 py-2 text-sm transition-colors duration-300 cursor-pointer",
                                childIsActive
                                  ? theme === 'dark'
                                    ? "text-white bg-indonesian-gold/20 border-l-2 border-indonesian-gold"
                                    : "text-black bg-indonesian-gold/30 border-l-2 border-indonesian-gold"
                                  : theme === 'dark'
                                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                                    : "text-gray-700 hover:text-black hover:bg-gray-100"
                              )}
                              onClick={(e) => {
                                setOpenDropdown(null);
                                if (isHashLink) {
                                  e.preventDefault();
                                  const hash = child.path.substring(1);
                                  if (location.pathname !== '/') {
                                    window.location.href = child.path;
                                  } else {
                                    smoothScrollTo(hash.replace('#', ''), 80);
                                  }
                                }
                              }}
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
                      ? theme === 'dark'
                        ? "text-white bg-white/10"
                        : "text-black bg-gray-100"
                      : theme === 'dark'
                        ? "text-gray-300 hover:text-white hover:bg-white/5"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                  )}
                  aria-label={`Navigate to ${item.label} page`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions - positioned on the right */}
          <div className="absolute right-0 hidden lg:flex items-center gap-3" style={{ pointerEvents: 'auto', zIndex: 1001 }}>
            {/* User Menu / Get Started Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef} style={{ pointerEvents: 'auto', zIndex: 1002 }}>
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 cursor-pointer",
                    theme === 'dark'
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
                  )}
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
                    className={cn(
                      "absolute top-full right-0 mt-2 min-w-[200px] backdrop-blur-md border rounded-lg shadow-xl overflow-hidden z-[1003]",
                      theme === 'dark'
                        ? "bg-black/95 border-white/10"
                        : "bg-white/95 border-gray-200/50"
                    )}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="py-2">
                      <div className={cn(
                        "px-4 py-2 text-sm border-b",
                        theme === 'dark'
                          ? "text-gray-300 border-white/10"
                          : "text-gray-700 border-gray-200/50"
                      )}>
                        <div className={cn(
                          "font-medium",
                          theme === 'dark' ? "text-white" : "text-black"
                        )}>{user?.name}</div>
                        <div className={cn(
                          "text-xs",
                          theme === 'dark' ? "text-gray-400" : "text-gray-500"
                        )}>{user?.email}</div>
                      </div>
                      <Link
                        to="/get-started"
                        onClick={() => setOpenUserMenu(false)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer",
                          theme === 'dark'
                            ? "text-gray-300 hover:text-white hover:bg-white/5"
                            : "text-gray-700 hover:text-black hover:bg-gray-100"
                        )}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/chat/subscription"
                        onClick={() => setOpenUserMenu(false)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer",
                          theme === 'dark'
                            ? "text-gray-300 hover:text-white hover:bg-white/5"
                            : "text-gray-700 hover:text-black hover:bg-gray-100"
                        )}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <CreditCard className="w-4 h-4" />
                        Subscription
                      </Link>
                      <Link
                        to="/company/about"
                        onClick={() => setOpenUserMenu(false)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer",
                          theme === 'dark'
                            ? "text-gray-300 hover:text-white hover:bg-white/5"
                            : "text-gray-700 hover:text-black hover:bg-gray-100"
                        )}
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
                        className={cn(
                          "flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer",
                          theme === 'dark'
                            ? "text-gray-300 hover:text-white hover:bg-white/5"
                            : "text-gray-700 hover:text-black hover:bg-gray-100"
                        )}
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
                className={cn(
                  "px-6 py-2 font-semibold rounded-lg transition-all duration-300 cursor-pointer",
                  theme === 'dark'
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-900"
                )}
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

            {/* Theme Toggle */}
            <ToggleTheme
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 cursor-pointer",
                theme === 'dark'
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-700 hover:text-black hover:bg-gray-100"
              )}
              style={{ pointerEvents: 'auto' }}
            />
          </div>

          {/* Mobile Right Actions - Theme Toggle + Hamburger */}
          <div className="absolute right-0 flex lg:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <ToggleTheme
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 cursor-pointer",
                theme === 'dark'
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-700 hover:text-black hover:bg-gray-100"
              )}
              style={{ pointerEvents: 'auto' }}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}
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
            className={cn(
              "pb-4 border-t backdrop-blur-md",
              theme === 'dark'
                ? "border-white/10 bg-black/95"
                : "border-gray-200/50 bg-white/95"
            )}
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
                          ? theme === 'dark'
                            ? "text-white bg-white/5"
                            : "text-black bg-gray-100"
                          : theme === 'dark'
                            ? "text-gray-300 hover:text-white hover:bg-white/5"
                            : "text-gray-700 hover:text-black hover:bg-gray-100"
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
                            onClick={(e) => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                              if (child.path.startsWith('/#')) {
                                e.preventDefault();
                                const hash = child.path.substring(1);
                                if (location.pathname !== '/') {
                                  window.location.href = child.path;
                                } else {
                                  smoothScrollTo(hash.replace('#', ''), 80);
                                }
                              }
                            }}
                            className={cn(
                              "block pl-8 pr-4 py-2 text-sm transition-all duration-300",
                              childIsActive
                                ? theme === 'dark'
                                  ? "text-white bg-indonesian-gold/20 border-l-2 border-indonesian-gold"
                                  : "text-black bg-indonesian-gold/30 border-l-2 border-indonesian-gold"
                                : theme === 'dark'
                                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                                  : "text-gray-600 hover:text-black hover:bg-gray-100"
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
                      ? theme === 'dark'
                        ? "text-white bg-white/5"
                        : "text-black bg-gray-100"
                      : theme === 'dark'
                        ? "text-gray-300 hover:text-white hover:bg-white/5"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
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
            <div className={cn(
              "mt-2 border-t pt-2",
              theme === 'dark' ? "border-white/10" : "border-gray-200/50"
            )}>
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg transition-all duration-300",
                  theme === 'dark'
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-gray-700 hover:text-black hover:bg-gray-100"
                )}
                role="menuitem"
                style={{ pointerEvents: 'auto' }}
              >
                <ToggleTheme className="p-0" />
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </div>
            </div>

            {/* User Menu / Get Started Button */}
            {isAuthenticated ? (
              <div className="mt-2 space-y-2">
                <div className={cn(
                  "px-4 py-3 text-sm border-t",
                  theme === 'dark'
                    ? "text-gray-300 border-white/10"
                    : "text-gray-700 border-gray-200/50"
                )}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || user?.email}</span>
                  </div>
                </div>
                <Link
                  to="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer",
                    theme === 'dark'
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
                  )}
                  role="menuitem"
                  style={{ pointerEvents: 'auto' }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/chat/subscription"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer",
                    theme === 'dark'
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
                  )}
                  role="menuitem"
                  style={{ pointerEvents: 'auto' }}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Subscription</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer",
                    theme === 'dark'
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
                  )}
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
                className={cn(
                  "block w-full text-left px-4 py-3 mt-2 font-semibold rounded-lg transition-all duration-300 cursor-pointer",
                  theme === 'dark'
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-900"
                )}
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

