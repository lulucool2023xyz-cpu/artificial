import { memo } from "react";
import { Camera, Mic, Brain } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CameraAI } from "@/components/landing/CameraAI";
import { VoiceAI } from "@/components/landing/VoiceAI";
import { DeepLearningAI } from "@/components/landing/DeepLearningAI";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const Demo = memo(function Demo() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <div className="relative z-10 max-w-7xl mx-auto">
              <Breadcrumb className="mb-8" />
              
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-8 sm:mb-12">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">AI Demo Center</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                    Eksplorasi semua fitur AI kami secara langsung. Uji kemampuan voice recognition, 
                    computer vision, dan deep learning dalam satu platform terintegrasi.
                  </p>
                </div>
              </ScrollReveal>

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
                    <OrnamentFrame variant="jawa" className="border rounded-xl p-6 backdrop-blur-sm">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                        <Camera className="w-6 h-6 text-indonesian-gold" />
                        Live Camera AI Demo
                      </h2>
                      <p className="mb-6 text-muted-foreground">
                        Uji kemampuan computer vision dengan live camera. Sistem akan mendeteksi wajah, 
                        objek, dan memberikan analisis real-time menggunakan teknologi AI terdepan.
                      </p>
                      <CameraAI />
                    </OrnamentFrame>
                  </TabsContent>

                  <TabsContent value="voice" className="mt-8">
                    <OrnamentFrame variant="jawa" className="border rounded-xl p-6 backdrop-blur-sm">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                        <Mic className="w-6 h-6 text-indonesian-gold" />
                        Voice Recognition Demo
                      </h2>
                      <p className="mb-6 text-muted-foreground">
                        Coba fitur voice recognition yang mendukung bahasa Indonesia. Sistem akan 
                        mencatat dan memproses ucapan Anda secara real-time dengan akurasi tinggi.
                      </p>
                      <VoiceAI />
                    </OrnamentFrame>
                  </TabsContent>

                  <TabsContent value="deeplearning" className="mt-8">
                    <OrnamentFrame variant="jawa" className="border rounded-xl p-6 backdrop-blur-sm">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                        <Brain className="w-6 h-6 text-indonesian-gold" />
                        Deep Learning Processing Demo
                      </h2>
                      <p className="mb-6 text-muted-foreground">
                        Simulasi neural network processing dengan visualisasi real-time. Lihat bagaimana 
                        AI memproses data melalui berbagai layer dan menghasilkan prediksi akurat.
                      </p>
                      <DeepLearningAI />
                    </OrnamentFrame>
                  </TabsContent>
                </Tabs>
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

