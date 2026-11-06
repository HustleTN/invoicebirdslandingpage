import type { Metadata } from "next";

import { DocumentsSection } from "@/components/sections/documents/documents-section";
import { DocumentsIllustratedSection } from "@/components/sections/documents-illustrated/documents-illustrated-section";

export const metadata: Metadata = {
  title: "Preview · Documents section",
  robots: { index: false, follow: false },
};

function VersionLabel({ letter, name, note }: { letter: string; name: string; note: string }) {
  return (
    <div className="sticky top-16 z-40 border-y border-[#E6EAEF] bg-surface/95 backdrop-blur">
      <p className="mx-auto max-w-content px-4 py-2.5 text-sm text-navy sm:px-6 lg:px-8">
        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md bg-navy text-xs font-semibold text-white">
          {letter}
        </span>
        <span className="font-semibold">{name}</span> <span className="text-muted">· {note}</span>
      </p>
    </div>
  );
}

/** Side-by-side comparison of the two versions of the documents section. Not linked from the site. */
export default function DocumentsPreviewPage() {
  return (
    <>
      <VersionLabel letter="A" name="Current" note="document previews (on the homepage)" />
      <DocumentsSection />
      <VersionLabel letter="B" name="Illustrated" note="interactive Hairline figures. Hover each one" />
      <DocumentsIllustratedSection />
    </>
  );
}
