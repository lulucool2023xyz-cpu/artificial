"use client";

import { memo, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
    MotionValue,
} from "framer-motion";
import {
    Newspaper,
    History,
    Palette,
    Settings,
    CreditCard,
    ChevronRight,
    LogOut,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ToggleTheme } from "@/components/ui/ToggleTheme";

// Spring configuration for smooth animations
const SPRING_CONFIG = { mass: 0.1, stiffness: 150, damping: 12 };
const BASE_ITEM_SIZE = 44;
const MAGNIFICATION = 64;
const DISTANCE = 140;

// Custom hook for dock item size magnification (vertical)
function useDockItemSize(
    mouseY: MotionValue<number>,
    baseItemSize: number,
    magnification: number,
    distance: number,
    ref: React.RefObject<HTMLDivElement>,
    spring: { mass: number; stiffness: number; damping: number }
) {
    const mouseDistance = useTransform(mouseY, (val) => {
        if (typeof val !== "number" || isNaN(val)) return 0;
        const rect = ref.current?.getBoundingClientRect() ?? {
            y: 0,
            height: baseItemSize,
        };
        return val - rect.y - baseItemSize / 2;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, magnification, baseItemSize]
    );

    return useSpring(targetSize, spring);
}

interface DockItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    mouseY: MotionValue<number>;
    baseItemSize: number;
    magnification: number;
    distance: number;
    spring: { mass: number; stiffness: number; damping: number };
    isExpanded: boolean;
}

const DockItem = memo(function DockItem({
    icon,
    label,
    isActive,
    onClick,
    mouseY,
    baseItemSize,
    magnification,
    distance,
    spring,
    isExpanded,
}: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);
    const size = useDockItemSize(mouseY, baseItemSize, magnification, distance, ref, spring);
    const [showLabel, setShowLabel] = useState(false);

    useEffect(() => {
        const unsubscribe = isHovered.on("change", (value) =>
            setShowLabel(value === 1)
        );
        return () => unsubscribe();
    }, [isHovered]);

    // Don't apply magnification when expanded
    if (isExpanded) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:ring-offset-2 focus:ring-offset-background",
                    isActive
                        ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
                aria-label={label}
            >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
            </button>
        );
    }

    return (
        <motion.div
            ref={ref}
            style={{ width: size, height: size }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={cn(
                "relative inline-flex items-center justify-center rounded-full shadow-md cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50",
                isActive
                    ? "bg-gradient-to-br from-[#FFD700]/30 to-[#FFA500]/20 text-[#FFD700] ring-2 ring-[#FFD700]/30"
                    : "bg-card text-muted-foreground hover:text-foreground"
            )}
            tabIndex={0}
            role="button"
            aria-label={label}
        >
            <div className="flex items-center justify-center">{icon}</div>

            {/* Tooltip - appears to the right */}
            <AnimatePresence>
                {showLabel && (
                    <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full ml-3 px-2.5 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground whitespace-nowrap z-50 shadow-lg"
                    >
                        {label}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

interface SidebarDockProps {
    isOpen: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onClose: () => void;
    isMobile: boolean;
}

export const SidebarDock = memo(function SidebarDock({
    isOpen,
    isExpanded,
    onToggleExpand,
    onClose,
    isMobile,
}: SidebarDockProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const mouseY = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const menuItems = [
        { icon: <Newspaper className="w-5 h-5" />, label: "News Chat", path: "/chat" },
        { icon: <History className="w-5 h-5" />, label: "Recent Chat", path: "/chat/history" },
    ];

    const toolItems = [
        { icon: <Palette className="w-5 h-5" />, label: "Customize", path: "/chat/profile" },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/chat/settings" },
        { icon: <CreditCard className="w-5 h-5" />, label: "Subscription", path: "/chat/subscription" },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) onClose();
    };

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    // Calculate sidebar width based on dock magnification
    const maxWidth = useMemo(
        () => Math.max(72, MAGNIFICATION + 24),
        []
    );

    const animatedWidth = useSpring(
        useTransform(isHovered, [0, 1], [72, maxWidth]),
        SPRING_CONFIG
    );

    // Don't render on mobile when closed
    if (isMobile && !isOpen) return null;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[59] backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <motion.aside
                className={cn(
                    "fixed lg:relative z-[60] bg-card border-r border-border h-full flex flex-col transition-all duration-300 ease-out shadow-2xl lg:shadow-none",
                    isMobile ? "left-0 top-0" : ""
                )}
                style={{
                    width: isExpanded ? 260 : isMobile ? 260 : animatedWidth,
                }}
                initial={isMobile ? { x: -260 } : false}
                animate={isMobile ? { x: isOpen ? 0 : -260 } : undefined}
                onMouseMove={(e) => {
                    if (!isExpanded && !isMobile) {
                        isHovered.set(1);
                        mouseY.set(e.clientY);
                    }
                }}
                onMouseLeave={() => {
                    if (!isExpanded && !isMobile) {
                        isHovered.set(0);
                        mouseY.set(Infinity);
                    }
                }}
            >
                {/* Header */}
                <div className={cn(
                    "p-4 border-b border-border/50 flex items-center",
                    isExpanded || isMobile ? "justify-between" : "justify-center"
                )}>
                    {(isExpanded || isMobile) && (
                        <h2 className="text-lg font-bold text-[#FFD700] flex items-center gap-2">
                            <Newspaper className="w-5 h-5" />
                            AI Chat
                        </h2>
                    )}

                    <button
                        onClick={isMobile ? onClose : onToggleExpand}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                        aria-label={isMobile ? "Close sidebar" : (isExpanded ? "Collapse sidebar" : "Expand sidebar")}
                    >
                        {isMobile ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <ChevronRight className={cn(
                                "w-4 h-4 transition-transform",
                                isExpanded ? "rotate-180" : ""
                            )} />
                        )}
                    </button>
                </div>

                {/* Main Navigation - Dock Style */}
                <nav className={cn(
                    "flex-1 overflow-y-auto",
                    isExpanded || isMobile ? "p-3 space-y-2" : "py-4 flex flex-col items-center gap-3"
                )}>
                    {menuItems.map((item) => (
                        <DockItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            isActive={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                            mouseY={mouseY}
                            baseItemSize={BASE_ITEM_SIZE}
                            magnification={MAGNIFICATION}
                            distance={DISTANCE}
                            spring={SPRING_CONFIG}
                            isExpanded={isExpanded || isMobile}
                        />
                    ))}

                    {/* Separator */}
                    {isExpanded || isMobile ? (
                        <div className="my-3 border-t border-border/50" />
                    ) : (
                        <div className="w-8 h-px bg-border/50 my-2" />
                    )}

                    {toolItems.map((item) => (
                        <DockItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            isActive={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                            mouseY={mouseY}
                            baseItemSize={BASE_ITEM_SIZE}
                            magnification={MAGNIFICATION}
                            distance={DISTANCE}
                            spring={SPRING_CONFIG}
                            isExpanded={isExpanded || isMobile}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <div className={cn(
                    "p-3 border-t border-border",
                    !isExpanded && !isMobile && "flex flex-col items-center gap-3"
                )}>
                    {/* Theme Toggle */}
                    <div className={cn(
                        "flex items-center rounded-xl transition-colors mb-3",
                        isExpanded || isMobile ? "justify-between px-3 py-2 hover:bg-secondary/50" : "justify-center"
                    )}>
                        {(isExpanded || isMobile) && (
                            <span className="text-sm text-muted-foreground">Theme</span>
                        )}
                        <ToggleTheme
                            animationType="circle-spread"
                            duration={400}
                            className="text-muted-foreground hover:text-foreground"
                        />
                    </div>

                    {/* User Profile */}
                    {user && (
                        <div className={cn(
                            "flex items-center rounded-xl bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/20",
                            isExpanded || isMobile ? "justify-between p-3" : "justify-center p-2"
                        )}>
                            {(isExpanded || isMobile) ? (
                                <>
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-sm font-bold text-black shrink-0">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                                        aria-label="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-xs font-bold text-black">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
});

export default SidebarDock;
