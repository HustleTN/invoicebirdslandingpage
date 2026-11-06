"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { cn } from "@/lib/cn";

/**
 * Hosts a Hairline figure (public/hairline/figures/<name>.js) on the unchanged
 * kernel (public/hairline/kernel.js), the way the package mounts one: a stage,
 * an svg, a read-out, then the figure's own tour while no pointer is on it.
 */

type Figure = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount: (host: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } }, value: number) => {
    set: (value: number) => void;
    destroy: () => void;
  };
};

type Kernel = {
  inject: (root: Document) => void;
  mk: (tag: string, attrs: Record<string, string>, parent: Element) => SVGSVGElement;
  tour: (stage: HTMLElement, stops: ([number, number] | null)[], onStop?: (i: number) => void) => { stop: () => void };
  LAP: ([number, number] | null)[];
};

declare global {
  interface Window {
    HL?: Kernel;
    hairline?: (figure: Figure) => void;
  }
}

const scripts = new Map<string, Promise<void>>();
const figures = new Map<string, Figure>();

function load(src: string, module = false) {
  if (!scripts.has(src)) {
    scripts.set(
      src,
      new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.src = src;
        if (module) el.type = "module";
        el.onload = () => resolve();
        el.onerror = () => reject(new Error(`Could not load ${src}`));
        document.head.appendChild(el);
      }),
    );
  }
  return scripts.get(src)!;
}

async function loadFigure(name: string) {
  await load("/hairline/kernel.js");
  // Figures end with hairline({ … }); here that call registers them by name.
  window.hairline = (figure) => void figures.set(figure.name, figure);
  await load(`/hairline/figures/${name}.js`, true);
  const figure = figures.get(name);
  if (!figure || !window.HL) throw new Error(`Hairline figure "${name}" did not register`);
  return { figure, HL: window.HL };
}

/**
 * Two colours only, through the kernel's own custom properties: navy for every
 * line (dimmer lines are navy at lower opacity) and green for the one highlight.
 */
const PALETTE = {
  "--hairline-plate": "#ffffff",
  "--hairline-edge": "#0A2540",
  "--hairline-mid": "rgb(10 37 64 / 0.5)",
  "--hairline-lo": "rgb(10 37 64 / 0.2)",
  "--hairline-hi": "#06B047",
  "--hairline-stroke": "1",
} as CSSProperties;

export function HairlineFigure({
  name,
  play = true,
  showReadout = false,
  zoom = 1,
  className,
}: {
  name: string;
  /** Walk the figure's own tour while no pointer is on it. */
  play?: boolean;
  /** Show the figure's read-out (what is under the pointer) in the corner. */
  showReadout?: boolean;
  /** Enlarge the 400 × 320 drawing within its frame; the overflow is clipped. */
  zoom?: number;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState("rest");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    let cleanup = () => {};

    loadFigure(name)
      .then(({ figure, HL }) => {
        if (cancelled) return;
        HL.inject(document);
        const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
        let text = "rest";
        const read = {
          get textContent() {
            return text;
          },
          set textContent(value: string) {
            text = value == null ? "" : String(value);
            setReadout(text);
          },
        };
        const handle = figure.mount({ stage, svg, read }, figure.range[1]);
        const tour = play ? HL.tour(stage, figure.tour ?? HL.LAP) : null;
        cleanup = () => {
          tour?.stop();
          handle.destroy();
          svg.remove();
        };
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [name, play]);

  return (
    <div className={cn("relative aspect-[5/4] overflow-hidden", className)}>
      {/* The stage stays 5:4, so the kernel's pointer mapping is unchanged by the zoom. */}
      <div
        ref={stageRef}
        data-hairline={name}
        data-hairline-theme="light"
        style={{
          ...PALETTE,
          position: "absolute",
          width: `${zoom * 100}%`,
          left: `${((1 - zoom) / 2) * 100}%`,
          top: `${((1 - zoom) / 2) * 100}%`,
        }}
      />
      {showReadout && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-2 right-2.5 font-mono text-[10.5px] text-[#6B7280] tabular-nums transition-opacity duration-300",
            readout === "rest" ? "opacity-0" : "opacity-100",
          )}
        >
          {readout}
        </span>
      )}
    </div>
  );
}
