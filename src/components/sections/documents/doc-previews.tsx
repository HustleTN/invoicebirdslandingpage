import { Check } from "lucide-react";

import { cn } from "@/lib/cn";

import { CLIENT, ITEMS, money, SUBTOTAL, TOTAL, VAT, type FlowFrame } from "./flow-timeline";

/** Natural size of a preview sheet; previews are scaled with `zoom` where needed. */
export const SHEET_WIDTH = 164;
export const SHEET_HEIGHT = 200;

function Sheet({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white px-3 pt-3 pb-2.5 font-[Helvetica,Arial,sans-serif] text-[6.5px] leading-[1.45] text-[#111827] shadow-[0_1px_6px_rgba(17,29,44,0.1)]",
        className,
      )}
      style={{ width: SHEET_WIDTH, height: SHEET_HEIGHT }}
    >
      {children}
    </div>
  );
}

function Wordmark() {
  return (
    <div className="leading-none">
      <p className="text-[9px] font-black tracking-[-0.02em] text-[#B91C1C] italic">RIDGEWAY</p>
      <p className="mt-0.5 text-[3.6px] font-bold tracking-[0.28em] text-[#1F2937]">TOWING &amp; RECOVERY</p>
    </div>
  );
}

function DocHeader({ title, number, color = "#111827" }: { title: string; number: string; color?: string }) {
  return (
    <div className="flex items-start justify-between">
      <Wordmark />
      <div className="text-right">
        <p className="text-[10px] leading-none font-bold tracking-[-0.01em]" style={{ color }}>
          {title}
        </p>
        <p className="mt-1 text-[5.5px] text-[#6B7280]">{number}</p>
      </div>
    </div>
  );
}

/** Grey placeholder lines standing in for body copy. */
function Lines({ widths }: { widths: string[] }) {
  return (
    <div className="space-y-[3px]">
      {widths.map((width, index) => (
        <div key={index} className="h-[2.5px] rounded-full bg-[#E5E7EB]" style={{ width }} />
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-0.5 text-[4.8px] font-semibold tracking-[0.16em] text-[#8A94A3]">{children}</p>;
}

/** Highlights a field that was carried over from the estimate. */
function Carried({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("-mx-1 rounded px-1 transition-colors duration-700", active ? "bg-[#E3F8EB]" : "bg-transparent")}>
      {children}
    </div>
  );
}

function ItemsTable({ color = "#111827", empty = false }: { color?: string; empty?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[3px] border border-[#E5E7EB]">
      <div className="flex justify-between px-1.5 py-[3px] text-[4.8px] font-semibold tracking-[0.12em] text-white" style={{ backgroundColor: color }}>
        <span>DESCRIPTION</span>
        <span>AMOUNT</span>
      </div>
      {ITEMS.map((item) => (
        <div key={item.name} className="flex justify-between border-t border-[#F1F3F5] px-1.5 py-[3px]">
          {empty ? (
            <>
              <span className="my-[2px] h-[2.5px] w-12 rounded-full bg-[#EEF0F3]" />
              <span className="my-[2px] h-[2.5px] w-6 rounded-full bg-[#EEF0F3]" />
            </>
          ) : (
            <>
              <span>{item.name}</span>
              <span className="tabular-nums">{money(item.price)}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function Totals({ empty = false, color = "#111827" }: { empty?: boolean; color?: string }) {
  return (
    <div className="mt-1.5 ml-auto w-[78px] space-y-[1px]">
      <div className="flex justify-between text-[#6B7280]">
        <span>Subtotal</span>
        <span className="text-[#111827] tabular-nums">{empty ? "-" : money(SUBTOTAL)}</span>
      </div>
      <div className="flex justify-between text-[#6B7280]">
        <span>VAT 20%</span>
        <span className="text-[#111827] tabular-nums">{empty ? "-" : money(VAT)}</span>
      </div>
      <div className="mt-0.5 flex justify-between rounded-[3px] px-1.5 py-[3px] font-bold text-white" style={{ backgroundColor: color }}>
        <span className="text-[5px] tracking-[0.12em]">TOTAL</span>
        <span className="tabular-nums">{empty ? "$0.00" : money(TOTAL)}</span>
      </div>
    </div>
  );
}

export function ProposalSheet() {
  return (
    <Sheet>
      <Wordmark />
      <p className="mt-3 text-[5.5px] font-semibold tracking-[0.16em] text-[#7C3AED]">PROPOSAL · PRO-031</p>
      <p className="mt-0.5 text-[10px] leading-tight font-bold">Fleet Recovery Partnership</p>
      <p className="mt-1 text-[#6B7280]">Prepared for {CLIENT.name}</p>
      <div className="mt-2.5">
        <Lines widths={["100%", "92%", "96%", "70%"]} />
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-1">
        {[
          ["24/7 recovery", "45 min response"],
          ["Fleet rate", "From $350/job"],
        ].map(([title, detail]) => (
          <div key={title} className="rounded-[3px] bg-[#F5F3FF] px-1.5 py-1">
            <p className="font-semibold">{title}</p>
            <p className="text-[#6B7280]">{detail}</p>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between border-t border-[#EEF0F3] pt-1.5">
        <span className="text-[#6B7280]">12-month plan</span>
        <span className="flex items-center gap-0.5 font-semibold text-green">
          <Check size={6} strokeWidth={3} /> Accepted
        </span>
      </div>
    </Sheet>
  );
}

export function ContractSheet({ frame }: { frame: FlowFrame }) {
  return (
    <Sheet>
      <Wordmark />
      <p className="mt-3 text-[5.5px] font-semibold tracking-[0.16em] text-[#B45309]">CONTRACT · CTR-018</p>
      <p className="mt-0.5 text-[10px] leading-tight font-bold">Service Agreement</p>
      <p className="mt-1 text-[#6B7280]">Ridgeway Towing &amp; Recovery and {CLIENT.name}</p>
      <div className="mt-2 space-y-1.5">
        {["1. Services", "2. Rates & payment", "3. Term"].map((clause) => (
          <div key={clause}>
            <p className="mb-0.5 font-semibold">{clause}</p>
            <Lines widths={["100%", "84%"]} />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-3 bottom-2.5 grid grid-cols-2 gap-2">
        {[
          ["Mark Ridgeway", "Ridgeway Towing"],
          [CLIENT.contact, CLIENT.name],
        ].map(([name, company]) => (
          <div key={name}>
            <p
              className={cn(
                "h-3 font-serif text-[8px] text-[#1E3A8A] italic transition-opacity duration-700",
                frame.contractSigned ? "opacity-100" : "opacity-0",
              )}
            >
              {name}
            </p>
            <div className="border-t border-[#D1D5DB] pt-0.5 text-[4.8px] text-[#6B7280]">{company}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

export function EstimateSheet({ frame }: { frame: FlowFrame }) {
  return (
    <Sheet>
      <DocHeader title="ESTIMATE" number="EST-112" />
      <div className="mt-2.5">
        <Label>PREPARED FOR</Label>
        <p className="font-semibold">{CLIENT.name}</p>
        <p className="text-[#6B7280]">M62 J27 · Ford Transit</p>
      </div>
      <div className="mt-2">
        <ItemsTable />
      </div>
      <Totals />
      <div className="absolute inset-x-3 bottom-2.5">
        <div
          className={cn(
            "flex items-center justify-center gap-1 rounded-[4px] py-[3px] text-[5.5px] font-semibold text-white transition-all duration-200",
            frame.convertPressed ? "scale-95 bg-[#00983D]" : "bg-green",
            frame.converting && "ring-2 ring-green/25",
          )}
        >
          Convert to invoice
        </div>
      </div>
    </Sheet>
  );
}

export function InvoiceSheet({ frame }: { frame: FlowFrame }) {
  const fade = cn("transition-opacity duration-500", frame.resetting ? "opacity-0" : "opacity-100");

  return (
    <Sheet>
      <DocHeader title="INVOICE" number="INV-823" color="#0A2540" />
      <div className={fade}>
        <p
          className={cn(
            "mt-1.5 inline-block rounded-full bg-green-soft px-1.5 py-[1px] text-[4.8px] font-semibold text-green transition-opacity duration-500",
            frame.invoiceClient ? "opacity-100" : "opacity-0",
          )}
        >
          Converted from EST-112
        </p>
        <Carried active={frame.clientFlash}>
          <Label>BILL TO</Label>
          {frame.invoiceClient ? (
            <>
              <p className="font-semibold">{CLIENT.name}</p>
              <p className="text-[#6B7280]">Attn: {CLIENT.contact}</p>
            </>
          ) : (
            <>
              <p className="text-[#B5BDC7] italic">Choose a client</p>
              <p className="text-transparent">.</p>
            </>
          )}
        </Carried>
        <div className="mt-1.5">
          <Carried active={frame.itemsFlash}>
            <ItemsTable color="#0A2540" empty={!frame.invoiceItems} />
          </Carried>
        </div>
        <Carried active={frame.totalFlash}>
          <Totals color="#0A2540" empty={!frame.invoiceTotal} />
        </Carried>
      </div>
      <p className="absolute inset-x-3 bottom-2.5 text-[#6B7280]">Due in 14 days · Bank transfer or card</p>
    </Sheet>
  );
}

export function PaymentSheet({ frame }: { frame: FlowFrame }) {
  const received = frame.paymentReceived && !frame.resetting;

  return (
    <Sheet className="flex flex-col items-center text-center">
      <div className="self-stretch text-left">
        <Wordmark />
      </div>
      <div
        className={cn(
          "mt-5 flex size-9 items-center justify-center rounded-full transition-all duration-500",
          received ? "scale-100 bg-green-soft text-green" : "scale-90 bg-[#F1F3F5] text-[#C4C9D0]",
        )}
      >
        <Check size={18} strokeWidth={2.5} />
      </div>
      <p className="mt-2 text-[6px] text-[#6B7280]">{received ? "Payment received" : "Awaiting payment"}</p>
      <p className={cn("mt-0.5 text-[15px] font-bold tabular-nums transition-colors duration-500", !received && "text-[#C4C9D0]")}>
        {money(TOTAL)}
      </p>
      <div className="mt-3 w-full space-y-[2px] border-t border-[#EEF0F3] pt-2 text-left">
        {[
          ["Invoice", "INV-823"],
          ["From", CLIENT.name],
          ["Method", "Card •••• 4242"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-[#6B7280]">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
