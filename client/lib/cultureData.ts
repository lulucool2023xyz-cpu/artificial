/**
 * Culture Data Types & Sample Content
 * Purpose: Data structures and sample content for Indonesian culture page
 */

// Types
export interface CultureCategory {
    id: string;
    nama: string;
    deskripsi: string;
    icon: string; // Lucide icon name
    jumlahKonten: number;
    subKategori: string[];
    daerahAsal: string[];
    gradientFrom: string;
    gradientTo: string;
}

export interface CultureNews {
    id: string;
    judul: string;
    tanggal: string;
    sumber: string;
    thumbnail: string;
    excerpt: string;
    kategori: string[];
    link: string;
}

export interface UploadedCultureFile {
    id: number;
    file: File;
    name: string;
    size: number;
    type: string;
    preview: string | null;
}

// Sample Categories Data
export const cultureCategories: CultureCategory[] = [
    {
        id: "candi",
        nama: "Candi & Situs Bersejarah",
        deskripsi: "Eksplorasi keajaiban arsitektur candi Hindu-Buddha dan situs bersejarah Nusantara yang megah.",
        icon: "Landmark",
        jumlahKonten: 150,
        subKategori: ["Candi Buddha", "Candi Hindu", "Istana", "Benteng"],
        daerahAsal: ["Jawa Tengah", "Yogyakarta", "Jawa Timur", "Bali"],
        gradientFrom: "#D97706",
        gradientTo: "#F59E0B",
    },
    {
        id: "batik",
        nama: "Batik & Tekstil Tradisional",
        deskripsi: "Keindahan motif batik dan tekstil tradisional Indonesia yang diakui UNESCO.",
        icon: "Palette",
        jumlahKonten: 200,
        subKategori: ["Batik Tulis", "Batik Cap", "Tenun Ikat", "Songket"],
        daerahAsal: ["Solo", "Pekalongan", "Cirebon", "NTT"],
        gradientFrom: "#4B0082",
        gradientTo: "#8B5CF6",
    },
    {
        id: "tarian",
        nama: "Tarian Tradisional",
        deskripsi: "Gerakan anggun tarian tradisional yang menceritakan kisah dan budaya Nusantara.",
        icon: "Music2",
        jumlahKonten: 180,
        subKategori: ["Tari Klasik", "Tari Rakyat", "Tari Kreasi", "Tari Ritual"],
        daerahAsal: ["Bali", "Jawa", "Sumatra", "Sulawesi"],
        gradientFrom: "#DC2626",
        gradientTo: "#F87171",
    },
    {
        id: "musik",
        nama: "Musik & Alat Musik",
        deskripsi: "Harmoni gamelan, angklung, dan berbagai alat musik tradisional Indonesia.",
        icon: "Guitar",
        jumlahKonten: 120,
        subKategori: ["Gamelan", "Angklung", "Sasando", "Kolintang"],
        daerahAsal: ["Jawa", "Sunda", "NTT", "Sulawesi Utara"],
        gradientFrom: "#059669",
        gradientTo: "#34D399",
    },
    {
        id: "sastra",
        nama: "Sastra & Aksara Nusantara",
        deskripsi: "Kekayaan sastra dan aksara tradisional dari berbagai daerah di Indonesia.",
        icon: "BookOpen",
        jumlahKonten: 90,
        subKategori: ["Aksara Jawa", "Aksara Sunda", "Aksara Batak", "Lontar Bali"],
        daerahAsal: ["Jawa", "Sunda", "Sumatra Utara", "Bali"],
        gradientFrom: "#7C3AED",
        gradientTo: "#A78BFA",
    },
    {
        id: "kuliner",
        nama: "Kuliner Tradisional",
        deskripsi: "Cita rasa autentik masakan tradisional Indonesia dari Sabang sampai Merauke.",
        icon: "UtensilsCrossed",
        jumlahKonten: 250,
        subKategori: ["Makanan Utama", "Jajanan Pasar", "Minuman Tradisional", "Rempah"],
        daerahAsal: ["Padang", "Jawa", "Bali", "Manado"],
        gradientFrom: "#EA580C",
        gradientTo: "#FB923C",
    },
];

// Sample News Data
export const cultureNews: CultureNews[] = [
    {
        id: "news-001",
        judul: "Batik Indonesia Semakin Mendunia di Paris Fashion Week 2024",
        tanggal: "2024-12-05",
        sumber: "Kemendikbud",
        thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop",
        excerpt: "Desainer Indonesia membawa motif batik kontemporer ke panggung Paris Fashion Week, mendapat sambutan meriah dari kritikus mode internasional.",
        kategori: ["batik", "internasional"],
        link: "#",
    },
    {
        id: "news-002",
        judul: "UNESCO Tetapkan Gamelan sebagai Warisan Budaya Tak Benda",
        tanggal: "2024-12-03",
        sumber: "Antara News",
        thumbnail: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400&h=300&fit=crop",
        excerpt: "Gamelan Jawa dan Bali resmi diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity.",
        kategori: ["musik", "pengakuan-internasional"],
        link: "#",
    },
    {
        id: "news-003",
        judul: "Restorasi Candi Borobudur Fase 3 Dimulai",
        tanggal: "2024-11-28",
        sumber: "Kompas",
        thumbnail: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop",
        excerpt: "Kementerian PUPR memulai restorasi fase ketiga Candi Borobudur untuk memperkuat struktur dan konservasi relief.",
        kategori: ["candi", "konservasi"],
        link: "#",
    },
    {
        id: "news-004",
        judul: "Festival Tari Nusantara 2024 Digelar di Taman Mini",
        tanggal: "2024-11-25",
        sumber: "Detik",
        thumbnail: "https://images.unsplash.com/photo-1545296664-39db56ad95bd?w=400&h=300&fit=crop",
        excerpt: "Lebih dari 500 penari dari 34 provinsi tampil memukau dalam Festival Tari Nusantara 2024.",
        kategori: ["tarian", "festival"],
        link: "#",
    },
    {
        id: "news-005",
        judul: "Digitalisasi Aksara Nusantara untuk Generasi Muda",
        tanggal: "2024-11-20",
        sumber: "Tempo",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        excerpt: "Aplikasi pembelajaran aksara tradisional diluncurkan untuk melestarikan warisan literasi Nusantara.",
        kategori: ["sastra", "teknologi"],
        link: "#",
    },
    {
        id: "news-006",
        judul: "Rendang Kembali Raih Predikat Makanan Terenak Dunia",
        tanggal: "2024-11-15",
        sumber: "CNN Indonesia",
        thumbnail: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop",
        excerpt: "Rendang Padang kembali menduduki peringkat pertama dalam daftar World's Best Foods versi TasteAtlas.",
        kategori: ["kuliner", "internasional"],
        link: "#",
    },
    {
        id: "news-007",
        judul: "Pameran Wayang Kulit Kontemporer di Museum Nasional",
        tanggal: "2024-11-10",
        sumber: "Republika",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        excerpt: "Seniman muda Indonesia menghadirkan wayang kulit dengan sentuhan kontemporer yang memukau pengunjung.",
        kategori: ["seni", "pameran"],
        link: "#",
    },
    {
        id: "news-008",
        judul: "Tenun Ikat Sumba Tembus Pasar Eropa",
        tanggal: "2024-11-05",
        sumber: "Bisnis Indonesia",
        thumbnail: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&h=300&fit=crop",
        excerpt: "Kain tenun ikat dari Sumba berhasil menembus pasar fashion premium di negara-negara Eropa.",
        kategori: ["batik", "ekspor"],
        link: "#",
    },
];

// Helper function to format date in Indonesian
export const formatTanggal = (tanggal: string): string => {
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Suggested questions for each category
export const categorySuggestions: Record<string, string[]> = {
    candi: [
        "Apa sejarah Candi Borobudur?",
        "Bagaimana arsitektur Candi Prambanan?",
        "Candi apa saja yang ada di Jawa Timur?",
    ],
    batik: [
        "Apa makna motif batik parang?",
        "Bagaimana proses pembuatan batik tulis?",
        "Apa perbedaan batik Solo dan Pekalongan?",
    ],
    tarian: [
        "Apa filosofi Tari Pendet Bali?",
        "Bagaimana gerakan dasar Tari Jaipong?",
        "Tarian apa yang berasal dari Sulawesi?",
    ],
    musik: [
        "Apa instrumen dalam gamelan Jawa?",
        "Bagaimana cara memainkan angklung?",
        "Apa keunikan alat musik sasando?",
    ],
    sastra: [
        "Apa itu aksara Pallawa?",
        "Bagaimana cara membaca aksara Jawa?",
        "Apa karya sastra tertua di Indonesia?",
    ],
    kuliner: [
        "Apa resep autentik rendang Padang?",
        "Bagaimana cara membuat gudeg Jogja?",
        "Apa rempah khas masakan Manado?",
    ],
};
