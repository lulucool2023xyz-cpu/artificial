"use client";

import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
    MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function useDockItemSize(
    mouseX: MotionValue<number>,
    baseItemSize: number,
    magnification: number,
    distance: number,
    ref: React.RefObject<HTMLDivElement>,
    spring: { mass: number; stiffness: number; damping: number }
) {
    const mouseDistance = useTransform(mouseX, (val) => {
        if (typeof val !== "number" || isNaN(val)) return 0;
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize,
        };
        return val - rect.x - baseItemSize / 2;
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
    onClick: () => void;
    mouseX: MotionValue<number>;
    baseItemSize: number;
    magnification: number;
    distance: number;
    spring: { mass: number; stiffness: number; damping: number };
    badgeCount?: number;
}

function DockItem({
    icon,
    label,
    onClick,
    mouseX,
    baseItemSize,
    magnification,
    distance,
    spring,
    badgeCount,
}: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);
    const size = useDockItemSize(
        mouseX,
        baseItemSize,
        magnification,
        distance,
        ref,
        spring
    );
    const [showLabel, setShowLabel] = useState(false);
    const [isActivated, setIsActivated] = useState(false);
    const activationTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const unsubscribe = isHovered.on("change", (value) =>
            setShowLabel(value === 1)
        );
        return () => unsubscribe();
    }, [isHovered]);

    // Clear activation after 2 seconds of inactivity
    useEffect(() => {
        return () => {
            if (activationTimerRef.current) {
                clearTimeout(activationTimerRef.current);
            }
        };
    }, []);

    const handleClick = () => {
        if (isActivated) {
            // Second click - navigate
            onClick();
            setIsActivated(false);
            setShowLabel(false);
            if (activationTimerRef.current) {
                clearTimeout(activationTimerRef.current);
            }
        } else {
            // First click - show label and activate
            setIsActivated(true);
            setShowLabel(true);
            isHovered.set(1);

            // Reset after 2 seconds
            if (activationTimerRef.current) {
                clearTimeout(activationTimerRef.current);
            }
            activationTimerRef.current = setTimeout(() => {
                setIsActivated(false);
                setShowLabel(false);
                isHovered.set(0);
            }, 2000);
        }
    };

    return (
        <motion.div
            ref={ref}
            style={{ width: size, height: size }}
            onHoverStart={() => {
                isHovered.set(1);
                // On hover, reset activation state for desktop
                setIsActivated(false);
            }}
            onHoverEnd={() => {
                if (!isActivated) {
                    isHovered.set(0);
                }
            }}
            onFocus={() => isHovered.set(1)}
            onBlur={() => {
                if (!isActivated) {
                    isHovered.set(0);
                }
            }}
            onClick={handleClick}
            className="relative inline-flex items-center justify-center rounded-full 
      bg-background shadow-md cursor-pointer"
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            <div className="flex items-center justify-center">{icon}</div>
            {badgeCount !== undefined && badgeCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {badgeCount > 99 ? "99+" : badgeCount}
                </span>
            )}
            <AnimatePresence>
                {showLabel && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md 
            border border-border px-2 py-0.5 text-xs text-foreground
            ${isActivated ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-card'}`}
                        style={{ x: "-50%" }}
                        role="tooltip"
                    >
                        {isActivated ? `Tap to open ${label}` : label}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

interface DockItem {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    badgeCount?: number;
}

interface DockProps {
    items: DockItem[];
    className?: string;
    spring?: { mass: number; stiffness: number; damping: number };
    magnification?: number;
    distance?: number;
    panelHeight?: number;
    dockHeight?: number;
    baseItemSize?: number;
    position?: "bottom" | "top";
}

export default function Dock({
    items,
    className = "",
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 64,
    dockHeight = 256,
    baseItemSize = 50,
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );

    const animatedHeight = useSpring(
        useTransform(isHovered, [0, 1], [panelHeight, maxHeight]),
        spring
    );

    return (
        <motion.div
            style={{ height: animatedHeight }}
            className="mx-2 flex max-w-full items-center justify-center"
        >
            <motion.div
                onMouseMove={({ pageX }) => {
                    isHovered.set(1);
                    mouseX.set(pageX);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseX.set(Infinity);
                }}
                className={`relative flex items-end gap-4 w-fit rounded-2xl 
            border-2 border-border px-4 pb-2 ${className}`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        onClick={item.onClick}
                        mouseX={mouseX}
                        baseItemSize={baseItemSize}
                        magnification={magnification}
                        distance={distance}
                        spring={spring}
                        badgeCount={item.badgeCount}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
