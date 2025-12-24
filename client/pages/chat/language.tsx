import { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Check, Languages, Smartphone, RefreshCw } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    description: string;
}

const LANGUAGES: Language[] = [
    {
        code: "id",
        name: "Indonesian",
        nativeName: "Bahasa Indonesia",
        flag: "🇮🇩",
        description: "Bahasa utama aplikasi"
    },
    {
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇬🇧",
        description: "International language"
    }
];

const ChatLanguage = memo(function ChatLanguage() {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState<string>("id");
    const [autoDetect, setAutoDetect] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Load saved language preference
    useEffect(() => {
        const savedLang = localStorage.getItem("preferredLanguage") || "id";
        const savedAutoDetect = localStorage.getItem("autoDetectLanguage") === "true";
        setSelectedLanguage(savedLang);
        setAutoDetect(savedAutoDetect);
    }, []);

    const handleLanguageSelect = useCallback((langCode: string) => {
        setSelectedLanguage(langCode);
        setAutoDetect(false);
    }, []);

    const handleAutoDetectToggle = useCallback(() => {
        setAutoDetect(prev => !prev);
    }, []);

    const handleSave = useCallback(async () => {
        setIsSaving(true);

        // Simulate save delay
        await new Promise(resolve => setTimeout(resolve, 500));

        localStorage.setItem("preferredLanguage", selectedLanguage);
        localStorage.setItem("autoDetectLanguage", String(autoDetect));

        const lang = LANGUAGES.find(l => l.code === selectedLanguage);
        toast.success(`Bahasa diubah ke ${lang?.nativeName || selectedLanguage}`, {
            description: "Beberapa perubahan mungkin memerlukan refresh halaman"
        });

        setIsSaving(false);
    }, [selectedLanguage, autoDetect]);

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
                                <Globe className="w-5 h-5 text-[#FFD700]" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">Bahasa</h1>
                                <p className="text-xs text-muted-foreground">Language Settings</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
                    {/* Auto Detect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                                    <Smartphone className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Deteksi Otomatis</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Gunakan bahasa dari pengaturan perangkat
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleAutoDetectToggle}
                                className={cn(
                                    "relative w-14 h-8 rounded-full transition-colors",
                                    autoDetect ? "bg-[#FFD700]" : "bg-secondary"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform",
                                    autoDetect ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Language Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 px-1">
                            <Languages className="w-4 h-4 text-muted-foreground" />
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Pilih Bahasa
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {LANGUAGES.map((lang, index) => (
                                <motion.button
                                    key={lang.code}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    onClick={() => handleLanguageSelect(lang.code)}
                                    disabled={autoDetect}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                        autoDetect && "opacity-50 cursor-not-allowed",
                                        selectedLanguage === lang.code && !autoDetect
                                            ? "border-[#FFD700] bg-[#FFD700]/10 shadow-lg shadow-[#FFD700]/10"
                                            : "border-border bg-card hover:border-[#FFD700]/50 hover:bg-card/80"
                                    )}
                                >
                                    <div className="text-4xl">{lang.flag}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-foreground">{lang.nativeName}</h3>
                                            {selectedLanguage === lang.code && !autoDetect && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-[#FFD700]/20 text-[#FFD700] font-medium">
                                                    Aktif
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{lang.description}</p>
                                    </div>
                                    {selectedLanguage === lang.code && !autoDetect && (
                                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center">
                                            <Check className="w-5 h-5 text-black" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-secondary/30 border border-border rounded-2xl p-4"
                    >
                        <div className="flex items-start gap-3">
                            <RefreshCw className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Perubahan bahasa akan diterapkan pada antarmuka aplikasi. Beberapa konten
                                    mungkin tetap dalam bahasa aslinya.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "w-full py-4 rounded-2xl font-semibold text-lg transition-all",
                            "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black",
                            "hover:shadow-lg hover:shadow-[#FFD700]/30",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </motion.button>
                </main>
            </div>
        </PageTransition>
    );
});

export default ChatLanguage;
