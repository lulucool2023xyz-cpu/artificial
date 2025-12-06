import { memo, useState } from "react";
import { Briefcase, MapPin, Clock, Users } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { toast } from "@/hooks/use-toast";

const jobOpenings = [
  {
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    description: "Lead development of AI models and algorithms for our platform."
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build beautiful and intuitive user interfaces using React and TypeScript."
  },
  {
    title: "UX Designer",
    department: "Design",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    description: "Create user experiences that blend modern design with Indonesian culture."
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    description: "Drive product strategy and roadmap for our AI platform."
  }
];

const Careers = memo(function Careers() {
  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
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
                    <span className="text-glow">Careers</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join our team and help shape the future of AI in Indonesia
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Why Join Us?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-indonesian-gold mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Innovative Culture</h3>
                        <p className="text-muted-foreground">Work on cutting-edge AI technology with a team of passionate innovators.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-6 h-6 text-indonesian-gold mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Growth Opportunities</h3>
                        <p className="text-muted-foreground">Continuous learning and career development in a fast-growing company.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-indonesian-gold mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Flexible Work</h3>
                        <p className="text-muted-foreground">Remote and hybrid work options to suit your lifestyle.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-indonesian-gold mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Work-Life Balance</h3>
                        <p className="text-muted-foreground">We believe in sustainable productivity and employee well-being.</p>
                      </div>
                    </div>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  <span className="text-glow">Open Positions</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobOpenings.map((job, index) => (
                    <ScrollReveal
                      key={index}
                      delay={0.3 + index * 0.1}
                      duration={0.7}
                      distance={30}
                    >
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                          <span className="px-3 py-1 text-xs font-semibold bg-indonesian-gold/20 text-indonesian-gold rounded-full">
                            {job.department}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <button
                          onClick={() => {
                            toast({
                              title: "Posisi Belum Dibuka",
                              description: "Mohon maaf, kami belum membuka lowongan saat ini. Tim kami sedang fokus mengejar target juara dalam perlombaan. Pantau terus halaman ini untuk update terbaru!",
                              duration: 5000,
                            });
                          }}
                          className="w-full px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all"
                        >
                          Apply Now
                        </button>
                      </OrnamentFrame>
                    </ScrollReveal>
                  ))}
                </div>
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

export default Careers;

