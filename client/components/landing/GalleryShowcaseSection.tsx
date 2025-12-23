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

// Static grid component for mobile - much lighter than 3D ring
const StaticImageGallery = memo(function StaticImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {images.slice(0, 4).map((src, index) => (
        <div
          key={index}
          className="aspect-[4/3] rounded-xl overflow-hidden border border-indonesian-gold/20 shadow-lg"
        >
          <img
            src={src}
            alt={`Gallery image ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
});

export const GalleryShowcaseSection = memo(function GalleryShowcaseSection() {
  const deviceCapability = useDeviceCapability();

  // Use static grid on mobile for better performance
  const shouldUseStaticGrid = useMemo(() => {
    return deviceCapability?.isMobile || deviceCapability?.isLowEnd;
  }, [deviceCapability?.isMobile, deviceCapability?.isLowEnd]);

  // Reduce image count for devices
  const optimizedImages = useMemo(() => {
    if (shouldUseStaticGrid) {
      // Only 4 images for static grid
      return galleryImages.slice(0, 4);
    }
    // 6 images for 3D ring on capable devices
    return galleryImages.slice(0, 6);
  }, [shouldUseStaticGrid]);

  return (
    <section
      className="section-padding section-container bg-background relative overflow-hidden"
      aria-label="Gallery showcase section"
    >
      {/* Background elements - simplified on mobile */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
      {!deviceCapability?.isMobile && (
        <>
          <BatikPattern variant="kawung" opacity="opacity-[0.02]" speed={25} />
          <WayangDecoration variant="left" size="md" className="opacity-10" />
          <WayangDecoration variant="right" size="md" className="opacity-10" />
        </>
      )}

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
              {shouldUseStaticGrid
                ? 'Jelajahi galeri budaya Indonesia'
                : 'Explore our capabilities through an immersive 3D gallery experience'}
            </p>
          </div>
        </ScrollReveal>

        {/* Gallery - Static grid on mobile, 3D ring on desktop */}
        <ScrollReveal delay={0.2} duration={0.8} distance={30}>
          <OrnamentFrame
            variant="jawa"
            className="bg-gradient-to-br from-white/5 to-white/2 border border-indonesian-gold/20 rounded-2xl backdrop-blur-sm overflow-hidden"
          >
            {shouldUseStaticGrid ? (
              // Static image grid for mobile - much lighter
              <StaticImageGallery images={optimizedImages} />
            ) : (
              // 3D ring only for capable devices
              <div className="p-4 sm:p-8 lg:p-12">
                <div
                  className="w-full flex items-center justify-center relative"
                  style={{
                    height: '600px',
                    minHeight: '400px',
                  }}
                >
                  <ThreeDImageRing
                    images={optimizedImages}
                    width={900}
                    perspective={1800}
                    imageDistance={750}
                    initialRotation={180}
                    animationDuration={1.5}
                    staggerDelay={0.15}
                    draggable={true}
                    mobileBreakpoint={768}
                    mobileScaleFactor={0.8}
                    backgroundColor="transparent"
                    containerClassName="w-full h-full"
                    autoRotate={true}
                    autoRotateSpeed={0.15}
                    imageScale={0.85}
                  />
                </div>

                {/* Instructions - only show for 3D ring */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="text-indonesian-gold/70">Drag atau scroll</span> untuk memutar galeri
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Hover pada gambar untuk fokus
                  </p>
                </div>
              </div>
            )}
          </OrnamentFrame>
        </ScrollReveal>
      </div>
    </section>
  );
});
