import { Check, FileText, LoaderCircle, Mail, Paperclip, Send, X } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { DemoCursor } from "./demo-cursor";
import { CLIENT, type DemoFrame } from "./demo-timeline";
import { TypingCaret } from "./typing-caret";

const en = {
  title: "Send invoice",
  subtitle: "The PDF is generated automatically and attached on send.",
  to: "TO",
  ccHint: "(optional, comma-separated)",
  ccPlaceholder: "cfo@example.com, accounting@example.com",
  subject: "SUBJECT",
  subjectValue: "Invoice INV-822",
  message: "MESSAGE",
  greeting: "Hi,",
  body: "Please find attached invoice INV-822 for your review.",
  thanks: "Thank you for your business.",
  attachment: "ATTACHMENT",
  fileName: "invoice-INV-822.pdf",
  fileNote: "Generated automatically when you press Send",
  sentTo: "Sent to",
  cancel: "Cancel",
  sent: "Sent",
  sending: "Sending…",
  send: "Send invoice",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    title: "Envoyer la facture",
    subtitle: "Le PDF est généré automatiquement et joint à l’envoi.",
    to: "À",
    ccHint: "(facultatif, séparés par des virgules)",
    ccPlaceholder: "daf@example.com, compta@example.com",
    subject: "OBJET",
    subjectValue: "Facture INV-822",
    message: "MESSAGE",
    greeting: "Bonjour,",
    body: "Veuillez trouver ci-joint la facture INV-822.",
    thanks: "Merci pour votre confiance.",
    attachment: "PIÈCE JOINTE",
    fileName: "facture-INV-822.pdf",
    fileNote: "Généré automatiquement à l’envoi",
    sentTo: "Envoyée à",
    cancel: "Annuler",
    sent: "Envoyée",
    sending: "Envoi en cours…",
    send: "Envoyer la facture",
  },
};

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[9.5px] font-semibold tracking-[0.14em] text-[#4B5563]">{children}</p>;
}

function EmailField({
  value,
  typing,
  focused,
  placeholder,
}: {
  value: string;
  typing: boolean;
  focused: boolean;
  placeholder: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11.5px] transition-colors",
        focused ? "border-green ring-2 ring-green/15" : "border-[#E3E6EA]",
      )}
    >
      <Mail size={13} className="shrink-0 text-[#9CA3AF]" />
      {value ? (
        <span className="truncate">
          {value}
          {typing && <TypingCaret />}
        </span>
      ) : (
        <span className="truncate text-[#B5BDC7]">{placeholder}</span>
      )}
    </div>
  );
}

/** Compact recreation of the "Send invoice" dialog. */
export function SendInvoiceModal({ frame }: { frame: DemoFrame }) {
  const t = COPY[useLocale()];
  const toFocused = !frame.cc;
  const ccFocused = frame.cc.length > 0 && !frame.canSend;

  return (
    <div className="w-[350px] overflow-hidden rounded-2xl border border-[#E3E7EC] bg-white text-left text-[#111827] shadow-[0_12px_32px_rgba(10,37,64,0.09),0_2px_6px_rgba(10,37,64,0.04)]">
      <div className="flex items-start justify-between border-b border-[#EEF0F3] px-4 py-3">
        <div>
          <p className="text-[14px] font-bold">{t.title}</p>
          <p className="mt-0.5 text-[10.5px] text-[#6B7280]">{t.subtitle}</p>
        </div>
        <X size={15} className="mt-0.5 text-[#6B7280]" />
      </div>

      <div className={cn("space-y-3 px-4 pt-3 pb-3.5 transition-opacity duration-500", frame.resetting && "opacity-0")}>
        <div>
          <Label>{t.to}</Label>
          <EmailField value={frame.recipient} typing={frame.recipientTyping} focused={toFocused} placeholder="client@example.com" />
        </div>
        <div>
          <Label>
            CC <span className="font-normal tracking-normal text-[#9CA3AF]">{t.ccHint}</span>
          </Label>
          <EmailField
            value={frame.cc}
            typing={frame.ccTyping}
            focused={ccFocused}
            placeholder={t.ccPlaceholder}
          />
        </div>
        <div>
          <Label>{t.subject}</Label>
          <div className="rounded-lg border border-[#E3E6EA] px-2.5 py-2 text-[11.5px]">{t.subjectValue}</div>
        </div>
        <div>
          <Label>{t.message}</Label>
          <div className="space-y-2 rounded-lg border border-[#E3E6EA] px-2.5 py-2 text-[11.5px] leading-snug">
            <p>{t.greeting}</p>
            <p>{t.body}</p>
            <p>{t.thanks}</p>
          </div>
        </div>
        <div>
          <Label>
            <Paperclip size={10} className="mr-1 inline" />
            {t.attachment}
          </Label>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#E3E6EA] bg-[#FAFBFC] px-2.5 py-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-green-soft text-green">
              <FileText size={14} />
            </span>
            <div>
              <p className="text-[11.5px] font-semibold">{t.fileName}</p>
              <p className="text-[10px] text-[#6B7280]">{t.fileNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-[#EEF0F3] px-4 py-3">
        {frame.sent ? (
          <p className="mr-auto flex animate-fade-in items-center gap-1.5 text-[11px] font-medium text-green">
            <Check size={13} /> {t.sentTo} {CLIENT.email}
          </p>
        ) : (
          <span className="text-[12px] font-medium text-[#374151]">{t.cancel}</span>
        )}
        <span className="relative">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-medium text-white transition-colors",
              frame.sent || frame.sending || frame.canSend ? "bg-green" : "bg-[#CBD2DA]",
            )}
          >
            {frame.sent ? (
              <>
                <Check size={13} /> {t.sent}
              </>
            ) : frame.sending ? (
              <>
                <LoaderCircle size={13} className="animate-spin" /> {t.sending}
              </>
            ) : (
              <>
                <Send size={13} /> {t.send}
              </>
            )}
          </span>
          <DemoCursor visible={frame.sendCursor} clicking={frame.sendClick} className="top-5 left-12" />
        </span>
      </div>
    </div>
  );
}
