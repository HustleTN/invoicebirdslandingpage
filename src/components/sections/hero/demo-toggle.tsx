import { cn } from "@/lib/cn";

export function DemoToggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[18px] w-8 shrink-0 rounded-full transition-colors",
        on ? "bg-green" : "bg-[#E3E7EC]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-3.5 rounded-full bg-white shadow-sm transition-[left]",
          on ? "left-[16px]" : "left-0.5",
        )}
      />
    </span>
  );
}
