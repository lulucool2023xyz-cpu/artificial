import { memo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  MessageSquare, 
  History, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Plus,
  LogOut,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Chat Sidebar Component - Redesigned
 * Purpose: Navigation sidebar with search functionality
 * 
 * Features:
 * - Fixed width 280px (expanded)
 * - Search bar for chat history
 * - Better spacing and visual hierarchy
 * - Smooth transitions
 */
export const ChatSidebar = memo(function ChatSidebar({ 
  isCollapsed, 
  onToggleCollapse 
}: ChatSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewChat = () => {
    navigate("/chat");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const menuItems = [
    { icon: MessageSquare, label: "New Chat", path: "/chat", onClick: handleNewChat },
    { icon: History, label: "History", path: "/chat/history" },
    { icon: Settings, label: "Settings", path: "/chat/settings" },
    { icon: User, label: "Profile", path: "/chat/profile" },
  ];

  return (
    <>
      {/* Mobile Overlay - Show when sidebar is open on mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onToggleCollapse}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "border-r flex flex-col transition-all duration-300",
          "bg-[#0A0A0A] border-white/10",
          isCollapsed ? "w-16" : "w-[280px]",
          "h-screen fixed left-0 top-0 z-40 lg:relative lg:z-0",
          "transform lg:translate-x-0",
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0",
          "shadow-lg lg:shadow-none"
        )}
      >
      {/* Header */}
      <div className={cn(
        "p-6 border-b flex items-center justify-between",
        "border-white/10"
      )}>
        {!isCollapsed ? (
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#FF8C00]" />
            AI Chat
          </h2>
        ) : (
          <MessageSquare className="w-6 h-6 text-[#FF8C00] mx-auto" />
        )}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "text-[#B0B0B0] hover:text-white hover:bg-white/10"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold",
            "bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white",
            "hover:shadow-[0_0_20px_rgba(255,140,0,0.4)] transition-all duration-300",
            "hover:scale-105 active:scale-95",
            isCollapsed && "justify-center"
          )}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B0B0]" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 py-2 w-full rounded-lg",
                "bg-white/5 border-white/10 text-white placeholder:text-[#B0B0B0]",
                "focus:bg-white/10 focus:border-[#FF8C00]/50 transition-all duration-200"
              )}
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
                    "text-[#B0B0B0] hover:text-white hover:bg-white/10",
                    isActive && "bg-white/10 text-white font-semibold",
                    isActive && "shadow-[inset_3px_0_0_#FF8C00]",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - User & Theme Toggle */}
      <div className={cn(
        "p-4 border-t space-y-3",
        "border-white/10"
      )}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            "text-[#B0B0B0] hover:text-white hover:bg-white/10",
            isCollapsed && "justify-center"
          )}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {!isCollapsed && <span className="text-sm">Theme</span>}
        </button>

        {/* User Info & Logout */}
        {!isCollapsed && user && (
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                "bg-gradient-to-br from-[#FF8C00] to-[#FFB347]"
              )}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">{user.name}</p>
                <p className="text-xs text-[#B0B0B0] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-[#B0B0B0] hover:text-white hover:bg-white/10"
              )}
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {isCollapsed && (
          <>
            <button
              onClick={onToggleCollapse}
              className={cn(
                "w-full p-3 rounded-lg transition-all duration-200 flex justify-center",
                "text-[#B0B0B0] hover:text-white hover:bg-white/10"
              )}
              aria-label="Expand sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full p-3 rounded-lg transition-all duration-200 flex justify-center",
                "text-[#B0B0B0] hover:text-white hover:bg-white/10"
              )}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </aside>
    </>
  );
});

