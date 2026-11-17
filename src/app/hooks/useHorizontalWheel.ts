import { useEffect, useRef, type RefObject } from "react";

const WHEEL_THRESHOLD_PX = 30;
/**
 * After a step, ignore wheel input until it has been quiet this long — i.e. until the
 * trackpad gesture and its momentum have finished — so one flick moves exactly one slide.
 */
const GESTURE_END_GAP_MS = 250;

/**
 * Turns a horizontal trackpad swipe (or shift + mouse wheel) over `ref` into a single
 * step: `onStep(1)` for right/forward, `onStep(-1)` for left/back.
 * Plain vertical wheel events are left alone so the page keeps scrolling.
 */
export function useHorizontalWheel(ref: RefObject<HTMLElement | null>, onStep: (direction: 1 | -1) => void) {
  // Always call the latest callback without re-binding the listener.
  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let distance = 0;
    let lockedUntil = 0;

    const onWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const dx = isHorizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (dx === 0) return;
      e.preventDefault(); // also stops the browser's back/forward swipe gesture
      const now = Date.now();
      if (now < lockedUntil) {
        lockedUntil = now + GESTURE_END_GAP_MS; // still the same gesture: keep waiting for it to end
        return;
      }
      distance += dx;
      if (Math.abs(distance) >= WHEEL_THRESHOLD_PX) {
        onStepRef.current(distance > 0 ? 1 : -1);
        distance = 0;
        lockedUntil = now + GESTURE_END_GAP_MS;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}
