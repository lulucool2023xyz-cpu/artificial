import { memo } from "react";
import { Link } from "react-router-dom";
import { Home, Github, Twitter, Linkedin, Mail, Brain, Code, Zap, Globe, Users, Target, Heart } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { IndonesianQuote } from "@/components/landing/IndonesianQuote";

const techStack = [
  { name: "React 18", description: "Modern UI framework", icon: Code },
  { name: "TypeScript", description: "Type-safe development", icon: Code },
  { name: "Vite", description: "Fast build tool", icon: Zap },
  { name: "TailwindCSS", description: "Utility-first CSS", icon: Code },
  { name: "Express", description: "Backend server", icon: Code },
  { name: "AI/ML", description: "Advanced AI capabilities", icon: Brain },
];

const About = memo(function About() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="section-container py-12 sm:py-16 relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.03]" speed={30} />
            <div className="relative z-10 max-w-7xl mx-auto">
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-12 sm:mb-16">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">Tentang Kami</span>
                    <br />
                    <span className="text-foreground text-3xl sm:text-4xl md:text-5xl font-light">
                      About Us
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                    Platform AI generasi berikutnya yang menggabungkan teknologi canggih dengan 
                    nilai-nilai budaya Indonesia untuk menciptakan pengalaman yang unik dan bermakna.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-indonesian-gold/60 text-foreground font-semibold rounded-lg hover-glow transition-all">
                  >
                    <Home className="w-5 h-5" />
                    Kembali ke Home
                  </Link>
                </div>
              </ScrollReveal>

              {/* Vision & Mission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16">
                <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                  <OrnamentFrame 
                    variant="jawa" 
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-8 h-8 text-indonesian-gold" />
                      <h2 className="text-2xl font-bold text-foreground">Visi</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Menjadi platform AI terdepan yang menghubungkan teknologi modern dengan 
                      kearifan lokal Indonesia, menciptakan solusi yang tidak hanya cerdas tetapi 
                      juga relevan dengan konteks budaya dan kebutuhan masyarakat Indonesia.
                    </p>
                  </OrnamentFrame>
                </ScrollReveal>

                <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                  <OrnamentFrame 
                    variant="jawa" 
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-8 h-8 text-indonesian-gold" />
                      <h2 className="text-2xl font-bold text-foreground">Misi</h2>
                    </div>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Mengembangkan teknologi AI yang mudah diakses dan bermanfaat</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Mengintegrasikan nilai-nilai budaya Indonesia dalam teknologi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Menciptakan pengalaman pengguna yang inklusif dan bermakna</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Mendorong inovasi dan kolaborasi dalam ekosistem AI Indonesia</span>
                      </li>
                    </ul>
                  </OrnamentFrame>
                </ScrollReveal>
              </div>

              {/* Project Information */}
              <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                <OrnamentFrame 
                  variant="jawa" 
                  className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold text-foreground">Tentang Project</h2>
                  </div>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Platform AI ini adalah hasil dari visi untuk menciptakan sistem AI yang 
                      tidak hanya powerful secara teknis, tetapi juga memahami konteks budaya dan 
                      kebutuhan lokal. Kami menggabungkan berbagai kemampuan AI modern seperti 
                      voice recognition, computer vision, dan deep learning dalam satu platform 
                      yang mudah digunakan.
                    </p>
                    <p>
                      Dengan dukungan bahasa Indonesia dan pemahaman terhadap budaya lokal, platform 
                      ini dirancang untuk menjadi asisten AI yang benar-benar relevan bagi pengguna 
                      Indonesia. Setiap fitur dikembangkan dengan mempertimbangkan bagaimana teknologi 
                      dapat memperkaya kehidupan sehari-hari sambil tetap menghormati nilai-nilai 
                      budaya yang ada.
                    </p>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              {/* Tech Stack */}
              <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-foreground text-center mb-8 sm:mb-12">
                    <span className="text-glow">Tech Stack</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {techStack.map((tech, index) => {
                      const Icon = tech.icon;
                      return (
                        <ScrollReveal
                          key={tech.name}
                          delay={0.6 + index * 0.1}
                          duration={0.7}
                          distance={30}
                        >
                          <OrnamentFrame 
                            variant="jawa" 
                            className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm text-center hover:scale-105 transition-transform"
                          >
                            <Icon className="w-8 h-8 text-indonesian-gold mx-auto mb-3" />
                            <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
                              {tech.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                          </OrnamentFrame>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Team/Creator */}
              <ScrollReveal delay={0.7} duration={0.7} distance={30}>
                <OrnamentFrame 
                  variant="jawa" 
                  className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-8 h-8 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold text-foreground">Tim & Creator</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Platform ini dikembangkan oleh tim yang berkomitmen untuk menghadirkan teknologi 
                      AI terbaik dengan sentuhan budaya Indonesia. Kami percaya bahwa teknologi harus 
                      dapat diakses oleh semua orang dan memberikan nilai yang berarti.
                    </p>
                    <p>
                      Dengan latar belakang yang beragam dalam teknologi, desain, dan pemahaman budaya, 
                      tim kami bekerja sama untuk menciptakan sesuatu yang benar-benar istimewa - sebuah 
                      platform AI yang tidak hanya cerdas, tetapi juga memahami dan menghormati konteks 
                      budaya penggunanya.
                    </p>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              {/* Cultural Integration */}
              <ScrollReveal delay={0.8} duration={0.7} distance={30}>
                <OrnamentFrame 
                  variant="jawa" 
                  className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-8 h-8 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold text-foreground">Integrasi Budaya Indonesia</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Salah satu aspek unik dari platform ini adalah integrasi elemen-elemen budaya 
                      Indonesia dalam desain dan pengalaman pengguna. Kami menggunakan pola batik, 
                      ornamen wayang, dan elemen visual lainnya yang mencerminkan kekayaan budaya 
                      Indonesia.
                    </p>
                    <p>
                      Selain itu, platform ini juga dirancang untuk memahami konteks budaya Indonesia, 
                      termasuk bahasa, nilai-nilai, dan cara berpikir yang khas. Ini memungkinkan AI 
                      untuk memberikan respons yang lebih relevan dan bermakna bagi pengguna Indonesia.
                    </p>
                    <div className="mt-6 pt-6 border-t border-indonesian-gold/20">
                      <IndonesianQuote quoteId="wisdom" delay={0} />
                    </div>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              {/* Contact & Social Media */}
              <ScrollReveal delay={0.9} duration={0.7} distance={30}>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-8 sm:mb-12">
                    <span className="text-glow">Hubungi Kami</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-accent border border-indonesian-gold/20 rounded-lg text-foreground hover:bg-accent/80 hover:border-indonesian-gold/40 transition-all"
                    >
                      <Github className="w-5 h-5" />
                      GitHub
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-accent border border-indonesian-gold/20 rounded-lg text-foreground hover:bg-accent/80 hover:border-indonesian-gold/40 transition-all"
                    >
                      <Twitter className="w-5 h-5" />
                      Twitter
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-accent border border-indonesian-gold/20 rounded-lg text-foreground hover:bg-accent/80 hover:border-indonesian-gold/40 transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                      LinkedIn
                    </a>
                    <a
                      href="mailto:contact@aiplatform.com"
                      className="flex items-center gap-2 px-6 py-3 bg-accent border border-indonesian-gold/20 rounded-lg text-foreground hover:bg-accent/80 hover:border-indonesian-gold/40 transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </a>
                  </div>
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

export default About;

