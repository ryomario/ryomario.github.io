import React, { useState, useRef, useEffect, useCallback } from 'react';

type Transform = {
  scale: number;
  translation: { x: number; y: number };
};

type ReactMapInteractionProps = {
  children: React.ReactNode;
  defaultScale?: number;
  defaultTranslation?: { x: number; y: number };
  minScale?: number;
  maxScale?: number;
  disableZoom?: boolean;
  disablePan?: boolean;
  showControls?: boolean;
  className?: string;
  contentClassName?: string;
  onInteraction?: (transform: Transform) => void;
};

export const ReactMapInteraction: React.FC<ReactMapInteractionProps> = ({
  children,
  defaultScale = 1,
  defaultTranslation = { x: 0, y: 0 },
  minScale = 0.1,
  maxScale = 5,
  disableZoom = false,
  disablePan = false,
  showControls = false,
  className = '',
  contentClassName = '',
  onInteraction,
}) => {
  const [transform, setTransform] = useState<Transform>({
    scale: defaultScale,
    translation: defaultTranslation,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update transform and call callback
  const updateTransform = useCallback(
    (newTransform: Transform) => {
      setTransform(newTransform);
      if (onInteraction) {
        onInteraction(newTransform);
      }
    },
    [onInteraction]
  );

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
    (e: React.MouseEvent) => {
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

  // Handle double click to reset
  const handleDoubleClick = useCallback(() => {
    updateTransform({
      scale: defaultScale,
      translation: defaultTranslation,
    });
  }, [defaultScale, defaultTranslation, updateTransform]);

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
    updateTransform({
      scale: defaultScale,
      translation: defaultTranslation,
    });
  }, [defaultScale, defaultTranslation, updateTransform]);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`transform ${contentClassName}`}
        style={{
          transform: `translate(${transform.translation.x}px, ${transform.translation.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>

      {showControls && (
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button
            onClick={zoomIn}
            disabled={disableZoom || transform.scale >= maxScale}
            className="p-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50"
            aria-label="Zoom in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={zoomOut}
            disabled={disableZoom || transform.scale <= minScale}
            className="p-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50"
            aria-label="Zoom out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={reset}
            className="p-2 bg-white rounded shadow hover:bg-gray-100"
            aria-label="Reset"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
