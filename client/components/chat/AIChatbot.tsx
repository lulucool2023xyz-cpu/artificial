import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Camera, Settings, User, History, Menu, X, Zap, Brain, Gauge, Trash2, ChevronDown, Plus, LogOut, MessageSquare, Search, Save, Bell, Copy, RotateCcw, Sun, Moon, Monitor, Paperclip, File, Image as ImageIcon, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modeMenuOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close sidebar on mobile
      if (event.key === 'Escape' && sidebarOpen && window.innerWidth < 1024) {
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
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File terlalu besar', {
          description: `${file.name} melebihi batas 10MB`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
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
    return File;
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

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new window.File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFiles([file]);
          toast.success('Foto diambil!');
          toggleCamera(); // Close camera after capture
        }
      }, 'image/jpeg');
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
      // Call OpenRouter API with Anthropic Claude Sonnet 4.5
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const model = import.meta.env.VITE_AI_MODEL || 'anthropic/claude-sonnet-4.5';
      
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      // Prepare messages for API
      const apiMessages = await Promise.all(newMessages.map(async (msg) => {
        if (msg.type === 'user') {
          const content: any[] = [{ type: 'text', text: msg.text }];
          
          if (msg.files && msg.files.length > 0) {
            for (const fileObj of msg.files) {
              if (fileObj.type.startsWith('image/')) {
                const base64 = await convertFileToBase64(fileObj.file);
                content.push({
                  type: 'image_url',
                  image_url: {
                    url: base64
                  }
                });
              }
            }
          }
          return { role: 'user', content };
        } else {
          return { role: 'assistant', content: msg.text };
        }
      }));

      // Mode-specific configuration for response speed and quality
      const modeSettings = {
        fast: {
          temperature: 0.5,
          max_tokens: 300,
          top_p: 0.7,
          systemPrompt: 'Anda adalah asisten AI Indonesia yang cepat dan efisien. Berikan jawaban singkat, langsung ke inti, dan mudah dipahami. Fokus pada informasi penting saja.'
        },
        balance: {
          temperature: 0.8,
          max_tokens: 1000,
          top_p: 0.9,
          systemPrompt: 'Anda adalah asisten AI Indonesia yang ramah dan membantu. Jawab dalam bahasa Indonesia dengan sopan, informatif, dan seimbang antara detail dan kejelasan.'
        },
        deeplearning: {
          temperature: 0.9,
          max_tokens: 2500,
          top_p: 0.95,
          systemPrompt: 'Anda adalah asisten AI Indonesia dengan kemampuan analisis mendalam. Berikan penjelasan detail, komprehensif, dan pertimbangkan berbagai perspektif. Gunakan reasoning yang mendalam dan sertakan contoh jika relevan.'
        }
      };

      const currentSettings = modeSettings[mode as keyof typeof modeSettings] || modeSettings.balance;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Indonesian AI Chatbot'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: currentSettings.systemPrompt
            },
            ...apiMessages
          ],
          temperature: currentSettings.temperature,
          max_tokens: currentSettings.max_tokens,
          top_p: currentSettings.top_p,
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      
      // Create initial bot message
      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        type: 'bot',
        text: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  
                  if (content) {
                    accumulatedText += content;
                    
                    // Update message with accumulated text
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === botMessageId 
                          ? { ...msg, text: accumulatedText }
                          : msg
                      )
                    );

                    // Add delay based on mode for typing effect
                    const typingDelay = mode === 'fast' ? 5 : mode === 'balance' ? 15 : 30;
                    await new Promise(resolve => setTimeout(resolve, typingDelay));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
        }
      }
      
      // Update final message
      const finalBotMessage = {
        id: botMessageId,
        type: 'bot',
        text: accumulatedText || 'Maaf, tidak ada respons dari AI.',
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
        description: error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga'
      });
      
      // Fallback to mock response if API fails
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Maaf, terjadi kesalahan dalam menghubungi AI. Silakan coba lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Update history with error message
      if (currentChatId) {
        updateChatHistory(currentChatId, [...newMessages, botMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = async () => {
    if (!isRecording) {
      try {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          toast.error('Browser tidak support', {
            description: 'Browser Anda tidak mendukung speech recognition'
          });
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID'; // Indonesian
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsRecording(true);
          toast.info('Sedang merekam...', {
            description: 'Silakan berbicara'
          });
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + (prev ? ' ' : '') + transcript);
          toast.success('Suara berhasil dikenali!');
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Error merekam suara', {
            description: event.error === 'no-speech' ? 'Tidak ada suara terdeteksi' : 'Terjadi kesalahan'
          });
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } catch (err) {
        console.error('Cannot access microphone:', err);
        toast.error('Tidak dapat mengakses mikrofon', {
          description: 'Pastikan izin mikrofon telah diberikan'
        });
      }
    } else {
      setIsRecording(false);
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
    if (window.innerWidth < 1024) setSidebarOpen(false);
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
              toast.dismiss(t.id);
              toast.success('Chat berhasil dihapus');
            }}
            className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90"
          >
            Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
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
              toast.dismiss(t.id);
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
            onClick={() => toast.dismiss(t.id)}
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
        description: 'Tidak dapat menyalin teks'
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
        description: 'Pesan pengguna tidak ditemukan'
      });
      return;
    }

    const userMessage = messages[userMessageIndex];
    setIsLoading(true);
    toast.info('Regenerating...', {
      description: 'Membuat ulang respons AI'
    });

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const model = import.meta.env.VITE_AI_MODEL || 'anthropic/claude-sonnet-4.5';
      
      if (!apiKey) throw new Error('API key not configured');

      // Filter messages up to the user message
      const contextMessages = messages.slice(0, userMessageIndex + 1);
      
      const apiMessages = await Promise.all(contextMessages.map(async (msg) => {
        if (msg.type === 'user') {
          const content: any[] = [{ type: 'text', text: msg.text }];
          if (msg.files && msg.files.length > 0) {
            for (const fileObj of msg.files) {
              if (fileObj.type.startsWith('image/')) {
                const base64 = await convertFileToBase64(fileObj.file);
                content.push({
                  type: 'image_url',
                  image_url: { url: base64 }
                });
              }
            }
          }
          return { role: 'user', content };
        } else {
          return { role: 'assistant', content: msg.text };
        }
      }));

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Indonesian AI Chatbot'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'Anda adalah asisten AI Indonesia yang ramah dan membantu. Jawab dalam bahasa Indonesia dengan sopan dan informatif.'
            },
            ...apiMessages
          ],
          temperature: mode === 'fast' ? 0.7 : mode === 'balance' ? 0.8 : 0.9,
          max_tokens: mode === 'fast' ? 500 : mode === 'balance' ? 1000 : 2000
        })
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons.';
      
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
        description: 'Tidak dapat membuat ulang respons'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-medium text-muted-foreground font-heading">Asisten AI Indonesia</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
              setTheme(newTheme);
              toast.success('Theme diubah', {
                description: `Tema: ${newTheme === 'dark' ? 'Gelap' : newTheme === 'light' ? 'Terang' : 'Sistem'}`
              });
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-500" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
              <Monitor className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {/* Mode Dropdown */}
          <div className="mode-dropdown relative">
          <button
            onClick={() => setModeMenuOpen(!modeMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select AI mode"
            aria-haspopup="menu"
            aria-expanded={modeMenuOpen}
          >
            {React.createElement(modeConfig[mode].icon, { 
              className: cn("w-4 h-4", modeConfig[mode].textColor)
            })}
            <span className="text-sm text-foreground font-medium">{modeConfig[mode].label}</span>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform",
              modeMenuOpen && "rotate-180"
            )} />
            
            {/* Dropdown Menu */}
            {modeMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50" role="menu" aria-label="AI mode options">
                {Object.entries(modeConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={(e) => { e.stopPropagation(); setMode(key); setModeMenuOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                        mode === key
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                      role="menuitem"
                      aria-label={`Select ${config.label} mode`}
                    >
                      <Icon className={cn("w-4 h-4", mode === key && config.textColor)} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{config.desc}</p>
                      </div>
                      {mode === key && (
                        <div className={cn("w-1.5 h-1.5 rounded-full", config.color)}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-background" role="log" aria-live="polite" aria-atomic="false">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center mb-6",
              modeConfig[mode].bgLight,
              "shadow-lg"
            )}>
              {React.createElement(modeConfig[mode].icon, { 
                className: cn("w-10 h-10", modeConfig[mode].textColor)
              })}
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading">Apa yang bisa AI bantu?</h3>
            <p className="text-xs text-muted-foreground max-w-md mb-6">
              Asisten AI Indonesia siap membantu Anda dengan berbagai kebutuhan
            </p>
            
            {/* AI Capabilities Grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {/* Text Generation */}
              <button 
                onClick={() => handleFeatureClick('chat')}
                className="group bg-card border border-border rounded-xl p-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all active:scale-95 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-sm font-semibold mb-1 text-foreground">Percakapan & Teks</h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Jawab pertanyaan, buat konten, atau diskusi topik
                </p>
              </button>

              {/* Code Assistant */}
              <button 
                onClick={() => handleFeatureClick('code')}
                className="group bg-card border border-border rounded-xl p-4 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all active:scale-95 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                  <Brain className="w-5 h-5 text-purple-500" />
                </div>
                <h4 className="text-sm font-semibold mb-1 text-foreground">Pemrograman & Kode</h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Debug kode, review, atau jelaskan konsep
                </p>
              </button>

              {/* Analysis */}
              <button 
                onClick={() => handleFeatureClick('analysis')}
                className="group bg-card border border-border rounded-xl p-4 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all active:scale-95 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-3 group-hover:bg-yellow-500/20 transition-colors">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <h4 className="text-sm font-semibold mb-1 text-foreground">Analisis & Riset</h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Analisis data, riset, atau rangkum info
                </p>
              </button>

              {/* Creative */}
              <button 
                onClick={() => handleFeatureClick('creative')}
                className="group bg-card border border-border rounded-xl p-4 hover:border-green-500/50 hover:bg-green-500/5 transition-all active:scale-95 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                  <Gauge className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="text-sm font-semibold mb-1 text-foreground">Kreativitas & Ide</h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Brainstorming, cerita, atau solusi inovatif
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, index) => (
              <div key={msg.id} className={cn(
                "flex group",
                msg.type === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'
              )}>
                <div className={cn(
                  "max-w-[75%]",
                  msg.type === 'user' ? '' : 'flex flex-col gap-2'
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl",
                    msg.type === 'user'
                      ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-lg shadow-blue-500/20"
                      : msg.type === 'error'
                      ? "bg-red-500/10 border border-red-500/30 text-foreground rounded-tl-sm"
                      : "bg-secondary text-foreground rounded-tl-sm border border-border"
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
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({node, className, children, ...props}: any) {
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
                            a({node, children, ...props}: any) {
                              return (
                                <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props}>
                                  {children}
                                </a>
                              );
                            },
                            p({node, children, ...props}: any) {
                              return <p className={cn(
                                "leading-relaxed mb-2 last:mb-0",
                                fontSize === 'small' && "text-xs",
                                fontSize === 'medium' && "text-sm",
                                fontSize === 'large' && "text-base"
                              )} {...props}>{children}</p>;
                            },
                            ul({node, children, ...props}: any) {
                              return <ul className={cn(
                                "list-disc list-inside space-y-1 my-2",
                                fontSize === 'small' && "text-xs",
                                fontSize === 'medium' && "text-sm",
                                fontSize === 'large' && "text-base"
                              )} {...props}>{children}</ul>;
                            },
                            ol({node, children, ...props}: any) {
                              return <ol className={cn(
                                "list-decimal list-inside space-y-1 my-2",
                                fontSize === 'small' && "text-xs",
                                fontSize === 'medium' && "text-sm",
                                fontSize === 'large' && "text-base"
                              )} {...props}>{children}</ol>;
                            },
                            strong({node, children, ...props}: any) {
                              return <strong className="font-semibold" {...props}>{children}</strong>;
                            }
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
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
                  
                  {/* Action Buttons for Bot Messages */}
                  {msg.type === 'bot' && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => copyToClipboard(msg.text)}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        title="Salin teks"
                      >
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => regenerateResponse(msg.id)}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                        title="Buat ulang respons"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
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
        )}
      </div>

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

      {/* Input Area */}
      <div 
        className={cn(
          "px-6 py-4 border-t border-border bg-card transition-colors",
          isDragging && "bg-blue-500/10 border-blue-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="max-w-3xl mx-auto mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg p-2 pr-8">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                        {React.createElement(getFileIcon(file.type), { className: "w-5 h-5 text-muted-foreground" })}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs font-medium truncate max-w-[150px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Drag & Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <Paperclip className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-500">Lepaskan file di sini</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMic}
            className={cn(
              "p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring",
              isRecording 
                ? "bg-destructive text-destructive-foreground animate-pulse" 
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
            aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            aria-pressed={isRecording}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={toggleCamera}
            className={cn(
              "p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring",
              isCameraOn 
                ? "bg-green-600 text-white" 
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
            aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
            aria-pressed={isCameraOn}
          >
            <Camera className="w-4 h-4" />
          </button>
          <div className={cn(
            "flex-1 bg-secondary rounded-xl flex items-center px-4 py-2 transition-all",
            "focus-within:ring-1 focus-within:ring-ring",
            activeFeature === 'chat' && "ring-2 ring-blue-500 bg-blue-500/5",
            activeFeature === 'code' && "ring-2 ring-purple-500 bg-purple-500/5",
            activeFeature === 'analysis' && "ring-2 ring-yellow-500 bg-yellow-500/5",
            activeFeature === 'creative' && "ring-2 ring-green-500 bg-green-500/5"
          )}>
            {activeFeature && (
              <div className="mr-2 flex items-center justify-center">
                {React.createElement(featureConfig[activeFeature].icon, {
                  className: cn(
                    "w-4 h-4",
                    activeFeature === 'chat' && "text-blue-500",
                    activeFeature === 'code' && "text-purple-500",
                    activeFeature === 'analysis' && "text-yellow-500",
                    activeFeature === 'creative' && "text-green-500"
                  )
                })}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Kirim pesan ke AI..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              aria-label="Message input"
              aria-describedby="message-help"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring",
              (input.trim() || uploadedFiles.length > 0) && !isLoading
                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:opacity-90 shadow-lg shadow-blue-500/20"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Send message"
            aria-disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

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

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative lg:translate-x-0 z-50 bg-card border-r border-border h-full flex flex-col",
        "transition-all duration-300 ease-out",
        sidebarOpen 
          ? sidebarMinimized 
            ? "w-20 shadow-2xl lg:shadow-none" 
            : "w-64 shadow-2xl lg:shadow-none" 
          : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className={cn(
          "p-6 border-b border-border transition-all",
          sidebarMinimized && "p-4"
        )}>
          <div className="flex items-center justify-between">
            {!sidebarMinimized && (
              <h1 className="text-xl font-bold font-heading whitespace-nowrap">AI Chat Indonesia</h1>
            )}
            <div className="flex items-center gap-2">
              {/* Minimize button - hidden on mobile when closed */}
              {(sidebarOpen || window.innerWidth >= 1024) && (
                <button
                  onClick={() => setSidebarMinimized(!sidebarMinimized)}
                  className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
                >
                  {sidebarMinimized ? (
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  ) : (
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                  )}
                </button>
              )}
              {/* Close button - only on mobile */}
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
          {[
            { id: 'chat' as const, icon: MessageSquare, label: 'Chat', route: '/chat' },
            { id: 'history' as const, icon: History, label: 'Riwayat', route: '/chat/history' },
            { id: 'profile' as const, icon: User, label: 'Profil', route: '/chat/profile' },
            { id: 'settings' as const, icon: Settings, label: 'Pengaturan', route: '/chat/settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { 
                navigate(item.route);
                if (window.innerWidth < 1024) setSidebarOpen(false); 
              }}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl transition-all",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                sidebarMinimized ? "px-3 py-3 justify-center" : "px-4 py-3",
                currentView === item.id 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
              aria-label={item.label}
              aria-current={currentView === item.id ? "page" : undefined}
              title={sidebarMinimized ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!sidebarMinimized && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center text-sm font-bold text-background">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl transition-all",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring",
              sidebarMinimized ? "px-3 py-3 justify-center" : "px-4 py-3"
            )}
            aria-label="Logout"
            title={sidebarMinimized ? "Keluar" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarMinimized && <span className="text-sm font-medium whitespace-nowrap">Keluar</span>}
          </button>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40 animate-fade-in"
        />
      )}
    </div>
  );
}
