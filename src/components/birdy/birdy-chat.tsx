import Image from "next/image";
import { ArrowUp, History, Mic, SquarePen, X } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

const MONTHLY_REQUESTS = 35;

const COPY: Localized<{ requestsLeft: (left: number, total: number) => string; placeholder: string; hint: string }> = {
  en: {
    requestsLeft: (left, total) => `${left} of ${total} Birdy requests left this month`,
    placeholder: "Message Birdy",
    hint: "Enter to send, Shift + Enter for a new line",
  },
  fr: {
    requestsLeft: (left, total) => `${left} sur ${total} requêtes Birdy restantes ce mois-ci`,
    placeholder: "Écrire à Birdy",
    hint: "Entrée pour envoyer, Maj + Entrée pour aller à la ligne",
  },
};

export function BirdyMascot({ size }: { size: number }) {
  return <Image src="/images/bird-wave.webp" alt="" width={181} height={160} style={{ width: size, height: "auto" }} />;
}

export function TypingCaret() {
  return <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 animate-pulse bg-green" />;
}

export function ThinkingDots() {
  return (
    <span className="inline-flex gap-1 py-2">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-[#9CA3AF]"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="ml-10 animate-fade-in rounded-2xl rounded-br-md bg-surface px-3.5 py-2.5 text-[#1F2937]">{children}</p>
  );
}

export function BirdyMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex animate-fade-in gap-2.5">
      <span className="mt-0.5 shrink-0">
        <BirdyMascot size={26} />
      </span>
      <div className="min-w-0 flex-1 text-[#1F2937]">{children}</div>
    </div>
  );
}

/**
 * Visual shell of the Birdy assistant panel, matching the in-app design.
 * Messages stay pinned to the bottom; older ones scroll out of view.
 */
export function BirdyChatShell({
  requestsLeft,
  monthlyRequests = MONTHLY_REQUESTS,
  input,
  inputActive,
  fading = false,
  className,
  children,
}: {
  requestsLeft: number;
  monthlyRequests?: number;
  /** What is in the message box; falls back to the placeholder. */
  input: React.ReactNode;
  inputActive: boolean;
  fading?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const t = COPY[useLocale()];
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-[#E3E7EC] bg-white text-left text-[#111827]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3">
        <BirdyMascot size={32} />
        <div className="flex-1">
          <p className="text-sm font-semibold">Birdy</p>
          <p className="text-[11px] text-[#6B7280]">{t.requestsLeft(requestsLeft, monthlyRequests)}</p>
        </div>
        <span className="flex items-center gap-3.5 text-[#374151]">
          <SquarePen size={16} />
          <History size={16} />
          <X size={16} />
        </span>
      </div>
      <div className="h-0.5 bg-[#EEF0F3]">
        <div
          className="h-full bg-navy transition-[width] duration-500"
          style={{ width: `${(requestsLeft / monthlyRequests) * 100}%` }}
        />
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col justify-end space-y-3.5 overflow-hidden px-4 pt-4 pb-3 text-[13px] leading-[1.55] transition-opacity duration-500",
          fading && "opacity-0",
        )}
      >
        {children}
      </div>

      <div className="border-t border-[#EEF0F3] px-3 pt-3 pb-2.5">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border px-3 py-2.5 transition-colors",
            inputActive ? "border-[#9CA3AF]" : "border-[#D9DDE2]",
          )}
        >
          <p className="min-h-[20px] flex-1 text-[13px] leading-[1.5]">
            {input || <span className="text-[#9CA3AF]">{t.placeholder}</span>}
          </p>
          <Mic size={16} className="mb-1 text-[#4B5563]" />
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors",
              inputActive ? "bg-navy text-white" : "bg-[#E5E7EB] text-[#9CA3AF]",
            )}
          >
            <ArrowUp size={14} />
          </span>
        </div>
        <p className="mt-1.5 px-1 text-[10px] text-[#9CA3AF]">{t.hint}</p>
      </div>
    </div>
  );
}
