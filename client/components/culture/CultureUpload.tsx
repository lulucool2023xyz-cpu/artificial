import { memo, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Upload,
    FileImage,
    FileText,
    File,
    X,
    Sparkles,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { UploadedCultureFile } from "@/lib/cultureData";
import { formatFileSize } from "@/lib/cultureData";

interface CultureUploadProps {
    onAnalyze: (files: UploadedCultureFile[]) => void;
}

/**
 * Culture Upload Component
 * Purpose: Drag-and-drop file upload for cultural artifact analysis
 */
export const CultureUpload = memo(function CultureUpload({
    onAnalyze,
}: CultureUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedCultureFile[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) return FileImage;
        if (fileType.includes("pdf") || fileType.includes("document"))
            return FileText;
        return File;
    };

    const handleFiles = useCallback((files: File[]) => {
        if (!files || files.length === 0) return;

        const validFiles = files.filter((file) => {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                toast.error("File terlalu besar", {
                    description: `${file.name} melebihi batas 10MB`,
                });
                return false;
            }
            if (!acceptedTypes.some((type) => file.type.includes(type.split("/")[1]))) {
                toast.error("Format tidak didukung", {
                    description: `${file.name} bukan format yang didukung`,
                });
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            const newFiles: UploadedCultureFile[] = validFiles.map((file) => ({
                id: Date.now() + Math.random(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                preview: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : null,
            }));

            setUploadedFiles((prev) => [...prev, ...newFiles]);
            toast.success("File ditambahkan", {
                description: `${validFiles.length} file siap dianalisis`,
            });
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        },
        [handleFiles]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            handleFiles(files);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [handleFiles]
    );

    const removeFile = useCallback((id: number) => {
        setUploadedFiles((prev) => {
            const file = prev.find((f) => f.id === id);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter((f) => f.id !== id);
        });
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (uploadedFiles.length === 0) {
            toast.error("Tidak ada file", {
                description: "Upload file terlebih dahulu untuk dianalisis",
            });
            return;
        }

        setIsAnalyzing(true);
        try {
            await onAnalyze(uploadedFiles);
            toast.success("Analisis selesai!", {
                description: "Hasil analisis budaya telah tersedia",
            });
        } catch {
            toast.error("Gagal menganalisis", {
                description: "Silakan coba lagi",
            });
        } finally {
            setIsAnalyzing(false);
        }
    }, [uploadedFiles, onAnalyze]);

    return (
        <section className="section-container py-8 lg:py-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Upload Area */}
                        <div className="flex-1">
                            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                                Analisis Artefak Budaya
                            </h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Upload gambar candi, batik, atau dokumen budaya untuk analisis AI
                            </p>

                            {/* Drag and Drop Zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
                                    isDragging
                                        ? "border-[#FFD700] bg-[#FFD700]/10"
                                        : "border-border/50 hover:border-[#FFD700]/50 hover:bg-muted/20"
                                )}
                                role="button"
                                tabIndex={0}
                                aria-label="Upload file untuk analisis budaya"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        fileInputRef.current?.click();
                                    }
                                }}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    aria-hidden="true"
                                />

                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        className={cn(
                                            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                            isDragging
                                                ? "bg-[#FFD700]/20"
                                                : "bg-muted/30"
                                        )}
                                    >
                                        <Upload
                                            className={cn(
                                                "w-8 h-8 transition-colors",
                                                isDragging ? "text-[#FFD700]" : "text-muted-foreground"
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <p className="font-medium text-foreground mb-1">
                                            {isDragging
                                                ? "Lepaskan file di sini"
                                                : "Drag & drop file atau klik untuk upload"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Format: JPG, PNG, PDF, DOCX (Max 10MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Uploaded Files Preview */}
                        <div className="lg:w-80">
                            <h3 className="font-medium text-foreground mb-4">
                                File yang diupload ({uploadedFiles.length})
                            </h3>

                            {uploadedFiles.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Belum ada file yang diupload
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                    {uploadedFiles.map((file) => {
                                        const FileIcon = getFileIcon(file.type);
                                        return (
                                            <div
                                                key={file.id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30"
                                            >
                                                {file.preview ? (
                                                    <img
                                                        src={file.preview}
                                                        alt={file.name}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center">
                                                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(file.id);
                                                    }}
                                                    className="p-1.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                                                    aria-label={`Hapus ${file.name}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Analyze Button */}
                            <Button
                                onClick={handleAnalyze}
                                disabled={uploadedFiles.length === 0 || isAnalyzing}
                                className={cn(
                                    "w-full mt-6 gap-2",
                                    "bg-gradient-to-r from-[#FFD700] to-[#D97706] text-black font-semibold",
                                    "hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menganalisis...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Analisis Budaya
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
});
