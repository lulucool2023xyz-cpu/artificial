import { memo, useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    HelpCircle,
    Search,
    ChevronDown,
    Mail,
    MessageSquare,
    FileText,
    ExternalLink,
    Sparkles,
    CreditCard,
    Settings,
    Shield,
    Zap
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { cn } from "@/lib/utils";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        category: "Umum",
        question: "Apa itu OrenaX?",
        answer: "OrenaX adalah platform AI canggih yang menyediakan berbagai fitur seperti chat AI, generasi gambar, video, musik, dan text-to-speech. Platform ini dirancang khusus untuk pengguna Indonesia dengan dukungan bahasa lokal."
    },
    {
        category: "Umum",
        question: "Bagaimana cara memulai menggunakan OrenaX?",
        answer: "Cukup daftar akun gratis, lalu Anda bisa langsung menggunakan fitur chat AI. Untuk fitur premium seperti generasi gambar dan video, Anda bisa upgrade ke paket berbayar."
    },
    {
        category: "Akun",
        question: "Bagaimana cara mengganti password?",
        answer: "Buka Settings > Security > Change Password. Masukkan password lama dan password baru Anda. Pastikan password baru minimal 8 karakter dengan kombinasi huruf dan angka."
    },
    {
        category: "Akun",
        question: "Bagaimana cara menghapus akun?",
        answer: "Untuk menghapus akun, hubungi tim support kami melalui email support@orenax.com. Proses penghapusan akan memakan waktu 7-14 hari kerja."
    },
    {
        category: "Langganan",
        question: "Apa saja paket berlangganan yang tersedia?",
        answer: "Kami menyediakan 3 paket: Free (gratis dengan fitur terbatas), Pro (Rp 99.000/bulan dengan akses penuh ke chat dan generasi gambar), dan Ultra (Rp 299.000/bulan dengan semua fitur termasuk video dan musik)."
    },
    {
        category: "Langganan",
        question: "Bagaimana cara upgrade atau downgrade paket?",
        answer: "Buka Settings > Subscription dan pilih paket yang diinginkan. Perubahan akan berlaku pada periode billing berikutnya."
    },
    {
        category: "Teknis",
        question: "Mengapa AI tidak merespons?",
        answer: "Pastikan koneksi internet stabil. Jika masalah berlanjut, coba refresh halaman atau clear cache browser. Anda juga bisa cek status layanan di halaman Status."
    },
    {
        category: "Teknis",
        question: "Format file apa yang didukung untuk upload?",
        answer: "Untuk gambar: JPG, PNG, WebP (maks 10MB). Untuk dokumen: PDF, TXT, DOCX (maks 25MB). Untuk audio: MP3, WAV (maks 50MB)."
    }
];

const CATEGORIES = ["Semua", "Umum", "Akun", "Langganan", "Teknis"];

const ChatHelp = memo(function ChatHelp() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const filteredFAQ = useMemo(() => {
        return FAQ_DATA.filter(item => {
            const matchesSearch = searchQuery === "" ||
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const toggleExpand = useCallback((index: number) => {
        setExpandedIndex(prev => prev === index ? null : index);
    }, []);

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
                    <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                            aria-label="Kembali"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-[#FFD700]" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">Bantuan</h1>
                                <p className="text-xs text-muted-foreground">Help Center</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari pertanyaan..."
                            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all"
                        />
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                        {[
                            { icon: MessageSquare, label: "Live Chat", href: "/resources/support", color: "from-blue-500/20 to-blue-600/10" },
                            { icon: FileText, label: "Dokumentasi", href: "/resources/documentation", color: "from-green-500/20 to-green-600/10" },
                            { icon: Mail, label: "Email", href: "mailto:support@orenax.com", color: "from-purple-500/20 to-purple-600/10" },
                            { icon: Zap, label: "Status", href: "/resources/status", color: "from-orange-500/20 to-orange-600/10" }
                        ].map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card",
                                    "hover:border-[#FFD700]/50 hover:shadow-lg transition-all group"
                                )}
                            >
                                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", item.color)}>
                                    <item.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                    >
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                    selectedCategory === cat
                                        ? "bg-[#FFD700] text-black"
                                        : "bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#FFD700]" />
                            Pertanyaan Umum
                        </h2>

                        {filteredFAQ.length === 0 ? (
                            <div className="text-center py-12">
                                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Tidak ada hasil ditemukan</p>
                                <p className="text-sm text-muted-foreground mt-1">Coba kata kunci lain atau hubungi support</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredFAQ.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="bg-card border border-border rounded-2xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleExpand(index)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                                                    {item.category === "Umum" && <Sparkles className="w-4 h-4 text-[#FFD700]" />}
                                                    {item.category === "Akun" && <Settings className="w-4 h-4 text-blue-400" />}
                                                    {item.category === "Langganan" && <CreditCard className="w-4 h-4 text-green-400" />}
                                                    {item.category === "Teknis" && <Shield className="w-4 h-4 text-purple-400" />}
                                                </div>
                                                <span className="font-medium text-foreground">{item.question}</span>
                                            </div>
                                            <ChevronDown className={cn(
                                                "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ml-2",
                                                expandedIndex === index && "rotate-180"
                                            )} />
                                        </button>
                                        <AnimatePresence>
                                            {expandedIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 pt-0">
                                                        <p className="text-muted-foreground text-sm leading-relaxed pl-11">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Contact Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5 border border-[#FFD700]/20 rounded-2xl p-6"
                    >
                        <h3 className="font-semibold text-foreground mb-2">Masih butuh bantuan?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Tim support kami siap membantu 24/7. Hubungi kami melalui email atau live chat.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="mailto:support@orenax.com"
                                className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-xl font-medium hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                Email Support
                            </a>
                            <Link
                                to="/resources/support"
                                className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Support Center
                            </Link>
                        </div>
                    </motion.div>
                </main>
            </div>
        </PageTransition>
    );
});

export default ChatHelp;
