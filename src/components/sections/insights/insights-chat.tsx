import { Bell } from "lucide-react";

import { BirdyChatShell, BirdyMessage, ThinkingDots, TypingCaret, UserMessage } from "@/components/birdy/birdy-chat";
import { cn } from "@/lib/cn";

import { euro, INVOICES, OUTSTANDING, OVERDUE } from "./data";
import { StatusBadge } from "./dashboard-ui";

const QUESTION = "Who still owes me money?";
const ACTION = "Prepare a reminder for Daniel Carter.";

/** Key moments in the loop, in milliseconds. */
const T = {
  type: 600,
  sent: 1_900,
  reply: 2_700,
  press: 5_600,
  actionSent: 5_900,
  confirmed: 6_700,
  fade: 12_500,
};

export const CHAT_LOOP_MS = 13_000;
export const CHAT_FINAL_FRAME = 12_000;

/** Birdy has answered, so the dashboard can highlight the unpaid invoices. */
export const birdyAnswered = (ms: number) => ms >= T.reply && ms < T.fade;

const UNPAID = INVOICES.filter((invoice) => invoice.status !== "paid").sort(
  (a, b) => Number(b.status === "overdue") - Number(a.status === "overdue"),
);

export function InsightsChat({ ms, className }: { ms: number; className?: string }) {
  const sent = ms >= T.sent;
  const typed = !sent && ms >= T.type ? QUESTION.slice(0, Math.floor((ms - T.type) / 40)) : "";
  const pressed = ms >= T.press && ms < T.actionSent;
  const actionSent = ms >= T.actionSent;

  return (
    <BirdyChatShell
      className={className}
      requestsLeft={actionSent ? 15 : sent ? 16 : 17}
      inputActive={typed.length > 0}
      fading={ms >= T.fade}
      input={
        typed && (
          <span className="text-[#1F2937]">
            {typed}
            <TypingCaret />
          </span>
        )
      }
    >
      {sent && <UserMessage>{QUESTION}</UserMessage>}
      {sent && (
        <BirdyMessage>
          {ms < T.reply ? (
            <ThinkingDots />
          ) : (
            <>
              <p>
                You have <strong className="font-semibold">{euro(OUTSTANDING)}</strong> outstanding, including{" "}
                <strong className="font-semibold">{euro(OVERDUE)}</strong> overdue. Want me to prepare a reminder?
              </p>
              <ul className="mt-2.5 divide-y divide-[#EEF1F4] rounded-xl border border-[#E3E7EC] text-[12px]">
                {UNPAID.map((invoice) => (
                  <li key={invoice.number} className="flex items-center gap-2 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-navy">{invoice.client}</p>
                      <p className="text-[11px] text-[#6B7280]">
                        {invoice.number} · {invoice.when}
                      </p>
                    </div>
                    <span className="font-medium text-navy tabular-nums">{euro(invoice.amount)}</span>
                  </li>
                ))}
              </ul>
              {!actionSent && (
                <div className="mt-2.5 flex gap-2 text-[12px] font-medium">
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-white transition-all duration-150",
                      pressed ? "scale-95 bg-green-hover" : "bg-green",
                    )}
                  >
                    <Bell size={12} /> Prepare reminder
                  </span>
                  <span className="rounded-lg border border-[#E3E7EC] px-2.5 py-1.5 text-[#374151]">Not now</span>
                </div>
              )}
            </>
          )}
        </BirdyMessage>
      )}
      {actionSent && <UserMessage>{ACTION}</UserMessage>}
      {actionSent && (
        <BirdyMessage>
          {ms < T.confirmed ? (
            <ThinkingDots />
          ) : (
            <div>
              <p>Done. Your reminder is ready for review:</p>
              <div className="mt-2 flex animate-fade-in items-center gap-2 rounded-xl border border-[#E3E7EC] px-3 py-2 text-[12px]">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-navy">Reminder · INV-814</p>
                  <p className="text-[11px] text-[#6B7280]">To Daniel Carter · {euro(OVERDUE)}</p>
                </div>
                <StatusBadge status="overdue" />
              </div>
            </div>
          )}
        </BirdyMessage>
      )}
    </BirdyChatShell>
  );
}
