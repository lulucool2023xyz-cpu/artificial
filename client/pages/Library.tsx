import { memo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FolderOpen,
    Image,
    Video,
    Music,
    FileText,
    Star,
    Trash2,
    Upload,
    Search,
    Filter,
    SortAsc,
    Grid3X3,
    List,
    MoreVertical,
    X,
    Download,
    Share2,
    Edit3,
    Heart,
    Eye,
    Calendar,
    HardDrive,
    Tag,
    CheckSquare,
    Square,
    RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AppLayout, type SidebarItem } from "@/components/layout/AppLayout";

// Mock data for files
const mockFiles = [
    { id: "1", name: "Batik Pekalongan.jpg", type: "image", size: "2.4 MB", date: "2024-01-15", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", favorite: true, tags: ["batik", "budaya"] },
    { id: "2", name: "Tari Pendet.mp4", type: "video", size: "45.2 MB", date: "2024-01-14", thumbnail: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=300&h=300&fit=crop", favorite: false, tags: ["tari", "bali"] },
    { id: "3", name: "Gamelan Recording.mp3", type: "audio", size: "8.1 MB", date: "2024-01-13", thumbnail: null, favorite: false, tags: ["musik", "gamelan"] },
    { id: "4", name: "Sejarah Wayang.pdf", type: "document", size: "1.2 MB", date: "2024-01-12", thumbnail: null, favorite: true, tags: ["wayang", "sejarah"] },
    { id: "5", name: "Candi Borobudur.jpg", type: "image", size: "3.8 MB", date: "2024-01-11", thumbnail: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=300&h=300&fit=crop", favorite: false, tags: ["candi", "budaya"] },
    { id: "6", name: "Keris Pusaka.jpg", type: "image", size: "1.9 MB", date: "2024-01-10", thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop", favorite: false, tags: ["keris", "pusaka"] },
];

type LibraryCategory = "all" | "images" | "videos" | "audio" | "documents" | "favorites" | "trash";

interface LibraryFile {
    id: string;
    name: string;
    type: string;
    size: string;
    date: string;
    thumbnail: string | null;
    favorite: boolean;
    tags: string[];
    deleted?: boolean;
}

const Library = memo(function Library() {
    const [category, setCategory] = useState<LibraryCategory>("all");
    const [files, setFiles] = useState<LibraryFile[]>(mockFiles);
    const [trashedFiles, setTrashedFiles] = useState<LibraryFile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [previewFile, setPreviewFile] = useState<LibraryFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sidebar items for Library
    const sidebarItems: SidebarItem[] = [
        { id: "all", label: "Semua File", icon: <FolderOpen className="w-5 h-5" />, active: category === "all" },
        { id: "images", label: "Gambar", icon: <Image className="w-5 h-5" />, active: category === "images" },
        { id: "videos", label: "Video", icon: <Video className="w-5 h-5" />, active: category === "videos" },
        { id: "audio", label: "Audio", icon: <Music className="w-5 h-5" />, active: category === "audio" },
        { id: "documents", label: "Dokumen", icon: <FileText className="w-5 h-5" />, active: category === "documents" },
        { id: "favorites", label: "Favorit", icon: <Star className="w-5 h-5" />, active: category === "favorites" },
        { id: "trash", label: "Sampah", icon: <Trash2 className="w-5 h-5" />, active: category === "trash", badge: trashedFiles.length > 0 ? trashedFiles.length.toString() : undefined },
    ];

    const handleCategoryChange = (id: string) => {
        setCategory(id as LibraryCategory);
        setSelectedFiles(new Set());
        setSelectionMode(false);
    };

    // Filter files based on category and search
    const filteredFiles = (category === "trash" ? trashedFiles : files).filter(file => {
        if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (category === "all" || category === "trash") return true;
        if (category === "favorites") return file.favorite;
        if (category === "images") return file.type === "image";
        if (category === "videos") return file.type === "video";
        if (category === "audio") return file.type === "audio";
        if (category === "documents") return file.type === "document";
        return true;
    });

    const handleUpload = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = e.target.files;
        if (uploadedFiles) {
            toast.success(`${uploadedFiles.length} file berhasil diunggah`);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length) {
            toast.success(`${droppedFiles.length} file berhasil diunggah`);
        }
    };

    const toggleFavorite = (id: string) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, favorite: !f.favorite } : f));
        toast.success("Status favorit diperbarui");
    };

    const deleteFile = (id: string) => {
        const file = files.find(f => f.id === id);
        if (file) {
            setFiles(prev => prev.filter(f => f.id !== id));
            setTrashedFiles(prev => [...prev, { ...file, deleted: true }]);
            toast.success("File dipindahkan ke sampah");
        }
    };

    const restoreFile = (id: string) => {
        const file = trashedFiles.find(f => f.id === id);
        if (file) {
            setTrashedFiles(prev => prev.filter(f => f.id !== id));
            setFiles(prev => [...prev, { ...file, deleted: false }]);
            toast.success("File dipulihkan");
        }
    };

    const permanentDelete = (id: string) => {
        setTrashedFiles(prev => prev.filter(f => f.id !== id));
        toast.success("File dihapus permanen");
    };

    const toggleSelect = (id: string) => {
        setSelectedFiles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const bulkDelete = () => {
        const selected = Array.from(selectedFiles);
        selected.forEach(id => deleteFile(id));
        setSelectedFiles(new Set());
        setSelectionMode(false);
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case "image": return <Image className="w-8 h-8 text-blue-400" />;
            case "video": return <Video className="w-8 h-8 text-purple-400" />;
            case "audio": return <Music className="w-8 h-8 text-green-400" />;
            case "document": return <FileText className="w-8 h-8 text-orange-400" />;
            default: return <FileText className="w-8 h-8 text-gray-400" />;
        }
    };

    return (
        <AppLayout
            title="Library"
            sidebarItems={sidebarItems}
            activeSidebarItem={category}
            onSidebarItemClick={handleCategoryChange}
            showNewButton
            newButtonLabel="Upload"
            onNewButtonClick={handleUpload}
        >
            <div
                className="p-4 sm:p-6 min-h-full"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {/* Hidden file input */}
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

                {/* Drag overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-[#C9A04F]/20 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div className="bg-card border-2 border-dashed border-[#C9A04F] rounded-2xl p-12 text-center">
                                <Upload className="w-16 h-16 text-[#C9A04F] mx-auto mb-4" />
                                <p className="text-xl font-semibold text-white">Lepaskan file untuk mengunggah</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Controls */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari file..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A04F]/50"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-card border border-border rounded-lg">
                        <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-l-lg", viewMode === "grid" && "bg-[#C9A04F]/20 text-[#C9A04F]")}>
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-r-lg", viewMode === "list" && "bg-[#C9A04F]/20 text-[#C9A04F]")}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Selection Mode Toggle */}
                    <button
                        onClick={() => { setSelectionMode(!selectionMode); setSelectedFiles(new Set()); }}
                        className={cn("px-3 py-2 rounded-lg text-sm border", selectionMode ? "bg-[#C9A04F]/20 border-[#C9A04F] text-[#C9A04F]" : "border-border text-muted-foreground hover:text-foreground")}
                    >
                        <CheckSquare className="w-4 h-4" />
                    </button>

                    {/* Bulk Actions */}
                    {selectionMode && selectedFiles.size > 0 && (
                        <button onClick={bulkDelete} className="px-3 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30">
                            Hapus ({selectedFiles.size})
                        </button>
                    )}
                </div>

                {/* File Grid/List */}
                {filteredFiles.length > 0 ? (
                    <div className={cn(viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-2")}>
                        {filteredFiles.map((file) => (
                            <motion.div
                                key={file.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "group relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[#C9A04F]/50",
                                    selectedFiles.has(file.id) && "ring-2 ring-[#C9A04F]",
                                    viewMode === "list" && "flex items-center gap-4 p-3"
                                )}
                                onClick={() => selectionMode ? toggleSelect(file.id) : setPreviewFile(file)}
                            >
                                {/* Selection checkbox */}
                                {selectionMode && (
                                    <div className="absolute top-2 left-2 z-10">
                                        {selectedFiles.has(file.id) ? (
                                            <CheckSquare className="w-5 h-5 text-[#C9A04F]" />
                                        ) : (
                                            <Square className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                )}

                                {viewMode === "grid" ? (
                                    <>
                                        {/* Thumbnail */}
                                        <div className="aspect-square bg-secondary flex items-center justify-center">
                                            {file.thumbnail ? (
                                                <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                                            ) : (
                                                getFileIcon(file.type)
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="p-3">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <span>{file.size}</span>
                                                {file.favorite && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                            </div>
                                        </div>
                                        {/* Favorite button */}
                                        {category !== "trash" && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Star className={cn("w-4 h-4", file.favorite ? "text-yellow-400 fill-yellow-400" : "text-white")} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* List view */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-secondary rounded-lg flex items-center justify-center">
                                            {file.thumbnail ? (
                                                <img src={file.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                getFileIcon(file.type)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                                        </div>
                                        {category === "trash" ? (
                                            <div className="flex gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); restoreFile(file.id); }} className="p-2 hover:bg-secondary rounded-lg">
                                                    <RotateCcw className="w-4 h-4 text-green-400" />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); permanentDelete(file.id); }} className="p-2 hover:bg-secondary rounded-lg">
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}>
                                                <Star className={cn("w-5 h-5", file.favorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                            {category === "trash" ? <Trash2 className="w-10 h-10 text-muted-foreground" /> : <FolderOpen className="w-10 h-10 text-muted-foreground" />}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {category === "trash" ? "Sampah Kosong" : "Tidak Ada File"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {category === "trash" ? "File yang dihapus akan muncul di sini" : "Mulai dengan mengunggah file pertama Anda"}
                        </p>
                        {category !== "trash" && (
                            <button onClick={handleUpload} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-semibold">
                                Upload File
                            </button>
                        )}
                    </div>
                )}

                {/* Preview Modal */}
                <AnimatePresence>
                    {previewFile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setPreviewFile(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Preview */}
                                <div className="flex-1 bg-black flex items-center justify-center p-8 min-h-[300px]">
                                    {previewFile.thumbnail ? (
                                        <img src={previewFile.thumbnail} alt={previewFile.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        getFileIcon(previewFile.type)
                                    )}
                                </div>
                                {/* Details */}
                                <div className="w-full md:w-80 p-6 border-t md:border-t-0 md:border-l border-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold truncate">{previewFile.name}</h3>
                                        <button onClick={() => setPreviewFile(null)} className="p-1 hover:bg-secondary rounded">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-center gap-3"><HardDrive className="w-4 h-4 text-muted-foreground" /><span>{previewFile.size}</span></div>
                                        <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><span>{previewFile.date}</span></div>
                                        <div className="flex items-center gap-3"><Tag className="w-4 h-4 text-muted-foreground" /><span>{previewFile.tags.join(", ")}</span></div>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#C9A04F] text-white">
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                        <button onClick={() => { deleteFile(previewFile.id); setPreviewFile(null); }} className="p-2 rounded-lg bg-red-500/20 text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
});

export default Library;
