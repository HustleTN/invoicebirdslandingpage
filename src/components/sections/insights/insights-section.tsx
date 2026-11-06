import { Container } from "@/components/ui/container";

import { InsightsDashboard } from "./insights-dashboard";

export function InsightsSection() {
  return (
    <section aria-labelledby="insights-title" className="bg-surface py-20 text-navy sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <h2 id="insights-title" className="text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[44px] lg:text-[52px]">
            Know what&apos;s paid. Know what&apos;s next.
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed text-muted sm:text-lg">
            Track payments, spot overdue invoices, manage expenses and understand your business numbers. Or simply ask
            Birdy for the answers.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <InsightsDashboard />
        </div>
      </Container>
    </section>
  );
}
