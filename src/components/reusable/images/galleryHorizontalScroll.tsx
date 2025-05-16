import { useState } from 'react';

type Props = {
  images: string[]
}

export function GalleryHorizontalScroll({ images }: Props) {

  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    const gallery = document.getElementById('gallery');
    const image = document.getElementById(`image-${index}`);
    if (gallery && image) {
      gallery.scrollTo({
        left: image.offsetLeft - gallery.offsetWidth / 2 + image.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-full mx-auto p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Image Gallery</h2> */}
      
      {/* Main gallery with horizontal scroll */}
      <div 
        id="gallery"
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 p-2"
        style={{ scrollbarWidth: 'none' }} // For Firefox
      >
        {images.map((img, index) => (
          <div 
            key={index}
            id={`image-${index}`}
            className={`flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden shadow-md snap-center transition-all duration-300 ${activeIndex === index ? 'ring-4 ring-blue-500' : ''}`}
          >
            <img
              src={img}
              onError={(e) => e.currentTarget.src = '/images/placeholder-image.jpg'}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onClick={() => scrollToImage(index)}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToImage(index)}
            className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Optional: Image counter */}
      <div className="text-center text-gray-600 mt-2">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
};