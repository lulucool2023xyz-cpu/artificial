import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean; // Cmd on Mac
    shiftKey?: boolean;
    altKey?: boolean;
    description: string;
    action: () => void;
}

interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
}

/**
 * Hook for registering keyboard shortcuts
 * Supports Cmd/Ctrl + Key combinations
 */
export function useKeyboardShortcuts(
    shortcuts: KeyboardShortcut[],
    options: UseKeyboardShortcutsOptions = {}
) {
    const { enabled = true } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            // Don't trigger shortcuts when typing in input/textarea
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                // Allow Escape to work even in inputs
                if (event.key !== 'Escape') return;
            }

            for (const shortcut of shortcuts) {
                const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
                const isCtrlPressed = event.ctrlKey || event.metaKey;

                const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatches = ctrlOrMeta ? isCtrlPressed : !isCtrlPressed;
                const shiftMatches = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
                const altMatches = shortcut.altKey ? event.altKey : !event.altKey;

                if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
                    event.preventDefault();
                    shortcut.action();
                    return;
                }
            }
        },
        [shortcuts, enabled]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Pre-built shortcuts for common navigation
 */
export function useGlobalShortcuts() {
    const navigate = useNavigate();

    const shortcuts: KeyboardShortcut[] = [
        {
            key: 'k',
            ctrlKey: true,
            description: 'Open command palette / search',
            action: () => {
                // Dispatch custom event for command palette
                window.dispatchEvent(new CustomEvent('open-command-palette'));
            },
        },
        {
            key: '/',
            description: 'Focus chat input',
            action: () => {
                const chatInput = document.querySelector('[data-chat-input]') as HTMLElement;
                chatInput?.focus();
            },
        },
        {
            key: 'n',
            ctrlKey: true,
            description: 'New chat',
            action: () => {
                window.dispatchEvent(new CustomEvent('new-chat'));
            },
        },
        {
            key: 'Escape',
            description: 'Close modal / Cancel',
            action: () => {
                window.dispatchEvent(new CustomEvent('close-modal'));
            },
        },
        {
            key: '1',
            ctrlKey: true,
            description: 'Go to Chat',
            action: () => navigate('/chat'),
        },
        {
            key: '2',
            ctrlKey: true,
            description: 'Go to Creative',
            action: () => navigate('/creative'),
        },
        {
            key: '3',
            ctrlKey: true,
            description: 'Go to Culture',
            action: () => navigate('/culture'),
        },
        {
            key: '4',
            ctrlKey: true,
            description: 'Go to Library',
            action: () => navigate('/library'),
        },
        {
            key: ',',
            ctrlKey: true,
            description: 'Open Settings',
            action: () => navigate('/chat/settings'),
        },
    ];

    useKeyboardShortcuts(shortcuts);

    return shortcuts;
}
