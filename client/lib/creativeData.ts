/**
 * Creative Studio Data Types & Sample Content
 * Purpose: Data structures and sample content for AI Creative Studio
 */

import { LucideIcon } from "lucide-react";

// ===== TYPES =====

export interface CreativeTool {
    id: string;
    name: string;
    tagline: string;
    icon: string;
    badge?: string;
    gradientFrom: string;
    gradientTo: string;
    features: string[];
    samples: CreativeSample[];
    popular?: boolean;
}

export interface CreativeSample {
    id: string;
    title: string;
    thumbnail?: string;
    duration?: string;
    previewUrl?: string;
}

export interface Creation {
    id: string;
    type: "music" | "video" | "image" | "voice" | "animation";
    title: string;
    thumbnail: string;
    createdAt: string;
    duration?: string;
    isFavorite: boolean;
}

export interface GalleryItem {
    id: string;
    type: "music" | "video" | "image" | "voice" | "animation";
    title: string;
    thumbnail: string;
    creator: string;
    createdAt: string;
    likes: number;
    views: number;
    isPublic: boolean;
}

// ===== MUSIC GENERATOR CONFIG =====

export const musicGenres = [
    { id: "pop", name: "Pop", icon: "🎵" },
    { id: "jazz", name: "Jazz", icon: "🎷" },
    { id: "classical", name: "Classical", icon: "🎻" },
    { id: "edm", name: "EDM", icon: "🎧" },
    { id: "traditional", name: "Traditional", icon: "🎹" },
    { id: "lofi", name: "Lo-fi", icon: "☕" },
    { id: "rock", name: "Rock", icon: "🎸" },
    { id: "ambient", name: "Ambient", icon: "🌙" },
    { id: "hiphop", name: "Hip-hop", icon: "🎤" },
    { id: "cinematic", name: "Cinematic", icon: "🎬" },
];

export const musicInstruments = [
    { id: "piano", name: "Piano", icon: "🎹" },
    { id: "guitar", name: "Guitar", icon: "🎸" },
    { id: "gamelan", name: "Gamelan", icon: "🔔" },
    { id: "orchestra", name: "Orchestra", icon: "🎻" },
    { id: "synth", name: "Synth", icon: "🎛️" },
    { id: "drums", name: "Drums", icon: "🥁" },
];

export const musicMoods = [
    { id: "happy", name: "Happy", color: "#FFD700" },
    { id: "sad", name: "Sad", color: "#6366F1" },
    { id: "energetic", name: "Energetic", color: "#EF4444" },
    { id: "calm", name: "Calm", color: "#10B981" },
    { id: "epic", name: "Epic", color: "#8B5CF6" },
    { id: "mysterious", name: "Mysterious", color: "#1F2937" },
];

// ===== VIDEO GENERATOR CONFIG =====

export const videoStyles = [
    { id: "realistic", name: "Realistic", thumbnail: "📹" },
    { id: "anime", name: "Anime", thumbnail: "🎌" },
    { id: "3d", name: "3D Animation", thumbnail: "🎮" },
    { id: "cartoon", name: "Cartoon", thumbnail: "🎨" },
    { id: "cinematic", name: "Cinematic", thumbnail: "🎬" },
];

export const videoAspectRatios = [
    { id: "16:9", name: "Landscape (16:9)", icon: "📺" },
    { id: "9:16", name: "Portrait (9:16)", icon: "📱" },
    { id: "1:1", name: "Square (1:1)", icon: "⬜" },
    { id: "4:3", name: "Classic (4:3)", icon: "🖼️" },
];

// ===== IMAGE GENERATOR CONFIG =====

export const imageStyles = [
    { id: "photorealistic", name: "Photorealistic", thumbnail: "📷" },
    { id: "oil-painting", name: "Oil Painting", thumbnail: "🎨" },
    { id: "watercolor", name: "Watercolor", thumbnail: "💧" },
    { id: "digital-art", name: "Digital Art", thumbnail: "🖥️" },
    { id: "sketch", name: "Sketch", thumbnail: "✏️" },
    { id: "anime", name: "Anime", thumbnail: "🎌" },
    { id: "3d-render", name: "3D Render", thumbnail: "🎮" },
    { id: "abstract", name: "Abstract", thumbnail: "🌀" },
];

export const imageAspectRatios = [
    { id: "1:1", name: "Square", dimensions: "1024x1024" },
    { id: "4:3", name: "Landscape", dimensions: "1024x768" },
    { id: "3:4", name: "Portrait", dimensions: "768x1024" },
    { id: "16:9", name: "Wide", dimensions: "1920x1080" },
    { id: "9:16", name: "Tall", dimensions: "1080x1920" },
];

// ===== TTS GENERATOR CONFIG =====

export const ttsVoices = [
    { id: "aria", name: "Aria", gender: "female", language: "id-ID", accent: "Indonesia", description: "Suara lembut dan profesional" },
    { id: "budi", name: "Budi", gender: "male", language: "id-ID", accent: "Indonesia", description: "Suara tegas dan jelas" },
    { id: "citra", name: "Citra", gender: "female", language: "id-ID", accent: "Jawa", description: "Aksen Jawa halus" },
    { id: "dewi", name: "Dewi", gender: "female", language: "id-ID", accent: "Sunda", description: "Aksen Sunda melodis" },
    { id: "eko", name: "Eko", gender: "male", language: "id-ID", accent: "Indonesia", description: "Suara hangat dan friendly" },
    { id: "sarah", name: "Sarah", gender: "female", language: "en-US", accent: "American", description: "Clear American accent" },
    { id: "james", name: "James", gender: "male", language: "en-GB", accent: "British", description: "Sophisticated British accent" },
];

export const ttsEmotions = [
    { id: "neutral", name: "Netral", icon: "😐" },
    { id: "happy", name: "Gembira", icon: "😊" },
    { id: "sad", name: "Sedih", icon: "😢" },
    { id: "angry", name: "Marah", icon: "😠" },
    { id: "excited", name: "Excited", icon: "🤩" },
    { id: "professional", name: "Professional", icon: "👔" },
    { id: "friendly", name: "Friendly", icon: "🤗" },
];

// ===== IMAGE TO VIDEO CONFIG =====

export const animationStyles = [
    { id: "parallax", name: "2.5D Parallax", description: "Depth-based motion with foreground/background separation", icon: "🎭" },
    { id: "pan", name: "Cinematic Pan", description: "Smooth camera movement across the image", icon: "🎥" },
    { id: "zoom", name: "Zoom Burst", description: "Dynamic zoom effects with impact", icon: "🔍" },
    { id: "morph", name: "Morphing", description: "Smooth blend between multiple images", icon: "🌊" },
    { id: "kenburns", name: "Ken Burns", description: "Classic documentary style pan and zoom", icon: "📽️" },
    { id: "3d-rotate", name: "3D Rotation", description: "Rotate image in 3D space", icon: "🔄" },
];

// ===== CREATIVE TOOLS DATA =====

export const creativeTools: CreativeTool[] = [
    {
        id: "music",
        name: "AI Music Studio",
        tagline: "Komposisi musik original dalam hitungan detik",
        icon: "Music",
        badge: "Trending",
        gradientFrom: "#8B5CF6",
        gradientTo: "#EC4899",
        features: [
            "🎼 10+ Genre musik",
            "🎹 Pilih instrumen",
            "⏱️ Durasi 15s - 5 menit",
            "🎚️ Kontrol mood",
            "🔊 Export MP3/WAV",
        ],
        samples: [
            { id: "s1", title: "Summer Vibes", duration: "0:30" },
            { id: "s2", title: "Epic Orchestra", duration: "1:00" },
            { id: "s3", title: "Lo-fi Chill", duration: "0:45" },
        ],
        popular: true,
    },
    {
        id: "video",
        name: "AI Video Creator",
        tagline: "Dari ide menjadi video berkualitas studio",
        icon: "Video",
        badge: "Pro Feature",
        gradientFrom: "#3B82F6",
        gradientTo: "#06B6D4",
        features: [
            "📹 Text-to-Video",
            "🎞️ 5 Gaya visual",
            "⏰ Durasi 5s - 2 menit",
            "🎬 Resolusi 4K",
            "🎵 Auto-sync music",
        ],
        samples: [
            { id: "v1", title: "Product Ad", duration: "0:15" },
            { id: "v2", title: "Social Story", duration: "0:30" },
        ],
    },
    {
        id: "image",
        name: "AI Art Studio",
        tagline: "Ciptakan visual memukau dengan deskripsi sederhana",
        icon: "Palette",
        badge: "Most Popular",
        gradientFrom: "#F59E0B",
        gradientTo: "#EF4444",
        features: [
            "🖼️ 8 Gaya artistik",
            "📐 Multiple aspect ratios",
            "🎨 Hingga 4096x4096px",
            "🔄 Batch generate",
            "✨ Upscale & enhance",
        ],
        samples: [
            { id: "i1", title: "Fantasy Landscape" },
            { id: "i2", title: "Portrait Art" },
            { id: "i3", title: "Abstract Design" },
            { id: "i4", title: "Anime Character" },
        ],
        popular: true,
    },
    {
        id: "tts",
        name: "AI Voice Studio",
        tagline: "Ubah teks menjadi suara natural dan ekspresif",
        icon: "Mic",
        badge: "New Voices",
        gradientFrom: "#F97316",
        gradientTo: "#DC2626",
        features: [
            "🗣️ 50+ suara natural",
            "🌍 30+ bahasa",
            "🎭 7 Emosi berbeda",
            "⚡ Kecepatan adjustable",
            "🎵 Background music",
        ],
        samples: [
            { id: "t1", title: "Narasi Indonesia", duration: "0:20" },
            { id: "t2", title: "English Podcast", duration: "0:30" },
        ],
    },
    {
        id: "img2video",
        name: "Image Animation Studio",
        tagline: "Hidupkan foto menjadi video sinematik",
        icon: "Clapperboard",
        badge: "AI Magic",
        gradientFrom: "#A855F7",
        gradientTo: "#3B82F6",
        features: [
            "📸 Single/multiple images",
            "🎬 6 Gaya animasi",
            "⏱️ 2-10 detik per image",
            "🎵 Sync dengan music",
            "✨ Particle effects",
        ],
        samples: [
            { id: "a1", title: "Parallax Demo", duration: "0:05" },
            { id: "a2", title: "Ken Burns Effect", duration: "0:08" },
        ],
    },
];

// ===== GALLERY SAMPLE DATA - Indonesian Culture Theme =====

export const sampleGalleryItems: GalleryItem[] = [
    {
        id: "g1",
        type: "image",
        title: "Keindahan Candi Borobudur",
        thumbnail: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop",
        creator: "SeniNusantara",
        createdAt: "2024-12-05",
        likes: 234,
        views: 1520,
        isPublic: true,
    },
    {
        id: "g2",
        type: "music",
        title: "Gamelan Remix Modern",
        thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
        creator: "MusikTradisi",
        createdAt: "2024-12-04",
        likes: 189,
        views: 980,
        isPublic: true,
    },
    {
        id: "g3",
        type: "video",
        title: "Pesona Pulau Dewata Bali",
        thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
        creator: "VideoBudaya",
        createdAt: "2024-12-03",
        likes: 456,
        views: 2340,
        isPublic: true,
    },
    {
        id: "g4",
        type: "image",
        title: "Batik Mega Mendung Digital",
        thumbnail: "https://images.unsplash.com/photo-1555992457-b8fefdd09069?w=400&h=300&fit=crop",
        creator: "DesainBatik",
        createdAt: "2024-12-02",
        likes: 312,
        views: 1890,
        isPublic: true,
    },
    {
        id: "g5",
        type: "voice",
        title: "Narasi Dongeng Nusantara",
        thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
        creator: "SuaraBudaya",
        createdAt: "2024-12-01",
        likes: 78,
        views: 456,
        isPublic: true,
    },
    {
        id: "g6",
        type: "animation",
        title: "Wayang Kulit Bergerak",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        creator: "AnimasiTradisi",
        createdAt: "2024-11-30",
        likes: 201,
        views: 1230,
        isPublic: true,
    },
];

// ===== MY CREATIONS SAMPLE DATA - Indonesian Culture Theme =====

export const sampleCreations: Creation[] = [
    {
        id: "c1",
        type: "image",
        title: "Ilustrasi Garuda Pancasila",
        thumbnail: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=200&h=200&fit=crop",
        createdAt: "2024-12-07",
        isFavorite: true,
    },
    {
        id: "c2",
        type: "music",
        title: "Angklung Lo-fi Remix",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
        createdAt: "2024-12-06",
        duration: "2:30",
        isFavorite: false,
    },
    {
        id: "c3",
        type: "voice",
        title: "Narasi Cerita Rakyat",
        thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200&fit=crop",
        createdAt: "2024-12-05",
        duration: "0:45",
        isFavorite: true,
    },
];

// ===== HELPER FUNCTIONS =====

export const getToolById = (id: string): CreativeTool | undefined => {
    return creativeTools.find((tool) => tool.id === id);
};

export const formatCreationDate = (date: string): string => {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const getTypeIcon = (type: Creation["type"]): string => {
    const icons: Record<Creation["type"], string> = {
        music: "Music",
        video: "Video",
        image: "Image",
        voice: "Mic",
        animation: "Clapperboard",
    };
    return icons[type];
};

export const getTypeColor = (type: Creation["type"]): string => {
    const colors: Record<Creation["type"], string> = {
        music: "#8B5CF6",
        video: "#3B82F6",
        image: "#F59E0B",
        voice: "#F97316",
        animation: "#A855F7",
    };
    return colors[type];
};
