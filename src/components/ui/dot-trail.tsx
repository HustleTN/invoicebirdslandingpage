"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/* A hidden grid of dots behind a blue area (its parent, which must be positioned and isolated): moving the mouse lights the dots near it, which then fade away. */
const GAP = 22;
const REACH = 130;
const FADE = 0.968;

export function DotTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx || reduceMotion) return;

    let cols = 0,
      rows = 0,
      glow = new Float32Array(0),
      frame = 0;
    // a fixed random phase per dot, so the lit dots shimmer rather than glow evenly
    let phase = new Float32Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / GAP) + 1;
      rows = Math.ceil(height / GAP) + 1;
      glow = new Float32Array(cols * rows);
      phase = Float32Array.from({ length: cols * rows }, () => Math.random() * Math.PI * 2);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (let i = 0; i < glow.length; i++) {
        const g = glow[i];
        if (g < 0.01) continue;
        alive = true;
        glow[i] = g * FADE;
        const twinkle = 0.75 + 0.25 * Math.sin(now / 160 + phase[i]);
        const x = (i % cols) * GAP;
        const y = Math.floor(i / cols) * GAP;
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + g * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 176, 71, ${Math.min(1, g * twinkle * 0.9)})`;
        ctx.fill();
      }
      frame = alive ? requestAnimationFrame(draw) : 0;
    };

    const light = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = host.getBoundingClientRect();
      const px = event.clientX - box.left;
      const py = event.clientY - box.top;
      const c0 = Math.max(0, Math.floor((px - REACH) / GAP));
      const c1 = Math.min(cols - 1, Math.ceil((px + REACH) / GAP));
      const r0 = Math.max(0, Math.floor((py - REACH) / GAP));
      const r1 = Math.min(rows - 1, Math.ceil((py + REACH) / GAP));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const d = Math.hypot(c * GAP - px, r * GAP - py);
          if (d > REACH) continue;
          const i = r * cols + c;
          glow[i] = Math.max(glow[i], (1 - d / REACH) ** 1.6);
        }
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointermove", light);
    return () => {
      observer.disconnect();
      host.removeEventListener("pointermove", light);
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  // behind the content, above the section's own background (the section is its own stacking context)
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" />;
}
