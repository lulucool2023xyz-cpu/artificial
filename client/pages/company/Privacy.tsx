import { memo, useState, useEffect } from "react";
import { ArrowUp, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { cn } from "@/lib/utils";

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-collect', title: 'Information We Collect' },
  { id: 'how-we-use', title: 'How We Use Your Information' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'cookies-tracking', title: 'Cookies & Tracking' },
  { id: 'third-party', title: 'Third-Party Services' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'contact', title: 'Contact Us' },
];

const Privacy = memo(function Privacy() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Update active section based on scroll position
      const sectionElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={30} />

            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Table of Contents (Desktop) */}
                <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                  <div className="sticky top-24">
                    <OrnamentFrame variant="jawa" className="border rounded-xl p-6 backdrop-blur-sm bg-card/80">
                      <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Table of Contents</h3>
                      <nav className="space-y-2">
                        {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300",
                              activeSection === section.id
                                ? "bg-indonesian-gold/20 text-indonesian-gold border-l-2 border-indonesian-gold"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            {section.title}
                          </button>
                        ))}
                      </nav>
                    </OrnamentFrame>
                  </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 max-w-4xl">
                  <Breadcrumb className="mb-8" />

                  <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                    <div className="text-center mb-12">
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4">
                        <span className="text-glow">Privacy Policy</span>
                      </h1>
                      <p className="text-muted-foreground">Terakhir diperbarui: 5 Desember 2025</p>
                    </div>
                  </ScrollReveal>

                  <div className="space-y-8">
                    <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="introduction" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">1. Introduction</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Kami menghormati privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda.
                              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi
                              informasi Anda saat menggunakan platform AI kami.
                            </p>
                            <p>
                              Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
                              Jika Anda tidak setuju dengan kebijakan ini, mohon untuk tidak menggunakan layanan kami.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="information-collect" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">2. Information We Collect</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>Kami mengumpulkan informasi berikut:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Informasi yang Anda berikan langsung: nama, email, password, dan informasi lain saat registrasi</li>
                              <li>Data penggunaan: bagaimana Anda berinteraksi dengan platform, fitur yang digunakan, dan waktu penggunaan</li>
                              <li>Data teknis: alamat IP, jenis browser, perangkat yang digunakan, dan informasi sistem</li>
                              <li>Cookies dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna</li>
                            </ul>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="how-we-use" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">3. How We Use Your Information</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
                              <li>Memproses transaksi dan mengelola akun Anda</li>
                              <li>Mengirimkan notifikasi teknis dan pesan dukungan</li>
                              <li>Menganalisis penggunaan platform untuk perbaikan produk</li>
                              <li>Mencegah aktivitas penipuan dan memastikan keamanan</li>
                            </ul>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="data-security" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">4. Data Security</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda
                              dari akses tidak sah, perubahan, pengungkapan, atau penghancuran. Ini termasuk:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Enkripsi data dalam transit dan saat istirahat</li>
                              <li>Autentikasi dan otorisasi yang kuat</li>
                              <li>Pemantauan keamanan secara berkala</li>
                              <li>Pelatihan staf tentang praktik keamanan data</li>
                            </ul>
                            <p className="text-muted-foreground text-sm mt-4">
                              Namun, tidak ada metode transmisi melalui Internet yang 100% aman. Meskipun kami berusaha
                              melindungi informasi Anda, kami tidak dapat menjamin keamanan absolut.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.6} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="cookies-tracking" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">5. Cookies & Tracking</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Kami menggunakan cookies dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda.
                              Cookies adalah file teks kecil yang disimpan di perangkat Anda.
                            </p>
                            <p>Jenis cookies yang kami gunakan:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li><strong>Essential Cookies:</strong> Diperlukan untuk fungsi dasar platform</li>
                              <li><strong>Analytics Cookies:</strong> Membantu kami memahami bagaimana pengguna berinteraksi dengan platform</li>
                              <li><strong>Preference Cookies:</strong> Mengingat preferensi dan pengaturan Anda</li>
                            </ul>
                            <p>
                              Anda dapat mengontrol cookies melalui pengaturan browser Anda, namun ini dapat mempengaruhi
                              fungsionalitas platform.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.7} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="third-party" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">6. Third-Party Services</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Kami dapat menggunakan layanan pihak ketiga untuk membantu mengoperasikan platform dan
                              melayani pengguna. Layanan ini mungkin memiliki akses ke informasi Anda untuk melakukan
                              tugas atas nama kami.
                            </p>
                            <p>
                              Kami memastikan bahwa semua pihak ketiga mematuhi standar privasi yang sama dan hanya
                              menggunakan informasi untuk tujuan yang ditentukan.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.8} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="your-rights" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">7. Your Rights</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>Anda memiliki hak berikut terkait data pribadi Anda:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li><strong>Akses:</strong> Meminta salinan data pribadi yang kami miliki tentang Anda</li>
                              <li><strong>Perbaikan:</strong> Meminta koreksi data yang tidak akurat atau tidak lengkap</li>
                              <li><strong>Penghapusan:</strong> Meminta penghapusan data pribadi Anda</li>
                              <li><strong>Pembatasan:</strong> Meminta pembatasan pemrosesan data Anda</li>
                              <li><strong>Portabilitas:</strong> Meminta transfer data Anda ke layanan lain</li>
                              <li><strong>Keberatan:</strong> Menolak pemrosesan data Anda untuk tujuan tertentu</li>
                            </ul>
                            <p>
                              Untuk menggunakan hak-hak ini, silakan hubungi kami di privacy@aiplatform.com
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.9} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="contact" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">8. Contact Us</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini,
                              silakan hubungi kami:
                            </p>
                            <div className="bg-black/30 rounded-lg p-4 space-y-3 border border-indonesian-gold/20">
                              <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indonesian-gold" />
                                <div>
                                  <p className="font-medium text-foreground">Email</p>
                                  <p className="text-muted-foreground">arieffajarmarhas@gmail.com</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-indonesian-gold" />
                                <div>
                                  <p className="font-medium text-foreground">WhatsApp</p>
                                  <p className="text-muted-foreground">+62-881-4554-581</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-indonesian-gold mt-1" />
                                <div>
                                  <p className="font-medium text-foreground">Alamat</p>
                                  <p className="text-muted-foreground text-sm">Jl. Terusan Kopo No.385/299, Margahayu Sel., Kec. Margahayu, Kabupaten Bandung, Jawa Barat 40226</p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground pt-2 border-t border-border"><strong>Waktu Respon:</strong> 1-3 hari kerja</p>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-4">
                              <a
                                href="https://wa.me/628814554581"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                WhatsApp
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href="mailto:arieffajarmarhas@gmail.com"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indonesian-gold hover:bg-indonesian-gold/90 text-black rounded-lg transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                                Email
                              </a>
                            </div>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>
                  </div>
                </div>
              </div>

              {/* Back to Top Button */}
              {showBackToTop && (
                <button
                  onClick={scrollToTop}
                  className="fixed bottom-8 right-8 p-4 bg-indonesian-gold text-black rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50"
                  aria-label="Back to top"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
              )}
            </div>
          </section>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
});

export default Privacy;


