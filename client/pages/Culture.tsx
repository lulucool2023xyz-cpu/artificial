import { memo, useState, useCallback, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    MapPin,
    FolderOpen,
    Plus,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { cultureApi } from "@/lib/api";
import { AppLayout, type SidebarItem } from "@/components/layout/AppLayout";
import IndonesiaMap from "@/components/ui/IndonesiaMap";

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

type CultureCategory = "identify" | "story" | "craft" | "rituals" | "map" | "sources" | "projects";
type AnalysisState = "idle" | "uploading" | "analyzing" | "complete" | "error";

// Mock AI responses for culture content
const mockAIResponses: Record<string, string> = {
    "roro jonggrang": `**Legenda Roro Jonggrang** adalah kisah cinta tragis dari Jawa Tengah.

Dikisahkan, Bandung Bondowoso jatuh cinta pada Roro Jonggrang, putri Raja Boko yang telah ia kalahkan. Roro Jonggrang tidak ingin menikah dengannya, maka ia memberi syarat: Bandung harus membangun 1000 candi dalam semalam.

Dengan bantuan jin, Bandung hampir berhasil. Namun Roro Jonggrang menyuruh para gadis desa menumbuk padi dan menyalakan api agar jin mengira fajar telah tiba. Jin-jin pun pergi, dan candi hanya terbangun 999.

Marah besar, Bandung mengutuk Roro Jonggrang menjadi batu—menjadi arca Dewi Durga di Candi Prambanan.

**Pelajaran**: Kesombongan dan tipu daya dapat membawa akibat yang buruk.`,

    "malin kundang": `**Malin Kundang** adalah legenda dari Sumatera Barat tentang anak durhaka.

Malin adalah anak miskin yang pergi merantau mencari kehidupan lebih baik. Setelah menjadi kaya dan menikahi putri bangsawan, ia kembali ke kampung halamannya dengan kapal besar.

Ibunya yang telah lama menunggu, berlari ke pelabuhan untuk memeluknya. Namun Malin malu mengakui ibunya yang miskin dan renta. Ia mengusir ibunya di hadapan istrinya.

Hati sang ibu hancur. Ia berdoa: "Ya Tuhan, jika memang ia anakku Malin Kundang, kutuklah ia menjadi batu!"

Tiba-tiba badai datang, kapal Malin hancur, dan ia berubah menjadi batu di pantai Air Manis.

**Pelajaran**: Hormati orang tua, jangan lupakan asal-usul.`,

    "batik": `**Batik** adalah seni tradisional Indonesia yang telah diakui UNESCO sebagai Warisan Budaya Takbenda Kemanusiaan sejak 2009.

**Teknik Pembuatan:**
1. **Batik Tulis** - Menggunakan canting untuk menggambar motif dengan lilin panas
2. **Batik Cap** - Menggunakan cap tembaga untuk mencetak motif
3. **Batik Printing** - Teknik cetak modern

**Motif Populer:**
- **Parang** - Melambangkan kekuatan dan keberanian
- **Kawung** - Melambangkan kesucian dan keadilan
- **Mega Mendung** - Khas Cirebon, melambangkan kesabaran
- **Truntum** - Melambangkan cinta yang tumbuh kembali

**Filosofi:**
Setiap motif batik memiliki makna mendalam. Warna, pola, dan simbol semuanya mengandung pesan tentang kehidupan, alam, dan spiritualitas.`,

    "wayang": `**Wayang Kulit** adalah seni pertunjukan tradisional menggunakan boneka kulit yang diproyeksikan ke layar.

**Sejarah:**
Wayang sudah ada sejak abad ke-9. Awalnya digunakan untuk upacara keagamaan dan penghormatan arwah leluhur.

**Jenis Wayang:**
- **Wayang Kulit Purwa** - Lakon Ramayana & Mahabharata
- **Wayang Golek** - Boneka kayu 3D dari Jawa Barat
- **Wayang Orang** - Dimainkan oleh manusia
- **Wayang Suket** - Dari rumput, untuk anak-anak

**Tokoh Penting:**
- **Semar** - Punakawan bijaksana
- **Gatotkaca** - Ksatria perkasa
- **Arjuna** - Ksatria tampan dan ahli panah

**Pertunjukan:**
Dalang memainkan puluhan wayang, menyanyikan tembang, dan bercerita sepanjang malam, diiringi gamelan.`,
};

// Generate mock AI response based on query
const generateMockAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    for (const [key, response] of Object.entries(mockAIResponses)) {
        if (lowerQuery.includes(key)) {
            return response;
        }
    }

    // Default response if no match found
    return `Terima kasih atas pertanyaan Anda tentang "${query}".

**Informasi Budaya Indonesia:**

Indonesia memiliki lebih dari 300 kelompok etnis dengan ribuan tradisi, bahasa, dan kesenian yang unik. Setiap daerah memiliki kekayaan budaya tersendiri yang diwariskan turun-temurun.

Untuk informasi lebih spesifik, silakan tanyakan tentang:
- **Cerita Rakyat**: Roro Jonggrang, Malin Kundang, Sangkuriang, dll.
- **Kerajinan**: Batik, Wayang, Songket, Tenun Ikat, dll.
- **Tarian**: Kecak, Pendet, Saman, Jaipong, dll.
- **Upacara Adat**: Ngaben, Sekaten, Kasada, dll.

*Ketik nama budaya atau tradisi untuk mendapatkan informasi lengkap.*`;
};

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
    const [analysisResult, setAnalysisResult] = useState<{
        title: string;
        location: string;
        confidence: number;
        summary: string;
        whatIsThis: string;
        whereFrom: { city: string; description: string };
        howItsMade: Array<{ step: number; title: string; description: string }>;
        meaning: { symbolism: string; usage: string; history: string };
    } | null>(null);
    const [provinceInfo, setProvinceInfo] = useState<string | null>(null);
    const [mapLoading, setMapLoading] = useState(false);

    // AI Chat states for story/craft sections
    const [storyQuery, setStoryQuery] = useState("");
    const [storyResponse, setStoryResponse] = useState<string | null>(null);
    const [storyLoading, setStoryLoading] = useState(false);
    const [craftQuery, setCraftQuery] = useState("");
    const [craftResponse, setCraftResponse] = useState<string | null>(null);
    const [craftLoading, setCraftLoading] = useState(false);
    const [selectedStory, setSelectedStory] = useState<string | null>(null);
    const [selectedCraft, setSelectedCraft] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle AI query for story - using real Gemini API
    const handleStoryQuery = useCallback(async (query: string) => {
        setStoryLoading(true);
        setStoryResponse(null);

        try {
            const result = await cultureApi.getCultureInfo({
                query,
                type: 'story',
                includeThinking: false,
                enableSearch: true,
            });
            setStoryResponse(result.content);
        } catch (error) {
            console.error('Story query error:', error);
            toast.error('Gagal mengambil informasi. Silakan coba lagi.');
            setStoryResponse(null);
        } finally {
            setStoryLoading(false);
        }
    }, []);

    // Handle AI query for craft - using real Gemini API
    const handleCraftQuery = useCallback(async (query: string) => {
        setCraftLoading(true);
        setCraftResponse(null);

        try {
            const result = await cultureApi.getCultureInfo({
                query,
                type: 'craft',
                includeThinking: false,
                enableSearch: true,
            });
            setCraftResponse(result.content);
        } catch (error) {
            console.error('Craft query error:', error);
            toast.error('Gagal mengambil informasi. Silakan coba lagi.');
            setCraftResponse(null);
        } finally {
            setCraftLoading(false);
        }
    }, []);

    // Sidebar items for Culture
    const sidebarItems: SidebarItem[] = [
        { id: "identify", label: "Identifikasi Budaya", icon: <Sparkles className="w-5 h-5" />, active: category === "identify" },
        { id: "story", label: "Cerita Budaya", icon: <BookOpen className="w-5 h-5" />, active: category === "story" },
        { id: "craft", label: "Kerajinan & Asal", icon: <Palette className="w-5 h-5" />, active: category === "craft" },
        { id: "rituals", label: "Ritual & Tradisi", icon: <Users className="w-5 h-5" />, active: category === "rituals" },
        { id: "map", label: "Peta Indonesia", icon: <Map className="w-5 h-5" />, active: category === "map" },
        { id: "sources", label: "Sumber & Referensi", icon: <FileSearch className="w-5 h-5" />, active: category === "sources" },
        { id: "projects", label: "My Projects", icon: <FolderOpen className="w-5 h-5" />, active: category === "projects", badge: "5" },
    ];

    // Real image analysis using Gemini Vision API
    const analyzeImage = useCallback(async (imageBase64: string) => {
        setAnalysisState("uploading");
        setLoadingProgress(0);
        setLoadingText("Mengunggah gambar...");
        setAnalysisResult(null);

        try {
            setLoadingProgress(25);
            setLoadingText("Menganalisis gambar dengan AI...");
            setAnalysisState("analyzing");

            // Get MIME type from base64
            const mimeMatch = imageBase64.match(/data:(image\/\w+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

            setLoadingProgress(50);
            setLoadingText("Mengidentifikasi warisan budaya...");

            const result = await cultureApi.analyzeImage(imageBase64, mimeType);

            setLoadingProgress(100);
            setAnalysisResult(result);
            setAnalysisState("complete");
            toast.success("Analisis selesai!");
        } catch (error) {
            console.error('Image analysis error:', error);
            toast.error('Gagal menganalisis gambar. Silakan coba lagi.');
            setAnalysisState("error");
        }
    }, []);

    // Handle province click on map - get AI info
    const handleProvinceClick = useCallback(async (provinceName: string) => {
        setMapLoading(true);
        setProvinceInfo(null);

        try {
            const result = await cultureApi.getProvinceInfo(provinceName);
            setProvinceInfo(result.content);
        } catch (error) {
            console.error('Province info error:', error);
            toast.error('Gagal mengambil informasi provinsi.');
        } finally {
            setMapLoading(false);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                setUploadedImage(imageData);
                analyzeImage(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                setUploadedImage(imageData);
                analyzeImage(imageData);
            };
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
            showNewButton
            newButtonLabel="New Project"
            onNewButtonClick={() => toast.info("Buat proyek budaya baru")}
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
                        {analysisState === "complete" && uploadedImage && analysisResult && (
                            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
                                {/* Left: Image */}
                                <div className="lg:w-1/2 bg-black p-4 flex flex-col">
                                    <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[300px]">
                                        <img src={uploadedImage} alt="Analyzed" className="max-w-full max-h-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoomLevel / 100})` }} />
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
                                        <h3 className="text-xl font-bold text-foreground">{analysisResult.title}</h3>
                                        <p className="text-[#C9A04F] text-sm mt-1">{analysisResult.location}</p>
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1"><span>Confidence</span><span className="text-[#C9A04F]">{analysisResult.confidence}%</span></div>
                                            <div className="w-full bg-secondary rounded-full h-2"><div className="bg-gradient-to-r from-[#C9A04F] to-[#B8860B] h-2 rounded-full" style={{ width: `${analysisResult.confidence}%` }} /></div>
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
                                        <p className="text-sm text-muted-foreground leading-relaxed">{expandedCards.whatIsThis ? analysisResult.whatIsThis : analysisResult.summary}</p>
                                        <button onClick={() => toggleCard("whatIsThis")} className="mt-3 text-[#C9A04F] text-sm hover:underline">{expandedCards.whatIsThis ? "Sembunyikan" : "Tampilkan Detail →"}</button>
                                    </div>

                                    {/* Card 3: Where From */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">📍 DARI MANA?</div>
                                        <div className="bg-secondary rounded-lg h-32 mb-3 flex items-center justify-center cursor-pointer hover:bg-secondary/80" onClick={() => setShowMapModal(true)}>
                                            <div className="text-center"><MapPin className="w-8 h-8 text-[#C9A04F] mx-auto mb-2" /><p className="text-xs text-muted-foreground">Klik untuk buka peta</p></div>
                                        </div>
                                        <p className="text-foreground font-semibold">{analysisResult.whereFrom.city}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{analysisResult.whereFrom.description}</p>
                                    </div>

                                    {/* Card 4: How Made */}
                                    <div className="bg-card border border-border rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3">🎨 CARA PEMBUATAN</div>
                                        <div className="space-y-3">
                                            {analysisResult.howItsMade.map((step) => (
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
                                            <div><p className="text-foreground font-medium mb-1">Symbolism:</p><p className="text-muted-foreground">{analysisResult.meaning.symbolism}</p></div>
                                            <div><p className="text-foreground font-medium mb-1">Usage:</p><p className="text-muted-foreground">{analysisResult.meaning.usage}</p></div>
                                            <div><p className="text-foreground font-medium mb-1">History:</p><p className="text-muted-foreground">{analysisResult.meaning.history}</p></div>
                                        </div>
                                    </div>

                                    {/* Card 6: Actions */}
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

                {/* STORY - Cerita Budaya */}
                {category === "story" && (
                    <div className="p-6 space-y-6 max-w-5xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-[#C9A04F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Cerita Budaya Indonesia</h2>
                            <p className="text-muted-foreground">Tanyakan AI tentang legenda dan cerita rakyat Nusantara</p>
                        </div>

                        {/* AI Chat Input */}
                        <div className="bg-card border border-border rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-[#C9A04F]" />
                                <input
                                    type="text"
                                    placeholder="Tanyakan cerita... (cth: Roro Jonggrang, Malin Kundang)"
                                    value={storyQuery}
                                    onChange={(e) => setStoryQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && storyQuery.trim()) {
                                            handleStoryQuery(storyQuery);
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    onClick={() => storyQuery.trim() && handleStoryQuery(storyQuery)}
                                    disabled={storyLoading || !storyQuery.trim()}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {storyLoading ? "..." : "Tanya AI"}
                                </button>
                            </div>
                        </div>

                        {/* AI Response */}
                        {storyLoading && (
                            <div className="bg-card border border-[#C9A04F]/30 rounded-xl p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#C9A04F]/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-[#C9A04F] animate-spin" />
                                    </div>
                                    <span className="text-[#C9A04F] font-medium">AI sedang berpikir...</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-secondary rounded w-full" />
                                    <div className="h-4 bg-secondary rounded w-3/4" />
                                    <div className="h-4 bg-secondary rounded w-5/6" />
                                </div>
                            </div>
                        )}

                        {storyResponse && !storyLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-[#C9A04F]/30 rounded-xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#C9A04F]/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-[#C9A04F]" />
                                    </div>
                                    <span className="text-[#C9A04F] font-medium">AI Culture Assistant</span>
                                </div>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {storyResponse}
                                    </ReactMarkdown>
                                </div>
                                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
                                    <button onClick={() => { setStoryResponse(null); setStoryQuery(""); }} className="text-sm text-muted-foreground hover:text-foreground">
                                        Tanya lagi
                                    </button>
                                    <button onClick={() => toast.success("Disimpan!")} className="text-sm text-[#C9A04F] hover:text-[#B8860B]">
                                        Simpan
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Story Cards */}
                        {!storyResponse && !storyLoading && (
                            <>
                                <p className="text-sm text-muted-foreground text-center mb-4">Atau pilih cerita populer:</p>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        { title: "Legenda Roro Jonggrang", region: "Jawa Tengah", desc: "Kisah cinta tragis yang melahirkan Candi Prambanan", icon: "🏛️", query: "roro jonggrang" },
                                        { title: "Malin Kundang", region: "Sumatera Barat", desc: "Anak durhaka yang dikutuk menjadi batu", icon: "⛵", query: "malin kundang" },
                                        { title: "Sangkuriang", region: "Jawa Barat", desc: "Asal usul Gunung Tangkuban Perahu", icon: "🌋", query: "sangkuriang" },
                                        { title: "Timun Mas", region: "Jawa Tengah", desc: "Gadis pemberani melawan raksasa jahat", icon: "🥒", query: "timun mas" },
                                        { title: "Si Pitung", region: "DKI Jakarta", desc: "Pahlawan Betawi pembela rakyat kecil", icon: "🥊", query: "si pitung" },
                                        { title: "Lutung Kasarung", region: "Jawa Barat", desc: "Pangeran kera dan putri Purbasari", icon: "🐒", query: "lutung kasarung" },
                                    ].map((story, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => {
                                                setStoryQuery(story.title);
                                                handleStoryQuery(story.query);
                                            }}
                                            className={cn(
                                                "bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-[#C9A04F]/50 hover:shadow-lg transition-all group",
                                                selectedStory === story.title && "border-[#C9A04F] bg-[#C9A04F]/10"
                                            )}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="text-3xl">{story.icon}</div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground group-hover:text-[#C9A04F] transition-colors">{story.title}</h3>
                                                    <p className="text-xs text-[#C9A04F] mb-2">{story.region}</p>
                                                    <p className="text-sm text-muted-foreground">{story.desc}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* CRAFT - Kerajinan & Asal */}
                {category === "craft" && (
                    <div className="p-6 space-y-6 max-w-5xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-4">
                                <Palette className="w-8 h-8 text-[#C9A04F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Kerajinan Tradisional</h2>
                            <p className="text-muted-foreground">Tanyakan AI tentang kerajinan dan seni tradisional Indonesia</p>
                        </div>

                        {/* AI Chat Input */}
                        <div className="bg-card border border-border rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-[#C9A04F]" />
                                <input
                                    type="text"
                                    placeholder="Tanyakan kerajinan... (cth: Batik, Wayang)"
                                    value={craftQuery}
                                    onChange={(e) => setCraftQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && craftQuery.trim()) {
                                            handleCraftQuery(craftQuery);
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    onClick={() => craftQuery.trim() && handleCraftQuery(craftQuery)}
                                    disabled={craftLoading || !craftQuery.trim()}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {craftLoading ? "..." : "Tanya AI"}
                                </button>
                            </div>
                        </div>

                        {/* AI Response */}
                        {craftLoading && (
                            <div className="bg-card border border-[#C9A04F]/30 rounded-xl p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#C9A04F]/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-[#C9A04F] animate-spin" />
                                    </div>
                                    <span className="text-[#C9A04F] font-medium">AI sedang berpikir...</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-secondary rounded w-full" />
                                    <div className="h-4 bg-secondary rounded w-3/4" />
                                    <div className="h-4 bg-secondary rounded w-5/6" />
                                </div>
                            </div>
                        )}

                        {craftResponse && !craftLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-[#C9A04F]/30 rounded-xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#C9A04F]/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-[#C9A04F]" />
                                    </div>
                                    <span className="text-[#C9A04F] font-medium">AI Culture Assistant</span>
                                </div>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {craftResponse}
                                    </ReactMarkdown>
                                </div>
                                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
                                    <button onClick={() => { setCraftResponse(null); setCraftQuery(""); }} className="text-sm text-muted-foreground hover:text-foreground">
                                        Tanya lagi
                                    </button>
                                    <button onClick={() => toast.success("Disimpan!")} className="text-sm text-[#C9A04F] hover:text-[#B8860B]">
                                        Simpan
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Craft Cards */}
                        {!craftResponse && !craftLoading && (
                            <>
                                <p className="text-sm text-muted-foreground text-center mb-4">Atau pilih kerajinan populer:</p>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {[
                                        { name: "Batik", origin: "Jawa", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop", desc: "Kain dengan motif malam", query: "batik" },
                                        { name: "Wayang Kulit", origin: "Jawa", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=300&h=200&fit=crop", desc: "Seni pertunjukan boneka", query: "wayang" },
                                        { name: "Songket", origin: "Sumatera", image: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=300&h=200&fit=crop", desc: "Tenun benang emas", query: "songket" },
                                        { name: "Ukiran Jepara", origin: "Jawa Tengah", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=300&h=200&fit=crop", desc: "Seni ukir kayu", query: "ukiran jepara" },
                                        { name: "Tenun Ikat", origin: "NTT", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop", desc: "Kain tenun tradisional", query: "tenun ikat" },
                                        { name: "Keramik", origin: "Kasongan", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=200&fit=crop", desc: "Seni gerabah Yogya", query: "keramik kasongan" },
                                    ].map((craft, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => {
                                                setCraftQuery(craft.name);
                                                handleCraftQuery(craft.query);
                                            }}
                                            className={cn(
                                                "bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all",
                                                selectedCraft === craft.name && "border-[#C9A04F] ring-2 ring-[#C9A04F]/20"
                                            )}
                                        >
                                            <div className="h-40 overflow-hidden relative">
                                                <img src={craft.image} alt={craft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                    <span className="text-white text-sm font-medium flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4" /> Tanya AI
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-foreground">{craft.name}</h3>
                                                <p className="text-xs text-[#C9A04F] mb-1">{craft.origin}</p>
                                                <p className="text-sm text-muted-foreground">{craft.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* RITUALS - Ritual & Tradisi */}
                {category === "rituals" && (
                    <div className="p-6 space-y-6 max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-[#C9A04F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Ritual & Tradisi</h2>
                            <p className="text-muted-foreground">Upacara adat dan tradisi yang masih lestari</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "Sekaten", region: "Yogyakarta & Solo", time: "Maulid Nabi", desc: "Perayaan kelahiran Nabi Muhammad dengan gamelan pusaka", type: "Keagamaan" },
                                { name: "Kasada", region: "Bromo, Jawa Timur", time: "14 Kasada", desc: "Persembahan hasil bumi ke kawah Gunung Bromo oleh Suku Tengger", type: "Adat" },
                                { name: "Ngaben", region: "Bali", time: "Sesuai weton", desc: "Upacara kremasi untuk mengembalikan roh ke alam semesta", type: "Kematian" },
                                { name: "Rambu Solo", region: "Toraja", time: "Sesuai adat", desc: "Upacara pemakaman dengan korban kerbau", type: "Kematian" },
                                { name: "Tabuik", region: "Pariaman", time: "1-10 Muharram", desc: "Peringatan wafatnya cucu Nabi, Husain bin Ali", type: "Keagamaan" },
                                { name: "Erau", region: "Kutai, Kalimantan", time: "Tahunan", desc: "Festival adat Kerajaan Kutai Kartanegara", type: "Kerajaan" },
                            ].map((ritual, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-[#C9A04F]/50 transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#C9A04F]/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#C9A04F] font-bold">{i + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground">{ritual.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A04F]/20 text-[#C9A04F]">{ritual.type}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1">{ritual.region} • {ritual.time}</p>
                                        <p className="text-sm text-muted-foreground">{ritual.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MAP - Peta Indonesia */}
                {category === "map" && (
                    <div className="p-6 space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-4">
                                <Map className="w-8 h-8 text-[#C9A04F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Peta Budaya Indonesia</h2>
                            <p className="text-muted-foreground">Jelajahi kekayaan budaya dari 38 provinsi Nusantara</p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6">
                            {/* Interactive Indonesia Map SVG */}
                            <div className="w-full min-h-[400px]">
                                <Suspense fallback={
                                    <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#C9A04F]" />
                                        <p className="text-sm text-muted-foreground">Memuat peta Indonesia...</p>
                                    </div>
                                }>
                                    <IndonesiaMap
                                        onProvinceClick={(id, name) => {
                                            handleProvinceClick(name);
                                        }}
                                        className="w-full"
                                        showStats={true}
                                        showLegend={true}
                                    />
                                </Suspense>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                🖱️ Klik provinsi untuk informasi budaya lengkap dari AI
                            </p>
                        </div>

                        {/* Province Info Panel */}
                        {(mapLoading || provinceInfo) && (
                            <div className="mt-6 bg-card border border-border rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-4">
                                    📍 INFORMASI PROVINSI
                                </div>
                                {mapLoading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-[#C9A04F]" />
                                        <span className="text-muted-foreground">Memuat informasi budaya...</span>
                                    </div>
                                ) : provinceInfo && (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {provinceInfo}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cultural Highlights */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Sorotan Budaya Nusantara</h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    {
                                        region: "Warisan UNESCO",
                                        items: ["Batik", "Wayang", "Angklung", "Tari Saman"],
                                        icon: "🏛️",
                                        color: "from-[#C9A04F]/20 to-[#B8860B]/10 border-[#C9A04F]/30"
                                    },
                                    {
                                        region: "Tarian Tradisional",
                                        items: ["Tari Kecak", "Tari Pendet", "Tari Piring", "Tari Jaipong"],
                                        icon: "💃",
                                        color: "from-purple-500/20 to-purple-600/10 border-purple-500/30"
                                    },
                                    {
                                        region: "Kerajinan Khas",
                                        items: ["Songket", "Tenun Ikat", "Ukiran Jepara", "Keris"],
                                        icon: "🎨",
                                        color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30"
                                    },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`bg-gradient-to-br ${item.color} border rounded-xl p-4`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">{item.icon}</span>
                                            <h4 className="font-semibold text-foreground">{item.region}</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.items.map((name, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-background/50 rounded-full text-xs text-muted-foreground">
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SOURCES - Sumber & Referensi */}
                {category === "sources" && (
                    <div className="p-6 space-y-6 max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-4">
                                <FileSearch className="w-8 h-8 text-[#C9A04F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Sumber & Referensi</h2>
                            <p className="text-muted-foreground">Referensi terpercaya untuk pembelajaran budaya</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "Kementerian Pendidikan dan Kebudayaan", url: "kemdikbud.go.id", type: "Pemerintah", desc: "Sumber resmi informasi kebudayaan Indonesia" },
                                { title: "Indonesia.go.id", url: "indonesia.go.id", type: "Portal", desc: "Portal resmi Republik Indonesia" },
                                { title: "Perpustakaan Nasional RI", url: "perpusnas.go.id", type: "Perpustakaan", desc: "Koleksi digital naskah kuno dan dokumen sejarah" },
                                { title: "Museum Nasional Indonesia", url: "museumnasional.or.id", type: "Museum", desc: "Koleksi artefak dan benda bersejarah" },
                                { title: "Arsip Nasional RI", url: "anri.go.id", type: "Arsip", desc: "Dokumen sejarah dan arsip negara" },
                                { title: "UNESCO Indonesia", url: "unesco.or.id", type: "Internasional", desc: "Warisan budaya dunia dari Indonesia" },
                            ].map((source, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-[#C9A04F]/50 transition-all cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#C9A04F]/20 flex items-center justify-center flex-shrink-0">
                                        <FileSearch className="w-6 h-6 text-[#C9A04F]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground group-hover:text-[#C9A04F] transition-colors">{source.title}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{source.type}</span>
                                        </div>
                                        <p className="text-xs text-[#C9A04F] mb-1">{source.url}</p>
                                        <p className="text-sm text-muted-foreground">{source.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROJECTS - My Projects */}
                {category === "projects" && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">My Projects</h2>
                                <p className="text-muted-foreground">Proyek identifikasi budaya yang tersimpan</p>
                            </div>
                            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-semibold flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                New Project
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                { name: "Batik Pekalongan", date: "2 hari lalu", status: "Selesai", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
                                { name: "Wayang Kulit Purwa", date: "5 hari lalu", status: "Selesai", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=300&h=200&fit=crop" },
                                { name: "Keris Pusaka", date: "1 minggu lalu", status: "Draft", image: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=300&h=200&fit=crop" },
                                { name: "Songket Palembang", date: "2 minggu lalu", status: "Selesai", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=300&h=200&fit=crop" },
                                { name: "Tarian Saman", date: "3 minggu lalu", status: "Selesai", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop" },
                            ].map((project, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                                >
                                    <div className="h-32 overflow-hidden relative">
                                        <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className={cn(
                                            "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
                                            project.status === "Selesai" ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-black"
                                        )}>
                                            {project.status}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
                                        <p className="text-xs text-muted-foreground">{project.date}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Map Modal */}
                <AnimatePresence>
                    {showMapModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMapModal(false)} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#C9A04F]/20 flex items-center justify-center">
                                            <Map className="w-5 h-5 text-[#C9A04F]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">Peta Budaya Indonesia</h3>
                                            <p className="text-xs text-muted-foreground">Klik provinsi untuk info budaya</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowMapModal(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-4 md:p-6">
                                    <Suspense fallback={
                                        <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#C9A04F]" />
                                            <p className="text-sm text-muted-foreground">Memuat peta Indonesia...</p>
                                        </div>
                                    }>
                                        <IndonesiaMap
                                            onProvinceClick={(id, name, culture, capital) => {
                                                toast.info(`🗺️ ${name}`, {
                                                    description: `📍 Ibukota: ${capital}\n🎭 Budaya: ${culture}`,
                                                    duration: 5000,
                                                });
                                            }}
                                            className="w-full"
                                            showStats={true}
                                            showLegend={true}
                                        />
                                    </Suspense>
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

