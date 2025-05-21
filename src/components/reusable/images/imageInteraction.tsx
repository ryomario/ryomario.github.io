import React, { Component } from 'react';

import { clamp, distance, midpoint, touchPt, touchDistance } from '@/lib/geometry';
import makePassiveEventOption from '@/utils/makePassiveEventOption';
import { MyPointerEvent } from '@/types/IGeometry';

// The amount that a value of a dimension will change given a new scale
const coordChange = (coordinate: number, scaleRatio: number) => {
  return (scaleRatio * coordinate) - coordinate;
};

type PointerInfo = {
  pointers: MyPointerEvent[]
  scale: number
  translation: TranslationShape
}

type TranslationShape = {
  x: number
  y: number
};

type TranslationBounds = {
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
};


type TransformValue = {
  scale: number
  translation: TranslationShape
}

type ImageInteractionProps = {
  src: string
  alt: string

  previewClass?: string
  containerClass?: string
  onClose?: () => void

  defaultScale?: number
  defaultTranslation?: TranslationShape
  disableZoom?: boolean
  disablePan?: boolean
  translationBounds?: TranslationBounds
  minScale?: number
  maxScale?: number
  showControls?: boolean
}
type ImageInteractionState = TransformValue & {
  isPanning: boolean
  shouldPreventTouchEndDefault: boolean
}

/*
  This contains logic for providing a map-like interaction to any DOM node.
  It allows a user to pinch, zoom, translate, etc, as they would an interactive map.
  It renders its children with the current state of the translation and does not do any scaling
  or translating on its own. This works on both desktop, and mobile.
*/
export class ImageInteraction extends React.Component<ImageInteractionProps, ImageInteractionState> {
  private startPointerInfo: PointerInfo | null = null
  private containerNode: HTMLDivElement | null = null
  private imgNode: HTMLImageElement | null = null;

  private translationBounds: TranslationBounds = {};

  static defaultProps = {
    containerClass: '',
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

  get safeProps(): Readonly<Required<ImageInteractionProps>> {
    return {
      onClose() {
        // do nothing
      },
      ...ImageInteraction.defaultProps,
      ...this.props,
    }
  }

  constructor(props: ImageInteractionProps) {
    super(props);

    this.state = {
      isPanning: false,
      shouldPreventTouchEndDefault: false,
      scale: this.safeProps.defaultScale,
      translation: this.safeProps.defaultTranslation,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.onWheel = this.onWheel.bind(this);
  }

  // still developing
  // componentDidUpdate(): void {
  //   if(this.imgNode && this.containerNode) {
  //     const containerW = this.containerNode.offsetWidth
  //     const containerH = this.containerNode.offsetHeight
      
  //     const imgContainerScaledW = this.imgNode.offsetWidth * this.state.scale
  //     const imgContainerScaledH = this.imgNode.offsetHeight * this.state.scale

  //     this.translationBounds = {
  //       xMin: (-containerW / 2) - (imgContainerScaledW / 2) + 50,
  //       xMax: (containerW / 2) + (imgContainerScaledW / 2) - 50,
  //       yMin: (-containerH / 2) - (imgContainerScaledH / 2) + 50,
  //       yMax: (containerH / 2) + (imgContainerScaledH / 2) - 50,
  //     }
  //   }
  // }

  componentDidMount() {
    if(!this.containerNode) return;

    const passiveOption = makePassiveEventOption(false);

    this.containerNode.addEventListener('wheel', this.onWheel, passiveOption);

    /*
      Setup events for the gesture lifecycle: start, move, end touch
    */

    // start gesture
    this.containerNode.addEventListener('touchstart', this.onTouchStart, passiveOption);
    this.containerNode.addEventListener('mousedown', this.onMouseDown, passiveOption);

    // move gesture
    window.addEventListener('touchmove', this.onTouchMove, passiveOption);
    window.addEventListener('mousemove', this.onMouseMove, passiveOption);

    // end gesture
    const touchAndMouseEndOptions: AddEventListenerOptions = { capture: true, ...(typeof passiveOption !== 'boolean' && passiveOption) };
    window.addEventListener('touchend', this.onTouchEnd, touchAndMouseEndOptions);
    window.addEventListener('mouseup', this.onMouseUp, touchAndMouseEndOptions);

  }

  componentWillUnmount() {
    if(!this.containerNode) return;

    this.containerNode.removeEventListener('wheel', this.onWheel);

    // Remove touch events
    this.containerNode.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // Remove mouse events
    this.containerNode.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  /*
    Event handlers

    All touch/mouse handlers preventDefault because we add
    both touch and mouse handlers in the same session to support devicse
    with both touch screen and mouse inputs. The browser may fire both
    a touch and mouse event for a *single* user action, so we have to ensure
    that only one handler is used by canceling the event in the first handler.

    https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
  */

  onMouseDown(e: MouseEvent) {
    if(!this.imgNode?.contains(e.target as Node)) {
      return;
    }
    e.preventDefault();
    this.setPointerState([e]);
  }

  onTouchStart(e: TouchEvent) {
    if(!this.imgNode?.contains(e.target as Node)) {
      return;
    }
    e.preventDefault();
    this.setPointerState(Object.entries(e.touches).map(([,t]) => t));
  }

  onMouseUp(e: MouseEvent) {
    this.setPointerState();
  }

  onTouchEnd(e: TouchEvent) {
    this.setPointerState(Object.entries(e.touches).map(([,t]) => t));
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

    this.setState({
      shouldPreventTouchEndDefault,
      isPanning: true,
      translation: this.clampTranslation(newTranslation)
    });
  }

  onWheel(e: WheelEvent) {
    if (this.safeProps.disableZoom || !this.imgNode) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const scaleChange = 2 ** (e.deltaY * 0.002);

    const newScale = clamp(
      this.safeProps.minScale,
      this.state.scale + (1 - scaleChange),
      this.safeProps.maxScale
    );
    
    const mousePos = this.clientPosToTranslatedPos({
      x: e.clientX - this.imgNode.offsetLeft,
      y: e.clientY - this.imgNode.offsetTop,
    });

    this.scaleFromPoint(newScale, mousePos);
  }

  setPointerState(pointers?: MyPointerEvent[]) {
    if (!pointers || pointers.length === 0) {
      this.setState({
        isPanning: false,
      })
      this.startPointerInfo = null;
      return;
    }

    this.startPointerInfo = {
      pointers,
      scale: this.state.scale,
      translation: this.state.translation,
    }
  }

  clampTranslation(desiredTranslation: TranslationShape, translationBounds = this.translationBounds) {
    const { x, y } = desiredTranslation;
    let { xMax, xMin, yMax, yMin } = translationBounds;
    xMin = xMin != undefined ? xMin : -Infinity;
    yMin = yMin != undefined ? yMin : -Infinity;
    xMax = xMax != undefined ? xMax : Infinity;
    yMax = yMax != undefined ? yMax : Infinity;

    return {
      x: clamp(xMin, x, xMax),
      y: clamp(yMin, y, yMax)
    };
  }

  translatedOrigin(translation = this.state.translation) {
    const clientOffset = this.getContainerBoundingClientRect();
    return {
      x: clientOffset.left + translation.x,
      y: clientOffset.top + translation.y
    };
  }

  // From a given screen point return it as a point
  // in the coordinate system of the given translation
  clientPosToTranslatedPos({ x, y }: TranslationShape, translation = this.state.translation) {
    const origin = this.translatedOrigin(translation);
    return {
      x: x - origin.x,
      y: y - origin.y
    };
  }

  scaleFromPoint(newScale: number, focalPt: TranslationShape) {
    const { translation, scale } = this.state;
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
      scale: newScale,
      translation: this.clampTranslation(newTranslation)
    })
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
      scale: newScale,
      translation: this.clampTranslation(newTranslation)
    });
  }

  discreteScaleStepSize() {
    const { minScale, maxScale } = this.safeProps;
    const delta = Math.abs(maxScale - minScale);
    return delta / 10;
  }

  // Scale using the center of the content as a focal point
  changeScale(delta: number) {
    const targetScale = this.state.scale + delta;
    const { minScale, maxScale } = this.safeProps;
    const scale = clamp(minScale, targetScale, maxScale);

    const rect = this.getContainerBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    const focalPoint = this.clientPosToTranslatedPos({ x, y });
    this.scaleFromPoint(scale, focalPoint);
  }

  // Done like this so it is mockable
  getContainerBoundingClientRect() {
    return this.containerNode!.getBoundingClientRect();
  }
  getImageBoundingClientRect() {
    return this.imgNode!.getBoundingClientRect();
  }

  getControls() {
    const step = this.discreteScaleStepSize();
    return {
      zoomIn: () => this.changeScale(step),
      zoomOut: () => this.changeScale(-step),
      reset: () => {
        this.setState({
          scale: this.safeProps.defaultScale,
          translation: this.clampTranslation(this.safeProps.defaultTranslation),
        });
      },
    }
  }

  render() {
    const {
      src,
      alt,

      showControls,
      containerClass,
      previewClass,
      
      disableZoom,
      maxScale,
      minScale,
      defaultScale,
      defaultTranslation,
      onClose,
    } = this.safeProps;
    const {
      scale,
      isPanning,
    } = this.state;
    // Defensively clamp the translation. This should not be necessary if we properly set state elsewhere.
    const translation = this.clampTranslation(this.state.translation);
    
    const {
      reset,
      zoomIn,
      zoomOut,
    } = this.getControls()

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

    return (
      <div
        ref={(node) => {
          this.containerNode = node;
        }}
        className={containerClass}
        style={{
          height: '100%',
          width: '100%',
          touchAction: 'none'
        }}
        onClickCapture={handleEventCapture}
        onTouchEndCapture={handleEventCapture}
        onClick={onClose}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            position: 'relative', // for absolutely positioned children
            overflow: 'hidden',
            touchAction: 'none', // Not supported in Safari :(
            msTouchAction: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            ref={(node) => {
              this.imgNode = node;
            }}
            src={src}
            alt={alt}
            className={previewClass}
            onClick={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              cursor: isPanning ? 'grabbing' : 'grab',
              transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`,
              transformOrigin: '0 0 '
            }}
          />
        </div>
        {showControls && (
          <div
            className="absolute top-4 right-4 flex gap-2 z-10 bg-black/50 rounded-full p-1"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
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
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="bg-transparent text-white p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Close preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }
}
