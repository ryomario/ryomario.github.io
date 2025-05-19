import makePassiveEventOption from '@/utils/makePassiveEventOption';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Transform = {
  scale: number;
  translation: { x: number; y: number };
};

type TranslationBounds = {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
};

type ImagePreviewProps = {
  src: string;
  alt: string;
  previewClass?: string;
  thumbnailClass?: string;
  onInteraction?: (transform: Transform) => void;

  defaultScale?: number;
  defaultTranslation?: { x: number; y: number };
  maxScale?: number;
  minScale?: number;
  disableZoom?: boolean;
  disablePan?: boolean;
  showControls?: boolean;

  translationBounds?: TranslationBounds;
};

export function ImagePreview({
  src,
  alt,
  thumbnailClass = 'w-24 h-24 object-cover rounded-md cursor-pointer',
  previewClass = 'max-w-[90vw] max-h-[90vh] object-contain m-auto',
  onInteraction,
  defaultScale = 1,
  defaultTranslation = { x: 0, y: 0 },
  minScale = 0.1,
  maxScale = 5,
  disableZoom = false,
  disablePan = false,
  showControls = false,
  translationBounds = {},
}: ImagePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  const [transform, setTransform] = useState<Transform>({
    scale: defaultScale,
    translation: defaultTranslation,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const initialDistance = useRef<number>(null);
  
  // Update transform and call callback
  const updateTransform = useCallback(
    (newTransform: Transform) => {
      setTransform(newTransform);
      if (onInteraction) {
        onInteraction(newTransform);
      }
    },
    [setTransform, onInteraction]
  );
  
  // Handle zoom controls
  const zoomIn = useCallback(() => {
    if (disableZoom) return;
    const newScale = Math.min(maxScale, transform.scale * 1.2);
    updateTransform({
      ...transform,
      scale: newScale,
    });
  }, [disableZoom, maxScale, transform, updateTransform]);

  const zoomOut = useCallback(() => {
    if (disableZoom) return;
    const newScale = Math.max(minScale, transform.scale * 0.8);
    updateTransform({
      ...transform,
      scale: newScale,
    });
  }, [disableZoom, minScale, transform, updateTransform]);

  const reset = useCallback(() => {
    if(
      transform.scale == defaultScale
      && transform.translation.x == defaultTranslation.x
      && transform.translation.y == defaultTranslation.y
    ) return;
    updateTransform({
      scale: defaultScale,
      translation: defaultTranslation,
    });
  }, [defaultScale, defaultTranslation, transform, updateTransform]);

  // Handle wheel event for zooming
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (disableZoom) return;
      e.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      // Get mouse position relative to container
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate the position relative to the transformed content
      const contentX = (mouseX - transform.translation.x) / transform.scale;
      const contentY = (mouseY - transform.translation.y) / transform.scale;

      // Calculate new scale
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      let newScale = transform.scale * delta;

      // Apply scale constraints
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      // Calculate new translation to keep the content under the mouse stable
      const newTranslation = {
        x: mouseX - contentX * newScale,
        y: mouseY - contentY * newScale,
      };

      updateTransform({
        scale: newScale,
        translation: newTranslation,
      });
    },
    [transform, disableZoom, minScale, maxScale, updateTransform]
  );

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (disablePan) return;
      if (e.button !== 0) return; // Only left mouse button

      setIsPanning(true);
      setStartPan({
        x: e.clientX - transform.translation.x,
        y: e.clientY - transform.translation.y,
      });

      // Prevent text selection during pan
      e.preventDefault();
    },
    [disablePan, transform.translation.x, transform.translation.y]
  );

  // Handle mouse move for panning
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning || disablePan) return;

      const newTranslation = {
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      };

      updateTransform({
        ...transform,
        translation: newTranslation,
      });
    },
    [isPanning, disablePan, startPan.x, startPan.y, transform, updateTransform]
  );

  // Handle mouse up for panning
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);
  
  // Touch gesture handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setIsPanning(false);
    } else if (e.touches.length === 1) {
      // Single touch drag
      const touch = e.touches[0];

      setIsPanning(true);
      setStartPan({
        x: touch.clientX - transform.translation.x,
        y: touch.clientY - transform.translation.y,
      });
      
    }
  }, [disablePan, transform]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && initialDistance.current !== null && !disableZoom) {
      
      const container = containerRef.current;
      if (!container) return;

      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      // Calculate new scale
      const delta = (currentDistance / initialDistance.current) * 1.5;
      let newScale = transform.scale * delta;
      
      // Apply scale constraints
      newScale = Math.max(minScale, Math.min(maxScale, newScale));
      
      const midX = (touch1.clientX + touch2.clientX) / 2;
      const midY = (touch1.clientY + touch2.clientY) / 2;
      
      // Calculate the position relative to the transformed content
      const contentX = (midX - transform.translation.x) / transform.scale;
      const contentY = (midY - transform.translation.y) / transform.scale;
      
      // Calculate new translation to keep the content under the mouse stable
      const newTranslation = {
        x: midX - contentX * newScale,
        y: midY - contentY * newScale,
      };

      updateTransform({
        scale: newScale,
        translation: newTranslation,
      });
    } else if (isPanning && !disablePan && e.touches.length === 1) {
      // Single touch drag
      const touch = e.touches[0];
      
      const newTranslation = {
        x: touch.clientX - startPan.x,
        y: touch.clientY - startPan.y,
      };

      updateTransform({
        ...transform,
        translation: newTranslation,
      });
    }
  }, [isPanning, disablePan, startPan.x, startPan.y, transform, updateTransform]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    initialDistance.current = null;
    
    setIsPanning(false);
  }, []);

  // Handle double click to reset
  const handleDoubleClick = useCallback(() => {
    updateTransform({
      scale: defaultScale,
      translation: defaultTranslation,
    });
  }, [defaultScale, defaultTranslation, updateTransform]);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    const imgContainer = imgContainerRef.current;
    if (!container || !imgContainer) return;
  
    const passiveOption = makePassiveEventOption(false);

    container.addEventListener('wheel', handleWheel, passiveOption);

    /*
      Setup events for the gesture lifecycle: start, move, end touch
    */

    // start gesture
    imgContainer.addEventListener('touchstart', handleTouchStart, passiveOption);
    imgContainer.addEventListener('mousedown', handleMouseDown, passiveOption);

    // move gesture
    window.addEventListener('mousemove', handleMouseMove, passiveOption);
    window.addEventListener('touchmove', handleTouchMove, passiveOption);
    
    // end gesture
    const touchAndMouseEndOptions: AddEventListenerOptions = { capture: true, ...(typeof passiveOption !== 'boolean' && passiveOption) };
    window.addEventListener('mouseup', handleMouseUp, touchAndMouseEndOptions);
    window.addEventListener('touchend', handleTouchEnd, touchAndMouseEndOptions);

    return () => {
      container.removeEventListener('wheel', handleWheel);

      // Remove touch events
      imgContainer.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      // Remove mouse events
      imgContainer.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Effect to prevent scroll when modal is open
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
      reset();
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isPreviewOpen]);

  return (
    <>
      {/* Thumbnail Image */}
      <img
        src={src}
        alt={alt}
        className={thumbnailClass}
        onClick={openPreview}
      />

      {/* Preview Modal */}
      {isPreviewOpen && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closePreview}
        >
          <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none select-none"
          >
            {/* Zoom Controls */}
            {showControls && (
              <div
                className="absolute top-4 right-4 flex gap-2 z-10 bg-black/50 rounded-full p-1"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={zoomIn}
                  className={`bg-transparent p-2 rounded-full transition ${
                    (disableZoom || transform.scale >= maxScale)
                    ? 'text-gray-500'
                    : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Zoom in"
                  disabled={disableZoom || transform.scale >= maxScale}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={zoomOut}
                  className={`bg-transparent p-2 rounded-full transition ${
                    (disableZoom || transform.scale <= minScale)
                    ? 'text-gray-500'
                    : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Zoom out"
                  disabled={disableZoom || transform.scale <= minScale}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={reset}
                  className={`bg-transparent p-2 rounded-full transition ${
                    (transform.scale == defaultScale
                      && transform.translation.x == defaultTranslation.x
                      && transform.translation.y == defaultTranslation.y)
                    ? 'text-gray-500'
                    : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Reset zoom"
                  disabled={transform.scale == defaultScale
                    && transform.translation.x == defaultTranslation.x
                    && transform.translation.y == defaultTranslation.y}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); closePreview(); }}
                  className="bg-transparent text-white p-2 rounded-full hover:bg-white/20 transition"
                  aria-label="Close preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Zoomable Image Container */}
            <div 
              ref={imgContainerRef}
              className="overflow-hidden max-w-full max-h-full"
              onDoubleClick={handleDoubleClick}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `translate(${transform.translation.x}px, ${transform.translation.y}px) scale(${transform.scale})`,
                transformOrigin: '0 0',
                cursor: isPanning ? 'grabbing' : 'grab',
                touchAction: 'none',
                willChange: 'transform',
              }}
            >
              <img
                src={src}
                alt={alt}
                className={previewClass}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}