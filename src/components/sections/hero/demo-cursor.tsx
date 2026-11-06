import { cn } from "@/lib/cn";

/**
 * Pointer that glides onto its target and "clicks". Place it inside a
 * `relative` parent; its tip lands at `className`'s position.
 */
export function DemoCursor({ visible, clicking, className }: { visible: boolean; clicking: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute z-30 transition-all duration-500 ease-out",
        visible ? "translate-x-0 translate-y-0 opacity-100" : "translate-x-6 translate-y-6 opacity-0",
        className,
      )}
    >
      <span
        className={cn(
          "absolute -top-2.5 -left-2.5 size-5 rounded-full bg-green/30 transition-all duration-300",
          clicking ? "scale-150 opacity-100" : "scale-50 opacity-0",
        )}
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className={cn("relative drop-shadow-md transition-transform duration-150", clicking && "scale-90")}
      >
        <path d="M2 1.5 17 8.6l-6.4 1.9L7.7 17z" fill="#0A2540" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
