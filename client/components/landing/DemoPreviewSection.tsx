import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { BackgroundGrid } from './BackgroundGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { WayangDecoration } from './WayangDecoration';
import { OrnamentFrame } from './OrnamentFrame';

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

export const DemoPreviewSection = memo(function DemoPreviewSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const demoConversation = [
    { type: 'user' as const, text: 'Apa yang bisa dilakukan di website ini?' },
    { type: 'bot' as const, text: 'Website ini adalah platform AI Chat Indonesia yang menawarkan berbagai fitur canggih! Anda bisa melakukan percakapan natural dengan AI, mendapatkan bantuan coding, menganalisis data, serta brainstorming ide kreatif.' },
    { type: 'user' as const, text: 'Bagaimana cara menggunakannya?' },
    { type: 'bot' as const, text: 'Sangat mudah! Setelah login, pilih mode AI sesuai kebutuhan - Fast, Balance, atau Deep Learning. Lalu ketik pertanyaan atau upload file, dan AI siap membantu! Riwayat chat tersimpan otomatis.' },
    { type: 'user' as const, text: 'Apa keunggulannya?' },
    { type: 'bot' as const, text: 'Platform ini menggunakan model AI terkini dengan kemampuan memahami Bahasa Indonesia, mendukung upload file, syntax highlighting untuk kode, dan desain yang terinspirasi budaya Indonesia!' },
  ];

  const typeMessage = async (text: string, messageId: number, isUser: boolean = false) => {
    // Type character by character for smooth effect
    const chars = text.split('');
    let currentText = '';

    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, text: currentText, isTyping: true }
            : msg
        )
      );

      // Smooth typing per character with consistent speed
      const char = chars[i];
      let delay;

      if (char === ' ') {
        // Quick space delay
        delay = isUser ? 20 : 25;
      } else if (char === ',' || char === '.') {
        // Longer pause for punctuation
        delay = isUser ? 100 : 120;
      } else if (char === '!' || char === '?') {
        // Even longer pause for sentence endings
        delay = isUser ? 120 : 140;
      } else {
        // Normal character typing speed - very smooth
        delay = isUser ? 25 : 30;
        // Add slight random variation for natural feel
        delay += Math.random() * 10;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isTyping: false }
          : msg
      )
    );
  };

  const runAnimation = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setMessages([]);

    for (let i = 0; i < demoConversation.length; i++) {
      const conv = demoConversation[i];
      const messageId = Date.now() + i * 100;

      if (conv.type === 'user') {
        // User message with smooth character-by-character typing
        setMessages(prev => [...prev, { id: messageId, type: 'user', text: '', isTyping: true }]);
        await new Promise(resolve => setTimeout(resolve, 300));
        await typeMessage(conv.text, messageId, true);
        await new Promise(resolve => setTimeout(resolve, 600));
      } else {
        // Show typing indicator for bot (thinking delay)
        setMessages(prev => [...prev, { id: messageId, type: 'bot', text: '...', isTyping: true }]);
        // AI thinking delay with smooth transition
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 400));
        // Start smooth character-by-character typing
        await typeMessage(conv.text, messageId, false);
        // Smooth pause after message
        await new Promise(resolve => setTimeout(resolve, 900));
      }
    }

    // Smooth wait before restarting
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnimating(false);
  };

  useEffect(() => {
    // Start first animation
    runAnimation();

    // Cleanup on unmount
    return () => {
      setIsAnimating(false);
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    // Restart animation when it finishes
    if (!isAnimating) {
      const timeout = setTimeout(() => {
        runAnimation();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, runAnimation]);

  return (
    <section
      className="section-padding section-container bg-background relative overflow-hidden"
      aria-label="Demo preview section"
    >
      {/* Background elements */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
      <BatikPattern variant="ceplok" opacity="opacity-[0.03]" speed={30} />
      <WayangDecoration variant="left" size="sm" className="opacity-15" />
      <WayangDecoration variant="right" size="sm" className="opacity-15" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <ScrollReveal delay={0.1} duration={0.7} distance={30}>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6">
              <span className="text-foreground">See It in Action</span>
              <br />
              <span className="text-indonesian-gold/80 text-2xl sm:text-3xl md:text-4xl font-light">
                Lihat Dalam Aksi
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indonesian-gold/60 to-transparent mx-auto opacity-60 mb-4"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Saksikan demo interaktif bagaimana AI kami bekerja dan membantu Anda
            </p>
          </div>
        </ScrollReveal>

        {/* Demo mockup */}
        <ScrollReveal delay={0.2} duration={0.7} distance={30}>
          <div className="relative">
            {/* Main interface container */}
            <OrnamentFrame
              variant="jawa"
              className="bg-gradient-to-b from-white/10 to-white/5 border border-indonesian-gold/20 rounded-2xl backdrop-blur-xl relative"
              style={{
                boxShadow: "0 0 60px rgba(255, 255, 255, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.05)",
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 80px rgba(255, 255, 255, 0.15), inset 0 0 50px rgba(255, 255, 255, 0.08), 0 0 30px rgba(217, 119, 6, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 60px rgba(255, 255, 255, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.05)";
              }}
            >
              <div className="p-4 sm:p-6 md:p-8 lg:p-12 relative">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-indonesian-gold/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indonesian-gold/30 to-indonesian-gold/10 flex items-center justify-center border border-indonesian-gold/30">
                      <MessageSquare className="w-5 h-5 text-indonesian-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-heading">AI Assistant</h3>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat messages area - Responsive */}
                <div className="mb-8 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] bg-black/50 rounded-xl p-4 sm:p-6 border border-white/10 overflow-y-auto scroll-smooth">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageSquare className="w-12 h-12 text-indonesian-gold/30 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">Memulai demo animasi...</p>
                        </div>
                      </div>
                    )}
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up mb-3 sm:mb-4`}>
                        <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm border ${message.type === 'user'
                            ? 'bg-gradient-to-br from-indonesian-gold/30 to-indonesian-gold/20 text-white border-indonesian-gold/40 rounded-tr-sm shadow-lg'
                            : 'bg-white/10 text-gray-200 border-white/10 rounded-tl-sm backdrop-blur-sm'
                          }`}>
                          {message.type === 'bot' && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-indonesian-gold/20 flex items-center justify-center">
                                <MessageSquare className="w-3 h-3 text-indonesian-gold" />
                              </div>
                              <span className="font-semibold text-indonesian-gold text-xs">AI Assistant</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {message.text === '...' ? (
                              <span className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </span>
                            ) : (
                              <>
                                {message.text}
                                {message.isTyping && <span className="inline-block w-0.5 h-4 bg-indonesian-gold ml-1 animate-pulse"></span>}
                              </>
                            )}
                          </p>
                          <span className="text-xs text-gray-500 mt-2 block">
                            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Input Area - Matches Chat Interface */}
                <div className="space-y-3">
                  {/* Mode Selector & Web Search Row */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Mode Selector Preview */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-xs font-medium">Balanced Mode</span>
                    </div>
                    {/* Web Search Preview */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-xs font-medium">Web Search ON</span>
                    </div>
                  </div>

                  {/* Simulated Image Upload Preview */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indonesian-gold/20 to-orange-500/20 border border-indonesian-gold/30 flex items-center justify-center overflow-hidden">
                        <svg className="w-6 h-6 text-indonesian-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">image_demo.png</span>
                  </div>

                  {/* Input Row */}
                  <div className="flex gap-2 sm:gap-3">
                    {/* Attachment Button */}
                    <button
                      className="p-2.5 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all"
                      disabled
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>

                    <input
                      type="text"
                      placeholder="Ask me anything... (Markdown supported)"
                      className="flex-1 bg-white/10 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-all"
                      disabled
                    />

                    {/* Send/Mic Button */}
                    <button
                      className="p-3 bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white rounded-xl disabled:opacity-50 transition-all"
                      disabled
                      aria-label="Send message (demo)"
                    >
                      <Send className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </OrnamentFrame>

            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indonesian-gold/5 to-transparent pointer-events-none -z-10 blur-xl" style={{
              boxShadow: "inset 0 0 60px rgba(217, 119, 6, 0.1)"
            }}></div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});
