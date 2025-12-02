import { memo } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
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

const blogPosts = [
  {
    id: 1,
    title: "Building an AI Platform with Indonesian Cultural Integration",
    excerpt: "Learn how we integrated Indonesian cultural elements into our AI platform, creating a unique user experience that celebrates local heritage.",
    date: "2024-01-15",
    author: "AI Team",
    category: "Development"
  },
  {
    id: 2,
    title: "The Future of Voice Recognition in Indonesia",
    excerpt: "Exploring the challenges and opportunities of implementing voice recognition for Indonesian language, including regional dialects and accents.",
    date: "2024-01-10",
    author: "AI Team",
    category: "Technology"
  },
  {
    id: 3,
    title: "Deep Learning: From Theory to Practice",
    excerpt: "A deep dive into how we implemented neural networks for real-time processing, including performance optimizations and best practices.",
    date: "2024-01-05",
    author: "AI Team",
    category: "Technical"
  },
  {
    id: 4,
    title: "Computer Vision Applications in Everyday Life",
    excerpt: "Discover how computer vision technology can be applied to solve real-world problems, from healthcare to education and beyond.",
    date: "2024-01-01",
    author: "AI Team",
    category: "Applications"
  }
];

const Blog = memo(function Blog() {
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
                    <span className="text-glow">Blog</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                    Development journey, project updates, and behind the scenes stories from our team
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {blogPosts.map((post, index) => (
                  <ScrollReveal
                    key={post.id}
                    delay={0.2 + index * 0.1}
                    duration={0.7}
                    distance={30}
                  >
                    <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm h-full flex flex-col hover:scale-105 transition-transform">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-semibold bg-indonesian-gold/20 text-indonesian-gold rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{post.title}</h3>
                      <p className="mb-4 flex-1 text-muted-foreground">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm mb-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="inline-flex items-center gap-2 text-indonesian-gold hover:text-white transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </OrnamentFrame>
                  </ScrollReveal>
                ))}
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

export default Blog;

