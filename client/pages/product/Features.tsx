import { memo } from "react";
import { Mic, Camera, Brain, MessageSquare, Sparkles } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const features = [
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Natural speech recognition and AI-powered responses with advanced audio synthesis. Supports Indonesian language with high accuracy.",
  },
  {
    icon: Camera,
    title: "Live Camera Access",
    description: "Real-time face and object detection powered by cutting-edge computer vision. Analyze images instantly with AI processing.",
  },
  {
    icon: Brain,
    title: "Deep Reasoning",
    description: "Advanced DeepThink mode for complex analysis and multi-step problem solving. Think through problems systematically.",
  },
  {
    icon: MessageSquare,
    title: "Smart Chat",
    description: "Contextual conversations with intelligent memory and adaptive responses. Understands context and maintains conversation flow.",
  },
  {
    icon: Sparkles,
    title: "Cultural Insights",
    description: "Knowledge engine connecting global perspectives and cultural understanding. Integrates Indonesian cultural elements seamlessly.",
  }
];

const Features = memo(function Features() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="kawung" opacity="opacity-[0.02]" speed={25} />
            
            <div className="relative z-10 max-w-7xl mx-auto">
              <Breadcrumb className="mb-8" />
              
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-16 sm:mb-20">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">AI Features</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                    Five powerful AI features working together to create an unprecedented platform for human-machine interaction
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollReveal
                      key={index}
                      delay={0.2 + index * 0.1}
                      duration={0.7}
                      distance={30}
                    >
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm h-full flex flex-col">
                        <div className="mb-4 inline-flex">
                          <div className="p-3 sm:p-4 rounded-lg border border-indonesian-gold/40 bg-indonesian-gold/20">
                            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-indonesian-gold" />
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold font-heading mb-3 text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground flex-1">
                          {feature.description}
                        </p>
                      </OrnamentFrame>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
});

export default Features;

