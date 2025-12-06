import { memo, useState, useEffect } from "react";
import { ArrowUp, Mail, Phone } from "lucide-react";
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
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'use-license', title: 'Use License' },
  { id: 'restrictions', title: 'Restrictions' },
  { id: 'disclaimer', title: 'Disclaimer' },
  { id: 'limitations', title: 'Limitations' },
  { id: 'revisions', title: 'Revisions' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact' },
];

const Terms = memo(function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

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
                        <span className="text-glow">Terms of Service</span>
                      </h1>
                      <p className="text-muted-foreground">Terakhir diperbarui: 5 Desember 2025</p>
                    </div>
                  </ScrollReveal>

                  <div className="space-y-8">
                    <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="acceptance" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">1. Acceptance of Terms</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Dengan mengakses dan menggunakan platform Orenax, Anda menerima dan setuju untuk terikat
                              oleh syarat dan ketentuan perjanjian ini. Jika Anda tidak setuju untuk mematuhi ketentuan
                              di atas, mohon untuk tidak menggunakan layanan ini.
                            </p>
                            <p>
                              Kami berhak untuk memperbarui atau mengubah Ketentuan Layanan ini kapan saja tanpa
                              pemberitahuan sebelumnya. Penggunaan Anda yang berkelanjutan atas layanan kami setelah
                              perubahan tersebut merupakan penerimaan Anda terhadap Ketentuan Layanan yang baru.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="use-license" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">2. Use License</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Izin diberikan untuk menggunakan layanan kami secara sementara untuk penggunaan pribadi
                              dan non-komersial. Ini adalah pemberian lisensi, bukan transfer kepemilikan, dan di
                              bawah lisensi ini Anda tidak boleh:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Memodifikasi atau menyalin materi</li>
                              <li>Menggunakan materi untuk tujuan komersial</li>
                              <li>Mencoba merekayasa balik perangkat lunak apa pun</li>
                              <li>Menghapus hak cipta atau notasi kepemilikan lainnya</li>
                              <li>Mentransfer materi ke orang lain atau "mencerminkan" materi di server lain</li>
                            </ul>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="restrictions" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">3. Restrictions</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Anda tidak boleh memodifikasi, menyalin, mendistribusikan, mentransmisikan, menampilkan,
                              melaksanakan, mereproduksi, menerbitkan, melisensikan, membuat karya turunan dari,
                              mentransfer, atau menjual informasi apa pun yang diperoleh dari layanan kami tanpa
                              persetujuan tertulis sebelumnya.
                            </p>
                            <p>
                              Pelanggaran terhadap pembatasan ini dapat mengakibatkan penghentian akun Anda dan
                              tindakan hukum yang sesuai.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="disclaimer" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">4. Disclaimer</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Materi di platform kami disediakan dengan dasar 'apa adanya'. Kami tidak memberikan
                              jaminan, tersurat maupun tersirat, dan dengan ini menolak dan meniadakan semua
                              jaminan lainnya termasuk, tanpa batasan, jaminan tersirat atau kondisi dapat
                              diperjualbelikan, kesesuaian untuk tujuan tertentu, atau non-pelanggaran hak
                              kekayaan intelektual atau pelanggaran hak lainnya.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.6} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="limitations" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">5. Limitations</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Dalam keadaan apa pun Orenax atau pemasoknya tidak akan bertanggung jawab atas
                              kerusakan apa pun (termasuk, tanpa batasan, kerusakan atas kehilangan data atau
                              keuntungan, atau karena gangguan bisnis) yang timbul dari penggunaan atau
                              ketidakmampuan untuk menggunakan layanan kami.
                            </p>
                            <p>
                              Karena beberapa yurisdiksi tidak mengizinkan batasan pada jaminan tersirat, atau
                              batasan tanggung jawab untuk kerusakan konsekuensial atau insidentil, batasan ini
                              mungkin tidak berlaku untuk Anda.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.7} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="revisions" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">6. Revisions</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Materi yang muncul di platform kami mungkin termasuk kesalahan teknis, tipografi,
                              atau fotografis. Kami tidak menjamin bahwa materi apa pun di platform kami akurat,
                              lengkap, atau terkini.
                            </p>
                            <p>
                              Kami dapat membuat perubahan pada materi yang terdapat di platform kami kapan saja
                              tanpa pemberitahuan. Namun kami tidak membuat komitmen untuk memperbarui materi.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.8} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="governing-law" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">7. Governing Law</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Ketentuan Layanan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia
                              dan Anda secara tidak dapat ditarik kembali tunduk pada yurisdiksi eksklusif
                              pengadilan di negara atau lokasi tersebut.
                            </p>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </ScrollReveal>

                    <ScrollReveal delay={0.9} duration={0.7} distance={30}>
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-card/80">
                        <div id="contact" className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">8. Contact</h2>
                          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                            <p>
                              Untuk pertanyaan tentang Ketentuan Layanan ini, silakan hubungi kami:
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

export default Terms;
