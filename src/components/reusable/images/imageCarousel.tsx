import { useState, useEffect, useCallback } from 'react';
import { ImagePreview } from './imagePreview';

interface Image {
  src: string;
  alt?: string;
}

interface ImageCarouselProps {
  images: Image[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ImageCarousel({ 
  images, 
  autoPlay = false, 
  autoPlayInterval = 5000 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Create an infinite loop array
  const infiniteImages = [images[images.length - 1], ...images, images[0]];
  const infiniteIndex = currentIndex + 1; // Offset for the prepended slide

  const goToSlide = useCallback((index: number): void => {
    setTransitionEnabled(true);
    setCurrentIndex(index);
  }, []);

  const goToPrev = useCallback((): void => {
    if (currentIndex <= 0) {
      // Jump to the end without animation
      setTransitionEnabled(false);
      setCurrentIndex(images.length);
      // Force reflow to reset position before next transition
      setTimeout(() => {
        setTransitionEnabled(true);
        setCurrentIndex(images.length - 1);
      }, 0);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, images.length]);


  const goToNext = useCallback((): void => {
    if (currentIndex >= images.length - 1) {
      // Jump to the beginning without animation
      setTransitionEnabled(false);
      setCurrentIndex(-1);
      // Force reflow to reset position before next transition
      setTimeout(() => {
        setTransitionEnabled(true);
        setCurrentIndex(0);
      }, 100);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, images.length]);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent): void => {
    if(!e.currentTarget.contains(e.target as Node)) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    if(!e.currentTarget.contains(e.target as Node)) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval, goToNext]);

  return (
    <div className="max-w-full mx-auto">
      {/* Main Carousel */}
      <div 
        className="relative overflow-hidden rounded-lg aspect-video bg-gray-800"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides with infinite loop */}
        <div 
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${infiniteIndex * 100}%)`,
            transition: transitionEnabled ? 'transform 300ms ease-in-out' : 'none'
          }}
        >
          {infiniteImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 flex align-center justify-center">
              <ImagePreview
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                thumbnailClass="max-w-full max-h-full object-contain cursor-pointer"
                minScale={0.5}
                maxScale={3}
                showControls
                // loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators (Dots) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-4 grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`overflow-hidden rounded-md aspect-square transition ${index === currentIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          >
            <img
              src={image.src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
