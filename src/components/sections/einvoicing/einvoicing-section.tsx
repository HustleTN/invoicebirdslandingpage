import { Container } from "@/components/ui/container";

import { EInvoiceDemo } from "./einvoice-demo";

export function EInvoicingSection() {
  return (
    <section aria-labelledby="einvoicing-title" className="bg-white py-20 text-navy sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <h2 id="einvoicing-title" className="text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[44px] lg:text-[52px]">
            E-invoicing, without another workflow.
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed text-muted sm:text-lg">
            Create, send and receive electronic invoices alongside your regular invoices. Same clients, same workspace,
            less administrative work.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <EInvoiceDemo />
        </div>
      </Container>
    </section>
  );
}
