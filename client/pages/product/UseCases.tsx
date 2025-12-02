import { memo } from "react";
import { Briefcase, GraduationCap, Building2, Heart, ShoppingCart, Lightbulb } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const useCases = [
  {
    icon: Briefcase,
    title: "Business Automation",
    description: "Streamline business processes with AI-powered automation. Handle customer inquiries, analyze data, and generate reports automatically.",
    examples: ["Customer Support", "Data Analysis", "Report Generation", "Process Optimization"]
  },
  {
    icon: GraduationCap,
    title: "Education & Learning",
    description: "Enhance learning experiences with personalized AI tutoring. Support multiple languages including Indonesian for better accessibility.",
    examples: ["Personalized Tutoring", "Language Learning", "Content Translation", "Interactive Q&A"]
  },
  {
    icon: Building2,
    title: "Enterprise Solutions",
    description: "Powerful AI tools for enterprise needs. Integrate seamlessly with existing systems and workflows.",
    examples: ["Document Processing", "Meeting Transcription", "Smart Search", "Knowledge Management"]
  },
  {
    icon: Heart,
    title: "Healthcare Support",
    description: "AI assistance for healthcare professionals. Help with documentation, patient information, and medical research.",
    examples: ["Medical Documentation", "Patient Information", "Research Assistance", "Appointment Scheduling"]
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Enhance online shopping experiences with AI-powered recommendations, customer service, and product analysis.",
    examples: ["Product Recommendations", "Customer Service", "Image Search", "Review Analysis"]
  },
  {
    icon: Lightbulb,
    title: "Creative Industries",
    description: "Unlock creativity with AI assistance for content creation, design, and multimedia production.",
    examples: ["Content Creation", "Design Assistance", "Video Analysis", "Music Generation"]
  }
];

const UseCases = memo(function UseCases() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={30} />
            
            <div className="relative z-10 max-w-7xl mx-auto">
              <Breadcrumb className="mb-8" />
              
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-16 sm:mb-20">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">Use Cases</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                    Discover real-world applications of our AI platform across various industries and use cases
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {useCases.map((useCase, index) => {
                  const Icon = useCase.icon;
                  return (
                    <ScrollReveal
                      key={index}
                      delay={0.2 + index * 0.1}
                      duration={0.7}
                      distance={30}
                    >
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <Icon className="w-6 h-6 text-indonesian-gold" />
                          <h3 className="text-xl font-bold text-foreground">{useCase.title}</h3>
                        </div>
                        <p className="mb-4 flex-1 text-muted-foreground">{useCase.description}</p>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold mb-2 text-indonesian-gold">Examples:</p>
                          <ul className="space-y-1">
                            {useCase.examples.map((example, i) => (
                              <li key={i} className="text-sm flex items-center gap-2 text-muted-foreground">
                                <span className="text-indonesian-gold">•</span>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
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

export default UseCases;

