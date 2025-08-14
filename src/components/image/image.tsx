import React, { forwardRef, startTransition, useCallback, useEffect, useRef, useState } from "react";
import { ImageImg, ImageOverlay, ImagePlaceholder, ImageRoot } from "./styles";
import { useInView, type UseInViewOptions } from "framer-motion";
import { Breakpoint } from "@mui/material/styles";

type AspectRatioType = `${number}/${number}` | `${number}`;

export type ImageProps = React.ComponentProps<typeof ImageRoot> & {
  src?: string;
  alt?: string;
  delayTime?: number;
  onLoad?: () => void;
  visibleByDefault?: boolean;
  disablePlaceholder?: boolean;
  viewportOptions?: UseInViewOptions;
  ratio?: AspectRatioType | Partial<Record<Breakpoint, AspectRatioType>>;
  slotProps?: {
    img?: Omit<React.ComponentProps<typeof ImageImg>, 'src' | 'alt'>;
    overlay?: React.ComponentProps<typeof ImageOverlay>;
    placeholder?: React.ComponentProps<typeof ImagePlaceholder>;
  };
}

const DEFAULT_DELAY = 0;

export const Image = forwardRef<HTMLSpanElement, ImageProps>((props, ref) => {
  const {
    sx,
    src,
    ratio,
    onLoad,
    alt = '',
    slotProps,
    className,
    viewportOptions,
    disablePlaceholder,
    visibleByDefault = false,
    delayTime = DEFAULT_DELAY,
    ...rest
  } = props;

  const localRef = useRef<HTMLSpanElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  const isInView = useInView(localRef, {
    once: true,
    ...viewportOptions,
  });

  const handleImageLoad = useCallback(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsLoaded(true);
        onLoad?.();
      });
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime, onLoad]);

  const handleImageError = useCallback(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsError(true);
      });
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime]);

  const shouldRenderImage = visibleByDefault || isInView;
  const showPlaceholder = (!visibleByDefault && !isLoaded && !disablePlaceholder) || isError;

  const renderComponents = {
    overlay: () => slotProps?.overlay && (
      <ImageOverlay {...slotProps.overlay} />
    ),
    placeholder: () => showPlaceholder && (
      <ImagePlaceholder {...slotProps?.placeholder} />
    ),
    image: () => !isError && !!src && (
      <ImageImg
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...slotProps?.img}
      />
    ),
  };

  return (
    <ImageRoot
      ref={(node) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        localRef.current = node;
      }}
      className={`${isLoaded ? '--loaded' : ''}`}
      sx={[
        {
          '--aspect-ratio': ratio,
          ...(!!ratio && { width: 1 }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {renderComponents.overlay()}
      {renderComponents.placeholder()}
      {shouldRenderImage && renderComponents.image()}
    </ImageRoot>
  )
})