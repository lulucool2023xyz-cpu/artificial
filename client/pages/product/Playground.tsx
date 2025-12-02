import { memo, useState } from "react";
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

const Playground = memo(function Playground() {
  const [activeTab, setActiveTab] = useState<string>("camera");

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
                    <span className="text-glow">AI Playground</span>
                  </h1>
                  <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-6 text-muted-foreground">
                    Interactive sandbox untuk bereksperimen dengan semua fitur AI. Coba sendiri dan lihat 
                    bagaimana AI dapat membantu berbagai kebutuhan Anda.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-card/80 border border-indonesian-gold/20 mb-8">
                      <TabsTrigger value="camera" className="data-[state=active]:bg-indonesian-gold data-[state=active]:text-black">
                        <Camera className="w-4 h-4 mr-2" />
                        Camera AI
                      </TabsTrigger>
                      <TabsTrigger value="voice" className="data-[state=active]:bg-indonesian-gold data-[state=active]:text-black">
                        <Mic className="w-4 h-4 mr-2" />
                        Voice AI
                      </TabsTrigger>
                      <TabsTrigger value="deeplearning" className="data-[state=active]:bg-indonesian-gold data-[state=active]:text-black">
                        <Brain className="w-4 h-4 mr-2" />
                        Deep Learning
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="camera" className="mt-8">
                      <div className="rounded-lg p-4 border border-border bg-card/80">
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Camera AI Playground</h3>
                        <p className="text-sm mb-4 text-muted-foreground">
                          Aktifkan kamera dan coba fitur computer vision. Deteksi wajah, objek, dan dapatkan analisis real-time.
                        </p>
                        <CameraAI />
                      </div>
                    </TabsContent>

                    <TabsContent value="voice" className="mt-8">
                      <div className="rounded-lg p-4 border border-border bg-card/80">
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Voice AI Playground</h3>
                        <p className="text-sm mb-4 text-muted-foreground">
                          Coba voice recognition dengan bahasa Indonesia. Berbicara dan lihat bagaimana AI mencatat ucapan Anda.
                        </p>
                        <VoiceAI />
                      </div>
                    </TabsContent>

                    <TabsContent value="deeplearning" className="mt-8">
                      <div className="rounded-lg p-4 border border-border bg-card/80">
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Deep Learning Playground</h3>
                        <p className="text-sm mb-4 text-muted-foreground">
                          Simulasi neural network processing. Lihat visualisasi real-time dari proses deep learning.
                        </p>
                        <DeepLearningAI />
                      </div>
                    </TabsContent>
                  </Tabs>
                </OrnamentFrame>
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

export default Playground;

