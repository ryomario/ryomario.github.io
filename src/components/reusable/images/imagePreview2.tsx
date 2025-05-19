import { clamp, midpoint, touchDistance, touchPt } from "@/lib/geometry";
import { MyPointerEvent, TranslationShape } from "@/types/IGeometry";
import makePassiveEventOption from "@/utils/makePassiveEventOption";
import React from "react";
import { createPortal } from "react-dom";

// The amount that a value of a dimension will change given a new scale
const coordChange = (coordinate: number, scaleRatio: number) => {
  return (scaleRatio * coordinate) - coordinate;
};

type PointerInfo = {
  pointers: MyPointerEvent[]
  scale: number
  translation: TranslationShape
}

type Transform = Pick<PointerInfo,'scale'|'translation'>;

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

type ImagePreviewState = {
  open: boolean
  isPanning: boolean
  shouldPreventTouchEndDefault: boolean
  transform: Transform
};

export class ImagePreview extends React.Component<ImagePreviewProps, ImagePreviewState> {
  private startPointerInfo: PointerInfo | undefined;
  private containerNode: HTMLDivElement | null = null;
  private imgContainerNode: HTMLDivElement | null = null;

  private translationBounds: TranslationBounds = {};

  static defaultProps = {
    thumbnailClass: 'w-24 h-24 object-cover rounded-md cursor-pointer',
    previewClass: 'max-w-[90vw] max-h-[90vh] object-contain m-auto',
    defaultScale: 1,
    defaultTranslation: { x: 0, y: 0 },
    minScale: 0.1,
    maxScale: 5,
    disableZoom: false,
    disablePan: false,
    showControls: false,
    translationBounds: {} as TranslationBounds,
  }

  get safeProps(): Readonly<Required<ImagePreviewProps>> {
    return {
      onInteraction() {
        // do nothing
      },
      ...ImagePreview.defaultProps,
      ...this.props,
    }
  }

  constructor(props: ImagePreviewProps) {
    super(props)

    this.state = {
      open: false,
      isPanning: false,
      shouldPreventTouchEndDefault: false,
      transform: {
        scale: props.defaultScale ?? ImagePreview.defaultProps.defaultScale,
        translation: props.defaultTranslation ?? ImagePreview.defaultProps.defaultTranslation,
      },
    }

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.onWheel = this.onWheel.bind(this);
  }

  componentDidUpdate(): void {
    const { open } = this.state;
    
    if(open) {
      document.body.style.overflow = 'hidden';
      this.componentDidMount();
    } else {
      if(!this.containerNode)document.body.style.overflow = '';
      this.componentWillUnmount();
    }

    if(this.imgContainerNode && this.containerNode) {
      const containerW = this.containerNode.offsetWidth
      const containerH = this.containerNode.offsetHeight
      
      const imgContainerScaledW = this.imgContainerNode.offsetWidth * this.state.transform.scale
      const imgContainerScaledH = this.imgContainerNode.offsetHeight * this.state.transform.scale

      this.translationBounds = {
        xMin: (-containerW / 2) - (imgContainerScaledW / 2) + 50,
        xMax: (containerW / 2) + (imgContainerScaledW / 2) - 50,
        yMin: (-containerH / 2) - (imgContainerScaledH / 2) + 50,
        yMax: (containerH / 2) + (imgContainerScaledH / 2) - 50,
      }
    }

  }

  componentDidMount(): void {
    if(!this.imgContainerNode || !this.containerNode) return;

    const passiveOption = makePassiveEventOption(false);

    this.containerNode.addEventListener('wheel', this.onWheel, passiveOption);
    
    /*
      Setup events for the gesture lifecycle: start, move, end touch
    */

    // start gesture
    this.imgContainerNode.addEventListener('touchstart', this.onTouchStart, passiveOption);
    this.imgContainerNode.addEventListener('mousedown', this.onMouseDown, passiveOption);

    // move gesture
    window.addEventListener('touchmove', this.onTouchMove, passiveOption);
    window.addEventListener('mousemove', this.onMouseMove, passiveOption);

    // end gesture
    const touchAndMouseEndOptions: AddEventListenerOptions = { capture: true, ...(typeof passiveOption !== 'boolean' && passiveOption) };
    window.addEventListener('touchend', this.onTouchEnd, touchAndMouseEndOptions);
    window.addEventListener('mouseup', this.onMouseUp, touchAndMouseEndOptions);
  }

  componentWillUnmount(): void {
    if(!this.imgContainerNode || !this.containerNode) return;
    this.containerNode.removeEventListener('wheel', this.onWheel);

    // Remove touch events
    this.imgContainerNode.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // Remove mouse events
    this.imgContainerNode.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.setPointerState(e);
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault();
    this.setPointerState(...e.touches)
  }
  onMouseUp(e: MouseEvent) {
    this.setPointerState();
  }

  onTouchEnd(e: TouchEvent) {
    this.setPointerState(...e.touches);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.startPointerInfo || this.safeProps.disablePan) {
      return;
    }
    e.preventDefault();
    this.onDrag(e);
  }
  onTouchMove(e: TouchEvent) {
    if (!this.startPointerInfo) {
      return;
    }

    e.preventDefault();

    const { disablePan, disableZoom } = this.safeProps;

    const isPinchAction = e.touches.length == 2 && this.startPointerInfo.pointers.length > 1;
    if (isPinchAction && !disableZoom) {
      this.scaleFromMultiTouch(e);
    } else if ((e.touches.length === 1) && this.startPointerInfo && !disablePan) {
      this.onDrag(e.touches[0]);
    }
  }

  // handles both touch and mouse drags
  onDrag(pointer: MyPointerEvent) {
    if(!this.startPointerInfo) return;

    const { translation, pointers } = this.startPointerInfo;
    const startPointer = pointers[0];
    const dragX = pointer.clientX - startPointer.clientX;
    const dragY = pointer.clientY - startPointer.clientY;
    const newTranslation = {
      x: translation.x + dragX,
      y: translation.y + dragY
    };

    const shouldPreventTouchEndDefault = Math.abs(dragX) > 1 || Math.abs(dragY) > 1;

    this.setState((prevState) => {
      return {
        shouldPreventTouchEndDefault,
        isPanning: true,
        transform: {
          ...prevState.transform,
          translation: this.clampTranslation(newTranslation),
        }
      }
    });
  }

  onWheel(e: WheelEvent) {
    if (this.safeProps.disableZoom || !this.imgContainerNode) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const scaleChange = 2 ** (e.deltaY * 0.002);

    const newScale = clamp(
      this.safeProps.minScale,
      this.state.transform.scale + (1 - scaleChange),
      this.safeProps.maxScale
    );

    const imgLeft = this.imgContainerNode.offsetLeft * this.state.transform.scale;
    const imgTop = this.imgContainerNode.offsetTop * this.state.transform.scale;
    const imgWidth = this.imgContainerNode.offsetWidth * this.state.transform.scale;
    const imgHeight = this.imgContainerNode.offsetHeight * this.state.transform.scale;

    const mousePos = this.clientPosToTranslatedPos({
      x: e.clientX - imgLeft - (imgWidth/2),
      y: e.clientY - imgTop - (imgHeight/2),
    });

    this.scaleFromPoint(newScale, mousePos);
  }

  setPointerState(...pointers: MyPointerEvent[]) {
    if(!pointers || pointers.length === 0) {
      this.setState({
        isPanning: false,
      })
      this.startPointerInfo = undefined;
      return;
    }

    this.startPointerInfo = {
      pointers,
      scale: this.state.transform.scale,
      translation: this.state.transform.translation,
    }
  }

  clampTranslation(desiredTranslation: TranslationShape, translationBounds: TranslationBounds = this.translationBounds): TranslationShape {
    const { x, y } = desiredTranslation;
    let { xMax, xMin, yMax, yMin } = translationBounds;
    xMin = xMin != undefined ? xMin : -Infinity;
    yMin = yMin != undefined ? yMin : -Infinity;
    xMax = xMax != undefined ? xMax : Infinity;
    yMax = yMax != undefined ? yMax : Infinity;

    return {
      x: clamp(xMin, x, xMax),
      y: clamp(yMin, y, yMax),
    };
  }

  translatedOrigin(translation: TranslationShape = this.state.transform.translation): TranslationShape {
    const clientOffset = this.getContainerBoundingClientRect();
    return {
      x: clientOffset.left + translation.x,
      y: clientOffset.top + translation.y
    };
  }

  // From a given screen point return it as a point
  // in the coordinate system of the given translation
  clientPosToTranslatedPos({ x, y }: TranslationShape, translation: TranslationShape = this.state.transform.translation): TranslationShape {
    const origin = this.translatedOrigin(translation);
    return {
      x: x - origin.x,
      y: y - origin.y
    };
  }

  scaleFromPoint(newScale: number, focalPt: TranslationShape) {
    const { translation, scale } = this.state.transform;
    const scaleRatio = newScale / (scale != 0 ? scale : 1);

    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: translation.x - focalPtDelta.x,
      y: translation.y - focalPtDelta.y
    };
    this.setState({
      transform: {
        scale: newScale,
        translation: this.clampTranslation(newTranslation)
      }
    });
  }
  
  // Given the start touches and new e.touches, scale and translate
  // such that the initial midpoint remains as the new midpoint. This is
  // to achieve the effect of keeping the content that was directly
  // in the middle of the two fingers as the focal point throughout the zoom.
  scaleFromMultiTouch(e: TouchEvent) {
    if(!this.startPointerInfo) return;

    const startTouches = this.startPointerInfo.pointers;
    const newTouches   = e.touches;

    // calculate new scale
    const dist0       = touchDistance(startTouches[0], startTouches[1]);
    const dist1       = touchDistance(newTouches[0], newTouches[1]);
    const scaleChange = dist1 / dist0;

    const startScale  = this.startPointerInfo.scale;
    const targetScale = startScale + ((scaleChange - 1) * startScale);
    const newScale    = clamp(this.safeProps.minScale, targetScale, this.safeProps.maxScale);

    // calculate mid points
    const startMidpoint = midpoint(touchPt(startTouches[0]), touchPt(startTouches[1]))
    const newMidPoint   = midpoint(touchPt(newTouches[0]), touchPt(newTouches[1]));

    // The amount we need to translate by in order for
    // the mid point to stay in the middle (before thinking about scaling factor)
    const dragDelta = {
      x: newMidPoint.x - startMidpoint.x,
      y: newMidPoint.y - startMidpoint.y
    };

    const scaleRatio = newScale / startScale;

    // The point originally in the middle of the fingers on the initial zoom start
    const focalPt = this.clientPosToTranslatedPos(startMidpoint, this.startPointerInfo.translation);

    // The amount that the middle point has changed from this scaling
    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    // Translation is the original translation, plus the amount we dragged,
    // minus what the scaling will do to the focal point. Subtracting the
    // scaling factor keeps the midpoint in the middle of the touch points.
    const newTranslation = {
      x: this.startPointerInfo.translation.x - focalPtDelta.x + dragDelta.x,
      y: this.startPointerInfo.translation.y - focalPtDelta.y + dragDelta.y
    };

    this.setState({
      transform: {
        scale: newScale,
        translation: this.clampTranslation(newTranslation)
      }
    });
  }

  discreteScaleStepSize() {
    const { minScale, maxScale } = this.safeProps;
    const delta = Math.abs(maxScale - minScale);
    return delta / 10;
  }

  // Scale using the center of the content as a focal point
  changeScale(delta: number) {
    const targetScale = this.state.transform.scale + delta;
    const { minScale, maxScale } = this.safeProps;
    const scale = clamp(minScale, targetScale, maxScale);

    const rect = this.getContainerBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    const focalPoint = this.clientPosToTranslatedPos({ x, y });
    this.scaleFromPoint(scale, focalPoint);
  }

  getController() {
    const step = this.discreteScaleStepSize();
    return {
      zoomIn: () => this.changeScale(step),
      zoomOut: () => this.changeScale(-step),
      reset: () => {
        this.setState({
          transform: {
            scale: this.safeProps.defaultScale,
            translation: this.clampTranslation(this.safeProps.defaultTranslation),
          }
        });
      },
    }
  }
  

  // Done like this so it is mockable
  getContainerNode() { return this.containerNode }
  getContainerBoundingClientRect() {
    return this.containerNode!.getBoundingClientRect();
  }

  render(): React.ReactNode {
    const {
      src,
      alt,
      showControls,
      thumbnailClass,
      previewClass,
      disableZoom,
      maxScale,
      minScale,
      defaultScale,
      defaultTranslation,
    } = this.safeProps;

    const {
      open: isPreviewOpen,
      isPanning,
    } = this.state;

    const openPreview = () => this.setState({
      open: true,
    })
    const closePreview = () => this.setState({
      open: false,
    })
    const {
      reset,
      zoomIn,
      zoomOut,
    } = this.getController()

    const {
      scale,
      translation: state_translation,
    } = this.state.transform;

    // Defensively clamp the translation. This should not be necessary if we properly set state elsewhere.
    const translation = this.clampTranslation(state_translation);
    
    /*
      This is a little trick to allow the following ux: We want the parent of this
      component to decide if elements inside the map are clickable. Normally, you wouldn't
      want to trigger a click event when the user *drags* on an element (only if they click
      and then release w/o dragging at all). However we don't want to assume this
      behavior here, so we call `preventDefault` and then let the parent check
      `e.defaultPrevented`. That value being true means that we are signalling that
      a drag event ended, not a click.
    */
    const handleEventCapture = (e: React.MouseEvent | React.TouchEvent) => {
      if (this.state.shouldPreventTouchEndDefault) {
        e.preventDefault();
        this.setState({ shouldPreventTouchEndDefault: false });
      }
    }

    return <>
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
          onClickCapture={handleEventCapture}
          onTouchEndCapture={handleEventCapture}
        >
          <div
            ref={(node) => {
              this.containerNode = node
            }}
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
                    (disableZoom || scale >= maxScale)
                    ? 'text-gray-500'
                    : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Zoom in"
                  disabled={disableZoom || scale >= maxScale}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={zoomOut}
                  className={`bg-transparent p-2 rounded-full transition ${
                    (disableZoom || scale <= minScale)
                    ? 'text-gray-500'
                    : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Zoom out"
                  disabled={disableZoom || scale <= minScale}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={reset}
                  className={`bg-transparent p-2 rounded-full transition ${
                    (scale == defaultScale
                      && translation.x == defaultTranslation.x
                      && translation.y == defaultTranslation.y)
                    ? 'text-gray-500'
                    : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Reset zoom"
                  disabled={scale == defaultScale
                    && translation.x == defaultTranslation.x
                    && translation.y == defaultTranslation.y}
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
              ref={(node) => {
                this.imgContainerNode = node;
              }}
              className="overflow-hidden max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`,
                transformOrigin: 'center center',
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
  }
}