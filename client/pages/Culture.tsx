import { memo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    BookOpen,
    Palette,
    Users,
    Map,
    FileSearch,
    Upload,
    Camera,
    X,
    ZoomIn,
    ZoomOut,
    Maximize2,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Save,
    Plane,
    BookMarked,
    Copy,
    Mail,
    MessageCircle,
    MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AppLayout, type SidebarItem } from "@/components/layout/AppLayout";

// MOCK DATA - Batik Pekalongan analysis result
const mockAnalysisResult = {
    title: "Batik Tulis Pekalongan",
    location: "Jawa Tengah, Indonesia",
    confidence: 85,
    summary: "Batik Tulis adalah teknik membuat motif kain dengan cara mencanting malam pada kain mori.",
    whatIsThis: "Batik Tulis adalah teknik membuat motif kain dengan cara mencanting malam pada kain mori. Batik Pekalongan terkenal dengan motif pesisir yang penuh warna cerah dan pengaruh multikultural dari perdagangan maritim.",
    whereFrom: {
        city: "Pekalongan, Jawa Tengah",
        description: "Wilayah pesisir utara Jawa, terkenal sebagai 'Kota Batik' dengan tradisi tekstil berusia ratusan tahun.",
    },
    howItsMade: [
        { step: 1, title: "Persiapan Kain", description: "Kain mori dicuci dan dikeringkan" },
        { step: 2, title: "Membuat Pola", description: "Pola digambar dengan pensil halus" },
        { step: 3, title: "Mencanting", description: "Malam panas dicanting mengikuti pola" },
        { step: 4, title: "Pewarnaan", description: "Kain dicelup dalam larutan warna" },
        { step: 5, title: "Melorod", description: "Malam dihilangkan dengan air mendidih" },
        { step: 6, title: "Finishing", description: "Kain dijemur dan disetrika" }
    ],
    meaning: {
        symbolism: "Motif megamendung melambangkan kesabaran dan keteduhan.",
        usage: "Dipakai dalam acara formal, pernikahan, dan upacara adat.",
        history: "Batik Pekalongan berkembang sejak abad 16-17 dengan pengaruh Arab, Tionghoa, dan Eropa."
    },
    markers: [
        { id: 1, x: 30, y: 25, label: "Motif Megamendung" },
        { id: 2, x: 60, y: 45, label: "Garis Kawung" },
        { id: 3, x: 45, y: 70, label: "Warna Indigo Natural" }
    ],
    relatedImages: [
        { id: "r1", title: "Batik Lainnya", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop" },
        { id: "r2", title: "Detail Motif", thumbnail: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=100&h=100&fit=crop" },
        { id: "r3", title: "Upacara Adat", thumbnail: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=100&h=100&fit=crop" },
    ]
};

type CultureCategory = "identify" | "story" | "craft" | "rituals" | "map" | "sources";
type AnalysisState = "idle" | "uploading" | "analyzing" | "complete" | "error";

const Culture = memo(function Culture() {
    const [category, setCategory] = useState<CultureCategory>("identify");
    const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("Mengunggah gambar...");
    const [showMapModal, setShowMapModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);
    const [zoomLevel, setZoomLevel] = useState(100);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sidebar items for Culture
    const sidebarItems: SidebarItem[] = [
        { id: "identify", label: "Identifikasi Budaya", icon: <Sparkles className="w-5 h-5" />, active: category === "identify" },
        { id: "story", label: "Cerita Budaya", icon: <BookOpen className="w-5 h-5" />, active: category === "story" },
        { id: "craft", label: "Kerajinan & Asal", icon: <Palette className="w-5 h-5" />, active: category === "craft" },
        { id: "rituals", label: "Ritual & Tradisi", icon: <Users className="w-5 h-5" />, active: category === "rituals" },
        { id: "map", label: "Peta Indonesia", icon: <Map className="w-5 h-5" />, active: category === "map" },
        { id: "sources", label: "Sumber & Referensi", icon: <FileSearch className="w-5 h-5" />, active: category === "sources" },
    ];

    const simulateAnalysis = useCallback(() => {
        setAnalysisState("uploading");
        setLoadingProgress(0);
        setLoadingText("Mengunggah gambar...");

        setTimeout(() => { setLoadingProgress(25); setLoadingText("Menganalisis motif..."); setAnalysisState("analyzing"); }, 1000);
        setTimeout(() => { setLoadingProgress(50); setLoadingText("Sedang menganalisis detail..."); }, 3000);
        setTimeout(() => { setLoadingProgress(75); setLoadingText("Hampir selesai..."); }, 5000);
        setTimeout(() => { setLoadingProgress(100); setAnalysisState("complete"); toast.success("Analisis selesai!"); }, 7000);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => { setUploadedImage(event.target?.result as string); simulateAnalysis(); };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => { setUploadedImage(event.target?.result as string); simulateAnalysis(); };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = (type: string) => {
        if (type === "copy") toast.success("Link disalin");
        else toast.info("Fitur akan datang");
        setShowShareModal(false);
    };

    const toggleCard = (cardId: string) => setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));

    return (
        <AppLayout
            title="Budaya"
            sidebarItems={sidebarItems}
            activeSidebarItem={category}
            onSidebarItemClick={(id) => setCategory(id as CultureCategory)}
        >
            <div className="min-h-full">
                {category === "identify" && (
                    <>
                        {/* Upload State */}
                        {analysisState === "idle" && (
                            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-8">
                                <div className="w-full max-w-2xl" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-6">
                                            <Sparkles className="w-10 h-10 text-[#C9A04F]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground mb-3">Identifikasi Budaya Indonesia</h2>
                                        <p className="text-muted-foreground">Tarik atau pilih gambar — hasil terbaik bila motif diambil dekat</p>
                                    </div>

                                    <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-[#C9A04F]/50 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 group-hover:text-[#C9A04F] transition-colors" />
                                        <p className="text-muted-foreground mb-4">Tarik file ke sini atau klik untuk memilih</p>
                                        <div className="flex items-center justify-center gap-3 flex-wrap">
                                            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-semibold">Pilih Gambar</button>
                                            <button className="px-6 py-3 rounded-xl border border-[#C9A04F] text-[#C9A04F] font-semibold flex items-center gap-2">
                                                <Camera className="w-5 h-5" />Gunakan Kamera
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center mt-4">Format: JPG, PNG (Max 10MB)</p>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                            </div>
                        )}

                        {/* Loading State */}
                        {(analysisState === "uploading" || analysisState === "analyzing") && uploadedImage && (
                            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-8">
                                <div className="w-full max-w-xl text-center">
                                    <div className="relative mb-8">
                                        <img src={uploadedImage} alt="Uploaded" className="max-h-80 mx-auto rounded-2xl opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-16 h-16 border-4 border-[#C9A04F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-foreground font-semibold">{loadingText}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                                        <motion.div className="bg-gradient-to-r from-[#C9A04F] to-[#B8860B] h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${loadingProgress}%` }} />
                                    </div>
                                    <p className="text-muted-foreground text-sm">{loadingProgress}%</p>
                                </div>
                            </div>
                        )}

                        {/* Complete - Result Layout */}
                        {analysisState === "complete" && uploadedImage && (
                            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
                                {/* Left: Image + Markers */}
                                <div className="lg:w-1/2 bg-black p-4 flex flex-col">
                                    <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[300px]">
                                        <img src={uploadedImage} alt="Analyzed" className="max-w-full max-h-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoomLevel / 100})` }} />
                                        {mockAnalysisResult.markers.map((marker) => (
                                            <div
                                                key={marker.id}
                                                className={cn("absolute w-8 h-8 rounded-full border-2 border-[#C9A04F] bg-black/50 flex items-center justify-center cursor-pointer transition-all hover:scale-110", hoveredMarker === marker.id && "scale-110 bg-[#C9A04F]/30")}
                                                style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: "translate(-50%, -50%)" }}
                                                onMouseEnter={() => setHoveredMarker(marker.id)}
                                                onMouseLeave={() => setHoveredMarker(null)}
                                            >
                                                <span className="text-white text-xs font-bold">{marker.id}</span>
                                                <AnimatePresence>
                                                    {hoveredMarker === marker.id && (
                                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card text-foreground text-xs rounded-lg whitespace-nowrap z-10">
                                                            {marker.label}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-4">
                                        <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} className="p-2 rounded-lg bg-secondary text-foreground"><ZoomOut className="w-4 h-4" /></button>
                                        <span className="text-foreground text-sm px-2">{zoomLevel}%</span>
                                        <button onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))} className="p-2 rounded-lg bg-secondary text-foreground"><ZoomIn className="w-4 h-4" /></button>
                                        <button onClick={() => setZoomLevel(100)} className="p-2 rounded-lg bg-secondary text-foreground"><Maximize2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                {/* Right: Result Cards */}
                                <div className="lg:w-1/2 overflow-y-auto p-6 space-y-4">
                                    {/* Card 1: Summary */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">🏛️ RINGKASAN</div>
                                        <h3 className="text-xl font-bold text-foreground">{mockAnalysisResult.title}</h3>
                                        <p className="text-[#C9A04F] text-sm mt-1">{mockAnalysisResult.location}</p>
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1"><span>Confidence</span><span className="text-[#C9A04F]">{mockAnalysisResult.confidence}%</span></div>
                                            <div className="w-full bg-secondary rounded-full h-2"><div className="bg-gradient-to-r from-[#C9A04F] to-[#B8860B] h-2 rounded-full" style={{ width: `${mockAnalysisResult.confidence}%` }} /></div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <span className="text-xs text-muted-foreground">Hasil akurat?</span>
                                            <button onClick={() => { setFeedbackGiven("up"); toast.success("Terima kasih!"); }} className={cn("p-2 rounded-lg", feedbackGiven === "up" ? "bg-green-500/20 text-green-400" : "hover:bg-secondary text-muted-foreground")}><ThumbsUp className="w-4 h-4" /></button>
                                            <button onClick={() => { setFeedbackGiven("down"); }} className={cn("p-2 rounded-lg", feedbackGiven === "down" ? "bg-red-500/20 text-red-400" : "hover:bg-secondary text-muted-foreground")}><ThumbsDown className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    {/* Card 2: What Is This */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">🔍 APA INI?</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{expandedCards.whatIsThis ? mockAnalysisResult.whatIsThis : mockAnalysisResult.summary}</p>
                                        <button onClick={() => toggleCard("whatIsThis")} className="mt-3 text-[#C9A04F] text-sm hover:underline">{expandedCards.whatIsThis ? "Sembunyikan" : "Tampilkan Detail →"}</button>
                                    </div>

                                    {/* Card 3: Where From */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">📍 DARI MANA?</div>
                                        <div className="bg-secondary rounded-lg h-32 mb-3 flex items-center justify-center cursor-pointer hover:bg-secondary/80" onClick={() => setShowMapModal(true)}>
                                            <div className="text-center"><MapPin className="w-8 h-8 text-[#C9A04F] mx-auto mb-2" /><p className="text-xs text-muted-foreground">Klik untuk buka peta</p></div>
                                        </div>
                                        <p className="text-foreground font-semibold">{mockAnalysisResult.whereFrom.city}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{mockAnalysisResult.whereFrom.description}</p>
                                    </div>

                                    {/* Card 4: How Made */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">🎨 CARA PEMBUATAN</div>
                                        <div className="space-y-3">
                                            {mockAnalysisResult.howItsMade.map((step) => (
                                                <div key={step.step} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-[#C9A04F] flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">{step.step}</span></div>
                                                    <div><p className="text-foreground text-sm font-medium">{step.title}</p><p className="text-muted-foreground text-xs">{step.description}</p></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card 5: Meaning */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">📜 MAKNA & KONTEKS</div>
                                        <div className="space-y-4 text-sm">
                                            <div><p className="text-foreground font-medium mb-1">Symbolism:</p><p className="text-muted-foreground">{mockAnalysisResult.meaning.symbolism}</p></div>
                                            <div><p className="text-foreground font-medium mb-1">Usage:</p><p className="text-muted-foreground">{mockAnalysisResult.meaning.usage}</p></div>
                                            <div><p className="text-foreground font-medium mb-1">History:</p><p className="text-muted-foreground">{mockAnalysisResult.meaning.history}</p></div>
                                        </div>
                                    </div>

                                    {/* Card 6: Related Images */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">🖼️ GAMBAR TERKAIT</div>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {mockAnalysisResult.relatedImages.map((img) => (
                                                <div key={img.id} className="flex-shrink-0 cursor-pointer group">
                                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary"><img src={img.thumbnail} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                                                    <p className="text-[10px] text-muted-foreground mt-1 w-24 truncate">{img.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card 7: Actions */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">⚡ AKSI</div>
                                        <div className="space-y-3">
                                            <button onClick={() => toast.success("Disimpan ke Library")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-medium"><Save className="w-5 h-5" />Simpan ke Library</button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#C9A04F] text-[#C9A04F] hover:bg-[#C9A04F]/10"><BookMarked className="w-5 h-5" />Buat Cerita Panjang</button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#C9A04F] text-[#C9A04F] hover:bg-[#C9A04F]/10"><Plane className="w-5 h-5" />Buat Tourism Kit</button>
                                            <button onClick={() => setShowShareModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#C9A04F] text-[#C9A04F] hover:bg-[#C9A04F]/10"><Share2 className="w-5 h-5" />Bagikan</button>
                                        </div>
                                    </div>

                                    <button onClick={() => { setAnalysisState("idle"); setUploadedImage(null); }} className="w-full py-3 text-muted-foreground hover:text-foreground">Analisis Gambar Lain</button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Other categories - Placeholder */}
                {category !== "identify" && (
                    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                                {category === "story" && <BookOpen className="w-10 h-10 text-muted-foreground" />}
                                {category === "craft" && <Palette className="w-10 h-10 text-muted-foreground" />}
                                {category === "rituals" && <Users className="w-10 h-10 text-muted-foreground" />}
                                {category === "map" && <Map className="w-10 h-10 text-muted-foreground" />}
                                {category === "sources" && <FileSearch className="w-10 h-10 text-muted-foreground" />}
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">{sidebarItems.find(i => i.id === category)?.label}</h2>
                            <p className="text-muted-foreground">Fitur ini akan segera hadir</p>
                        </div>
                    </div>
                )}

                {/* Map Modal */}
                <AnimatePresence>
                    {showMapModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMapModal(false)} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-2xl overflow-hidden max-w-4xl w-full">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h3 className="text-lg font-semibold text-foreground">PETA INDONESIA</h3>
                                    <button onClick={() => setShowMapModal(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-8">
                                    <div className="bg-secondary rounded-xl h-96 flex items-center justify-center relative">
                                        <p className="text-muted-foreground">🗺️ Peta Interaktif Indonesia</p>
                                        <div className="absolute" style={{ left: "60%", top: "55%" }}>
                                            <div className="w-8 h-8 rounded-full bg-[#C9A04F] flex items-center justify-center animate-pulse"><MapPin className="w-5 h-5 text-white" /></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Share Modal */}
                <AnimatePresence>
                    {showShareModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShareModal(false)} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-2xl overflow-hidden w-80">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h3 className="text-lg font-semibold text-foreground">Bagikan</h3>
                                    <button onClick={() => setShowShareModal(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-4 space-y-2">
                                    <button onClick={() => handleShare("copy")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary text-foreground"><Copy className="w-5 h-5" />Salin Link</button>
                                    <button onClick={() => handleShare("email")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary text-foreground"><Mail className="w-5 h-5" />Email</button>
                                    <button onClick={() => handleShare("whatsapp")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary text-foreground"><MessageCircle className="w-5 h-5" />WhatsApp</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
});

export default Culture;
