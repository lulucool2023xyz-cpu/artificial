import { memo } from "react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const Terms = memo(function Terms() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={30} />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <Breadcrumb className="mb-8" />
              
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4">
                    <span className="text-glow">Terms of Service</span>
                  </h1>
                  <p className="text-muted-foreground">Last updated: January 2024</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
                      <p className="text-muted-foreground">
                        By accessing and using this platform, you accept and agree to be bound by the terms and 
                        provision of this agreement. If you do not agree to abide by the above, please do not 
                        use this service.
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">2. Use License</h2>
                      <p className="text-muted-foreground">
                        Permission is granted to temporarily use our services for personal, non-commercial 
                        transitory viewing only. This is the grant of a license, not a transfer of title, and 
                        under this license you may not modify or copy the materials.
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">3. Restrictions</h2>
                      <p className="text-muted-foreground">
                        You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, 
                        license, create derivative works from, transfer, or sell any information obtained from 
                        our services without prior written consent.
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">4. Disclaimer</h2>
                      <p className="text-muted-foreground">
                        The materials on our platform are provided on an 'as is' basis. We make no warranties, 
                        expressed or implied, and hereby disclaim and negate all other warranties including, 
                        without limitation, implied warranties or conditions of merchantability.
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">5. Limitations</h2>
                      <p className="text-muted-foreground">
                        In no event shall our company or its suppliers be liable for any damages (including, 
                        without limitation, damages for loss of data or profit, or due to business interruption) 
                        arising out of the use or inability to use our services.
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">6. Contact</h2>
                      <p className="text-muted-foreground">
                        For questions about these Terms of Service, please contact us at legal@aiplatform.com
                      </p>
                    </div>
                  </div>
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

export default Terms;

