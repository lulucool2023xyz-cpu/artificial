import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Download,
    Smartphone,
    ArrowLeft,
    Sparkles,
    MessageSquare,
    Image,
    Video,
    Music,
    Mic,
    Shield,
    Zap,
    Globe,
    CheckCircle2
} from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { cn } from "@/lib/utils";

const FEATURES = [
    { icon: MessageSquare, title: "AI Chat", desc: "Percakapan cerdas dengan AI" },
    { icon: Image, title: "Generasi Gambar", desc: "Buat gambar dari teks" },
    { icon: Video, title: "Generasi Video", desc: "Buat video dari prompt" },
    { icon: Music, title: "Generasi Musik", desc: "Komposisi musik AI" },
    { icon: Mic, title: "Text-to-Speech", desc: "Konversi teks ke suara" },
    { icon: Globe, title: "Budaya Indonesia", desc: "Jelajahi budaya Nusantara" }
];

const BENEFITS = [
    "Akses offline untuk chat tersimpan",
    "Notifikasi real-time",
    "Optimisasi baterai",
    "Integrasi keyboard",
    "Dark mode otomatis",
    "Sinkronisasi multi-device"
];

const DownloadPage = memo(function DownloadPage() {
    const handleDownload = () => {
        // Trigger APK download
        window.open("/aplikasi/app-release.apk", "_blank");
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-background text-foreground">
                <NavigationBar />

                <main className="pt-20 pb-12">
                    <BackgroundGrid opacity="opacity-[0.02]" size="100px" />

                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-16 sm:py-24">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Left Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center lg:text-left"
                                >
                                    <Link
                                        to="/"
                                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Kembali ke Beranda
                                    </Link>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-sm font-medium mb-6">
                                        <Sparkles className="w-4 h-4" />
                                        Android App v1.0
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading mb-6">
                                        <span className="text-[#FFD700]">OrenaX</span>
                                        <br />
                                        <span className="text-foreground">Mobile App</span>
                                    </h1>

                                    <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                                        Akses semua fitur AI canggih langsung dari smartphone Anda.
                                        Chat, buat gambar, video, dan musik kapan saja, di mana saja.
                                    </p>

                                    {/* Download Button */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                        <motion.button
                                            onClick={handleDownload}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "flex items-center justify-center gap-3 px-8 py-4 rounded-2xl",
                                                "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-lg",
                                                "shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40",
                                                "transition-all duration-300"
                                            )}
                                        >
                                            <Download className="w-6 h-6" />
                                            Download APK
                                        </motion.button>

                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4" />
                                            <span>Verified & Secure</span>
                                        </div>
                                    </div>

                                    {/* App Info */}
                                    <div className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#FFD700]" />
                                            <span>Size: ~45 MB</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="w-4 h-4 text-[#FFD700]" />
                                            <span>Android 8.0+</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right - Phone Mockup */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="relative flex justify-center"
                                >
                                    <div className="relative">
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-[#FFD700]/20 blur-3xl rounded-full scale-75" />

                                        {/* Phone Frame */}
                                        <div className="relative w-64 sm:w-72 aspect-[9/19] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border border-gray-700">
                                            {/* Screen */}
                                            <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden border border-border">
                                                {/* Status Bar */}
                                                <div className="h-8 bg-card flex items-center justify-center">
                                                    <div className="w-20 h-5 bg-black rounded-full" />
                                                </div>

                                                {/* App Preview */}
                                                <div className="p-4 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                                                            <Sparkles className="w-5 h-5 text-black" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-[#FFD700]">OrenaX</div>
                                                            <div className="text-xs text-muted-foreground">AI Assistant</div>
                                                        </div>
                                                    </div>

                                                    {/* Chat Bubbles */}
                                                    <div className="space-y-3">
                                                        <div className="bg-secondary rounded-2xl rounded-tl-sm p-3 text-xs text-foreground max-w-[80%]">
                                                            Halo! Ada yang bisa saya bantu?
                                                        </div>
                                                        <div className="bg-[#FFD700]/20 rounded-2xl rounded-tr-sm p-3 text-xs text-foreground max-w-[80%] ml-auto">
                                                            Buatkan gambar sunset
                                                        </div>
                                                        <div className="bg-secondary rounded-2xl rounded-tl-sm p-3 text-xs text-foreground max-w-[80%]">
                                                            ✨ Generating image...
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="py-16 bg-card/50">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl font-bold font-heading mb-4">
                                    Semua Fitur dalam Genggaman
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Nikmati pengalaman AI lengkap di smartphone Anda
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {FEATURES.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-card border border-border rounded-2xl p-5 hover:border-[#FFD700]/50 hover:shadow-lg transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <feature.icon className="w-6 h-6 text-[#FFD700]" />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Benefits */}
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5 border border-[#FFD700]/20 rounded-3xl p-8 sm:p-12"
                            >
                                <h3 className="text-2xl font-bold text-center mb-8">
                                    Keuntungan Mobile App
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {BENEFITS.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                                            <span className="text-foreground">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <motion.button
                                        onClick={handleDownload}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:shadow-lg transition-all"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Sekarang
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* iOS Coming Soon */}
                    <section className="py-12">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-muted-foreground text-sm mb-4">
                                🍎 iOS Version Coming Soon
                            </div>
                            <p className="text-muted-foreground">
                                Versi iOS sedang dalam pengembangan. Daftarkan email Anda untuk mendapatkan notifikasi saat tersedia.
                            </p>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
});

export default DownloadPage;
