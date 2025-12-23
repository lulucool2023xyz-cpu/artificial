import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts';

/**
 * Wrapper component that activates global keyboard shortcuts
 * This uses the router so it must be inside BrowserRouter
 */
export function GlobalShortcuts() {
    // Register all global shortcuts
    useGlobalShortcuts();

    return null;
}
