import { memo, useState } from "react";
import {
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    Clock,
    HelpCircle,
    ChevronDown,
    ExternalLink,
    Send
} from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

// FAQ Data
const faqs = [
    {
        id: 1,
        question: "Bagaimana cara menggunakan Orenax AI?",
        answer: "Setelah login, Anda bisa langsung memulai percakapan dengan AI. Pilih mode AI sesuai kebutuhan (Fast, Balanced, atau Deep), lalu ketik pertanyaan Anda atau upload file untuk dianalisis."
    },
    {
        id: 2,
        question: "Apakah data saya aman?",
        answer: "Ya, kami mengutamakan keamanan data Anda. Semua data dienkripsi dan disimpan dengan aman. Kami tidak menjual data pribadi ke pihak ketiga. Baca Privacy Policy kami untuk detail lengkap."
    },
    {
        id: 3,
        question: "Berapa lama waktu respon dukungan?",
        answer: "Tim kami biasanya merespon dalam 1-3 hari kerja melalui email. Untuk pertanyaan umum, FAQ ini mungkin sudah menjawab kebanyakan pertanyaan Anda."
    },
    {
        id: 4,
        question: "Model AI apa yang digunakan?",
        answer: "Kami menggunakan model Gemini dari Google, termasuk Gemini 2.0 Flash untuk respon cepat dan Gemini 2.5 Pro untuk analisis mendalam dengan kemampuan thinking."
    },
    {
        id: 5,
        question: "Apakah bisa upload file?",
        answer: "Ya! Anda bisa upload berbagai jenis file termasuk gambar (JPG, PNG, WebP), dokumen (PDF, TXT, DOC), dan file lainnya untuk dianalisis oleh AI."
    },
    {
        id: 6,
        question: "Bagaimana cara menghubungi tim Orenax?",
        answer: "Anda bisa menghubungi kami melalui email arieffajarmarhas@gmail.com atau WhatsApp +62-881-4554-581. Kami juga aktif di Instagram @marhasupdate."
    }
];

const Support = memo(function Support() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build mailto link
        const mailtoLink = `mailto:arieffajarmarhas@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Nama: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
        window.open(mailtoLink, "_blank");

        toast({
            title: "Email client akan terbuka",
            description: "Silakan kirim pesan melalui email client Anda.",
        });

        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" });
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
                            <Breadcrumb className="mb-8" />

                            {/* Header */}
                            <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                                <div className="text-center mb-16 sm:mb-20">
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                                        <span className="text-glow">Pusat Bantuan</span>
                                    </h1>
                                    <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                        Butuh bantuan? Kami siap membantu Anda. Temukan jawaban atau hubungi tim kami.
                                    </p>
                                </div>
                            </ScrollReveal>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* FAQ Section */}
                                <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <HelpCircle className="w-6 h-6 text-indonesian-gold" />
                                            <h2 className="text-2xl font-bold text-foreground font-heading">
                                                Pertanyaan Umum (FAQ)
                                            </h2>
                                        </div>

                                        <div className="space-y-3">
                                            {faqs.map((faq) => (
                                                <OrnamentFrame
                                                    key={faq.id}
                                                    variant="jawa"
                                                    className="border rounded-xl backdrop-blur-sm overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(faq.id)}
                                                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                                    >
                                                        <span className="font-medium text-foreground pr-4">
                                                            {faq.question}
                                                        </span>
                                                        <ChevronDown
                                                            className={cn(
                                                                "w-5 h-5 text-indonesian-gold transition-transform flex-shrink-0",
                                                                openFaq === faq.id && "rotate-180"
                                                            )}
                                                        />
                                                    </button>
                                                    <div
                                                        className={cn(
                                                            "overflow-hidden transition-all duration-300",
                                                            openFaq === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                        )}
                                                    >
                                                        <div className="px-4 pb-4 text-muted-foreground">
                                                            {faq.answer}
                                                        </div>
                                                    </div>
                                                </OrnamentFrame>
                                            ))}
                                        </div>
                                    </div>
                                </ScrollReveal>

                                {/* Contact Section */}
                                <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                                    <div className="space-y-6">
                                        {/* Contact Info Cards */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <MessageCircle className="w-6 h-6 text-indonesian-gold" />
                                            <h2 className="text-2xl font-bold text-foreground font-heading">
                                                Hubungi Kami
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* WhatsApp */}
                                            <a
                                                href="https://wa.me/628814554581"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <OrnamentFrame
                                                    variant="jawa"
                                                    className="border rounded-xl p-4 backdrop-blur-sm hover:scale-105 hover:border-green-500/50 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                            <Phone className="w-5 h-5 text-green-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">WhatsApp</p>
                                                            <p className="text-sm text-muted-foreground">+62-881-4554-581</p>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                                                    </div>
                                                </OrnamentFrame>
                                            </a>

                                            {/* Email */}
                                            <a
                                                href="mailto:arieffajarmarhas@gmail.com"
                                                className="block"
                                            >
                                                <OrnamentFrame
                                                    variant="jawa"
                                                    className="border rounded-xl p-4 backdrop-blur-sm hover:scale-105 hover:border-indonesian-gold/50 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indonesian-gold/20 flex items-center justify-center">
                                                            <Mail className="w-5 h-5 text-indonesian-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">Email</p>
                                                            <p className="text-sm text-muted-foreground truncate">arieffajarmarhas@gmail.com</p>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
                                                    </div>
                                                </OrnamentFrame>
                                            </a>

                                            {/* Instagram */}
                                            <a
                                                href="https://instagram.com/marhasupdate"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <OrnamentFrame
                                                    variant="jawa"
                                                    className="border rounded-xl p-4 backdrop-blur-sm hover:scale-105 hover:border-pink-500/50 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">Instagram</p>
                                                            <p className="text-sm text-muted-foreground">@marhasupdate</p>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                                                    </div>
                                                </OrnamentFrame>
                                            </a>

                                            {/* Response Time */}
                                            <OrnamentFrame
                                                variant="jawa"
                                                className="border rounded-xl p-4 backdrop-blur-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">Waktu Respon</p>
                                                        <p className="text-sm text-muted-foreground">1-3 hari kerja</p>
                                                    </div>
                                                </div>
                                            </OrnamentFrame>
                                        </div>

                                        {/* Location */}
                                        <OrnamentFrame
                                            variant="jawa"
                                            className="border rounded-xl p-4 backdrop-blur-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indonesian-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                    <MapPin className="w-5 h-5 text-indonesian-gold" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground mb-1">Lokasi</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Jl. Terusan Kopo No.385/299, Margahayu Sel., Kec. Margahayu, Kabupaten Bandung, Jawa Barat 40226
                                                    </p>
                                                </div>
                                            </div>
                                        </OrnamentFrame>

                                        {/* Contact Form */}
                                        <OrnamentFrame
                                            variant="jawa"
                                            className="border rounded-xl p-6 backdrop-blur-sm bg-card/80"
                                        >
                                            <h3 className="text-lg font-bold text-foreground mb-4 font-heading">
                                                Kirim Pesan
                                            </h3>
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Nama"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indonesian-gold/50 transition-colors"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="Email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indonesian-gold/50 transition-colors"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Subjek"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indonesian-gold/50 transition-colors"
                                                />
                                                <textarea
                                                    placeholder="Pesan Anda..."
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indonesian-gold/50 transition-colors resize-none"
                                                />
                                                <button
                                                    type="submit"
                                                    className="w-full px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Kirim Pesan
                                                </button>
                                            </form>
                                        </OrnamentFrame>
                                    </div>
                                </ScrollReveal>
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

export default Support;
