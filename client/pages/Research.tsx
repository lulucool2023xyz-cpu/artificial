import { memo } from "react";
import { Book, Code, Zap, Settings, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const researchSections = [
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

const Research = memo(function Research() {
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
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">Research</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground mb-8">
                    Everything you need to know about using Orenax
                  </p>
                  
                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search research..."
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:ring-offset-2 focus:ring-offset-background"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {researchSections.map((section, index) => {
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

              {/* Additional Research Content */}
              <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                <div className="mt-12">
                  <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">Research Resources</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        Explore our comprehensive research resources, documentation, and guides to help you get the most out of Orenax.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <Link
                          to="/resources/documentation"
                          className="p-4 border border-border rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
                          <p className="text-sm">Complete API reference and guides</p>
                        </Link>
                        <Link
                          to="/resources/blog"
                          className="p-4 border border-border rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <h3 className="font-semibold text-foreground mb-2">Blog</h3>
                          <p className="text-sm">Latest updates and insights</p>
                        </Link>
                      </div>
                    </div>
                  </OrnamentFrame>
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

export default Research;






