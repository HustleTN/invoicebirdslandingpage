import { Container } from "@/components/ui/container";

import { WorkspaceDemo } from "./workspace-demo";

export function WorkspaceSection() {
  return (
    <section aria-labelledby="workspace-title" className="bg-surface py-20 text-navy sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <h2 id="workspace-title" className="text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[44px] lg:text-[52px]">
            Set it once. Birdy puts it to work.
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed text-muted sm:text-lg">
            Your clients, services, prices and business settings are already in InvoiceBirds. Birdy uses them to prepare
            documents, handle everyday tasks and give you answers.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <WorkspaceDemo />
        </div>
      </Container>
    </section>
  );
}
