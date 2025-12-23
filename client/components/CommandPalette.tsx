import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    MessageSquare,
    Image,
    BookOpen,
    FolderOpen,
    Settings,
    Plus,
    Command,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
    id: string;
    icon: React.ReactNode;
    title: string;
    description?: string;
    shortcut?: string;
    action: () => void;
    category: 'navigation' | 'action' | 'setting';
}

export const CommandPalette = memo(function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const commands: CommandItem[] = [
        // Navigation
        {
            id: 'nav-chat',
            icon: <MessageSquare className="w-4 h-4" />,
            title: 'Go to Chat',
            description: 'Start a new conversation',
            shortcut: '⌘1',
            action: () => navigate('/chat'),
            category: 'navigation',
        },
        {
            id: 'nav-creative',
            icon: <Image className="w-4 h-4" />,
            title: 'Go to Creative Studio',
            description: 'Generate images and videos',
            shortcut: '⌘2',
            action: () => navigate('/creative'),
            category: 'navigation',
        },
        {
            id: 'nav-culture',
            icon: <BookOpen className="w-4 h-4" />,
            title: 'Go to Culture',
            description: 'Explore Indonesian culture',
            shortcut: '⌘3',
            action: () => navigate('/culture'),
            category: 'navigation',
        },
        {
            id: 'nav-library',
            icon: <FolderOpen className="w-4 h-4" />,
            title: 'Go to Library',
            description: 'View saved content',
            shortcut: '⌘4',
            action: () => navigate('/library'),
            category: 'navigation',
        },
        {
            id: 'nav-settings',
            icon: <Settings className="w-4 h-4" />,
            title: 'Open Settings',
            description: 'Configure app preferences',
            shortcut: '⌘,',
            action: () => navigate('/chat/settings'),
            category: 'navigation',
        },
        // Actions
        {
            id: 'action-new-chat',
            icon: <Plus className="w-4 h-4" />,
            title: 'New Chat',
            description: 'Start a fresh conversation',
            shortcut: '⌘N',
            action: () => {
                window.dispatchEvent(new CustomEvent('new-chat'));
                navigate('/chat');
            },
            category: 'action',
        },
    ];

    // Filter commands based on search
    const filteredCommands = commands.filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(search.toLowerCase()) ||
            cmd.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Group by category
    const groupedCommands = {
        navigation: filteredCommands.filter((c) => c.category === 'navigation'),
        action: filteredCommands.filter((c) => c.category === 'action'),
        setting: filteredCommands.filter((c) => c.category === 'setting'),
    };

    // Listen for open event
    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        };

        const handleClose = () => setIsOpen(false);

        window.addEventListener('open-command-palette', handleOpen);
        window.addEventListener('close-modal', handleClose);

        return () => {
            window.removeEventListener('open-command-palette', handleOpen);
            window.removeEventListener('close-modal', handleClose);
        };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredCommands.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredCommands.length - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    setIsOpen(false);
                }
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        },
        [filteredCommands, selectedIndex]
    );

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a command or search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                        />
                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary text-muted-foreground text-xs">
                            <Command className="w-3 h-3" />K
                        </div>
                    </div>

                    {/* Commands List */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {filteredCommands.length === 0 ? (
                            <div className="px-4 py-8 text-center text-muted-foreground">
                                No commands found
                            </div>
                        ) : (
                            <>
                                {groupedCommands.navigation.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Navigation
                                        </div>
                                        {groupedCommands.navigation.map((cmd, idx) => (
                                            <CommandItemRow
                                                key={cmd.id}
                                                command={cmd}
                                                isSelected={filteredCommands.indexOf(cmd) === selectedIndex}
                                                onClick={() => {
                                                    cmd.action();
                                                    setIsOpen(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                {groupedCommands.action.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Actions
                                        </div>
                                        {groupedCommands.action.map((cmd) => (
                                            <CommandItemRow
                                                key={cmd.id}
                                                command={cmd}
                                                isSelected={filteredCommands.indexOf(cmd) === selectedIndex}
                                                onClick={() => {
                                                    cmd.action();
                                                    setIsOpen(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span>↑↓ Navigate</span>
                            <span>↵ Select</span>
                            <span>Esc Close</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

interface CommandItemRowProps {
    command: CommandItem;
    isSelected: boolean;
    onClick: () => void;
}

function CommandItemRow({ command, isSelected, onClick }: CommandItemRowProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                isSelected
                    ? "bg-[#FFD700]/20 text-[#FFD700]"
                    : "text-foreground hover:bg-secondary"
            )}
        >
            <div
                className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-[#FFD700] text-black" : "bg-secondary"
                )}
            >
                {command.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{command.title}</div>
                {command.description && (
                    <div className="text-xs text-muted-foreground truncate">
                        {command.description}
                    </div>
                )}
            </div>
            {command.shortcut && (
                <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {command.shortcut}
                </div>
            )}
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
    );
}
