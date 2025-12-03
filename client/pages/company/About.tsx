import { memo } from "react";
import { Brain, Code, Zap, Globe, Users, Target, Heart, Github, Twitter, Linkedin, Mail, Sparkles } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
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
      <div className="bg-background min-h-screen">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.03]" speed={30} />
            <div className="relative z-10 max-w-7xl mx-auto">
              <Breadcrumb className="mb-8" />
              
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
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16">
                <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                  <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-8 h-8 text-indonesian-gold" />
                      <h2 className="text-2xl font-bold text-foreground">Vision</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      To become a leading AI platform that seamlessly connects modern technology with 
                      Indonesian cultural wisdom, creating intelligent solutions that are not only 
                      powerful but also deeply relevant to the cultural context and needs of Indonesian society.
                    </p>
                  </OrnamentFrame>
                </ScrollReveal>

                <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                  <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-8 h-8 text-indonesian-gold" />
                      <h2 className="text-2xl font-bold text-foreground">Mission</h2>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Develop accessible and beneficial AI technology for everyone</span>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Integrate Indonesian cultural values into cutting-edge technology</span>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Create inclusive and meaningful user experiences</span>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-indonesian-gold mt-1">•</span>
                        <span>Foster innovation and collaboration within Indonesia's AI ecosystem</span>
                      </li>
                    </ul>
                  </OrnamentFrame>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold text-foreground">Tentang Project</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      Platform AI ini adalah hasil dari visi untuk menciptakan sistem AI yang 
                      tidak hanya powerful secara teknis, tetapi juga memahami konteks budaya dan 
                      kebutuhan lokal. Kami menggabungkan berbagai kemampuan AI modern seperti 
                      voice recognition, computer vision, dan deep learning dalam satu platform 
                      yang mudah digunakan.
                    </p>
                    <p className="leading-relaxed">
                      Dengan dukungan bahasa Indonesia dan pemahaman terhadap budaya lokal, platform 
                      ini dirancang untuk menjadi asisten AI yang benar-benar relevan bagi pengguna 
                      Indonesia. Setiap fitur dikembangkan dengan mempertimbangkan bagaimana teknologi 
                      dapat memperkaya kehidupan sehari-hari sambil tetap menghormati nilai-nilai 
                      budaya yang ada.
                    </p>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
                    <span className="text-glow">Tech Stack</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {techStack.map((tech, index) => {
                      const Icon = tech.icon;
                      return (
                        <ScrollReveal key={tech.name} delay={0.6 + index * 0.1} duration={0.7} distance={30}>
                          <OrnamentFrame variant="jawa" className="border rounded-xl p-4 sm:p-6 backdrop-blur-sm text-center hover:scale-105 transition-transform">
                            <Icon className="w-8 h-8 mx-auto mb-3 text-indonesian-gold" />
                            <h3 className="text-sm sm:text-base font-bold mb-1 text-foreground">{tech.name}</h3>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                          </OrnamentFrame>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.7} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-8 h-8 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold text-foreground">Integrasi Budaya Indonesia</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      Salah satu aspek unik dari platform ini adalah integrasi elemen-elemen budaya 
                      Indonesia dalam desain dan pengalaman pengguna. Kami menggunakan pola batik, 
                      ornamen wayang, dan elemen visual lainnya yang mencerminkan kekayaan budaya 
                      Indonesia.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <IndonesianQuote quoteId="wisdom" delay={0} />
                    </div>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              <ScrollReveal delay={0.8} duration={0.7} distance={30}>
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
                    <span className="text-glow">Our Team</span>
                  </h2>
                  <div className="space-y-8">
                    <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-foreground mb-2">Created By</h3>
                          <p className="text-muted-foreground">
                            A passionate team of students from SMK Marhas Margahayu, dedicated to bringing innovative AI solutions to life.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                          {/* Arief Fajar - Solo Leveling Theme */}
                          <ScrollReveal delay={0.6} duration={0.7} distance={30}>
                            <div className="group relative overflow-hidden border border-indonesian-gold/30 rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black hover:border-indonesian-gold/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indonesian-gold/20">
                              {/* Anime Background Image */}
                              <div 
                                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-cover bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80')",
                                  filter: 'brightness(0.5) contrast(1.2)',
                                }}
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                              
                              <div className="relative z-10 p-6 sm:p-8 text-center">
                                {/* Character Image Placeholder - Solo Leveling style */}
                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indonesian-gold/50 group-hover:border-indonesian-gold transition-all duration-500 shadow-2xl shadow-indonesian-gold/30">
                                  <div 
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: "url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop&q=80')",
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-indonesian-gold/20 to-transparent" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-indonesian-gold/10 backdrop-blur-sm border-2 border-indonesian-gold/30" />
                                  </div>
                                </div>
                                
                                <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 group-hover:text-indonesian-gold transition-colors">
                                  Arief Fajar
                                </h4>
                                <div className="inline-block px-4 py-1 mb-4 bg-indonesian-gold/20 border border-indonesian-gold/40 rounded-full">
                                  <p className="text-sm font-semibold text-indonesian-gold">Application Development</p>
                                </div>
                                
                                <div className="space-y-2 mb-6 text-sm">
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Code className="w-4 h-4 text-indonesian-gold" />
                                    <span>Front End Developer</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Code className="w-4 h-4 text-indonesian-gold" />
                                    <span>Back End Developer</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Brain className="w-4 h-4 text-indonesian-gold" />
                                    <span>AI/ML Engineer</span>
                                  </div>
                                </div>
                                
                                <div className="pt-4 border-t border-indonesian-gold/20">
                                  <p className="text-xs text-muted-foreground mb-1">Class 11 PPLG 3</p>
                                  <p className="text-xs text-muted-foreground">Software & Game Development</p>
                                </div>
                                
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indonesian-gold/10 to-transparent animate-pulse" />
                                </div>
                              </div>
                            </div>
                          </ScrollReveal>

                          {/* Alif Ikhwan - Sword Art Online Theme */}
                          <ScrollReveal delay={0.7} duration={0.7} distance={30}>
                            <div className="group relative overflow-hidden border border-blue-500/30 rounded-2xl bg-gradient-to-br from-black via-blue-900/20 to-black hover:border-blue-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                              {/* Anime Background Image */}
                              <div 
                                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-cover bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80')",
                                  filter: 'brightness(0.5) contrast(1.2)',
                                }}
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                              
                              <div className="relative z-10 p-6 sm:p-8 text-center">
                                {/* Character Image Placeholder - SAO style */}
                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500/50 group-hover:border-blue-400 transition-all duration-500 shadow-2xl shadow-blue-500/30">
                                  <div 
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&q=80')",
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-blue-500/10 backdrop-blur-sm border-2 border-blue-500/30" />
                                  </div>
                                </div>
                                
                                <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors">
                                  Alif Ikhwan
                                </h4>
                                <div className="inline-block px-4 py-1 mb-4 bg-blue-500/20 border border-blue-500/40 rounded-full">
                                  <p className="text-sm font-semibold text-blue-400">Website Development</p>
                                </div>
                                
                                <div className="space-y-2 mb-6 text-sm">
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <span>UI/UX Designer</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Target className="w-4 h-4 text-blue-400" />
                                    <span>Plan Manager</span>
                                  </div>
                                </div>
                                
                                <div className="pt-4 border-t border-blue-500/20">
                                  <p className="text-xs text-muted-foreground mb-1">Class 11 PPLG 2</p>
                                  <p className="text-xs text-muted-foreground">Software & Game Development</p>
                                </div>
                                
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" />
                                </div>
                              </div>
                            </div>
                          </ScrollReveal>

                          {/* Reza Arrofi - Demon Slayer Theme */}
                          <ScrollReveal delay={0.8} duration={0.7} distance={30}>
                            <div className="group relative overflow-hidden border border-red-500/30 rounded-2xl bg-gradient-to-br from-black via-red-900/20 to-black hover:border-red-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
                              {/* Anime Background Image */}
                              <div 
                                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-cover bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80')",
                                  filter: 'brightness(0.5) contrast(1.2)',
                                }}
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                              
                              <div className="relative z-10 p-6 sm:p-8 text-center">
                                {/* Character Image Placeholder - Demon Slayer style */}
                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-red-500/50 group-hover:border-red-400 transition-all duration-500 shadow-2xl shadow-red-500/30">
                                  <div 
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop&q=80')",
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-red-500/10 backdrop-blur-sm border-2 border-red-500/30" />
                                  </div>
                                </div>
                                
                                <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 group-hover:text-red-400 transition-colors">
                                  Reza Arrofi
                                </h4>
                                <div className="inline-block px-4 py-1 mb-4 bg-red-500/20 border border-red-500/40 rounded-full">
                                  <p className="text-sm font-semibold text-red-400">Digital Marketing</p>
                                </div>
                                
                                <div className="space-y-2 mb-6 text-sm">
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Sparkles className="w-4 h-4 text-red-400" />
                                    <span>Concept Design Manager</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 text-foreground/80">
                                    <Heart className="w-4 h-4 text-red-400" />
                                    <span>Creative Leader</span>
                                  </div>
                                </div>
                                
                                <div className="pt-4 border-t border-red-500/20">
                                  <p className="text-xs text-muted-foreground mb-1">Class 10 PPLG 3</p>
                                  <p className="text-xs text-muted-foreground">Software & Game Development</p>
                                </div>
                                
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
                                </div>
                              </div>
                            </div>
                          </ScrollReveal>
                        </div>
                      </div>
                    </OrnamentFrame>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.9} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-8 h-8 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold text-foreground">Kisah Kami</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      Orenax lahir dari visi bersama tiga siswa yang ambisius di SMK Marhas Margahayu. 
                      Apa yang dimulai sebagai proyek kelas dalam Pengembangan Perangkat Lunak dan Gim (PPLG) 
                      telah berubah menjadi platform AI komprehensif yang menghubungkan teknologi canggih dengan 
                      nilai-nilai budaya Indonesia secara mulus.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Arief Fajar</strong>, siswa Kelas 11 PPLG 3, berperan sebagai 
                      lead developer dan AI/ML engineer kami. Dengan keahlian yang mencakup pengembangan full-stack, 
                      rekayasa front-end dan back-end, Arief telah menciptakan fondasi teknis yang kuat yang menggerakkan 
                      Orenax. Perhatiannya yang teliti terhadap detail dan semangatnya dalam menciptakan aplikasi yang 
                      luar biasa terlihat jelas di setiap komponen, memastikan platform kami memberikan kinerja dan 
                      keandalan yang luar biasa.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Alif Ikhwan</strong>, juga siswa Kelas 11 PPLG 2, mengkhususkan 
                      diri dalam pengembangan website, desain UI/UX, dan perencanaan proyek. Sebagai design and planning 
                      manager kami, Alif mengubah konsep teknis yang kompleks menjadi pengalaman pengguna yang intuitif 
                      dan menarik secara visual. Kemampuannya untuk menyeimbangkan desain estetika dengan persyaratan 
                      fungsional memastikan bahwa Orenax tidak hanya powerful tetapi juga mudah diakses dan menarik bagi 
                      pengguna dari berbagai latar belakang.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Reza Arrofi</strong>, siswa Kelas 10 PPLG 3, membawa kreativitas 
                      dan visi strategis ke tim kami sebagai spesialis digital marketing dan concept design manager. Sebagai 
                      creative leader kami, Reza menggerakkan identitas merek platform melalui strategi pemasaran yang inovatif 
                      dan konsep desain yang kohesif. Perspektif segarnya dan kepemimpinan kreatifnya membantu Orenax terhubung 
                      dengan audiens sambil mempertahankan kehadiran merek yang kuat dan terpadu.
                    </p>
                    <p className="leading-relaxed">
                      Bersama-sama, ketiga inovator muda dari SMK Marhas Margahayu ini telah menciptakan sesuatu yang luar biasa—sebuah 
                      platform yang menunjukkan bagaimana semangat, keterampilan teknis, dan visi kreatif dapat mengatasi hambatan 
                      tradisional. Orenax berdiri sebagai bukti dari apa yang dapat dicapai oleh siswa yang berdedikasi ketika mereka 
                      menggabungkan keahlian mereka, merangkul warisan budaya, dan bekerja sama menuju tujuan bersama.
                    </p>
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-2">SMK Marhas Margahayu</p>
                      <p className="text-sm text-muted-foreground">
                        Memberdayakan generasi berikutnya dari pengembang dan inovator Indonesia melalui pendidikan berkualitas 
                        dan pengalaman langsung dalam Pengembangan Perangkat Lunak dan Gim.
                      </p>
                    </div>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              <ScrollReveal delay={1.0} duration={0.7} distance={30}>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-8 sm:mb-12 text-foreground">
                    <span className="text-glow">Contact Us</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Github className="w-5 h-5" /> GitHub
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Twitter className="w-5 h-5" /> Twitter
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Linkedin className="w-5 h-5" /> LinkedIn
                    </a>
                    <a 
                      href="mailto:contact@orenax.com" 
                      className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Mail className="w-5 h-5" /> Email
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

