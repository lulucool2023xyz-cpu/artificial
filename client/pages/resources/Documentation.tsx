import { memo } from "react";
import { Book, Code, Zap, Settings, FileText } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const docsSections = [
  {
    icon: Zap,
    title: "Quick Start",
    content: "Get started with our AI platform in minutes. Learn the basics and start building amazing applications."
  },
  {
    icon: Code,
    title: "API Reference",
    content: "Complete API documentation with examples. Integrate our AI capabilities into your applications."
  },
  {
    icon: Settings,
    title: "Configuration",
    content: "Configure and customize the AI platform to meet your specific needs and requirements."
  },
  {
    icon: FileText,
    title: "Guides & Tutorials",
    content: "Step-by-step guides and tutorials to help you make the most of our AI platform features."
  }
];

const Documentation = memo(function Documentation() {
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
                    <span className="text-glow">Documentation</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                    Comprehensive technical documentation to help you integrate and use our AI platform effectively
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                {docsSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <ScrollReveal
                      key={index}
                      delay={0.2 + index * 0.1}
                      duration={0.7}
                      distance={30}
                    >
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <Icon className="w-8 h-8 text-indonesian-gold" />
                          <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{section.content}</p>
                      </OrnamentFrame>
                    </ScrollReveal>
                  );
                })}
              </div>

              <ScrollReveal delay={0.6} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-foreground mb-6">FAQ</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b border-border">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">How do I get started?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Start by visiting our Get Started page and following the quick start guide. You can also try our Playground to experiment with features.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b border-border">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">What languages are supported?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Our platform supports multiple languages including Indonesian, English, and many others. Voice recognition works best with Indonesian and English.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-b border-border">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">How accurate is the AI?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Our AI models are trained on large datasets and achieve high accuracy rates. Voice recognition accuracy is above 95% for Indonesian language.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">Can I integrate this into my application?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Yes! We provide comprehensive API documentation and SDKs for easy integration into your existing applications.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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

export default Documentation;

