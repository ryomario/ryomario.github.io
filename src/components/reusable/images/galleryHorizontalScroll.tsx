import { styled, SxProps, Theme } from '@mui/material/styles';
import { useRef, useState } from 'react';

type Props = {
  images: string[];
  sx?: SxProps<Theme>;
}

export function GalleryHorizontalScroll({ images, sx }: Props) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToImage = (index: number) => {
    if (!galleryRef.current) {
      return;
    }

    setActiveIndex(index);
    const gallery = galleryRef.current;
    const image = gallery.querySelector<HTMLDivElement>(`#image-${index}`);
    if (image) {
      gallery.scrollTo({
        left: (image.offsetLeft - gallery.offsetLeft) - (gallery.offsetWidth / 2) + (image.offsetWidth / 2),
        behavior: 'smooth'
      });
    }
  };

  return (
    <Container className={galleryHorizontalScrollClasses.root} sx={sx}>
      {/* Main gallery with horizontal scroll */}
      <Gallery
        ref={galleryRef}
        className={galleryHorizontalScrollClasses.gallery}
      >
        {images.map((img, index) => (
          <div
            key={index}
            id={`image-${index}`}
            className={`${galleryHorizontalScrollClasses.imgWrapper} ${activeIndex === index ? galleryHorizontalScrollClasses.imgWrapper_active : ''}`}
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
      <Navigation className={galleryHorizontalScrollClasses.navigation}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToImage(index)}
            className={activeIndex === index ? galleryHorizontalScrollClasses.navigation_active : ''}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </Navigation>

      {/* Optional: Image counter */}
      <div className={galleryHorizontalScrollClasses.counter}>
        {activeIndex + 1} / {images.length}
      </div>
    </Container>
  );
};

// ================================================

export const galleryHorizontalScrollClasses = {
  root: 'GalleryHorizontalScroll',
  gallery: 'GalleryHorizontalScroll-gallery',
  counter: 'GalleryHorizontalScroll-counter',
  imgWrapper: 'GalleryHorizontalScroll-img-wrapper',
  imgWrapper_active: 'GalleryHorizontalScroll-img-wrapper_active',
  navigation: 'GalleryHorizontalScroll-navigation',
  navigation_active: 'GalleryHorizontalScroll-navigation_active',
};

const Container = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  marginInline: 'auto',
  padding: theme.spacing(4),
  [`.${galleryHorizontalScrollClasses.counter}`]: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  }
}));

const Gallery = styled('div')(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  gap: theme.spacing(2),
  padding: theme.spacing(1),

  msOverflowStyle: 'none',
  scrollbarWidth: 'none',

  ['&::-webkit-scrollbar']: {
    display: 'none',
  },
  ['& > *']: {
    scrollSnapAlign: 'start',
  },
  [`.${galleryHorizontalScrollClasses.imgWrapper}`]: {
    flexShrink: 0,
    width: '16rem',
    height: '16rem',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
    scrollSnapAlign: 'center',
    transitionProperty: 'box-shadow',
    transitionDuration: '300ms',
    [`&.${galleryHorizontalScrollClasses.imgWrapper_active}`]: {
      boxShadow: `0 0 0 4px ${theme.palette.primary.main}`,
    },
    ['img']: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transitionProperty: 'transform',
      transitionDuration: '300ms',
      ['&:hover']: {
        transform: 'scale(1.05)',
      },
    },
  },
}));

const Navigation = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(1),
  gap: theme.spacing(1),

  ['& > button']: {
    all: 'unset',
    cursor: 'pointer',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: 99999,
    backgroundColor: theme.palette.text.disabled,
    [`&.${galleryHorizontalScrollClasses.navigation_active}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));