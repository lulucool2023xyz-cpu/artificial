import { memo, useMemo } from 'react';
import { BackgroundGrid } from './BackgroundGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { WayangDecoration } from './WayangDecoration';
import { OrnamentFrame } from './OrnamentFrame';
import { ThreeDImageRing } from '@/components/ui/ThreeDImageRing';
import { useDeviceCapability } from '@/utils/deviceCapability';

// Gambar-gambar budaya Indonesia dari folder public
const galleryImages = [
  '/Bali.jpeg',
  '/Batik.jpeg',
  '/Borobudur.jpeg',
  '/Ngaben.jpeg',
  '/Reog.png',
  '/RumahGadang.jpeg',
  '/WAYANG.jpeg',
  '/asmat.jpeg',
  '/tarian.jpeg',
];

export const GalleryShowcaseSection = memo(function GalleryShowcaseSection() {
  const deviceCapability = useDeviceCapability();
  
  // Reduce image count for low-end devices
  const optimizedImages = useMemo(() => {
    if (deviceCapability?.isLowEnd) {
      // Only load first 6 images for low-end devices
      return galleryImages.slice(0, 6);
    }
    return galleryImages;
  }, [deviceCapability?.isLowEnd]);

  return (
    <section 
      className="section-padding section-container bg-background relative overflow-hidden"
      aria-label="Gallery showcase section"
    >
      {/* Background elements */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
      <BatikPattern variant="kawung" opacity="opacity-[0.02]" speed={25} />
      <WayangDecoration variant="left" size="md" className="opacity-10" />
      <WayangDecoration variant="right" size="md" className="opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <ScrollReveal delay={0.1} duration={0.7} distance={30}>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6">
              <span className="text-foreground">Visual Showcase</span>
              <br />
              <span className="text-indonesian-gold/80 text-2xl sm:text-3xl md:text-4xl font-light">
                Galeri Visual
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indonesian-gold/60 to-transparent mx-auto opacity-60 mb-4"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our capabilities through an immersive 3D gallery experience
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Image Ring Gallery */}
        <ScrollReveal delay={0.2} duration={0.8} distance={30}>
          <div
            style={{
              boxShadow: "inset 0 0 40px rgba(255, 255, 255, 0.05), 0 0 60px rgba(217, 119, 6, 0.1)",
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 0 50px rgba(255, 255, 255, 0.08), 0 0 80px rgba(217, 119, 6, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 0 40px rgba(255, 255, 255, 0.05), 0 0 60px rgba(217, 119, 6, 0.1)";
            }}
          >
          <OrnamentFrame 
            variant="jawa" 
            className="bg-gradient-to-br from-white/5 to-white/2 border border-indonesian-gold/20 rounded-2xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-8 sm:p-12">
              <div 
                className="w-full flex items-center justify-center"
                style={{ 
                  height: '600px',
                  minHeight: '500px',
                }}
              >
                <ThreeDImageRing
                  images={optimizedImages}
                  width={deviceCapability?.isLowEnd ? 800 : 1200}
                  perspective={deviceCapability?.isLowEnd ? 1500 : 2000}
                  imageDistance={deviceCapability?.isLowEnd ? 600 : 900}
                  initialRotation={180}
                  animationDuration={deviceCapability?.isLowEnd ? 1.0 : 1.5}
                  staggerDelay={deviceCapability?.isLowEnd ? 0.1 : 0.15}
                  hoverOpacity={0.4}
                  draggable={!deviceCapability?.isLowEnd}
                  mobileBreakpoint={768}
                  mobileScaleFactor={deviceCapability?.isLowEnd ? 0.5 : 0.7}
                  inertiaPower={0.85}
                  inertiaTimeConstant={350}
                  inertiaVelocityMultiplier={18}
                  backgroundColor="transparent"
                />
              </div>
              
              {/* Instructions */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="text-indonesian-gold/70">Drag atau scroll</span> untuk memutar galeri
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Hover pada gambar untuk fokus
                </p>
              </div>
            </div>
          </OrnamentFrame>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

