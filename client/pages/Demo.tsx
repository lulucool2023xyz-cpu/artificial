import { memo } from "react";
import { Link } from "react-router-dom";
import { Home, Camera, Mic, Brain } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { CameraAI } from "@/components/landing/CameraAI";
import { VoiceAI } from "@/components/landing/VoiceAI";
import { DeepLearningAI } from "@/components/landing/DeepLearningAI";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Demo = memo(function Demo() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="section-container py-12 sm:py-16 relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <div className="relative z-10 max-w-7xl mx-auto">
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-8 sm:mb-12">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">AI Demo Center</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                    Eksplorasi semua fitur AI kami secara langsung. Uji kemampuan voice recognition,
                    computer vision, dan deep learning dalam satu platform terintegrasi.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-indonesian-gold/60 text-foreground font-semibold rounded-lg hover-glow transition-all"
                  >
                    <Home className="w-5 h-5" />
                    Kembali ke Home
                  </Link>
                </div>
              </ScrollReveal>

              {/* Demo Tabs */}
              <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                <Tabs defaultValue="camera" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-card/80 border border-indonesian-gold/20 mb-8">
                    <TabsTrigger
                      value="camera"
                      className="data-[state=active]:bg-indonesian-gold data-[state=active]:text-black"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Camera AI
                    </TabsTrigger>
                    <TabsTrigger
                      value="voice"
                      className="data-[state=active]:bg-indonesian-gold data-[state=active]:text-black"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Voice AI
                    </TabsTrigger>
                    <TabsTrigger
                      value="deeplearning"
                      className="data-[state=active]:bg-indonesian-gold data-[state=active]:text-black"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Deep Learning
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="camera" className="mt-8">
                    <div className="space-y-6">
                      <div className="bg-card/80 border border-indonesian-gold/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Camera className="w-6 h-6 text-indonesian-gold" />
                          Live Camera AI Demo
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Uji kemampuan computer vision dengan live camera. Sistem akan mendeteksi wajah,
                          objek, dan memberikan analisis real-time menggunakan teknologi AI terdepan.
                        </p>
                        <CameraAI />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="mt-8">
                    <div className="space-y-6">
                      <div className="bg-card/80 border border-indonesian-gold/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Mic className="w-6 h-6 text-indonesian-gold" />
                          Live Voice Recognition Demo
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Coba fitur voice recognition yang mendukung bahasa Indonesia. Sistem akan
                          mencatat dan memproses ucapan Anda secara real-time dengan akurasi tinggi.
                        </p>
                        <VoiceAI />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="deeplearning" className="mt-8">
                    <div className="space-y-6">
                      <div className="bg-card/80 border border-indonesian-gold/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Brain className="w-6 h-6 text-indonesian-gold" />
                          Deep Learning Analysis Demo
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Simulasi neural network processing dengan visualisasi real-time. Lihat bagaimana
                          AI memproses data melalui berbagai layer dan menghasilkan prediksi akurat.
                        </p>
                        <DeepLearningAI />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollReveal>

              {/* Info Section */}
              <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                <div className="mt-12 sm:mt-16 bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-foreground mb-4">Tips Penggunaan</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-indonesian-gold mt-1">•</span>
                      <span>Pastikan browser Anda mengizinkan akses kamera dan microphone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indonesian-gold mt-1">•</span>
                      <span>Gunakan Chrome, Edge, atau Safari untuk pengalaman terbaik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indonesian-gold mt-1">•</span>
                      <span>Untuk voice recognition, berbicara dengan jelas dan hindari noise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indonesian-gold mt-1">•</span>
                      <span>Deep learning processing membutuhkan beberapa detik untuk menyelesaikan</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
});

export default Demo;

