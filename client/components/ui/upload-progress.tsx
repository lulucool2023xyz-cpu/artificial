import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, XCircle, File, Image, Video, Music, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

interface UploadProgressProps {
  files: UploadFile[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get file icon based on type
const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  return File;
};

// Progress bar color based on status
const getStatusColor = (status: UploadFile["status"]) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "error":
      return "bg-red-500";
    case "uploading":
      return "bg-[#C9A04F]";
    default:
      return "bg-muted-foreground";
  }
};

/**
 * File Upload Progress Component
 * 
 * Shows upload progress for multiple files with animations.
 */
export function UploadProgress({ files, onRemove, onRetry, className }: UploadProgressProps) {
  if (files.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="popLayout">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.type);
          
          return (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-card",
                file.status === "error" && "border-red-500/50 bg-red-500/10",
                file.status === "completed" && "border-emerald-500/50 bg-emerald-500/10"
              )}
            >
              {/* File Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  file.status === "completed" ? "bg-emerald-500/20" : 
                  file.status === "error" ? "bg-red-500/20" : "bg-secondary"
                )}
              >
                <FileIcon className="w-5 h-5 text-foreground" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>

                {/* Progress Bar */}
                {file.status === "uploading" && (
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", getStatusColor(file.status))}
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {/* Status Text */}
                <div className="mt-1 flex items-center justify-between">
                  {file.status === "uploading" && (
                    <span className="text-xs text-muted-foreground">
                      {file.progress}% uploaded
                    </span>
                  )}
                  {file.status === "completed" && (
                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {file.status === "error" && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {file.error || "Upload failed"}
                    </span>
                  )}
                  {file.status === "pending" && (
                    <span className="text-xs text-muted-foreground">
                      Waiting...
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-1">
                {file.status === "error" && onRetry && (
                  <button
                    onClick={() => onRetry(file.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(file.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Compact progress indicator (for inline use)
export function UploadProgressInline({ 
  progress, 
  status,
  className 
}: { 
  progress: number; 
  status: UploadFile["status"];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {status === "uploading" && (
        <>
          <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#C9A04F] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </>
      )}
      {status === "completed" && (
        <CheckCircle className="w-4 h-4 text-emerald-500" />
      )}
      {status === "error" && (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
}

// Hook for managing upload progress state
export function useUploadProgress() {
  const [files, setFiles] = React.useState<UploadFile[]>([]);

  const addFile = React.useCallback((file: File) => {
    const newFile: UploadFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "pending",
    };
    setFiles((prev) => [...prev, newFile]);
    return newFile.id;
  }, []);

  const updateProgress = React.useCallback((id: string, progress: number) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, progress, status: "uploading" as const } : f
      )
    );
  }, []);

  const setCompleted = React.useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, progress: 100, status: "completed" as const } : f
      )
    );
  }, []);

  const setError = React.useCallback((id: string, error?: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "error" as const, error } : f
      )
    );
  }, []);

  const removeFile = React.useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearCompleted = React.useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== "completed"));
  }, []);

  return {
    files,
    addFile,
    updateProgress,
    setCompleted,
    setError,
    removeFile,
    clearCompleted,
  };
}

export default UploadProgress;

