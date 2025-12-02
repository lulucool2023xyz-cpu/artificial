import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Book, Code, Zap } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const steps = [
  {
    icon: Play,
    title: "Try the Demo",
    description: "Start by exploring our interactive demos. See how voice recognition, computer vision, and deep learning work in action.",
    link: "/product/demo",
    linkText: "View Demo"
  },
  {
    icon: Book,
    title: "Read Documentation",
    description: "Learn how to integrate our AI capabilities into your applications with comprehensive guides and API references.",
    link: "/resources/documentation",
    linkText: "Read Docs"
  },
  {
    icon: Code,
    title: "Explore Playground",
    description: "Experiment with all features in our interactive playground. Test different inputs and see how AI responds.",
    link: "/product/playground",
    linkText: "Open Playground"
  },
  {
    icon: Zap,
    title: "Get Started",
    description: "Ready to build? Follow our quick start guide to integrate AI capabilities into your project.",
    link: "/resources/documentation",
    linkText: "Quick Start"
  }
];

const GetStarted = memo(function GetStarted() {
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
                    <span className="text-glow">Get Started</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                    Quick start guide to begin your journey with our AI platform
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <ScrollReveal
                      key={index}
                      delay={0.2 + index * 0.1}
                      duration={0.7}
                      distance={30}
                    >
                      <OrnamentFrame 
                        variant="jawa" 
                        className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm h-full flex flex-col"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 rounded-lg border border-indonesian-gold/40 bg-indonesian-gold/20">
                            <Icon className="w-6 h-6 text-indonesian-gold" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-6 flex-1">{step.description}</p>
                        <Link
                          to={step.link}
                          className="inline-flex items-center gap-2 text-indonesian-gold hover:text-white transition-colors"
                        >
                          {step.linkText}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </OrnamentFrame>
                    </ScrollReveal>
                  );
                })}
              </div>

              <ScrollReveal delay={0.6} duration={0.7} distance={30}>
                <OrnamentFrame 
                  variant="jawa" 
                  className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm text-center"
                >
                  <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose your path and begin exploring the possibilities with our AI platform
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      to="/product/demo"
                      className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Try Demo
                    </Link>
                    <Link
                      to="/product/playground"
                      className="px-6 py-3 border-2 border-indonesian-gold text-foreground font-semibold rounded-lg hover:bg-indonesian-gold/20 transition-all"
                    >
                      Open Playground
                    </Link>
                  </div>
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

export default GetStarted;

