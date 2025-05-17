import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ImagePreviewProps = {
  src: string;
  alt: string;
  thumbnailClass?: string;
  previewClass?: string;
};

export function ImagePreview({
  src,
  alt,
  thumbnailClass = 'w-24 h-24 object-cover rounded-md cursor-pointer',
  previewClass = 'max-w-[90vw] max-h-[90vh] object-contain m-auto'
}: ImagePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lastScale = useRef(1);
  const lastPosition = useRef({ x: 0, y: 0 });
  const targetScale = useRef(1);
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(null);
  
  // Add new state for pinch zoom
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (isPreviewOpen) {
        e.preventDefault();
      }
    };

    if (isPreviewOpen) {
      resetZoom();
      document.body.style.overflow = 'hidden';
      document.addEventListener('wheel', handleScroll, { passive: false });
      document.addEventListener('touchmove', handleScroll, { passive: false });
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('touchmove', handleScroll);
    };
  }, [isPreviewOpen]);


  // Smooth zoom transition function
  const smoothZoomTo = useCallback((newScale: number, focusPoint?: { x: number; y: number }) => {
    if (!containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    // Calculate the container center
    const containerCenter = {
      x: containerRect.width / 2,
      y: containerRect.height / 2
    };

    // Use provided focus point or default to center
    const focus = focusPoint || containerCenter;

    // Calculate current mouse position in image coordinates
    const currentImgX = (focus.x - containerCenter.x) / lastScale.current - lastPosition.current.x;
    const currentImgY = (focus.y - containerCenter.y) / lastScale.current - lastPosition.current.y;

    // Calculate new position to keep the focus point stable
    const newX = (focus.x - containerCenter.x) / newScale - currentImgX;
    const newY = (focus.y - containerCenter.y) / newScale - currentImgY;

    // Set targets for smooth animation
    targetScale.current = newScale;
    targetPosition.current = { x: -newX, y: -newY };

    // Start animation if not already running
    if (!animationRef.current) {
      const animate = () => {
        // Calculate interpolated values (ease-out effect)
        const scaleDiff = targetScale.current - lastScale.current;
        const posDiffX = targetPosition.current.x - lastPosition.current.x;
        const posDiffY = targetPosition.current.y - lastPosition.current.y;

        // Apply 20% of the difference each frame for smoothness
        const newScaleVal = lastScale.current + scaleDiff * 0.2;
        const newXVal = lastPosition.current.x + posDiffX * 0.2;
        const newYVal = lastPosition.current.y + posDiffY * 0.2;

        // Update state
        setScale(newScaleVal);
        setPosition({ x: newXVal, y: newYVal });

        // Update refs with latest values
        lastScale.current = newScaleVal;
        lastPosition.current = { x: newXVal, y: newYVal };

        // Continue animation if we haven't reached the target
        if (Math.abs(newScaleVal - targetScale.current) > 0.001 ||
            Math.abs(newXVal - targetPosition.current.x) > 0.1 ||
            Math.abs(newYVal - targetPosition.current.y) > 0.1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Final update to ensure we reach exact target
          setScale(targetScale.current);
          setPosition(targetPosition.current);
          lastScale.current = targetScale.current;
          lastPosition.current = targetPosition.current;
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const zoomIn = (factor = 1) => {
    setScale(prev => {
      const newScale = Math.min(prev + (0.25 * factor), 3)
      lastScale.current = newScale
      return newScale
    });
  };

  const zoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      lastScale.current = newScale
      return newScale;
    });
  };
  
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    lastScale.current = 1;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setStartPos(position);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    const dx = e.clientX - startDragPos.x;
    const dy = e.clientY - startDragPos.y;
    
    setPosition({
      x: startPos.x + dx,
      y: startPos.y + dy
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = '';
    }
  };

  // Pinch zoom handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Calculate initial distance between two fingers
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(dist);
      setInitialScale(scale);
      setIsDragging(false);
    } else if (e.touches.length === 1 && scale > 1) {
      // Single touch for dragging
      const touch = e.touches[0];
      setStartPos(position);
      setStartDragPos({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);
      
      // Store touch start for double tap detection
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }
  }, [scale, position]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && initialDistance !== null) {
      // Calculate current distance between fingers
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Calculate new scale based on pinch distance
      const newScale = Math.min(Math.max(
        initialScale * (currentDistance / initialDistance),
        1
      ), 3);
      
      // Calculate midpoint between fingers for zoom center
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      // Apply smooth zoom to the midpoint
      smoothZoomTo(newScale, { x: midX, y: midY });
    } else if (isDragging && e.touches.length === 1) {
      // Single finger drag
      const touch = e.touches[0];
      const dx = touch.clientX - startDragPos.x;
      const dy = touch.clientY - startDragPos.y;
      
      setPosition({
        x: startPos.x + dx,
        y: startPos.y + dy
      });
    }
  }, [initialDistance, initialScale, isDragging, startPos, startDragPos, smoothZoomTo]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setInitialDistance(null);
    
    // Double tap detection
    if (e.touches.length === 0 && touchStartRef.current) {
      const touchEnd = e.changedTouches[0];
      const start = touchStartRef.current;
      const dist = Math.hypot(touchEnd.clientX - start.x, touchEnd.clientY - start.y);
      const duration = Date.now() - start.time;
      
      if (dist < 10 && duration < 300) {
        // Double tap detected
        if (scale > 1.1) {
          smoothZoomTo(1);
        } else {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            smoothZoomTo(2, {
              x: touchEnd.clientX - rect.left,
              y: touchEnd.clientY - rect.top
            });
          }
        }
      }
    }
    
    setIsDragging(false);
  }, [scale, smoothZoomTo]);
  
  // Wheel handler with smooth zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // e.preventDefault();
    
    if (!containerRef.current) return;

    // Get mouse position relative to container
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom direction and amount
    const zoomSpeed = 0.01;
    const delta = -e.deltaY * zoomSpeed;
    const newScale = Math.min(Math.max(lastScale.current * (1 + delta), 1), 3);

    // Smooth zoom to the new scale with mouse position as focus point
    smoothZoomTo(newScale, { x: mouseX, y: mouseY });
  },[smoothZoomTo]);

  // Double click handler
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!containerRef.current) return;

    if (lastScale.current > 1.1) {
      smoothZoomTo(1);
    } else {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      smoothZoomTo(2, { x: clickX, y: clickY });
    }
  }, [smoothZoomTo]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div 
            ref={containerRef}
            className="fixed inset-0 flex items-center justify-center overflow-hidden touch-none"
            onWheel={handleWheel}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                  className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  aria-label="Zoom in"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                  className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  aria-label="Zoom out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                  className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  aria-label="Reset zoom"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); closePreview(); }}
                  className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  aria-label="Close preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Zoomable Image */}
              <div 
                className="overflow-hidden max-w-full max-h-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={handleDoubleClick}
                onClick={(e) => e.stopPropagation()}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                  transformOrigin: 'center center',
                  touchAction: 'none',
                  willChange: 'transform', // Hint to browser for optimization
                  backfaceVisibility: 'hidden', // Prevent flickering in some browsers
                }}
              >
                <img
                  ref={imageRef}
                  src={src}
                  alt={alt}
                  className={previewClass}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}