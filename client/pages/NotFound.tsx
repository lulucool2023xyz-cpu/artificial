import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 Number with Glow Effect */}
        <div className="relative mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[150px] sm:text-[200px] font-bold text-[#FFD700]/20 blur-2xl leading-none -z-10">
            404
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Path: <code className="bg-secondary px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-[#FFD700]/30 to-[#FFA500]/20 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="absolute inset-8 bg-gradient-to-br from-[#FFD700]/40 to-[#FFA500]/30 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-[#FFD700]" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-medium hover:opacity-90 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Halaman Utama
          </button>
        </div>

        {/* Footer Credit */}
        <p className="mt-12 text-xs text-muted-foreground">
          OrenaX Platform • Dikembangkan oleh SMK Marhas Margahayu
        </p>
      </div>
    </div>
  );
};

export default NotFound;
