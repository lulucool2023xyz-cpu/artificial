import { memo, useState } from "react";
import { Calendar, User, ArrowRight, X } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Full blog content with images
const blogPosts = [
  {
    id: 1,
    title: "Building Orenax with Indonesian Cultural Integration",
    excerpt: "Learn how we integrated Indonesian cultural elements into our AI platform, creating a unique user experience that celebrates local heritage.",
    date: "3 Desember 2025",
    author: "AI Team",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&h=400&fit=crop",
    content: `
Platform Orenax dibangun dengan fondasi kuat yang menggabungkan teknologi AI mutakhir dengan elemen budaya Indonesia yang kaya.

## Filosofi Desain

Kami percaya bahwa teknologi harus mencerminkan identitas penggunanya. Itulah mengapa setiap aspek Orenax - dari pola batik di latar belakang hingga warna emas khas Indonesia - dirancang untuk menciptakan pengalaman yang familiar dan bermakna bagi pengguna Indonesia.

## Elemen Budaya yang Terintegrasi

1. **Pola Batik Parang** - Melambangkan kontinuitas dan ketekunan
2. **Ornamen Jawa** - Menambah sentuhan elegan pada frame dan border
3. **Warna Indonesian Gold** - Warna utama yang melambangkan kemakmuran
4. **Wayang Decoration** - Sentuhan seni tradisional Indonesia

## Tantangan Teknis

Mengintegrasikan elemen-elemen visual ini sambil menjaga performa tinggi adalah tantangan tersendiri. Kami menggunakan teknik lazy loading dan CSS optimization untuk memastikan pengalaman yang mulus.

Hasilnya adalah platform yang tidak hanya powerful, tetapi juga bangga memamerkan warisan budaya Indonesia.
    `
  },
  {
    id: 2,
    title: "The Future of Voice Recognition in Indonesia",
    excerpt: "Exploring the challenges and opportunities of implementing voice recognition for Indonesian language, including regional dialects and accents.",
    date: "3 Desember 2025",
    author: "AI Team",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=400&fit=crop",
    content: `
Pengenalan suara dalam Bahasa Indonesia menghadapi tantangan unik yang berbeda dari bahasa lainnya.

## Keunikan Bahasa Indonesia

Indonesia memiliki lebih dari 700 bahasa daerah. Ini menciptakan variasi aksen dan dialek yang luar biasa bahkan dalam Bahasa Indonesia standar.

## Tantangan yang Kami Hadapi

1. **Variasi Aksen Regional** - Aksen Jawa berbeda dengan Sumatera atau Sulawesi
2. **Bahasa Gaul** - Bahasa informal yang terus berevolusi
3. **Code-Switching** - Pencampuran dengan bahasa daerah atau Inggris
4. **Informal vs Formal** - Perbedaan antara bahasa sehari-hari dan bahasa baku

## Solusi Kami

Kami menggunakan model AI yang dilatih khusus dengan dataset Bahasa Indonesia yang beragam, mencakup berbagai aksen dan dialek untuk meningkatkan akurasi pengenalan.

## Masa Depan

Voice recognition untuk Bahasa Indonesia akan terus berkembang. Kami berkomitmen untuk menjadi pioneer dalam bidang ini.
    `
  },
  {
    id: 3,
    title: "Deep Learning: From Theory to Practice",
    excerpt: "A deep dive into how we implemented neural networks for real-time processing, including performance optimizations and best practices.",
    date: "3 Desember 2025",
    author: "AI Team",
    category: "Technical",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    content: `
Implementasi deep learning di Orenax memerlukan keseimbangan antara kemampuan dan performa.

## Arsitektur Model

Kami menggunakan model Gemini dari Google, yang menawarkan kemampuan multimodal - memproses teks, gambar, dan suara dalam satu model.

## Optimizations yang Kami Terapkan

1. **Model Quantization** - Mengurangi ukuran model tanpa mengorbankan akurasi
2. **Streaming Response** - Menampilkan hasil secara real-time
3. **Context Caching** - Menyimpan konteks percakapan untuk efisiensi
4. **Adaptive Batching** - Mengoptimalkan penggunaan GPU

## Mode Pemrosesan

- **Fast Mode**: Respons cepat untuk pertanyaan sederhana
- **Balanced Mode**: Keseimbangan antara kecepatan dan depth
- **Deep Mode**: Analisis mendalam dengan thinking capability

## Best Practices

Kami selalu memprioritaskan keamanan data pengguna. Semua data dienkripsi dan tidak disimpan lebih lama dari yang diperlukan.

Deep learning adalah perjalanan yang terus berkembang, dan kami excited untuk terus berinovasi.
    `
  },
  {
    id: 4,
    title: "Computer Vision Applications in Everyday Life",
    excerpt: "Discover how computer vision technology can be applied to solve real-world problems, from healthcare to education and beyond.",
    date: "3 Desember 2025",
    author: "AI Team",
    category: "Applications",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    content: `
Computer vision membuka peluang tak terbatas dalam kehidupan sehari-hari.

## Aplikasi di Kesehatan

1. **Analisis Citra Medis** - Membantu dokter mendeteksi anomali
2. **Monitoring Pasien** - Pengawasan non-invasif
3. **Telemedicine** - Konsultasi jarak jauh dengan AI assistance

## Aplikasi di Pendidikan

1. **Document Scanner** - Mengkonversi catatan tulisan tangan
2. **Interactive Learning** - Mengenali objek untuk pembelajaran
3. **Accessibility** - Membantu siswa dengan kebutuhan khusus

## Bagaimana Orenax Menggunakannya

Di Orenax, Anda bisa:
- Upload gambar untuk dianalisis AI
- Mendapatkan deskripsi detail dari gambar
- Extract teks dari dokumen
- Menganalisis chart dan diagram

## Privasi dan Keamanan

Kami memproses gambar dengan standar keamanan tinggi. Gambar tidak disimpan tanpa izin pengguna.

Computer vision adalah salah satu fitur yang membuat AI benar-benar powerful untuk penggunaan sehari-hari.
    `
  }
];

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  content: string;
}

const Blog = memo(function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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
                    <OrnamentFrame
                      variant="jawa"
                      className="border rounded-xl backdrop-blur-sm h-full flex flex-col hover:scale-105 transition-transform overflow-hidden"
                    >
                      {/* Blog Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold bg-indonesian-gold/90 text-black rounded-full">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-6 sm:p-8 flex flex-col flex-1">
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
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="inline-flex items-center gap-2 text-indonesian-gold hover:text-white transition-colors font-medium"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </OrnamentFrame>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
        <BackToTop />

        {/* Blog Post Modal */}
        <Dialog open={selectedPost !== null} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] border-2 border-indonesian-gold/20 p-0 overflow-hidden">
            {selectedPost && (
              <div className="relative">
                {/* Header Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="px-3 py-1 text-xs font-semibold bg-indonesian-gold/90 text-black rounded-full">
                      {selectedPost.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 font-heading">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedPost.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedPost.author}</span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {selectedPost.content.split('\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h3 key={idx} className="text-xl font-bold text-indonesian-gold mt-6 mb-3">
                            {paragraph.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                        return (
                          <p key={idx} className="text-muted-foreground ml-4 my-1">
                            {paragraph}
                          </p>
                        );
                      }
                      if (paragraph.trim()) {
                        return (
                          <p key={idx} className="text-muted-foreground mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
});

export default Blog;
