"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

type AnimationType =
    | "none"
    | "circle-spread"
    | "round-morph"
    | "swipe-left"
    | "swipe-up"
    | "fade-in-out"

interface ToggleThemeProps
    extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number
    animationType?: AnimationType
}

export const ToggleTheme = ({
    className,
    duration = 400,
    animationType = "circle-spread",
    ...props
}: ToggleThemeProps) => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return

        const newTheme = theme === "dark" ? "light" : "dark"

        // Check if View Transition API is supported
        if (!document.startViewTransition) {
            setTheme(newTheme)
            return
        }

        // Wait for the DOM update to complete within the View Transition
        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme)
            })
        }).ready

        // Calculate coordinates and dimensions for spatial animations
        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        )
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        switch (animationType) {
            case "circle-spread":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "round-morph":
                document.documentElement.animate(
                    [
                        { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
                        { opacity: 1, transform: "scale(1) rotate(0deg)" },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-left":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 0 0 ${viewportWidth}px)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-up":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(${viewportHeight}px 0 0 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "fade-in-out":
                document.documentElement.animate(
                    {
                        opacity: [0, 1],
                    },
                    {
                        duration: duration * 0.5,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "none":
            default:
                break
        }

    }, [theme, duration, animationType, setTheme])

    if (!mounted) {
        return (
            <button
                className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    className
                )}
                disabled
                {...props}
            >
                <Moon className="h-5 w-5" />
            </button>
        )
    }

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleTheme}
                className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    theme === "dark" ? "hover:text-amber-400" : "hover:text-blue-500",
                    className
                )}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                {...props}
            >
                {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
            </button>

            {/* Override default view transition animation */}
            {animationType !== "none" && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            ::view-transition-old(root),
                            ::view-transition-new(root) {
                                animation: none;
                                mix-blend-mode: normal;
                            }
                        `,
                    }}
                />
            )}
        </>
    )
}

export default ToggleTheme
