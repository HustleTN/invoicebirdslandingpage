import type { Metadata } from "next";

import { PopupGallery } from "@/components/popups/popup-gallery";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Popups",
  robots: { index: false, follow: false },
};

/** Design principles behind the popups, for whoever ports them into the app. */
const NOTES = [
  {
    title: "Show the feature, not a mascot",
    text: "Each upgrade popup previews the real thing in product UI: a proposal being accepted, a contract being signed, a VAT summary adding up.",
  },
  {
    title: "Name the plan and the price up front",
    text: "The plan is in the label and the button, and the starting price sits under it, so nobody clicks blind.",
  },
  {
    title: "Make limits feel fair",
    text: "Limit popups show what’s in use (3 of 3) and remind that invoices stay unlimited, then list what Professional adds.",
  },
  {
    title: "One green, one action",
    text: "The brand green with white text is used only for the upgrade button. Secondary actions stay outlined or plain.",
  },
  {
    title: "Accessible by default",
    text: "Built on the native dialog: focus stays inside, Escape and the backdrop close it, and previews hold still for reduced motion.",
  },
];

export default function PopupsPage() {
  return (
    <div className="bg-white text-navy">
      <section aria-labelledby="popups-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <p className="text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">Playground</p>
          <h1 id="popups-title" className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.035em] sm:text-[48px]">
            Upgrade and limit popups
          </h1>
          <p className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-muted">
            Proposed designs for the in-app popups. Click a card to open the popup as it would appear in the dashboard.
          </p>
        </Container>
      </section>

      <section aria-label="Popups">
        <Container className="py-12 sm:py-16">
          <PopupGallery />

          <div className="mt-16 rounded-2xl border border-line p-6 sm:p-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Design notes</h2>
            <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {NOTES.map(({ title, text }) => (
                <li key={title}>
                  <p className="text-[15px] font-semibold">{title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
