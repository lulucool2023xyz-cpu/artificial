import { memo, useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  Send, 
  X,
  FileText,
  Zap,
  Gauge,
  Brain,
  Search,
  Sparkles,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessageProps } from "@/components/chat/ChatMessage";
import { validateData, chatMessageSchema, sanitizeString } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ChatMode = "fast" | "balanced" | "deep";

/**
 * Chat Input Bar Component
 * Purpose: Sticky input bar for user to send messages
 * 
 * Features:
 * - Auto-expanding textarea (max 5 rows)
 * - File upload button (.pdf, .txt, .doc, .docx)
 * - Image upload button (.jpg, .png, .webp)
 * - Voice input toggle (changes to Send when typing)
 * - Mode selector dropdown
 * - Web search toggle
 */
export const ChatInputBar = memo(function ChatInputBar() {
  const { theme } = useTheme();
  const { addMessage, setIsLoading } = useChat();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [mode, setMode] = useState<ChatMode>("balanced");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const isDeepThinking = mode === "deep";

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 5 * 24; // 5 rows * 24px line height
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }

    // Warn when approaching character limit
    if (inputValue.length > 2000 && inputValue.length <= 2010) {
      toast({
        title: "Character limit warning",
        description: "You're approaching the 2500 character limit",
        variant: "default",
        duration: 3000,
      });
    }
  }, [inputValue]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = [".pdf", ".txt", ".doc", ".docx"];
    const validFiles = files.filter(file => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      return allowedTypes.includes(ext);
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
    const validFiles = files.filter(file => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      return allowedTypes.includes(ext);
    });
    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorder.mimeType || 'audio/webm' 
          });
          
          // TODO: Send audio to speech-to-text API
          // For now, simulate transcription
          const simulatedTranscript = "[Voice message transcribed - " + 
            Math.floor(recordingTime) + " seconds]";
          setInputValue(simulatedTranscript);
          
          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        } catch (error) {
          console.error("Error processing recording:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    
    // Stop stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const handleSend = async () => {
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
    
    const messageText = inputValue.trim();
    
    if (!messageText && uploadedFiles.length === 0 && uploadedImages.length === 0) {
      return;
    }

    // Validate message with Zod
    if (messageText) {
      const validation = validateData(chatMessageSchema, { message: messageText });
      
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Invalid Message",
          description: validation.errors?.message || "Please enter a valid message",
        });
        return;
      }
    }

    // Add user message with sanitized content
    const sanitizedContent = messageText 
      ? sanitizeString(messageText)
      : `Sent ${uploadedFiles.length} file(s) and ${uploadedImages.length} image(s)`;
      
    const userMessage: ChatMessageProps = {
      id: `user-${Date.now()}`,
      role: "user",
      content: sanitizedContent,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Clear input
    setInputValue("");
    setUploadedFiles([]);
    setUploadedImages([]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: ChatMessageProps = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `I received your message: "${sanitizedContent}". This is a simulated response. In production, this would connect to an AI API.`,
        timestamp: new Date(),
      };
      addMessage(aiMessage);
      setIsLoading(false);
    }, 1500);
  };

  const showSendButton = inputValue.trim().length > 0;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent pt-4">
      {/* Input Container - Max Width 1400px, Centered with 32px padding */}
      <div className="w-full max-w-[1400px] mx-auto px-8 pb-6">
        <div className={cn(
          "backdrop-blur-xl rounded-2xl p-5 transition-all duration-300",
          "bg-white/5 border-2 border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        )}>
          {(uploadedFiles.length > 0 || uploadedImages.length > 0) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg",
                    "bg-white/10 border border-white/20"
                  )}
                >
                  <FileText className="w-4 h-4 text-[#FF8C00]" />
                  <span className="text-sm text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-[#B0B0B0]">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className={cn(
                      "p-1 rounded transition-all duration-200",
                      "hover:bg-white/20 text-[#B0B0B0] hover:text-white"
                    )}
                    aria-label="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {uploadedImages.map((file, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-white/20"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className={cn(
                      "absolute -top-2 -right-2 p-1 rounded-full transition-all duration-200",
                      "bg-red-500 text-white hover:bg-red-600 shadow-lg"
                    )}
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

      {/* Mode Selector & Web Search - More Prominent Design */}
      <div className="mb-3 flex items-center justify-between gap-3">
        {/* Mode Selector with prominent styling */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium",
                "border-2",
                mode === "fast" && "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20",
                mode === "balanced" && "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20",
                mode === "deep" && "bg-purple-500/10 border-purple-500/50 text-purple-400 hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              )}
            >
              {mode === "fast" && <Zap className="w-4 h-4" />}
              {mode === "balanced" && <Gauge className="w-4 h-4" />}
              {mode === "deep" && <Brain className="w-4 h-4 animate-pulse" />}
              <span className="capitalize text-sm">{mode} Mode</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-[#1A1A1A] border-white/20">
            <DropdownMenuItem 
              onClick={() => setMode("fast")}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-cyan-500/10"
            >
              <Zap className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <div className="font-semibold text-cyan-400">Fast</div>
                <div className="text-xs text-[#B0B0B0]">Quick responses for simple queries</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setMode("balanced")}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-blue-500/10"
            >
              <Gauge className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-400">Balanced</div>
                <div className="text-xs text-[#B0B0B0]">Default mode, good for most tasks</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setMode("deep")}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-purple-500/10"
            >
              <Brain className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <div className="font-semibold text-purple-400">Deep</div>
                <div className="text-xs text-[#B0B0B0]">Detailed analysis and complex reasoning</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Web Search Toggle - More Prominent */}
        <button
          onClick={() => setWebSearchEnabled(!webSearchEnabled)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium border-2",
            webSearchEnabled 
              ? "bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              : "bg-white/5 border-white/10 text-[#B0B0B0] hover:bg-white/10"
          )}
        >
          <Search className={cn("w-4 h-4", webSearchEnabled && "animate-pulse")} />
          <span className="text-sm">Web Search {webSearchEnabled ? "ON" : "OFF"}</span>
        </button>
      </div>

        {/* Input Bar */}
        <div className="flex items-end gap-3">
          {/* File Upload */}
          <label className={cn(
            "p-3 rounded-xl transition-all duration-200 cursor-pointer",
            "text-[#B0B0B0] hover:text-white hover:bg-white/10 hover:scale-110"
          )}>
            <Paperclip className="w-5 h-5" />
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload file"
            />
          </label>

          {/* Image Upload */}
          <label className={cn(
            "p-3 rounded-xl transition-all duration-200 cursor-pointer",
            "text-[#B0B0B0] hover:text-white hover:bg-white/10 hover:scale-110"
          )}>
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload image"
            />
          </label>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={mode === "deep" ? "Ask a complex question for deep analysis..." : "Ask me anything... (Markdown supported)"}
              rows={1}
              className={cn(
                "w-full px-5 py-4 rounded-xl resize-none transition-all duration-200",
                "bg-white/10 border-2 text-white placeholder-[#B0B0B0]",
                "focus:outline-none focus:bg-white/15",
                mode === "fast" && "border-cyan-500/30 focus:border-cyan-500/50",
                mode === "balanced" && "border-blue-500/30 focus:border-blue-500/50",
                mode === "deep" && "border-purple-500/30 focus:border-purple-500/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"
              )}
            />
            {inputValue.length > 0 && (
              <span className={cn(
                "absolute right-4 bottom-3 text-xs font-medium transition-colors",
                inputValue.length > 2000 ? "text-red-400" : "text-[#B0B0B0]"
              )}>
                {inputValue.length} / 2500
              </span>
            )}
          </div>

          {/* Voice/Send Button */}
          <button
            onClick={showSendButton ? handleSend : handleVoiceToggle}
            disabled={uploadedFiles.length === 0 && uploadedImages.length === 0 && !showSendButton && !isRecording}
            className={cn(
              "p-4 rounded-xl transition-all duration-300 relative flex-shrink-0 font-semibold",
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                : showSendButton
                ? "bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white hover:shadow-[0_0_25px_rgba(255,140,0,0.6)] hover:scale-110"
                : "bg-white/10 text-[#B0B0B0] hover:bg-white/20 hover:text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            aria-label={isRecording ? "Stop recording" : showSendButton ? "Send message" : "Start voice input"}
          >
            {isRecording ? (
              <>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5" />
                  {recordingTime > 0 && (
                    <span className="text-xs font-mono font-semibold">
                      {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
              </>
            ) : showSendButton ? (
              <Send className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
});

