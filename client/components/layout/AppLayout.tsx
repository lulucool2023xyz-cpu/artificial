import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ToggleTheme } from "@/components/ui/ToggleTheme";
import { MorphingNavigation, type MorphingNavigationLink } from "@/components/ui/MorphingNavigation";
import Dock from "@/components/ui/Dock";
import {
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    MessageSquare,
    BookOpen,
    Sparkles,
    PenTool,
    Settings,
    CreditCard,
    History,
    HelpCircle,
    LogOut,
    Clock,
    Plus,
    Globe,
    Download,
    ExternalLink,
    Crown,
    Info
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    badge?: string;
    children?: { id: string; label: string; onClick?: () => void }[];
}

export interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    sidebarItems?: SidebarItem[];
    activeSidebarItem?: string;
    onSidebarItemClick?: (id: string) => void;
    showNewButton?: boolean;
    newButtonLabel?: string;
    onNewButtonClick?: () => void;
}

/**
 * AppLayout Component - Consistent layout with sidebar for all pages
 * 
 * Features:
 * - Same sidebar STYLE as Chat (header "Orenax", user profile)
 * - Configurable sidebar CONTENT per page
 * - Responsive design (mobile sidebar + dock)
 * - Header with navigation
 */
export function AppLayout({
    children,
    title = "Orenax",
    sidebarItems = [],
    activeSidebarItem,
    onSidebarItemClick,
    showNewButton = false,
    newButtonLabel = "New",
    onNewButtonClick
}: AppLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme } = useTheme();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarMinimized, setSidebarMinimized] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const sidebarToggleRef = useRef(false);

    // Check mobile view
    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (isMobileView) setSidebarOpen(false);
    }, [location.pathname, isMobileView]);

    const profile = {
        name: user?.name || 'User',
        email: user?.email || 'user@example.com'
    };

    const toggleSidebar = () => {
        if (!sidebarToggleRef.current) {
            sidebarToggleRef.current = true;
            // On mobile, always open sidebar fully expanded (not minimized)
            if (isMobileView) {
                setSidebarMinimized(false); // Always expanded on mobile
            }
            setSidebarOpen(!sidebarOpen);
            setTimeout(() => { sidebarToggleRef.current = false; }, 300);
        }
    };

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleLogout = () => setShowLogoutDialog(true);
    const confirmLogout = () => { logout(); navigate('/auth/login'); };

    // Navigation links
    const navLinks: MorphingNavigationLink[] = [
        { id: 'library', label: 'Library', href: '/library', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'culture', label: 'Culture', href: '/culture', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'chat', label: 'Chat', href: '/chat', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'creative', label: 'Creative', href: '/creative', icon: <PenTool className="w-4 h-4" /> },
    ];

    const handleNavLinkClick = (link: MorphingNavigationLink) => {
        navigate(link.href || '/');
    };

    return (
        <div className="flex h-screen bg-background text-foreground relative overflow-hidden">

            {/* Mobile Overlay */}
            {isMobileView && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:relative lg:translate-x-0 z-[60] bg-card border-r border-border h-full flex flex-col",
                "transition-all duration-300 ease-out",
                isMobileView
                    ? sidebarOpen
                        // On mobile, always show fully expanded sidebar
                        ? "w-72 shadow-2xl translate-x-0"
                        : "-translate-x-full w-72"
                    : sidebarMinimized ? "w-16 sm:w-20" : "w-64 sm:w-72"
            )}>

                {/* Sidebar Header */}
                <div className={cn(
                    "flex items-center border-b border-border",
                    (sidebarMinimized && !isMobileView) ? "h-14 sm:h-16 px-2 justify-center" : "h-14 sm:h-16 px-3 sm:px-4 justify-between"
                )}>
                    {(!sidebarMinimized || isMobileView) ? (
                        <>
                            <h2 className="text-lg sm:text-xl font-bold text-[#FFD700]">Orenax</h2>
                            <button
                                onClick={() => {
                                    if (isMobileView) {
                                        setSidebarOpen(false);
                                    } else {
                                        setSidebarMinimized(true);
                                    }
                                }}
                                className="p-1.5 sm:p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={isMobileView ? "Close sidebar" : "Minimize sidebar"}
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setSidebarMinimized(false)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Expand sidebar"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    )}
                </div>

                {/* New Button (if enabled) */}
                {showNewButton && (
                    <div className={cn("p-2 sm:p-3", (sidebarMinimized && !isMobileView) && "flex justify-center")}>
                        <button
                            onClick={onNewButtonClick}
                            className={cn(
                                "flex items-center gap-2 rounded-lg sm:rounded-xl font-semibold transition-all",
                                "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:shadow-lg",
                                (sidebarMinimized && !isMobileView) ? "p-2 sm:p-2.5 justify-center" : "w-full px-3 sm:px-4 py-2 sm:py-2.5"
                            )}
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            {(!sidebarMinimized || isMobileView) && <span className="text-sm sm:text-base">{newButtonLabel}</span>}
                        </button>
                    </div>
                )}

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2">
                    {sidebarItems.map((item, index) => (
                        <div key={item.id}>
                            {/* Add separator/divider for visual spacing */}
                            {index > 0 && index % 3 === 0 && (!sidebarMinimized || isMobileView) && (
                                <hr className="border-border my-3" />
                            )}
                            <button
                                onClick={() => {
                                    if (item.children) toggleExpanded(item.id);
                                    else if (item.onClick) item.onClick();
                                    else if (onSidebarItemClick) onSidebarItemClick(item.id);
                                    // Close sidebar on mobile after selection
                                    if (isMobileView && !item.children) {
                                        setSidebarOpen(false);
                                    }
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2 sm:gap-3 rounded-lg transition-all",
                                    (sidebarMinimized && !isMobileView) ? "px-2 sm:px-3 py-2 sm:py-2.5 justify-center" : "px-3 py-2.5",
                                    activeSidebarItem === item.id || item.active
                                        ? "bg-[#FFD700]/20 text-[#FFD700] border-l-[3px] border-[#FFD700]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                {(!sidebarMinimized || isMobileView) && (
                                    <>
                                        <span className="text-sm flex-1 text-left truncate">{item.label}</span>
                                        {item.badge && (
                                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{item.badge}</span>
                                        )}
                                        {item.children && (
                                            expandedItems.has(item.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                                        )}
                                    </>
                                )}
                            </button>

                            {/* Children items */}
                            {item.children && expandedItems.has(item.id) && (!sidebarMinimized || isMobileView) && (
                                <div className="ml-4 pl-2 border-l border-border space-y-1 mt-1">
                                    {item.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => {
                                                child.onClick?.();
                                                if (isMobileView) setSidebarOpen(false);
                                            }}
                                            className="w-full text-left text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary/50 truncate"
                                        >
                                            {child.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer - User Profile */}
                <div className="p-3 border-t border-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={cn(
                                    "w-full flex items-center gap-3 rounded-xl transition-all",
                                    "focus:outline-none focus:ring-2 focus:ring-ring",
                                    (sidebarMinimized && !isMobileView) ? "px-2 py-3 justify-center" : "px-3 py-3",
                                    "bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/20 hover:from-[#FFD700]/15 hover:to-[#FFD700]/10"
                                )}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                                {(!sidebarMinimized || isMobileView) && (
                                    <>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium truncate text-[#FFD700]">{profile.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                    </>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="top"
                            sideOffset={8}
                            className="w-[17rem] bg-[#0A0A0A] dark:bg-[#0A0A0A] border border-white/10 shadow-xl"
                            style={{ zIndex: 9999 }}
                        >
                            <DropdownMenuLabel className="text-gray-400 pt-1 px-2 pb-2 truncate">{profile.email}</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() => { navigate('/chat/settings'); if (isMobileView) setSidebarOpen(false); }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                            >
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => { navigate('/chat/subscription'); if (isMobileView) setSidebarOpen(false); }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                            >
                                <CreditCard className="w-4 h-4 mr-2" /> Subscription
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => { navigate('/chat/history'); if (isMobileView) setSidebarOpen(false); }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                            >
                                <History className="w-4 h-4 mr-2" /> History
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-white/10" />

                            {/* Language submenu - simplified as single item */}
                            <DropdownMenuItem
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <Globe className="w-4 h-4 mr-2" /> Language
                                </div>
                                <span className="text-xs text-gray-500">ID</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => { toast.info("Bantuan tersedia di resources/support"); navigate('/resources/support'); if (isMobileView) setSidebarOpen(false); }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                            >
                                <HelpCircle className="w-4 h-4 mr-2" /> Get help
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-white/10" />

                            <DropdownMenuItem
                                onClick={() => { navigate('/chat/subscription'); if (isMobileView) setSidebarOpen(false); }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                            >
                                <Crown className="w-4 h-4 mr-2" /> Upgrade plan
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    window.open('/aplikasi/app-release.apk', '_blank');
                                    toast.success("Download dimulai...");
                                }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download OrenAX for Android
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => { navigate('/company/about'); if (isMobileView) setSidebarOpen(false); }}
                                className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <Info className="w-4 h-4 mr-2" /> Learn more
                                </div>
                                <ExternalLink className="w-3 h-3 text-gray-500" />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-white/10" />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        {/* Left - Mobile Menu & Title */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-[#FFD700] hover:text-[#FFA500] transition-colors p-2 rounded-lg hover:bg-[#FFD700]/10 flex-shrink-0"
                                aria-label="Toggle sidebar"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg sm:text-xl font-bold text-[#FFD700] truncate">{title}</h1>
                        </div>

                        {/* Center - Navigation (Desktop) */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <MorphingNavigation
                                links={navLinks}
                                theme="glass"
                                scrollThreshold={50}
                                onLinkClick={handleNavLinkClick}
                                className="relative !fixed !top-0 !left-1/2 !-translate-x-1/2"
                            />
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <ToggleTheme animationType="circle-spread" />
                            <button
                                onClick={() => navigate('/chat/history')}
                                className="p-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 hover:bg-[#FFD700]/20 text-[#FFD700]"
                                aria-label="History"
                            >
                                <Clock className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Dock Navigation */}
                <div className="lg:hidden">
                    <Dock
                        items={[
                            { icon: <BookOpen className="w-6 h-6 text-foreground" />, label: "Library", onClick: () => navigate('/library') },
                            { icon: <Sparkles className="w-6 h-6 text-foreground" />, label: "Culture", onClick: () => navigate('/culture') },
                            { icon: <MessageSquare className="w-6 h-6 text-foreground" />, label: "Chat", onClick: () => navigate('/chat') },
                            { icon: <PenTool className="w-6 h-6 text-foreground" />, label: "Creative", onClick: () => navigate('/creative') },
                        ]}
                        magnification={60}
                        distance={140}
                        baseItemSize={45}
                        panelHeight={56}
                        className="bg-card/80 backdrop-blur-md border-[#FFD700]/20"
                    />
                </div>

                {/* Main Content with Page Transition Animation */}
                <motion.main
                    className="flex-1 overflow-y-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4
                    }}
                    key={location.pathname}
                >
                    {children}
                </motion.main>
            </div>

            {/* Logout Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout</AlertDialogTitle>
                        <AlertDialogDescription>Apakah Anda yakin ingin keluar?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default AppLayout;
