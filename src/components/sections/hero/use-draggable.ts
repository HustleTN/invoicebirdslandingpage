"use client";

import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type PointerEvent } from "react";

type DragStart = {
  pointerX: number;
  pointerY: number;
  originX: number;
  originY: number;
  /** Screen pixels per CSS pixel of the (possibly zoomed) element. */
  scale: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/** Space kept between an auto-fitted card and the section edge, in screen pixels. */
const FIT_GUTTER = 16;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Distance to move a span so it fits between `min` and `max`. */
const fitInto = (start: number, end: number, min: number, max: number) =>
  start < min ? min - start : end > max ? max - end : 0;

/**
 * Lets an element be dragged with a pointer, kept inside its closest `<section>`.
 * If its default position overflows the section (on narrower screens), it is
 * nudged back inside.
 */
export function useDraggable<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [fit, setFit] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef<DragStart | null>(null);
  const fitRef = useRef(fit);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const keepInside = () => {
      const bounds = element.closest("section")?.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      if (!bounds || rect.width === 0) return;

      // Measure where the card would sit without the current correction.
      const scale = rect.width / element.offsetWidth || 1;
      const left = rect.left - fitRef.current.x * scale;
      const top = rect.top - fitRef.current.y * scale;
      const next = {
        x: fitInto(left, left + rect.width, bounds.left + FIT_GUTTER, bounds.right - FIT_GUTTER) / scale,
        y: fitInto(top, top + rect.height, bounds.top, bounds.bottom) / scale,
      };
      fitRef.current = next;
      setFit(next);
    };

    keepInside();
    window.addEventListener("resize", keepInside);
    return () => window.removeEventListener("resize", keepInside);
  }, []);

  const onPointerDown = (event: PointerEvent<T>) => {
    // Mouse and pen only: on touch screens the cards stay put so a swipe scrolls the page.
    if (event.button !== 0 || event.pointerType === "touch") return;
    const element = event.currentTarget;
    const bounds = element.closest("section")?.getBoundingClientRect();
    if (!bounds) return;

    const rect = element.getBoundingClientRect();
    start.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      scale: rect.width / element.offsetWidth || 1,
      minX: bounds.left - rect.left,
      maxX: bounds.right - rect.right,
      minY: bounds.top - rect.top,
      maxY: bounds.bottom - rect.bottom,
    };
    element.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<T>) => {
    const drag = start.current;
    if (!drag) return;
    const dx = clamp(event.clientX - drag.pointerX, drag.minX, drag.maxX);
    const dy = clamp(event.clientY - drag.pointerY, drag.minY, drag.maxY);
    setOffset({ x: drag.originX + dx / drag.scale, y: drag.originY + dy / drag.scale });
  };

  const onPointerUp = (event: PointerEvent<T>) => {
    if (!start.current) return;
    start.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  const style: CSSProperties = {
    translate: `${offset.x + fit.x}px ${offset.y + fit.y}px`,
    cursor: dragging ? "grabbing" : "grab",
  };

  // Stop the browser's native image/link drag from hijacking the pointer.
  const onDragStart = (event: DragEvent<T>) => event.preventDefault();

  return {
    dragging,
    dragProps: { ref, style, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onDragStart },
  };
}
