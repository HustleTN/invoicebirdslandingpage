
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { PaymentVisual } from "./payment-visual";

const en = {
  eyebrow: "Online payments & follow-ups",
  title: "Make it easy for clients to pay.",
  lead: "Add a payment link to your invoice, see what has been paid and follow up on what is overdue, all in one place.",
  points: [
    { title: "Pay from the invoice", text: "Give clients a direct way to pay online." },
    { title: "Know what needs attention", text: "See paid, outstanding and overdue invoices." },
    { title: "Follow up without starting over", text: "Use payment reminders to keep the conversation moving." },
  ],
  reminders: "Automatic payment reminders are included with Professional and Growth.",
  organized: "Keep expenses, payment history and tax reports organized alongside your invoices.",
  start: "Start for free",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: "Paiements en ligne et relances",
    title: "Facilitez le paiement pour vos clients.",
    lead: "Ajoutez un lien de paiement à votre facture, suivez ce qui a été réglé et relancez ce qui est en retard, le tout au même endroit.",
    points: [
      { title: "Encaissez depuis la facture", text: "Offrez à vos clients un moyen direct de payer en ligne." },
      { title: "Repérez ce qui demande votre attention", text: "Visualisez les factures payées, en attente et en retard." },
      { title: "Relancez sans repartir de zéro", text: "Les relances de paiement entretiennent le dialogue avec vos clients." },
    ],
    reminders: "Les relances de paiement automatiques sont incluses dans les formules Professional et Growth.",
    organized: "Gardez dépenses, historique des paiements et rapports fiscaux bien organisés, à côté de vos factures.",
    start: "Commencer gratuitement",
  },
};

export async function PaymentsSection() {
  const t = COPY[await getLocale()];
  return (
    <section aria-labelledby="payments-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="payments-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px]">
            {t.title}
          </h2>
          <p className="mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            {t.lead}
          </p>

          <dl className="mt-8 space-y-5">
            {t.points.map((point) => (
              <div key={point.title}>
                <dt className="font-semibold">{point.title}</dt>
                <dd className="mt-1 text-[15px] text-muted">{point.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[13px] text-muted">{t.reminders}</p>

          <p className="mt-8 text-[15px] text-navy">{t.organized}</p>
          <a
            href={siteConfig.links.signup}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-green px-5 text-sm font-semibold text-white transition-colors hover:bg-green-hover"
          >
            {t.start}
          </a>
        </div>

        <div className="pb-12 sm:pb-0">
          <PaymentVisual />
        </div>
      </Container>
    </section>
  );
}
