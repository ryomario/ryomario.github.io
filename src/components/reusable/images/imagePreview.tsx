import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageInteraction } from './imageInteraction';
import Image from 'next/image';

type ImagePreviewProps = {
  src: string;
  alt: string;
  previewClass?: string;
  thumbnailClass?: string;
};

export function ImagePreview({
  src,
  alt,
  thumbnailClass = 'w-24 h-24 object-cover rounded-md cursor-pointer',
  previewClass = 'max-w-[90vw] max-h-[90vh] object-contain m-auto',
}: ImagePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
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
        <ImageInteraction
          src={src}
          alt={alt}
          minScale={0.5}
          maxScale={3}
          containerClass="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          previewClass={previewClass}
          onClose={closePreview}
          showControls
        />,
        document.body
      )}
    </>
  );
}