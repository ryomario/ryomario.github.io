import { MyPointerEvent, TranslationShape } from "@/types/IGeometry";

export function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function distance(p1: TranslationShape, p2: TranslationShape) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

export function midpoint(p1: TranslationShape, p2: TranslationShape): TranslationShape {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

export function touchPt(touch: MyPointerEvent): TranslationShape {
  return { x: touch.clientX, y: touch.clientY };
}

export function touchDistance(t0: MyPointerEvent, t1: MyPointerEvent) {
  const p0 = touchPt(t0);
  const p1 = touchPt(t1);
  return distance(p0, p1);
}
