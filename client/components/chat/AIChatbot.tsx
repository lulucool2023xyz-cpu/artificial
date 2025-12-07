import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Camera, Settings, User, History, Menu, X, Zap, Brain, Gauge, Trash2, ChevronDown, Plus, LogOut, MessageSquare, Search, Save, Bell, Copy, RotateCcw, Sun, Moon, Monitor, Paperclip, File as FileIcon, Image as ImageIcon, FileText, Newspaper, Sparkles, HelpCircle, Clock, Palette, CreditCard, AlignJustify, BookOpen, PenTool, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { MorphingNavigation, type MorphingNavigationLink } from '@/components/ui/MorphingNavigation';
import { ToggleTheme } from '@/components/ui/ToggleTheme';
import { chatApi, modelsApi, ChatContent, ChatPart, ChatTool, ThinkingConfig, GeminiModel } from '@/lib/api';
import { VoiceLiveModal } from './VoiceLiveModal';
import { SidebarDock } from './SidebarDock';
import { ModelSelectorPopup } from './ModelSelectorPopup';
import { GlowingCards, GlowingCard } from '@/components/ui/GlowingCards';
import Dock from '@/components/ui/Dock';
import { BorderBeam } from '@/components/ui/BorderBeam';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

interface AIChatbotProps {
  initialView?: 'chat' | 'history' | 'profile' | 'settings';
}

/**
 * AI Chatbot Component - Monochrome Theme
 * Purpose: Modern AI chat interface with Indonesian cultural touch
 * 
 * Features:
 * - Voice input (Mic)
 * - Camera input
 * - Multiple AI modes (Fast, Balance, Deep Learning)
 * - Chat history management
 * - Profile & Settings
 * - Monochrome design with subtle Indonesian accents
 */
export default function AIChatbot({ initialView = 'chat' }: AIChatbotProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(true);
  const sidebarToggleRef = useRef(false);
  const [currentView, setCurrentView] = useState(initialView);
  const [mode, setMode] = useState('balance');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com'
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [voiceLiveActive, setVoiceLiveActive] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Model & Tools State
  const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [currentModel, setCurrentModel] = useState('Gemini 2.5 Flash');

  // Tools State
  const [googleSearchEnabled, setGoogleSearchEnabled] = useState(false);
  const [thinkingModeEnabled, setThinkingModeEnabled] = useState(false);
  const [thinkingBudget, setThinkingBudget] = useState(8192);
  const [showThoughts, setShowThoughts] = useState(true);

  // Scroll management - prevents auto-scroll from interrupting user reading
  const [userIsScrolling, setUserIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  // Detect mobile view and fix sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobileView;
      const nowMobile = window.innerWidth < 1024;
      setIsMobileView(nowMobile);

      // Fix sidebar state when switching between mobile and desktop
      if (wasMobile !== nowMobile) {
        if (nowMobile) {
          // Switching to mobile - close sidebar
          setSidebarOpen(false);
        } else {
          // Switching to desktop - open sidebar if it was open before
          setSidebarOpen(true);
          setSidebarMinimized(false);
        }
      }
    };

    // Initial check
    const initialMobile = window.innerWidth < 1024;
    setIsMobileView(initialMobile);
    if (initialMobile) {
      setSidebarOpen(false);
    }

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobileView]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync view with route
  useEffect(() => {
    if (location.pathname === '/chat') {
      setCurrentView('chat');
    } else if (location.pathname === '/chat/history') {
      setCurrentView('history');
    } else if (location.pathname === '/chat/profile') {
      setCurrentView('profile');
    } else if (location.pathname === '/chat/settings') {
      setCurrentView('settings');
    }
  }, [location.pathname]);

  // Smart auto-scroll: only scroll to bottom if user is near bottom
  // This prevents interrupting users who are reading previous messages during streaming
  const isUserNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    const threshold = 150; // pixels from bottom to consider "at bottom"
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Handle scroll events to detect user scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isScrollingUp = container.scrollTop < lastScrollTop.current - 10;
      lastScrollTop.current = container.scrollTop;

      // If user scrolls up during loading, mark as user scrolling
      if (isScrollingUp && isLoading) {
        setUserIsScrolling(true);
      }

      // If user scrolls back to bottom, reset the flag
      if (isUserNearBottom()) {
        setUserIsScrolling(false);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isLoading, isUserNearBottom]);

  // Auto-scroll to bottom only when appropriate
  useEffect(() => {
    // Don't auto-scroll if user is manually scrolling during streaming
    if (userIsScrolling) return;

    // Only auto-scroll if near bottom
    if (isUserNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, userIsScrolling, isUserNearBottom]);

  // Reset userIsScrolling when loading completes
  useEffect(() => {
    if (!isLoading) {
      setUserIsScrolling(false);
    }
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Close mode dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeMenuOpen && !(event.target as Element).closest('.mode-dropdown')) {
        setModeMenuOpen(false);
      }
      if (toolsMenuOpen && !(event.target as Element).closest('.tools-dropdown')) {
        setToolsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modeMenuOpen, toolsMenuOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close sidebar on mobile
      if (event.key === 'Escape' && sidebarOpen && isMobileView) {
        setSidebarOpen(false);
      }
      // ESC to close mode dropdown
      if (event.key === 'Escape' && modeMenuOpen) {
        setModeMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, modeMenuOpen]);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || 'User', email: user.email || 'user@example.com' });
    }

    // Load saved profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.mode) setMode(settings.mode);
        if (settings.notificationsEnabled !== undefined) setNotificationsEnabled(settings.notificationsEnabled);
        if (settings.autoSave !== undefined) setAutoSave(settings.autoSave);
        if (settings.fontSize) setFontSize(settings.fontSize);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [user]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setChatHistory(parsed.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Fetch available models from backend
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await modelsApi.list();
        setAvailableModels(response.models);
        // Set default model
        if (response.defaultModel) {
          setSelectedModel(response.defaultModel);
          const defaultModelInfo = response.models.find(m => m.name === response.defaultModel);
          if (defaultModelInfo) {
            setCurrentModel(defaultModelInfo.displayName);
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to default models if backend is unavailable
        setAvailableModels([
          { name: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', description: 'Fast model with thinking', supportsThinking: true, thinkingType: 'budget', maxInputTokens: 1048576, maxOutputTokens: 65536, supportedFeatures: [] },
          { name: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro', description: 'Premium model', supportsThinking: true, thinkingType: 'budget', maxInputTokens: 1048576, maxOutputTokens: 65536, supportedFeatures: [] },
          { name: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', description: 'Production fast model', supportsThinking: false, thinkingType: null, maxInputTokens: 1048576, maxOutputTokens: 8192, supportedFeatures: [] },
        ]);
      }
    };
    fetchModels();
  }, []);

  const modeConfig = {
    fast: {
      icon: Zap,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      textColor: 'text-yellow-500',
      bgLight: 'bg-yellow-500/10',
      label: 'Fast',
      desc: 'Respon cepat untuk pertanyaan sederhana'
    },
    balance: {
      icon: Gauge,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      textColor: 'text-blue-500',
      bgLight: 'bg-blue-500/10',
      label: 'Balance',
      desc: 'Keseimbangan kualitas dan kecepatan'
    },
    deeplearning: {
      icon: Brain,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      textColor: 'text-purple-500',
      bgLight: 'bg-purple-500/10',
      label: 'Deep Learning',
      desc: 'Analisis mendalam untuk topik kompleks'
    }
  };

  const featureConfig = {
    chat: { icon: MessageSquare, color: 'blue', label: 'Percakapan' },
    code: { icon: Brain, color: 'purple', label: 'Kode' },
    analysis: { icon: Zap, color: 'yellow', label: 'Analisis' },
    creative: { icon: Gauge, color: 'green', label: 'Kreativitas' }
  };

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
    inputRef.current?.focus();

    // Clear feature highlight after 3 seconds
    setTimeout(() => {
      setActiveFeature(null);
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // Guard against null/undefined files
    if (!files || files.length === 0) return;

    const validFiles = files.filter(file => {
      // Validate file object exists
      if (!file || typeof file.size !== 'number' || typeof file.type !== 'string') {
        console.warn('Invalid file object:', file);
        return false;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File terlalu besar', {
          description: `${file.name} melebihi batas 10MB`,
          duration: 1000
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      try {
        const newFiles = validFiles.map(file => ({
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast.success('File ditambahkan', {
          description: `${validFiles.length} file siap dikirim`
        });
      } catch (error) {
        console.error('Error processing files:', error);
        toast.error('Gagal memproses file', {
          description: 'Silakan coba lagi'
        });
      }
    }
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.startsWith('text/') || fileType.includes('document')) return FileText;
    return FileIcon;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Compress image to reduce payload size
  const compressImage = (file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      // If not an image or already small, return as-is
      if (!file.type.startsWith('image/') || file.size < 500 * 1024) {
        resolve(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log(`Image compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            try {
              // Use File constructor properly with all required properties
              const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              handleFiles([file]);
              toast.success('Foto diambil!');
              toggleCamera(); // Close camera after capture
            } catch (fileError) {
              console.error('Failed to create file from blob:', fileError);
              toast.error('Gagal menyimpan foto', {
                description: 'Browser tidak mendukung fitur ini'
              });
            }
          } else {
            toast.error('Gagal mengambil foto');
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        console.error('Error capturing photo:', error);
        toast.error('Gagal mengambil foto', {
          description: 'Terjadi kesalahan saat mengakses kamera'
        });
      }
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

    const messageText = input.trim();
    const attachedFiles = [...uploadedFiles];

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText || '📎 File dikirim',
      files: attachedFiles,
      timestamp: new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);

    // Create new chat if not exists
    if (!currentChatId) {
      const chatId = Date.now();
      const newChat = {
        id: chatId,
        title: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
        messages: newMessages,
        timestamp: new Date(),
        mode: mode
      };
      setChatHistory(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
    } else {
      // Update existing chat
      updateChatHistory(currentChatId, newMessages);
    }

    try {
      // Simplified system prompt for faster response
      const systemPrompt = `Anda adalah OrenaX Agent, asisten AI yang dikembangkan oleh Arief Fajar, Reza Arrofi, dan Alif Ikhwan dari SMK Marhas Margahayu. Jawab dengan sopan dan informatif dalam Bahasa Indonesia.`;

      // Build tools array
      const tools: ChatTool[] = [];
      if (googleSearchEnabled) {
        tools.push({
          googleSearch: {
            dynamicRetrievalConfig: {
              mode: 'MODE_DYNAMIC',
              dynamicThreshold: 0.5
            }
          }
        });
      }

      // Build thinking config
      let thinkingConfig: ThinkingConfig | undefined;
      const modelInfo = availableModels.find(m => m.name === selectedModel);
      if (thinkingModeEnabled && modelInfo?.supportsThinking) {
        thinkingConfig = {
          thinkingBudget: thinkingBudget,
          includeThoughts: showThoughts
        };
      }

      // Prepare contents for Gemini API format
      const contents: ChatContent[] = [];

      for (const msg of newMessages) {
        const parts: ChatPart[] = [];

        // Add text
        if (msg.text) {
          parts.push({ text: msg.text });
        }

        // Add images as inlineData
        if (msg.files && msg.files.length > 0) {
          for (const fileObj of msg.files) {
            if (fileObj.type.startsWith('image/')) {
              // Compress image before sending (reduces 413 errors)
              const compressedFile = await compressImage(fileObj.file);
              const base64 = await convertFileToBase64(compressedFile);
              // Remove data:image/xxx;base64, prefix
              const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
              parts.push({
                inlineData: {
                  mimeType: fileObj.type,
                  data: base64Data
                }
              });
            }
          }
        }

        if (parts.length > 0) {
          contents.push({
            role: msg.type === 'user' ? 'user' : 'model',
            parts
          });
        }
      }

      // Create initial bot message
      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        type: 'bot',
        text: '',
        thoughts: [] as string[],
        groundingMetadata: null as any,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      let accumulatedText = '';
      let accumulatedThoughts: string[] = [];
      let accumulatedGroundingMetadata: any = null;

      // Stream response from backend
      try {
        for await (const chunk of chatApi.streamChat({
          contents,
          model: selectedModel,
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: mode === 'fast' ? 0.5 : mode === 'balance' ? 0.8 : 0.9,
            maxOutputTokens: mode === 'fast' ? 1000 : mode === 'balance' ? 4000 : 8000,
          },
          ...(tools.length > 0 ? { tools } : {}),
          ...(thinkingConfig ? { thinkingConfig } : {}),
        })) {
          if (chunk.error) {
            throw new Error(chunk.message || 'Streaming error');
          }

          if (chunk.thought) {
            accumulatedThoughts.push(chunk.thought);
          }

          // Capture grounding metadata from Google Search
          if (chunk.groundingMetadata) {
            accumulatedGroundingMetadata = chunk.groundingMetadata;
          }


          if (chunk.text) {
            accumulatedText += chunk.text;

            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === botMessageId
                    ? { ...msg, text: accumulatedText, thoughts: accumulatedThoughts }
                    : msg
                )
              );
            });
          }

          if (chunk.done) {
            break;
          }
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        throw streamError;
      }

      // Update final message with grounding metadata
      const finalBotMessage = {
        id: botMessageId,
        type: 'bot',
        text: accumulatedText || 'Maaf, tidak ada respons dari AI.',
        thoughts: accumulatedThoughts,
        groundingMetadata: accumulatedGroundingMetadata,
        timestamp: new Date()
      };

      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId ? finalBotMessage : msg
        )
      );

      // Update history with bot response
      updateChatHistory(currentChatId, [...newMessages, finalBotMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga',
        duration: 3000
      });

      // Add error message
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Maaf, terjadi kesalahan dalam menghubungi AI. Silakan coba lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      if (currentChatId) {
        updateChatHistory(currentChatId, [...newMessages, botMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const isRecordingRef = useRef<boolean>(false);

  const toggleMic = async () => {
    if (!isRecording) {
      try {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
          toast.error('Browser tidak support', {
            description: 'Browser Anda tidak mendukung speech recognition',
            duration: 1000
          });
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID'; // Indonesian
        recognition.continuous = true; // Keep recording until manually stopped
        recognition.interimResults = true; // Show interim results
        recognition.maxAlternatives = 1;

        transcriptRef.current = ''; // Reset transcript
        recognitionRef.current = recognition;
        isRecordingRef.current = true;

        recognition.onstart = () => {
          setIsRecording(true);
          toast.info('Merekam...', {
            description: 'Klik tombol lagi untuk berhenti dan transcribe'
          });
        };

        recognition.onresult = (event: any) => {
          let fullTranscript = '';

          // Collect all results (both final and interim)
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript;
          }

          // Store the full transcript (including interim results)
          transcriptRef.current = fullTranscript.trim();
          console.log('Current transcript:', transcriptRef.current); // Debug log
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            toast.error('Error merekam suara', {
              description: event.error,
              duration: 2000
            });
          }
        };

        recognition.onend = () => {
          // If still supposed to be recording (browser auto-stopped due to silence or timeout)
          // Restart with a small delay to prevent rapid cycling
          if (isRecordingRef.current && recognitionRef.current) {
            // Add a small delay before restarting to prevent rapid cycling
            setTimeout(() => {
              if (isRecordingRef.current && recognitionRef.current) {
                try {
                  console.log('Restarting recognition after browser auto-stop...');
                  recognitionRef.current.start();
                } catch (e) {
                  console.log('Recognition restart failed:', e);
                  // If restart fails, stop recording gracefully
                  isRecordingRef.current = false;
                  setIsRecording(false);
                }
              }
            }, 100);
          }
        };

        recognition.start();
      } catch (err) {
        console.error('Cannot access microphone:', err);
        toast.error('Tidak dapat mengakses mikrofon', {
          description: 'Pastikan izin mikrofon telah diberikan',
          duration: 1000
        });
      }
    } else {
      // Stop recording
      isRecordingRef.current = false;

      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      setIsRecording(false);

      // Get the final transcript
      const finalText = transcriptRef.current.trim();
      console.log('Final transcript to insert:', finalText); // Debug log

      // Insert the accumulated transcript into input
      if (finalText) {
        setInput(prev => {
          const newValue = prev + (prev ? ' ' : '') + finalText;
          console.log('New input value:', newValue); // Debug log
          return newValue;
        });
        toast.success('Transkripsi selesai!', {
          description: `"${finalText.substring(0, 50)}${finalText.length > 50 ? '...' : ''}"`
        });
      } else {
        toast.info('Tidak ada suara terdeteksi', {
          description: 'Coba bicara lebih jelas atau lebih dekat ke mikrofon'
        });
      }

      transcriptRef.current = '';
    }
  };

  const toggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error('Cannot access camera:', err);
        alert('Tidak dapat mengakses kamera: ' + err.message);
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput('');
    toast.success('Chat baru dibuat!', {
      description: 'Mulai percakapan baru dengan AI'
    });
    navigate('/chat');
  };

  const updateChatHistory = (chatId, newMessages) => {
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === chatId) {
        // Update title with first user message if title is still default
        const firstUserMsg = newMessages.find(m => m.type === 'user');
        const newTitle = firstUserMsg
          ? firstUserMsg.text.substring(0, 50) + (firstUserMsg.text.length > 50 ? '...' : '')
          : chat.title;

        return { ...chat, messages: newMessages, title: newTitle };
      }
      return chat;
    }));
  };

  const loadChat = (chat) => {
    // Ensure messages timestamps are Date objects
    const messagesWithDates = chat.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
    }));
    setMessages(messagesWithDates);
    setCurrentChatId(chat.id);
    setMode(chat.mode || 'balance');
    toast.success('Chat dimuat', {
      description: 'Melanjutkan percakapan sebelumnya'
    });
    navigate('/chat');
    if (isMobileView) setSidebarOpen(false);
  };

  const deleteChat = (chatId) => {
    toast.custom((t) => (
      <div className="flex flex-col gap-3 bg-card border border-border rounded-lg p-4 shadow-lg">
        <p className="font-medium">Hapus percakapan ini?</p>
        <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
              if (currentChatId === chatId) {
                setMessages([]);
                setCurrentChatId(null);
              }
              toast.dismiss(t);
              toast.success('Chat berhasil dihapus');
            }}
            className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90"
          >
            Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t)}
            className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          >
            Batal
          </button>
        </div>
      </div>
    ), {
      duration: 5000
    });
  };

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast.success('Profil tersimpan!', {
      description: 'Perubahan profil Anda telah berhasil disimpan'
    });
  };

  const saveSettings = () => {
    const settings = {
      mode,
      notificationsEnabled,
      autoSave,
      fontSize
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success('Pengaturan tersimpan!', {
      description: 'Preferensi Anda telah diperbarui'
    });
  };

  const clearAllData = () => {
    toast.custom((t) => (
      <div className="flex flex-col gap-3 bg-card border border-border rounded-lg p-4 shadow-lg">
        <p className="font-medium">⚠️ Hapus SEMUA data?</p>
        <p className="text-sm text-muted-foreground">Semua riwayat chat, profil, dan pengaturan akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMessages([]);
              setChatHistory([]);
              setCurrentChatId(null);
              localStorage.removeItem('chatHistory');
              localStorage.removeItem('userProfile');
              localStorage.removeItem('appSettings');
              toast.dismiss(t);
              toast.success('Data dihapus', {
                description: 'Semua data aplikasi telah dibersihkan'
              });
              navigate('/chat');
            }}
            className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90"
          >
            Hapus Semua
          </button>
          <button
            onClick={() => toast.dismiss(t)}
            className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          >
            Batal
          </button>
        </div>
      </div>
    ), {
      duration: 10000
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Tersalin!', {
        description: 'Teks berhasil disalin ke clipboard'
      });
    } catch (err) {
      toast.error('Gagal menyalin', {
        description: 'Tidak dapat menyalin teks',
        duration: 1000
      });
    }
  };

  const regenerateResponse = async (messageId: number) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Find the user message before this bot message
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].type !== 'user') {
      userMessageIndex--;
    }

    if (userMessageIndex < 0) {
      toast.error('Tidak dapat regenerate', {
        description: 'Pesan pengguna tidak ditemukan',
        duration: 1000
      });
      return;
    }

    setIsLoading(true);
    toast.info('Regenerating...', {
      description: 'Membuat ulang respons AI'
    });

    try {
      // Filter messages up to the user message
      const contextMessages = messages.slice(0, userMessageIndex + 1);

      // Prepare contents for Gemini API format
      const contents: ChatContent[] = [];

      for (const msg of contextMessages) {
        const parts: ChatPart[] = [];

        if (msg.text) {
          parts.push({ text: msg.text });
        }

        if (msg.files && msg.files.length > 0) {
          for (const fileObj of msg.files) {
            if (fileObj.type.startsWith('image/')) {
              const base64 = await convertFileToBase64(fileObj.file);
              const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
              parts.push({
                inlineData: {
                  mimeType: fileObj.type,
                  data: base64Data
                }
              });
            }
          }
        }

        if (parts.length > 0) {
          contents.push({
            role: msg.type === 'user' ? 'user' : 'model',
            parts
          });
        }
      }

      // Use non-streaming for regeneration
      const response = await chatApi.chat({
        contents,
        model: mode === 'fast' ? 'gemini-2.0-flash' : mode === 'balance' ? 'gemini-2.5-flash' : 'gemini-2.5-pro',
        systemInstruction: 'Anda adalah asisten AI Indonesia yang ramah dan membantu. Jawab dalam bahasa Indonesia dengan sopan dan informatif.',
        generationConfig: {
          temperature: mode === 'fast' ? 0.7 : mode === 'balance' ? 0.8 : 0.9,
          maxOutputTokens: mode === 'fast' ? 500 : mode === 'balance' ? 1000 : 2000
        }
      });

      const aiResponse = response.text || 'Maaf, tidak ada respons.';

      const newMessages = [...messages];
      newMessages[messageIndex] = {
        ...newMessages[messageIndex],
        text: aiResponse,
        timestamp: new Date()
      };
      setMessages(newMessages);

      if (currentChatId) {
        updateChatHistory(currentChatId, newMessages);
      }
      toast.success('Respons dibuat ulang!');
    } catch (error) {
      console.error('Error regenerating:', error);
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Tidak dapat membuat ulang respons',
        duration: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const renderChat = () => {
    const isEmpty = messages.length === 0;

    return (
      <div className="flex flex-col h-full relative min-h-0">
        {/* Modern Header with Navigation - Always visible */}
        {(
          <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
              {/* Left Side - Mobile Menu & Title */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Mobile Menu Button - Opens Sidebar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!sidebarToggleRef.current) {
                      sidebarToggleRef.current = true;
                      setSidebarOpen(!sidebarOpen);
                      setTimeout(() => {
                        sidebarToggleRef.current = false;
                      }, 300);
                    }
                  }}
                  className="lg:hidden text-[#FFD700] hover:text-[#FFA500] transition-colors p-2 rounded-lg hover:bg-[#FFD700]/10 flex-shrink-0"
                  aria-label="Toggle sidebar menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Title - Model Name */}
                <h1 className="text-lg sm:text-xl font-bold text-[#FFD700] truncate">{currentModel}</h1>
              </div>

              {/* Center - Navigation (Desktop Only - Hidden on Mobile) */}
              <div className="hidden lg:flex items-center justify-center flex-1">
                <MorphingNavigation
                  links={navLinks}
                  theme="glass"
                  scrollThreshold={50}
                  initialTop={0}
                  compactTop={0}
                  onLinkClick={handleNavLinkClick}
                  className="relative !fixed !top-0 !left-1/2 !-translate-x-1/2"
                  disableAutoMorph={false}
                />
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Theme Toggle with Circle Spread Animation */}
                <ToggleTheme animationType="circle-spread" />

                {/* History Button */}
                <button
                  onClick={() => navigate('/chat/history')}
                  className="p-2 rounded-lg transition-all duration-200 bg-[#FFD700]/10 border border-[#FFD700]/20 hover:bg-[#FFD700]/20 hover:border-[#FFD700]/30 text-[#FFD700] flex-shrink-0"
                  aria-label="Recent chat history"
                  title="Recent Chat History"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Mobile Dock Navigation - Below Header */}
        <div className="lg:hidden">
          <Dock
            items={[
              {
                icon: <BookOpen className="w-6 h-6 text-foreground" />,
                label: "Library",
                onClick: () => navigate('/library'),
              },
              {
                icon: <Sparkles className="w-6 h-6 text-foreground" />,
                label: "Culture",
                onClick: () => navigate('/culture'),
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-foreground" />,
                label: "Chat",
                onClick: () => navigate('/chat'),
              },
              {
                icon: <PenTool className="w-6 h-6 text-foreground" />,
                label: "Creative",
                onClick: () => navigate('/creative'),
              },
            ]}
            magnification={60}
            distance={140}
            baseItemSize={45}
            panelHeight={56}
            className="bg-card/80 backdrop-blur-md border-[#FFD700]/20"
          />
        </div>
        {/* Messages Container - Mobile Responsive with proper bottom padding */}
        {!isEmpty ? (
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-background min-h-0" role="log" aria-live="polite" aria-atomic="false">
            {/* Add bottom padding to prevent content from being hidden behind fixed input on mobile */}
            <div className="space-y-6 max-w-3xl mx-auto pt-4 pb-32 sm:pb-36 lg:pb-4">
              {messages.map((msg, index) => (
                <div key={msg.id} className={cn(
                  "flex group",
                  msg.type === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'
                )}>
                  <div className={cn(
                    "max-w-full sm:max-w-[85%] lg:max-w-[75%]",
                    msg.type === 'user' ? '' : 'flex flex-col gap-2'
                  )}>
                    <div className={cn(
                      "px-5 py-4 sm:px-6 sm:py-5 rounded-2xl",
                      msg.type === 'user'
                        ? "bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 text-foreground border border-[#FFD700]/50 rounded-tr-sm"
                        : msg.type === 'error'
                          ? "bg-red-500/10 border border-red-500/30 text-foreground rounded-tl-sm"
                          : "bg-background/50 dark:bg-card/50 border-2 border-[#FFD700]/50 rounded-tl-sm"
                    )}>
                      {msg.type === 'error' ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500">⚠️</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-500 mb-1">Terjadi Kesalahan</p>
                              <p className={cn(
                                "leading-relaxed",
                                fontSize === 'small' && "text-xs",
                                fontSize === 'medium' && "text-sm",
                                fontSize === 'large' && "text-base"
                              )}>{msg.text}</p>
                            </div>
                          </div>
                        </div>
                      ) : msg.type === 'bot' ? (
                        <div className="flex flex-col gap-2">
                          {/* Thinking Thoughts Display */}
                          {msg.thoughts && msg.thoughts.length > 0 && (
                            <div className="mb-3">
                              <button
                                onClick={() => setShowThoughts(!showThoughts)}
                                className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20"
                              >
                                <Brain className="w-4 h-4" />
                                <span>{showThoughts ? 'Sembunyikan' : 'Lihat'} proses berpikir ({msg.thoughts.length})</span>
                                <ChevronDown className={cn("w-3 h-3 transition-transform", showThoughts && "rotate-180")} />
                              </button>
                              {showThoughts && (
                                <div className="mt-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm text-purple-200 space-y-3 max-h-80 overflow-y-auto">
                                  <div className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Brain className="w-3 h-3" />
                                    AI Thinking Process
                                  </div>
                                  {msg.thoughts.map((thought, i) => (
                                    <div key={i} className="flex gap-3">
                                      <span className="text-purple-400 font-medium shrink-0">{i + 1}.</span>
                                      <p className="leading-relaxed opacity-90">{thought}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:mb-4 prose-li:my-1 prose-ul:my-3 prose-ol:my-3 prose-headings:mb-3 prose-headings:mt-4 prose-pre:my-4 prose-sm sm:prose-base prose-pre:overflow-x-auto prose-pre:max-w-full prose-code:break-words">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const language = match ? match[1] : '';
                                  const isInline = !className;

                                  return !isInline && language ? (
                                    <div className="relative group my-3">
                                      <div className="absolute right-2 top-2 z-10">
                                        <button
                                          onClick={() => copyToClipboard(String(children).trim())}
                                          className="p-1.5 rounded bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                          title="Copy code"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-white" />
                                        </button>
                                      </div>
                                      <SyntaxHighlighter
                                        language={language}
                                        style={vscDarkPlus}
                                        customStyle={{
                                          margin: 0,
                                          borderRadius: '0.5rem',
                                          fontSize: '0.75rem',
                                          padding: '1rem',
                                        }}
                                        showLineNumbers={true}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : isInline ? (
                                    <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs" {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <code className="block bg-black/50 p-3 rounded-lg text-xs overflow-x-auto" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                a({ node, children, ...props }: any) {
                                  return (
                                    <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props}>
                                      {children}
                                    </a>
                                  );
                                },
                                p({ node, children, ...props }: any) {
                                  return <p className={cn(
                                    "leading-relaxed mb-4 last:mb-0",
                                    fontSize === 'small' && "text-xs",
                                    fontSize === 'medium' && "text-sm",
                                    fontSize === 'large' && "text-base"
                                  )} {...props}>{children}</p>;
                                },
                                ul({ node, children, ...props }: any) {
                                  return <ul className={cn(
                                    "list-disc list-inside space-y-2 my-4 pl-2",
                                    fontSize === 'small' && "text-xs",
                                    fontSize === 'medium' && "text-sm",
                                    fontSize === 'large' && "text-base"
                                  )} {...props}>{children}</ul>;
                                },
                                ol({ node, children, ...props }: any) {
                                  return <ol className={cn(
                                    "list-decimal list-inside space-y-2 my-4 pl-2",
                                    fontSize === 'small' && "text-xs",
                                    fontSize === 'medium' && "text-sm",
                                    fontSize === 'large' && "text-base"
                                  )} {...props}>{children}</ol>;
                                },
                                strong({ node, children, ...props }: any) {
                                  return <strong className="font-semibold" {...props}>{children}</strong>;
                                }
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>

                          {/* Google Search Grounding Sources */}
                          {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/30">
                              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                                <Search className="w-3.5 h-3.5" />
                                <span>Google Search Sources:</span>
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {msg.groundingMetadata.groundingChunks.map((chunk, i) => (
                                  chunk.web && (
                                    <a
                                      key={i}
                                      href={chunk.web.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs bg-blue-500/10 text-blue-400 hover:text-blue-300 px-2.5 py-1.5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors inline-flex items-center gap-1.5 max-w-[200px]"
                                    >
                                      <span className="truncate">{chunk.web.title || 'Source'}</span>
                                      <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className={cn(
                          "leading-relaxed whitespace-pre-wrap",
                          fontSize === 'small' && "text-xs",
                          fontSize === 'medium' && "text-sm",
                          fontSize === 'large' && "text-base"
                        )}>{msg.text}</p>
                      )}

                      {/* Display attached files */}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.files.map((file) => (
                            <div key={file.id} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg">
                              {file.preview ? (
                                <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-black/30 rounded">
                                  {React.createElement(getFileIcon(file.type), { className: "w-6 h-6" })}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{file.name}</p>
                                <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-xs opacity-60 mt-2 block">
                        {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Action Buttons for Bot Messages - Calm Design */}
                    {msg.type === 'bot' && (
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
                        <button
                          onClick={() => copyToClipboard(msg.text)}
                          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors group/tool"
                          title="Salin teks"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground group-hover/tool:text-foreground transition-colors" />
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'AI Response',
                                text: msg.text
                              }).catch(() => { });
                            } else {
                              copyToClipboard(msg.text);
                              toast.success('Link copied to clipboard');
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors group/tool"
                          title="Share"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground group-hover/tool:text-foreground transition-colors">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(msg.text);
                            utterance.lang = 'id-ID';
                            if (playingAudio === msg.id) {
                              window.speechSynthesis.cancel();
                              setPlayingAudio(null);
                            } else {
                              window.speechSynthesis.cancel();
                              window.speechSynthesis.speak(utterance);
                              setPlayingAudio(msg.id);
                              utterance.onend = () => setPlayingAudio(null);
                            }
                          }}
                          className={cn(
                            "p-2 rounded-lg hover:bg-secondary/50 transition-colors group/tool",
                            playingAudio === msg.id && "bg-secondary"
                          )}
                          title="Dengarkan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground group-hover/tool:text-foreground transition-colors">
                            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const newLiked = new Set(likedMessages);
                            if (newLiked.has(msg.id)) {
                              newLiked.delete(msg.id);
                            } else {
                              newLiked.add(msg.id);
                            }
                            setLikedMessages(newLiked);
                          }}
                          className={cn(
                            "p-2 rounded-lg hover:bg-secondary/50 transition-colors group/tool",
                            likedMessages.has(msg.id) && "bg-secondary"
                          )}
                          title="Like"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={likedMessages.has(msg.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(
                            "w-4 h-4 transition-colors",
                            likedMessages.has(msg.id) ? "text-foreground" : "text-muted-foreground group-hover/tool:text-foreground"
                          )}>
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-slide-in-left">
                  <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-secondary text-foreground rounded-tl-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground animate-pulse-glow">AI sedang berpikir...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          /* Empty State - Welcome Screen */
          <div className="flex-1 flex items-start justify-center px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 md:pt-24 relative z-0 pointer-events-auto">
            <div className="w-full max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground select-text">
                Selamat Datang di Orenax Chat
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground select-text">
                Mulai percakapan dengan AI asisten Anda. Tanyakan apa saja!
              </p>
            </div>
          </div>
        )}

        {/* Camera Preview */}
        {isCameraOn && (
          <div className="px-6 pb-3">
            <div className="relative rounded-xl overflow-hidden bg-black max-w-3xl mx-auto border border-border">
              <video ref={videoRef} autoPlay playsInline className="w-full max-h-40 object-cover" />
              <button
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Ambil Foto
              </button>
              <button
                onClick={toggleCamera}
                className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Area - Fixed at bottom for mobile, ensures it's always visible when scrolling */}
        <div
          className={cn(
            isEmpty
              ? "absolute bottom-0 left-0 right-0 flex items-center justify-center px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16 z-40"
              : "fixed lg:sticky bottom-0 left-0 right-0 lg:left-auto lg:right-auto bg-transparent lg:bg-transparent py-4 sm:py-5 z-50 lg:z-40 flex items-center justify-center safe-area-bottom",
            isDragging && "bg-blue-500/10"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={!isEmpty ? { paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)' } : undefined}
        >


          {/* Drag & Drop Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center pointer-events-none z-10">
              <div className="text-center">
                <Paperclip className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-500">Lepaskan file di sini</p>
              </div>
            </div>
          )}

          {/* Input Container Wrapper */}
          <div className={cn(
            "w-full flex flex-col items-center",
            isEmpty ? "max-w-4xl mx-auto" : "max-w-3xl mx-auto"
          )}>
            {/* Template Cards - Display Above Input (Only when empty) */}
            {isEmpty && (
              <div className="w-full mb-8 px-2 md:px-0 -mt-8 sm:-mt-12 md:-mt-16">
                <GlowingCards
                  gap="1rem"
                  padding="0"
                  glowRadius={20}
                  glowOpacity={0.8}
                  responsive={false}
                >
                  {[
                    { title: "Tulis Esai", prompt: "Tolong buatkan esai tentang teknologi AI", icon: "✍️", glowColor: "#8B5CF6" },
                    { title: "Jelaskan Konsep", prompt: "Jelaskan konsep machine learning dengan sederhana", icon: "💡", glowColor: "#F59E0B" },
                    { title: "Buat Kode", prompt: "Bantu saya membuat fungsi JavaScript untuk validasi form", icon: "💻", glowColor: "#3B82F6" },
                    { title: "Terjemahkan", prompt: "Terjemahkan teks ini ke bahasa Inggris", icon: "🌐", glowColor: "#10B981" }
                  ].map((template, idx) => (
                    <GlowingCard
                      key={idx}
                      glowColor={template.glowColor}
                      className="cursor-pointer min-w-[110px] sm:min-w-[130px] !p-4 sm:!p-5"
                    >
                      <button
                        onClick={() => {
                          setInput(template.prompt);
                          inputRef.current?.focus();
                        }}
                        className="flex flex-col items-center justify-center gap-2 w-full"
                      >
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3"
                          style={{ backgroundColor: template.glowColor }}
                        >
                          <span className="text-xl sm:text-2xl">{template.icon}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground/80 dark:text-white/80 text-center hover:text-foreground dark:hover:text-white transition-colors duration-300">
                          {template.title}
                        </span>
                      </button>
                    </GlowingCard>
                  ))}
                </GlowingCards>
              </div>
            )}

            {/* Input Container - Elegant Gold Style */}
            <div className={cn(
              "flex flex-col mx-2 md:mx-0 items-stretch transition-all duration-200 relative cursor-text z-40 rounded-2xl w-full group",
              "bg-gradient-to-br from-background via-background to-[#FFD700]/5",
              "border border-[#FFD700]/20",
              "shadow-[0_0.25rem_1.25rem_hsl(0_0%_0%_/3.5%),0_0_0_0.5px_hsla(43_96%_53%_/0.2)]",
              "hover:shadow-[0_0.25rem_1.25rem_hsl(0_0%_0%_/3.5%),0_0_0_0.5px_hsla(43_96%_53%_/0.3)]",
              "focus-within:shadow-[0_0.25rem_1.25rem_hsl(0_0%_0%_/7.5%),0_0_0_0.5px_hsla(43_96%_53%_/0.4)]",
              "hover:focus-within:shadow-[0_0.25rem_1.25rem_hsl(0_0%_0%_/7.5%),0_0_0_0.5px_hsla(43_96%_53%_/0.4)]"
            )}>
              {/* BorderBeam Effect */}
              <BorderBeam
                size={80}
                duration={8}
                colorFrom="#FFD700"
                colorTo="#FFA500"
                beamBorderRadius={16}
                opacity={0.6}
              />
              <div className="flex flex-col m-3.5 gap-2">
                {/* Uploaded Files Preview - Inside Input Container */}
                {uploadedFiles.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border/30">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-lg p-1.5 pr-6">
                          {file.preview ? (
                            <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-muted rounded">
                              {React.createElement(getFileIcon(file.type), { className: "w-4 h-4 text-muted-foreground" })}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <p className="text-xs font-medium truncate max-w-[100px]">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Text Area */}
                <div className="relative">
                  <div className="max-h-96 w-full overflow-y-auto font-large break-words transition-opacity duration-200 min-h-[3rem]">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder={isEmpty ? "How can I help you today?" : "Kirim pesan..."}
                      className={cn(
                        "w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none",
                        "px-2 py-2 min-h-[2.5rem]",
                        isEmpty ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                      )}
                      aria-label="Message input"
                      aria-describedby="message-help"
                    />
                  </div>
                </div>

                {/* Bottom Bar with Buttons */}
                <div className="flex gap-2 w-full items-center">
                  {/* Left Side - 3 Features: Tools SVG, Microphone, File Upload */}
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx"
                    />

                    {/* Tools Button */}
                    <div className="tools-dropdown relative">
                      <button
                        onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                        className="border transition-all h-8 flex items-center group outline-offset-1 overflow-hidden px-1.5 min-w-8 rounded-lg justify-center text-muted-foreground border-border hover:text-foreground/90 hover:bg-secondary active:scale-[0.98]"
                        aria-label="Open tools menu"
                        aria-expanded={toolsMenuOpen}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z"></path>
                        </svg>
                      </button>

                      {/* Tools Dropdown Menu */}
                      {toolsMenuOpen && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setToolsMenuOpen(false)}
                          />
                          <div className="absolute bottom-full left-0 mb-2 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50" role="menu">
                            {/* Tools Section - Main Focus */}
                            <div className="p-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-1">Tools & Features</p>

                              {/* Google Search Toggle */}
                              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Google Search</p>
                                    <p className="text-xs text-muted-foreground">Enable web search grounding</p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setGoogleSearchEnabled(!googleSearchEnabled);
                                    toast.info(googleSearchEnabled ? 'Google Search disabled' : 'Google Search enabled');
                                  }}
                                  className={cn(
                                    "relative w-11 h-6 rounded-full transition-colors",
                                    googleSearchEnabled ? "bg-blue-500" : "bg-muted"
                                  )}
                                  aria-checked={googleSearchEnabled}
                                  role="switch"
                                >
                                  <div className={cn(
                                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                                    googleSearchEnabled ? "translate-x-5" : "translate-x-0.5"
                                  )} />
                                </button>
                              </div>

                              {/* Thinking Mode Toggle */}
                              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Thinking Mode</p>
                                    <p className="text-xs text-muted-foreground">Show AI reasoning process</p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const modelInfo = availableModels.find(m => m.name === selectedModel);
                                    if (modelInfo && !modelInfo.supportsThinking) {
                                      toast.error('Model tidak mendukung thinking mode', {
                                        description: 'Gunakan Gemini 2.5 Flash, 2.5 Pro, atau 3 Pro'
                                      });
                                      return;
                                    }
                                    setThinkingModeEnabled(!thinkingModeEnabled);
                                    toast.info(thinkingModeEnabled ? 'Thinking Mode disabled' : 'Thinking Mode enabled');
                                  }}
                                  className={cn(
                                    "relative w-11 h-6 rounded-full transition-colors",
                                    thinkingModeEnabled ? "bg-purple-500" : "bg-muted"
                                  )}
                                  aria-checked={thinkingModeEnabled}
                                  role="switch"
                                >
                                  <div className={cn(
                                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                                    thinkingModeEnabled ? "translate-x-5" : "translate-x-0.5"
                                  )} />
                                </button>
                              </div>

                              {/* Thinking Budget Slider - Only visible when thinking mode is on */}
                              {thinkingModeEnabled && (
                                <div className="px-3 py-3 bg-purple-500/5 rounded-lg border border-purple-500/10 mb-2">
                                  <div className="flex justify-between text-xs mb-2">
                                    <span className="text-purple-400 font-medium">Thinking Budget</span>
                                    <span className="text-muted-foreground">{thinkingBudget.toLocaleString()} tokens</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="1024"
                                    max="24576"
                                    step="1024"
                                    value={thinkingBudget}
                                    onChange={(e) => setThinkingBudget(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-purple-500"
                                  />
                                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>Faster</span>
                                    <span>More detailed</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Model Selector Section */}
                            <div className="p-3 border-t border-border">
                              <button
                                onClick={() => {
                                  setToolsMenuOpen(false);
                                  setModeMenuOpen(!modeMenuOpen);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-[#FFD700]" />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-medium">{currentModel}</p>
                                    <p className="text-xs text-muted-foreground">Click to change model</p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Microphone Button */}
                    <button
                      onClick={toggleMic}
                      className={cn(
                        "border transition-all flex items-center group outline-offset-1 overflow-hidden rounded-lg justify-center active:scale-[0.98]",
                        isRecording
                          ? "bg-red-500 text-white px-3 h-8 gap-1 animate-pulse border-red-400"
                          : "text-muted-foreground border-border hover:text-foreground/90 hover:bg-secondary px-1.5 min-w-8 h-8"
                      )}
                      aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
                      aria-pressed={isRecording}
                    >
                      {isRecording ? (
                        <>
                          {/* Animated Wave Bars */}
                          <div className="flex items-center gap-[2px] h-4">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="w-[3px] bg-white rounded-full animate-[voiceWave_0.5s_ease-in-out_infinite]"
                                style={{
                                  height: `${8 + Math.random() * 8}px`,
                                  animationDelay: `${i * 0.1}s`
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium ml-1">REC</span>
                        </>
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>

                    {/* File Upload Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="border transition-all h-8 flex items-center group outline-offset-1 overflow-hidden px-1.5 min-w-8 rounded-lg justify-center text-muted-foreground border-border hover:text-foreground/90 hover:bg-secondary active:scale-[0.98]"
                      aria-label="Attach file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Right Side - Model Selector & Live Voice/Send */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
                    {/* Tools Active Indicator - Compact on mobile */}
                    {(googleSearchEnabled || thinkingModeEnabled) && (
                      <div className="flex items-center gap-1">
                        {googleSearchEnabled && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 sm:px-2 py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
                            <Search className="w-3 h-3" />
                            <span className="hidden sm:inline">Search</span>
                          </span>
                        )}
                        {thinkingModeEnabled && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 sm:px-2 py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
                            <Brain className="w-3 h-3" />
                            <span className="hidden sm:inline">Think</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Model Selector Button - Click to Toggle */}
                    <div className="model-selector relative">
                      <button
                        onClick={() => setModelMenuOpen(!modelMenuOpen)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 select-none hover:bg-[#FFD700]/10 disabled:hover:bg-transparent border border-[#FFD700]/20 h-10 py-1.5 text-sm rounded-full text-[#FFD700] px-3.5 focus:outline-none"
                        type="button"
                        id="model-select-trigger"
                        aria-label="Model select"
                        aria-haspopup="menu"
                        aria-expanded={modelMenuOpen}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <div className="flex items-center justify-center size-[18px] overflow-hidden shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[2]">
                              <path d="M6.5 12.5L11.5 17.5M6.5 12.5L11.8349 6.83172C13.5356 5.02464 15.9071 4 18.3887 4H20V5.61135C20 8.09292 18.9754 10.4644 17.1683 12.1651L11.5 17.5M6.5 12.5L2 11L5.12132 7.87868C5.68393 7.31607 6.44699 7 7.24264 7H11M11.5 17.5L13 22L16.1213 18.8787C16.6839 18.3161 17 17.553 17 16.7574V13" stroke="currentColor" strokeLinecap="square"></path>
                              <path d="M4.5 16.5C4.5 16.5 4 18 4 20C6 20 7.5 19.5 7.5 19.5" stroke="currentColor"></path>
                            </svg>
                          </div>
                          <div style={{ overflow: 'hidden', width: 'auto', opacity: 1, flexGrow: 0 }}>
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-sm shrink-0 line-clamp-1">{currentModel}</span>
                            </div>
                          </div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`stroke-[2] size-4 text-[#FFD700] transition-transform ${modelMenuOpen ? 'rotate-180' : ''}`}>
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeLinecap="square"></path>
                        </svg>
                      </button>

                      {/* Model Dropdown Menu - Show on Click */}
                      {modelMenuOpen && (
                        <>
                          {/* Backdrop to close on click outside */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setModelMenuOpen(false)}
                          />
                          <div className="absolute bottom-full right-0 mb-2 w-72 bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50" role="menu">
                            {/* Model List */}
                            <div className="p-2 border-b border-border">
                              <span className="text-xs text-muted-foreground px-2">AI Model</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {availableModels.map((model) => (
                                <button
                                  key={model.name}
                                  onClick={() => {
                                    setSelectedModel(model.name);
                                    setCurrentModel(model.displayName);
                                    toast.success('Model Selected', {
                                      description: `Switched to ${model.displayName}`
                                    });
                                    setModelMenuOpen(false);
                                  }}
                                  className={cn(
                                    "w-full flex items-start gap-3 px-3 py-2.5 hover:bg-secondary transition-colors text-left",
                                    selectedModel === model.name && "bg-[#FFD700]/10"
                                  )}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{model.displayName}</span>
                                      {selectedModel === model.name && (
                                        <span className="text-[#FFD700]">✓</span>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground line-clamp-1">{model.description}</span>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {model.supportsThinking && (
                                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">Thinking</span>
                                      )}
                                      {model.supportedFeatures.includes('google-search') && (
                                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Search</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* Tools Section */}
                            <div className="p-2 border-t border-border">
                              <span className="text-xs text-muted-foreground px-2">Tools & Features</span>
                            </div>
                            <div className="px-3 pb-3 space-y-2">
                              {/* Google Search Toggle */}
                              <label className="flex items-center justify-between cursor-pointer hover:bg-secondary/50 px-2 py-1.5 rounded">
                                <div className="flex items-center gap-2">
                                  <Search className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm">Google Search</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setGoogleSearchEnabled(!googleSearchEnabled);
                                    toast.info(googleSearchEnabled ? 'Google Search disabled' : 'Google Search enabled');
                                  }}
                                  className={cn(
                                    "w-10 h-5 rounded-full transition-colors",
                                    googleSearchEnabled ? "bg-[#FFD700]" : "bg-gray-600"
                                  )}
                                >
                                  <div className={cn(
                                    "w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5",
                                    googleSearchEnabled ? "translate-x-5" : "translate-x-0"
                                  )} />
                                </button>
                              </label>

                              {/* Thinking Mode Toggle */}
                              <label className="flex items-center justify-between cursor-pointer hover:bg-secondary/50 px-2 py-1.5 rounded">
                                <div className="flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm">Thinking Mode</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const modelInfo = availableModels.find(m => m.name === selectedModel);
                                    if (!modelInfo?.supportsThinking) {
                                      toast.error('This model does not support thinking mode');
                                      return;
                                    }
                                    setThinkingModeEnabled(!thinkingModeEnabled);
                                    toast.info(thinkingModeEnabled ? 'Thinking Mode disabled' : 'Thinking Mode enabled');
                                  }}
                                  className={cn(
                                    "w-10 h-5 rounded-full transition-colors",
                                    thinkingModeEnabled ? "bg-purple-500" : "bg-gray-600"
                                  )}
                                >
                                  <div className={cn(
                                    "w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5",
                                    thinkingModeEnabled ? "translate-x-5" : "translate-x-0"
                                  )} />
                                </button>
                              </label>

                              {/* Thinking Budget Slider (when thinking enabled) */}
                              {thinkingModeEnabled && (
                                <div className="px-2 py-1">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Thinking Budget</span>
                                    <span>{thinkingBudget} tokens</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="24576"
                                    step="1024"
                                    value={thinkingBudget}
                                    onChange={(e) => setThinkingBudget(Number(e.target.value))}
                                    className="w-full h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer accent-purple-500"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Send / Stop Button */}
                    {isLoading ? (
                      <button
                        onClick={() => {
                          setIsLoading(false);
                          toast.info('Generation stopped');
                        }}
                        className="inline-flex items-center justify-center relative shrink-0 select-none font-base-bold transition-all h-8 w-8 rounded-lg active:scale-95 bg-red-500 hover:bg-red-600 text-white"
                        type="button"
                        aria-label="Stop generation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : input.trim() ? (
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center relative shrink-0 select-none disabled:pointer-events-none disabled:opacity-50 font-base-bold transition-colors h-8 w-8 rounded-md active:scale-95 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black hover:opacity-90"
                        type="button"
                        aria-label="Send message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"></path>
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setVoiceLiveActive(!voiceLiveActive);
                          toast.info('Voice Mode', {
                            description: voiceLiveActive ? 'Voice mode disabled' : 'Voice mode enabled'
                          });
                        }}
                        className="inline-flex items-center justify-center relative shrink-0 select-none h-8 w-8 rounded-lg active:scale-95 group"
                        type="button"
                        aria-label="Enter voice mode"
                      >
                        <div className="h-8 relative aspect-square flex items-center justify-center gap-0.5 rounded-full ring-1 ring-inset duration-100 before:absolute before:inset-0 before:rounded-full before:bg-[#FFD700] before:ring-0 before:transition-all bg-[#FFD700] text-black ring-transparent before:[clip-path:circle(50%_at_50%_50%)] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                          {/* Animated Audio Wave Bars */}
                          <div className="w-0.5 relative z-10 rounded-full bg-black animate-[voiceWave_0.8s_ease-in-out_infinite_0s]" style={{ height: '0.4rem' }}></div>
                          <div className="w-0.5 relative z-10 rounded-full bg-black animate-[voiceWave_0.8s_ease-in-out_infinite_0.1s]" style={{ height: '0.8rem' }}></div>
                          <div className="w-0.5 relative z-10 rounded-full bg-black animate-[voiceWave_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '1.2rem' }}></div>
                          <div className="w-0.5 relative z-10 rounded-full bg-black animate-[voiceWave_0.8s_ease-in-out_infinite_0.3s]" style={{ height: '0.7rem' }}></div>
                          <div className="w-0.5 relative z-10 rounded-full bg-black animate-[voiceWave_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '1rem' }}></div>
                          <div className="w-0.5 relative z-10 rounded-full bg-black animate-[voiceWave_0.8s_ease-in-out_infinite_0.5s]" style={{ height: '0.4rem' }}></div>
                        </div>
                        {/* CSS Keyframes for Voice Wave Animation */}
                        <style dangerouslySetInnerHTML={{
                          __html: `
                          @keyframes voiceWave {
                            0%, 100% { transform: scaleY(1); }
                            50% { transform: scaleY(1.5); }
                          }
                        `}} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 font-heading">Profil Pengguna</h2>
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center text-3xl font-bold text-background shadow-xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium" htmlFor="profile-name">Nama</label>
          <input
            id="profile-name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-colors text-foreground"
            placeholder="Masukkan nama Anda"
            aria-label="User name"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring transition-colors text-foreground"
            placeholder="nama@email.com"
          />
        </div>
        <div className="pt-4">
          <button
            onClick={saveProfile}
            className="w-full bg-foreground hover:opacity-90 text-background py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 pt-8 border-t border-border">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Statistik Penggunaan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">{chatHistory.length}</p>
            <p className="text-sm text-muted-foreground">Total Chat</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">
              {chatHistory.reduce((acc, chat) => acc + chat.messages.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Pesan</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">
              {Math.round(chatHistory.reduce((acc, chat) => acc + chat.messages.reduce((sum, msg) => sum + msg.text.split(' ').length, 0), 0) / Math.max(chatHistory.length, 1))}
            </p>
            <p className="text-sm text-muted-foreground">Avg Words/Chat</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">
              {(() => {
                const modes = chatHistory.map(c => c.mode).filter(Boolean);
                if (modes.length === 0) return 'N/A';
                const modeCount = modes.reduce((acc, m) => {
                  acc[m] = (acc[m] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                const mostUsed = Object.entries(modeCount).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
                return modeConfig[mostUsed[0]]?.label || mostUsed[0];
              })()}
            </p>
            <p className="text-sm text-muted-foreground">Most Used Mode</p>
          </div>
        </div>

        {/* Mode Usage Statistics */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Penggunaan Mode</h4>
          <div className="space-y-3">
            {(() => {
              const modes = chatHistory.map(c => c.mode).filter(Boolean);
              if (modes.length === 0) {
                return <p className="text-sm text-muted-foreground text-center py-4">Belum ada data penggunaan mode</p>;
              }

              const modeCount = modes.reduce((acc, m) => {
                acc[m] = (acc[m] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              const total = modes.length;
              const sortedModes = Object.entries(modeCount).sort((a, b) => (b[1] as number) - (a[1] as number));

              return sortedModes.map(([modeKey, count]) => {
                const countNum = count as number;
                const percentage = Math.round((countNum / total) * 100);
                const config = modeConfig[modeKey as keyof typeof modeConfig];

                return (
                  <div key={modeKey} className="bg-card border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          modeKey === 'fast' && "bg-yellow-500",
                          modeKey === 'balance' && "bg-blue-500",
                          modeKey === 'deeplearning' && "bg-purple-500"
                        )} />
                        <span className="text-sm font-medium">{config?.label || modeKey}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{countNum}x</span>
                        <span className="text-sm font-semibold">{percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          modeKey === 'fast' && "bg-yellow-500",
                          modeKey === 'balance' && "bg-blue-500",
                          modeKey === 'deeplearning' && "bg-purple-500"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => {
    // Filter chat history based on search query
    const filteredHistory = chatHistory.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Group by date
    const groupedHistory = filteredHistory.reduce((groups, chat) => {
      const chatDate = new Date(chat.timestamp);
      const now = new Date();

      // Reset time to compare dates only
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());

      const diffTime = today.getTime() - chatDay.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let groupKey: string;
      if (diffDays === 0) {
        groupKey = 'Hari Ini';
      } else if (diffDays === 1) {
        groupKey = 'Kemarin';
      } else if (diffDays <= 7) {
        groupKey = '7 Hari Terakhir';
      } else if (diffDays <= 30) {
        groupKey = '30 Hari Terakhir';
      } else {
        groupKey = 'Lebih Lama';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(chat);
      return groups;
    }, {} as Record<string, typeof chatHistory>);

    // Sort chats within each group by timestamp (newest first)
    Object.keys(groupedHistory).forEach(key => {
      groupedHistory[key].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });

    const groupOrder = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', '30 Hari Terakhir', 'Lebih Lama'];
    const sortedGroups = groupOrder.filter(key => groupedHistory[key] && groupedHistory[key].length > 0);

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-heading">Riwayat Chat</h2>
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 bg-foreground hover:opacity-90 text-background px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Chat Baru
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari riwayat chat..."
              className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring transition-colors text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {chatHistory.length === 0 ? (
          <div className="text-center py-16">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Belum ada riwayat chat</p>
            <button
              onClick={startNewChat}
              className="inline-flex items-center gap-2 bg-foreground hover:opacity-90 text-background px-6 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Mulai Chat Pertama
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada hasil untuk "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedGroups.map(groupKey => (
              <div key={groupKey}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">
                  {groupKey}
                </h3>
                <div className="space-y-2">
                  {groupedHistory[groupKey].map(chat => {
                    const firstUserMsg = chat.messages?.find(m => m.type === 'user');
                    const preview = firstUserMsg ? firstUserMsg.text.substring(0, 80) : 'Percakapan kosong';
                    const messageCount = chat.messages?.length || 0;

                    return (
                      <div
                        key={chat.id}
                        className="bg-card border border-border rounded-xl p-4 hover:border-muted-foreground transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div onClick={() => loadChat(chat)} className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-medium truncate">{chat.title}</h3>
                              {chat.mode && (
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full shrink-0",
                                  chat.mode === 'fast' && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
                                  chat.mode === 'balance' && "bg-blue-500/10 text-blue-600 dark:text-blue-500",
                                  chat.mode === 'deeplearning' && "bg-purple-500/10 text-purple-600 dark:text-purple-500"
                                )}>
                                  {modeConfig[chat.mode]?.label || chat.mode}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {preview}
                              {firstUserMsg && firstUserMsg.text.length > 80 && '...'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span>{messageCount} pesan</span>
                              <span>•</span>
                              <span>{new Date(chat.timestamp).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</span>
                              <span>•</span>
                              <span>{new Date(chat.timestamp).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 shrink-0"
                            aria-label="Hapus chat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 font-heading">Pengaturan</h2>
      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Tema Tampilan
              </h3>
              <p className="text-sm text-muted-foreground">Ganti antara mode terang dan gelap</p>
            </div>
            <ToggleTheme />
          </div>
        </div>

        {/* Font Size Control */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div>
            <h3 className="font-medium mb-3">Ukuran Teks Pesan</h3>
            <p className="text-sm text-muted-foreground mb-4">Sesuaikan ukuran font untuk kenyamanan membaca</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFontSize('small')}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                fontSize === 'small'
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <span className="text-xs font-medium">A</span>
              <span className="text-xs">Kecil</span>
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                fontSize === 'medium'
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <span className="text-sm font-medium">A</span>
              <span className="text-xs">Sedang</span>
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                fontSize === 'large'
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <span className="text-base font-medium">A</span>
              <span className="text-xs">Besar</span>
            </button>
          </div>
        </div>

        {/* Mode Default */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium mb-1">Mode Default AI</h3>
              <p className="text-sm text-muted-foreground">Pilih mode AI yang akan digunakan saat memulai chat baru</p>
            </div>
          </div>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring transition-colors text-foreground"
            aria-label="Default AI mode"
          >
            <option value="fast">⚡ Mode Cepat - Respon instan</option>
            <option value="balance">⚖️ Mode Seimbang - Balance optimal</option>
            <option value="deeplearning">🧠 Deep Learning - Analisis mendalam</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifikasi
              </h3>
              <p className="text-sm text-muted-foreground">Aktifkan notifikasi untuk respon AI</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                notificationsEnabled ? "bg-foreground" : "bg-secondary"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-background transition-transform",
                notificationsEnabled ? "left-6" : "left-0.5"
              )} />
            </button>
          </div>
        </div>

        {/* Auto Save */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Simpan Otomatis
              </h3>
              <p className="text-sm text-muted-foreground">Simpan chat secara otomatis ke riwayat</p>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                autoSave ? "bg-foreground" : "bg-secondary"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-background transition-transform",
                autoSave ? "left-6" : "left-0.5"
              )} />
            </button>
          </div>
        </div>

        {/* Save Settings Button */}
        <button
          onClick={saveSettings}
          className="w-full bg-foreground hover:opacity-90 text-background py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Save settings"
        >
          <Save className="w-4 h-4" />
          Simpan Pengaturan
        </button>

        {/* Data Management */}
        <div className="pt-6 border-t border-border">
          <h3 className="font-medium mb-4 text-muted-foreground">Manajemen Data</h3>
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Riwayat Chat</p>
                <span className="text-sm text-muted-foreground">{chatHistory.length} percakapan</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Total {chatHistory.reduce((acc, chat) => acc + chat.messages.length, 0)} pesan tersimpan
              </p>
            </div>

            <button
              onClick={clearAllData}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Delete all data"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua Data
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="pt-6 border-t border-border">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p className="font-medium">AI Chat Indonesia v1.0</p>
            <p>UI Demo - Frontend Only</p>
            <p className="text-xs">© 2025 - Dibuat dengan ❤️ di Indonesia</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation links for MorphingNavigation
  const navLinks: MorphingNavigationLink[] = [
    { id: 'library', label: 'Library', href: '/library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'culture', label: 'Culture', href: '/culture', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', href: '/chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'creative', label: 'Creative', href: '/creative', icon: <PenTool className="w-4 h-4" /> },
  ];

  const handleNavLinkClick = (link: MorphingNavigationLink) => {
    // Navigate to all routes directly
    if (link.href) {
      navigate(link.href);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground relative overflow-hidden">

      {/* Sidebar - Mobile Responsive with Dock-style hover effects when minimized */}
      <div className={cn(
        "fixed lg:relative lg:translate-x-0 z-[60] bg-card border-r border-border h-full flex flex-col",
        "transition-all duration-300 ease-out",
        // Mobile: sidebarOpen controls visibility
        // Desktop: always visible, sidebarMinimized controls width
        isMobileView
          ? sidebarOpen
            ? sidebarMinimized
              ? "w-16 sm:w-20 shadow-2xl"
              : "w-64 sm:w-72 shadow-2xl"
            : "w-0 -translate-x-full overflow-hidden"
          : sidebarMinimized
            ? "w-16 lg:w-20"
            : "w-64 lg:w-72"
      )}>
        {/* Header - Modern Design */}
        <div className={cn(
          "p-4 sm:p-5 md:p-6 border-b border-border/50 transition-all",
          sidebarMinimized && "p-3 sm:p-4"
        )}>
          <div className="flex items-center justify-between gap-3">
            {!sidebarMinimized && (
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-heading whitespace-nowrap text-[#FFD700] truncate">Orenax</h1>
            )}
            <div className="flex items-center gap-2">
              {/* Minimize button - hidden on mobile when closed */}
              {(sidebarOpen || window.innerWidth >= 1024) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!sidebarToggleRef.current) {
                      sidebarToggleRef.current = true;
                      setSidebarMinimized(!sidebarMinimized);
                      setTimeout(() => {
                        sidebarToggleRef.current = false;
                      }, 300);
                    }
                  }}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  aria-label={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
                >
                  {sidebarMinimized ? (
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  ) : (
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  )}
                </button>
              )}
              {/* Close button - only on mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!sidebarToggleRef.current) {
                    sidebarToggleRef.current = true;
                    setSidebarOpen(false);
                    setTimeout(() => {
                      sidebarToggleRef.current = false;
                    }, 300);
                  }
                }}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto" role="navigation" aria-label="Main navigation">
          {/* News Chat - Mobile Responsive */}
          <button
            onClick={() => {
              navigate('/chat');
              if (isMobileView) setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center hover:scale-110" : "px-3 sm:px-4 py-2.5 sm:py-3",
              currentView === 'chat'
                ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            aria-label="News Chat"
            aria-current={currentView === 'chat' ? "page" : undefined}
            title={sidebarMinimized ? "News Chat" : undefined}
          >
            <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-xs sm:text-sm font-medium whitespace-nowrap truncate">News Chat</span>}
          </button>

          {/* Recent Chat - Mobile Responsive */}
          <button
            onClick={() => {
              navigate('/chat/history');
              if (isMobileView) setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center hover:scale-110" : "px-3 sm:px-4 py-2.5 sm:py-3",
              currentView === 'history'
                ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            aria-label="Recent Chat"
            aria-current={currentView === 'history' ? "page" : undefined}
            title={sidebarMinimized ? "Recent Chat" : undefined}
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-xs sm:text-sm font-medium whitespace-nowrap truncate">Recent Chat</span>}
          </button>

          {/* Separator */}
          <div className="my-2 border-t border-border" />

          {/* Customize - Mobile Responsive */}
          <button
            onClick={() => {
              navigate('/chat/profile');
              if (isMobileView) setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center hover:scale-110" : "px-3 sm:px-4 py-2.5 sm:py-3",
              currentView === 'profile'
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            aria-label="Customize"
            aria-current={currentView === 'profile' ? "page" : undefined}
            title={sidebarMinimized ? "Customize" : undefined}
          >
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-xs sm:text-sm font-medium whitespace-nowrap truncate">Customize</span>}
          </button>

          {/* Settings - Mobile Responsive */}
          <button
            onClick={() => {
              navigate('/chat/settings');
              if (isMobileView) setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center hover:scale-110" : "px-3 sm:px-4 py-2.5 sm:py-3",
              currentView === 'settings'
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            aria-label="Settings"
            aria-current={currentView === 'settings' ? "page" : undefined}
            title={sidebarMinimized ? "Settings" : undefined}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-xs sm:text-sm font-medium whitespace-nowrap truncate">Settings</span>}
          </button>

          {/* Subscription - Mobile Responsive */}
          <button
            onClick={() => {
              toast.info('Subscription', {
                description: 'Subscription feature coming soon'
              });
            }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center hover:scale-110" : "px-3 sm:px-4 py-2.5 sm:py-3",
              "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            aria-label="Subscription"
            title={sidebarMinimized ? "Subscription" : undefined}
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-xs sm:text-sm font-medium whitespace-nowrap truncate">Subscription</span>}
          </button>

          {/* History - Non-clickable Header */}
          <div
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl",
              sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center" : "px-3 sm:px-4 py-2.5 sm:py-3",
              "text-muted-foreground opacity-60"
            )}
            aria-label="History"
            title={sidebarMinimized ? "History" : undefined}
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-xs sm:text-sm font-medium whitespace-nowrap truncate">History</span>}
          </div>

          {/* Conversation List - Quick Access */}
          {!sidebarMinimized && chatHistory.length > 0 && (
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {chatHistory.slice(0, 10).map((chat: any) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setMessages(chat.messages || []);
                    setCurrentView('chat');
                    navigate('/chat');
                    if (isMobileView) setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-2 px-3 py-2 rounded-lg transition-all text-left",
                    "hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring",
                    currentChatId === chat.id && "bg-secondary"
                  )}
                  title={chat.title || 'Untitled Chat'}
                >
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {chat.title || chat.messages?.[0]?.content?.substring(0, 30) || 'Untitled Chat'}
                  </span>
                </button>
              ))}
            </div>
          )}

        </nav>

        <div className="p-2 sm:p-3 md:p-4 border-t border-border">
          {/* Profile with Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  sidebarMinimized ? "px-2 sm:px-3 py-2 sm:py-3 justify-center" : "px-2 sm:px-3 md:px-4 py-2 sm:py-3",
                  "bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/20 hover:from-[#FFD700]/15 hover:to-[#FFD700]/10"
                )}
                aria-label="Profile menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-xs sm:text-sm font-bold text-black flex-shrink-0">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                {!sidebarMinimized && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-medium truncate text-[#FFD700]">{profile.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{profile.email}</p>
                  </div>
                )}
                {!sidebarMinimized && (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-[17rem] bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg"
              style={{ zIndex: 9999 }}
            >
              <DropdownMenuLabel className="text-text-500 pt-1 px-2 pb-2 overflow-ellipsis truncate">
                {profile.email}
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => {
                  navigate('/chat/settings');
                  if (isMobileView) setSidebarOpen(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full text-sm">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="flex-1 truncate">Settings</span>
                  <span className="text-text-500 font-small px-0.5">⇧+Ctrl+,</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  toast.info('Subscription', {
                    description: 'Subscription feature coming soon'
                  });
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full text-sm">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="flex-1 truncate">Subscription</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigate('/chat/history');
                  if (isMobileView) setSidebarOpen(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full text-sm">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <History className="w-4 h-4" />
                  </div>
                  <span className="flex-1 truncate">History</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.2705 3.0498C11.1054 1.5437 15.4369 3.42942 16.9473 7.26367C18.4585 11.1003 16.5729 15.4359 12.7363 16.9473C8.89982 18.4583 4.56416 16.5736 3.05272 12.7373C1.54288 8.90435 3.42282 4.57201 7.25194 3.05663C7.25547 3.05522 7.25914 3.05413 7.26269 3.05273C7.26523 3.05172 7.26795 3.05079 7.2705 3.0498ZM8.64159 14.5283C8.05764 14.958 7.56418 15.4198 7.17772 15.8896C8.21355 16.3858 9.37633 16.6096 10.5508 16.5098C10.2224 16.2862 9.89754 16.0029 9.58202 15.6748C9.26312 15.3432 8.94744 14.9583 8.64159 14.5283ZM13.1572 12.5351C12.5305 12.6659 11.8818 12.8585 11.2275 13.1162C10.5729 13.3741 9.96666 13.6758 9.41894 14.0078C9.6946 14.3937 9.97385 14.7371 10.2539 15.0283C10.7036 15.4959 11.1332 15.8156 11.5117 15.9863C11.8879 16.1559 12.1765 16.1643 12.3935 16.0791C12.6107 15.9936 12.8179 15.7903 12.9775 15.4092C13.1379 15.0262 13.2342 14.4991 13.2441 13.8506C13.2503 13.4466 13.2187 13.0053 13.1572 12.5351ZM3.63768 8.51855C3.34594 9.76629 3.4167 11.1121 3.92186 12.3945C4.42675 13.6762 5.29203 14.7083 6.35546 15.4219C6.82009 14.8304 7.4201 14.2628 8.12694 13.748C7.6691 12.9972 7.2458 12.1466 6.88378 11.2275C6.52163 10.3082 6.25055 9.397 6.07323 8.53515C5.20566 8.64053 4.38055 8.63422 3.63768 8.51855ZM16.081 12.3828C15.4777 12.3027 14.8015 12.3016 14.081 12.3857C14.1506 12.9087 14.1838 13.4053 14.1767 13.8652C14.1698 14.3208 14.124 14.75 14.0361 15.1377C14.9636 14.4096 15.6617 13.4524 16.081 12.3828ZM11.0947 6.7705C10.4885 7.14026 9.82394 7.47239 9.11425 7.75195C8.40436 8.03157 7.69176 8.2418 6.99608 8.38476C7.16147 9.17591 7.41289 10.0225 7.75292 10.8857C8.09272 11.7483 8.48601 12.5376 8.90429 13.2285C9.51056 12.8587 10.176 12.5276 10.8857 12.248C11.5954 11.9685 12.3075 11.7572 13.0029 11.6143C12.8376 10.8236 12.5869 9.97794 12.2471 9.11523C11.907 8.25206 11.5133 7.46188 11.0947 6.7705ZM13.6426 4.57714C13.178 5.16855 12.5788 5.73625 11.8721 6.25097C12.3302 7.00222 12.754 7.85307 13.1162 8.77245C13.4782 9.69152 13.7485 10.6024 13.9258 11.4639C14.7932 11.3584 15.6185 11.3649 16.3613 11.4805C16.6528 10.233 16.5841 8.88752 16.0791 7.60546C15.5738 6.32297 14.707 5.29067 13.6426 4.57714ZM5.9619 4.86327C5.03547 5.59096 4.33712 6.54756 3.91796 7.6162C4.52106 7.69641 5.19677 7.69821 5.91698 7.61425C5.84736 7.09104 5.81616 6.59385 5.82323 6.13378C5.83026 5.679 5.87418 5.25038 5.9619 4.86327ZM8.48827 4.01367C8.11174 3.8439 7.82256 3.83644 7.60546 3.92187C7.38849 4.0075 7.182 4.20998 7.02245 4.59081C6.86212 4.97369 6.76585 5.50006 6.75585 6.14843C6.74965 6.55226 6.78027 6.99382 6.84179 7.46386C7.46863 7.33317 8.11803 7.14252 8.77245 6.88476C9.42675 6.62702 10.0316 6.32305 10.5791 5.9912C10.3036 5.6057 10.0259 5.26167 9.74608 4.9707C9.29651 4.50322 8.8667 4.18435 8.48827 4.01367ZM12.8223 4.10937C11.7866 3.61351 10.6234 3.3904 9.44921 3.49023C9.77744 3.71355 10.1026 3.99633 10.418 4.32421C10.7368 4.65579 11.0526 5.04068 11.3584 5.4707C11.9424 5.04095 12.4358 4.57931 12.8223 4.10937Z"></path>
                      </svg>
                    </div>
                    <span className="flex-1 truncate">Language</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Bahasa Indonesia</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onClick={() => {
                  toast.info('Get help', {
                    description: 'Contact us at support@orenax.com'
                  });
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full font-base group">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="flex-1 truncate">Get help</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  toast.info('Upgrade plan', {
                    description: 'Upgrade feature coming soon'
                  });
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full text-sm group">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5ZM10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5ZM9.64648 6.64648C9.81727 6.47572 10.0813 6.45407 10.2754 6.58203L10.3535 6.64648L12.8535 9.14648C13.0488 9.34174 13.0488 9.65825 12.8535 9.85352C12.6583 10.0488 12.3417 10.0488 12.1465 9.85352L10.5 8.20703V13L10.4902 13.1006C10.4437 13.3285 10.2416 13.4999 10 13.5C9.75851 13.4999 9.55644 13.3283 9.50977 13.1006L9.5 13V8.20703L7.85449 9.85352C7.6594 10.0486 7.34276 10.0483 7.14746 9.85352C6.9522 9.65825 6.9522 9.34175 7.14746 9.14648L9.64648 6.64648Z"></path>
                    </svg>
                  </div>
                  <span className="flex-1 truncate">Upgrade plan</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  toast.info('Download', {
                    description: 'Download feature coming soon'
                  });
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full text-sm group">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 13C16.7761 13 17 13.2239 17 13.5V15.5C17 16.3284 16.3284 17 15.5 17H4.5C3.67157 17 3 16.3284 3 15.5V13.5C3 13.2239 3.22386 13 3.5 13C3.77614 13 4 13.2239 4 13.5V15.5C4 15.7761 4.22386 16 4.5 16H15.5C15.7761 16 16 15.7761 16 15.5V13.5C16 13.2239 16.2239 13 16.5 13ZM10 3C10.2761 3 10.5 3.22386 10.5 3.5V12.1855L13.626 8.66797C13.8094 8.46166 14.1256 8.44275 14.332 8.62598C14.5383 8.80936 14.5573 9.12563 14.374 9.33203L10.374 13.832L10.2949 13.9033C10.21 13.9654 10.107 14 10 14C9.85718 14 9.72086 13.9388 9.62598 13.832L5.62598 9.33203L5.56738 9.25C5.45079 9.04872 5.48735 8.78653 5.66797 8.62598C5.84854 8.46567 6.1127 8.46039 6.29883 8.59961L6.37402 8.66797L9.5 12.1855V3.5C9.5 3.22386 9.72386 3 10 3Z"></path>
                    </svg>
                  </div>
                  <span className="flex-1 truncate">Download OrenaX for Android</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5ZM10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5ZM10.1006 9.00977C10.3286 9.05629 10.5 9.25829 10.5 9.5V12.5H11.5C11.7761 12.5 12 12.7239 12 13C12 13.2761 11.7761 13.5 11.5 13.5H8.5C8.22386 13.5 8 13.2761 8 13C8 12.7239 8.22386 12.5 8.5 12.5H9.5V10H8.5C8.22386 10 8 9.77614 8 9.5C8 9.22386 8.22386 9 8.5 9H10L10.1006 9.00977ZM10 6.5C10.4142 6.5 10.75 6.83579 10.75 7.25C10.75 7.66421 10.4142 8 10 8C9.58579 8 9.25 7.66421 9.25 7.25C9.25 6.83579 9.58579 6.5 10 6.5Z"></path>
                      </svg>
                    </div>
                    <span className="flex-1 truncate">Learn more</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuItem>API Reference</DropdownMenuItem>
                  <DropdownMenuItem>Community</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <div className="flex items-center gap-2 w-full text-sm group">
                  <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="flex-1 truncate">Log out</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'chat' && renderChat()}
        {currentView === 'profile' && <div className="flex-1 overflow-y-auto">{renderProfile()}</div>}
        {currentView === 'history' && <div className="flex-1 overflow-y-auto">{renderHistory()}</div>}
        {currentView === 'settings' && <div className="flex-1 overflow-y-auto">{renderSettings()}</div>}
      </div>

      {/* Overlay with Backdrop Blur */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-[55] animate-fade-in"
        />
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun? Anda perlu login kembali untuk mengakses aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Voice Live Modal */}
      <VoiceLiveModal
        isOpen={voiceLiveActive}
        onClose={() => setVoiceLiveActive(false)}
      />
    </div>
  );
}
