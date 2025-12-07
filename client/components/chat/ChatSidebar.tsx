import { memo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  MessageSquare,
  History,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Plus,
  LogOut,
  Search,
  Clock,
  Bookmark,
  FileText,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Pin,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// MOCK DATA - Replace with real API call
const mockRecentChats = [
  { id: "1", title: "Halo, aku ingin tahu tentang...", timestamp: "5 menit lalu", pinned: false },
  { id: "2", title: "Bagaimana cara membuat video...", timestamp: "1 jam lalu", pinned: false },
  { id: "3", title: "Tolong jelaskan budaya...", timestamp: "3 jam lalu", pinned: true },
  { id: "4", title: "Resep masakan tradisional...", timestamp: "Kemarin", pinned: false },
  { id: "5", title: "Sejarah kerajaan Majapahit...", timestamp: "2 hari lalu", pinned: false },
];

const mockSavedChats = [
  { id: "s1", title: "Resep rendang tradisional", timestamp: "2 hari lalu" },
  { id: "s2", title: "Cerita asal-usul batik mega...", timestamp: "1 minggu lalu" },
  { id: "s3", title: "Tourism kit untuk Danau Toba", timestamp: "2 minggu lalu" },
];

// Tooltip component for collapsed state
const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <div className="relative group">
    {children}
    <div className="absolute left-full ml-2 px-3 py-2 bg-[#333] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
      {text}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#333]" />
    </div>
  </div>
);

/**
 * Chat Sidebar Component - Redesigned for FULLY IMPLEMENTED.MD spec
 * 
 * Features:
 * - New Chat button (gold styled)
 * - Recent Chats (expandable with mock data)
 * - Saved Chats (expandable with empty state)
 * - My Prompts link
 * - History link
 * - Settings REMOVED from sidebar (now in topbar)
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

  // Expandable sections state
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [savedExpanded, setSavedExpanded] = useState(true);

  // Hover menu state for chat items
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const handleNewChat = () => {
    // Clear current chat and start fresh
    navigate("/chat");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number = 35) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Filter chats by search query
  const filteredRecentChats = mockRecentChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
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
          "p-4 border-b flex items-center justify-between",
          "border-white/10"
        )}>
          {!isCollapsed ? (
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#C9A04F]" />
              AI Chat
            </h2>
          ) : (
            <MessageSquare className="w-6 h-6 text-[#C9A04F] mx-auto" />
          )}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-[#A0A0A0] hover:text-white hover:bg-white/10"
              )}
              aria-label="Collapse sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Chat Button - Gold Styled */}
        <div className="p-4">
          {isCollapsed ? (
            <Tooltip text="Mulai chat baru">
              <button
                onClick={handleNewChat}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-xl font-semibold",
                  "bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white",
                  "hover:shadow-[0_0_20px_rgba(201,160,79,0.4)] transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}
                aria-label="New Chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={handleNewChat}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold",
                "bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white",
                "hover:shadow-[0_0_20px_rgba(201,160,79,0.4)] transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                "border border-[#C9A04F]/30"
              )}
            >
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* Search Bar (only when expanded) */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
              <Input
                type="text"
                placeholder="Cari chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2 w-full rounded-lg",
                  "bg-white/5 border-white/10 text-white placeholder:text-[#A0A0A0]",
                  "focus:bg-white/10 focus:border-[#C9A04F]/50 transition-all duration-200"
                )}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">

          {/* Recent Chats Section */}
          <div className="mb-2">
            {isCollapsed ? (
              <Tooltip text="Chat yang baru dibuka">
                <button
                  className={cn(
                    "w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                    "text-[#A0A0A0] hover:text-white hover:bg-white/10"
                  )}
                >
                  <Clock className="w-5 h-5" />
                </button>
              </Tooltip>
            ) : (
              <>
                <button
                  onClick={() => setRecentExpanded(!recentExpanded)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    "text-[#A0A0A0] hover:text-white hover:bg-white/10"
                  )}
                >
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left">Recent Chats</span>
                  {recentExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Recent Chats List */}
                {recentExpanded && (
                  <div className="ml-2 pl-4 border-l border-white/10 mt-1 space-y-1">
                    {filteredRecentChats.length > 0 ? (
                      filteredRecentChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer relative group",
                            "text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]",
                            chat.pinned && "bg-[#C9A04F]/10 border-l-2 border-[#C9A04F]"
                          )}
                          onMouseEnter={() => setHoveredChat(chat.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                          onClick={() => navigate(`/chat/${chat.id}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{truncateText(chat.title)}</p>
                            <p className="text-[10px] text-[#666] mt-0.5">{chat.timestamp}</p>
                          </div>

                          {/* Hover Menu */}
                          {hoveredChat === chat.id && (
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-1 hover:bg-white/20 rounded"
                                onClick={(e) => { e.stopPropagation(); /* Rename */ }}
                                aria-label="Rename"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                className="p-1 hover:bg-white/20 rounded"
                                onClick={(e) => { e.stopPropagation(); /* Pin */ }}
                                aria-label="Pin"
                              >
                                <Pin className="w-3 h-3" />
                              </button>
                              <button
                                className="p-1 hover:bg-red-500/20 rounded text-red-400"
                                onClick={(e) => { e.stopPropagation(); /* Delete */ }}
                                aria-label="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#666] px-3 py-2">Tidak ada hasil</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Saved Chats Section */}
          <div className="mb-2">
            {isCollapsed ? (
              <Tooltip text="Chat yang kamu simpan">
                <button
                  className={cn(
                    "w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                    "text-[#A0A0A0] hover:text-white hover:bg-white/10"
                  )}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </Tooltip>
            ) : (
              <>
                <button
                  onClick={() => setSavedExpanded(!savedExpanded)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    "text-[#A0A0A0] hover:text-white hover:bg-white/10"
                  )}
                >
                  <Bookmark className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left">Saved Chats</span>
                  {savedExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Saved Chats List or Empty State */}
                {savedExpanded && (
                  <div className="ml-2 pl-4 border-l border-white/10 mt-1 space-y-1">
                    {mockSavedChats.length > 0 ? (
                      mockSavedChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                            "text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]"
                          )}
                          onClick={() => navigate(`/chat/${chat.id}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{truncateText(chat.title)}</p>
                            <p className="text-[10px] text-[#666] mt-0.5">{chat.timestamp}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Empty State
                      <div className="bg-[#1A1A1A] rounded-lg p-3 text-center">
                        <p className="text-xs text-[#A0A0A0] mb-2">
                          Belum ada saved chat. Tekan tombol Simpan pada pesan untuk menyimpan.
                        </p>
                        <button className="text-xs text-[#C9A04F] hover:underline">
                          Pelajari Prompt
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* My Prompts */}
          <div className="mb-2">
            {isCollapsed ? (
              <Tooltip text="My Prompts">
                <Link
                  to="/chat/prompts"
                  className={cn(
                    "w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                    "text-[#A0A0A0] hover:text-white hover:bg-white/10",
                    location.pathname === "/chat/prompts" && "bg-[#C9A04F]/20 text-[#C9A04F] border-l-[3px] border-[#C9A04F]"
                  )}
                >
                  <FileText className="w-5 h-5" />
                </Link>
              </Tooltip>
            ) : (
              <Link
                to="/chat/prompts"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  "text-[#A0A0A0] hover:text-white hover:bg-white/10",
                  location.pathname === "/chat/prompts" && "bg-[#C9A04F]/20 text-[#C9A04F] border-l-[3px] border-[#C9A04F] font-semibold"
                )}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm flex-1">My Prompts</span>
                <span className="text-[10px] text-[#666] bg-white/10 px-2 py-0.5 rounded-full">3</span>
              </Link>
            )}
          </div>

          {/* History */}
          <div className="mb-2">
            {isCollapsed ? (
              <Tooltip text="Lihat semua percakapan">
                <Link
                  to="/chat/history"
                  className={cn(
                    "w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                    "text-[#A0A0A0] hover:text-white hover:bg-white/10",
                    location.pathname === "/chat/history" && "bg-[#C9A04F]/20 text-[#C9A04F] border-l-[3px] border-[#C9A04F]"
                  )}
                >
                  <History className="w-5 h-5" />
                </Link>
              </Tooltip>
            ) : (
              <Link
                to="/chat/history"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  "text-[#A0A0A0] hover:text-white hover:bg-white/10",
                  location.pathname === "/chat/history" && "bg-[#C9A04F]/20 text-[#C9A04F] border-l-[3px] border-[#C9A04F] font-semibold"
                )}
              >
                <History className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm flex-1">History</span>
                <span className="text-[10px] text-[#666]">Lihat semua</span>
              </Link>
            )}
          </div>

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
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
              "text-[#A0A0A0] hover:text-white hover:bg-white/10",
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
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  "bg-gradient-to-br from-[#C9A04F] to-[#8B6914]"
                )}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium truncate">{user.name}</p>
                  <p className="text-xs text-[#A0A0A0] truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "text-[#A0A0A0] hover:text-white hover:bg-white/10"
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
                  "text-[#A0A0A0] hover:text-white hover:bg-white/10"
                )}
                aria-label="Expand sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full p-3 rounded-lg transition-all duration-200 flex justify-center",
                  "text-[#A0A0A0] hover:text-white hover:bg-white/10"
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

export default ChatSidebar;
