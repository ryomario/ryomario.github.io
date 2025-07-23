import { useRef, useState } from 'react';
import styled from '@emotion/styled';

type Props = {
  images: string[]
}

export function GalleryHorizontalScroll({ images }: Props) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToImage = (index: number) => {
    if(!galleryRef.current) {
      return;
    }

    setActiveIndex(index);
    const gallery = galleryRef.current;
    const image = gallery.querySelector<HTMLDivElement>(`#image-${index}`);
    if (image) {
      gallery.scrollTo({
        left: image.offsetLeft - image.offsetWidth - gallery.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Container>
      {/* Main gallery with horizontal scroll */}
      <Gallery
        ref={galleryRef}
      >
        {images.map((img, index) => (
          <div
            key={index}
            id={`image-${index}`}
            className={`image-wraper ${activeIndex === index ? 'active' : ''}`}
          >
            <img
              src={img}
              onError={(e) => e.currentTarget.src = '/images/placeholder-image.jpg'}
              alt={`Gallery item ${index + 1}`}
              onClick={() => scrollToImage(index)}
            />
          </div>
        ))}
      </Gallery>

      {/* Navigation dots */}
      <Navigation>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToImage(index)}
            className={activeIndex === index ? 'active' : ''}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </Navigation>

      {/* Optional: Image counter */}
      <div className="counter">
        {activeIndex + 1} / {images.length}
      </div>
    </Container>
  );
};

// ================================================

const Container = styled.div`
  max-width: 100%;
  margin-inline: auto;
  padding: 2rem;
  & .counter {
    text-align: center;
    color: #4b5563;
    margin-top: 0.5rem;
  }
`;

const Gallery = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
  padding: 0.5rem;

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
  & > * {
    scroll-snap-align: start;
  }

  & .image-wraper {
    flex-shrink: 0;
    width: 16rem;
    height: 16rem;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    scroll-snap-align: center;
    transition-property: box-shadow;
    transition-duration: 300ms;

    &.active {
      box-shadow: 0 0 0 4px #3B82F6;
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition-property: transform;
      transition-duration: 300ms;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0.5rem; 

  & > button {
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    text-align: left;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    background-color: #d1d5db;
    &.active {
      background-color: #3b82f6;
    }
  }
`;