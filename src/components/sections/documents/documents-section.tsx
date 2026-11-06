import { Container } from "@/components/ui/container";

import { DocumentFlow } from "./document-flow";

export function DocumentsSection() {
  return (
    <section aria-labelledby="documents-title" className="bg-white py-20 text-navy sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <h2 id="documents-title" className="text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[44px] lg:text-[52px]">
            Every document. One connected flow.
          </h2>
          <p className="mx-auto mt-5 max-w-[660px] text-base leading-relaxed text-muted sm:text-lg">
            From the first proposal to the final payment, create, manage and track your documents in one place. No
            repeated client details. No disconnected tools.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <DocumentFlow />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Start anywhere. Use each document on its own, or connect them as you go.
        </p>
      </Container>
    </section>
  );
}
