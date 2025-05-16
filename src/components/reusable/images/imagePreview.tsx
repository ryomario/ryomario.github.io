import { useEffect, useRef, useState } from 'react';
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
  const imageRef = useRef<HTMLImageElement>(null);

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  useEffect(() => {
    const handleScroll = (e: TouchEvent) => {
      if (isPreviewOpen) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (isPreviewOpen) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Add touch event listeners for mobile
      document.addEventListener('touchmove', handleScroll, { passive: false });
    } else {
      // Re-enable scroll
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.position = '';
      
      // Remove event listeners
      document.removeEventListener('touchmove', handleScroll);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.position = '';
      document.removeEventListener('touchmove', handleScroll);
    };
  },[isPreviewOpen])

  const zoomIn = (x = 1) => {
    setScale(prev => Math.min(prev + (0.25 * x), 3)); // Limit max zoom to 3x
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 1)); // Don't go below 1x
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Calculate center position relative to image
    const centerX = (rect.width / 2 - clickX) * scale;
    const centerY = (rect.height / 2 - clickY) * scale;
    
    if (scale === 1) {
      zoomIn(2);
      setPosition({
        x: position.x + centerX,
        y: position.y + centerY
      });
    } else {
      resetZoom();
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y
    });
  };

  useEffect(() => {
    if(scale == 1) {
      resetZoom();
    }
  },[scale])

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
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closePreview}
        >
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
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
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                onClick={(e) => e.stopPropagation()}
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                  transformOrigin: 'center center',
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