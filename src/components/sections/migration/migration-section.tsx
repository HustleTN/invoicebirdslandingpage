import { FileUp, Headset, Rows3, type LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { MigrationVisual } from "./migration-visual";

const en = {
  eyebrow: "Switching made simple",
  title: "Switch in an afternoon. We'll help you move.",
  leadStrong: "Bring everything with you. We'll help.",
  lead: "Import your clients, items, services and expenses from the tool you use today, and get set up with a real person by your side.",
  contact: "Talk to our team",
  start: "Start for free",
  note: "Migration help is included on paid plans.",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: "Changer d’outil, simplement",
    title: "Changez d’outil en un après-midi. Nous vous accompagnons.",
    leadStrong: "Emportez toutes vos données. Nous vous aidons.",
    lead: "Importez vos clients, articles, prestations et dépenses depuis votre outil actuel, et configurez votre compte avec une vraie personne à vos côtés.",
    contact: "Contacter notre équipe",
    start: "Commencer gratuitement",
    note: "L’aide à la migration est incluse dans les formules payantes.",
  },
};

const POINTS: { icon: LucideIcon; copy: Localized<{ title: string; text: string }> }[] = [
  {
    icon: FileUp,
    copy: {
      en: {
        title: "Upload a CSV",
        text: "Export from your current software or a spreadsheet, then upload the file to bring your data across.",
      },
      fr: {
        title: "Import CSV",
        text: "Exportez vos données depuis votre logiciel actuel ou un tableur, puis importez le fichier pour tout récupérer.",
      },
    },
  },
  {
    icon: Rows3,
    copy: {
      en: {
        title: "Add in bulk",
        text: "Add clients, items, services and expenses in bulk, by CSV or by hand, instead of one at a time.",
      },
      fr: {
        title: "Ajout groupé",
        text: "Ajoutez clients, articles, prestations et dépenses en une seule fois, par CSV ou à la main, plutôt qu’un par un.",
      },
    },
  },
  {
    icon: Headset,
    copy: {
      en: {
        title: "Real people, ready to help",
        text: "On paid plans, our team guides your move by video call, chat or email.",
      },
      fr: {
        title: "Une vraie équipe, prête à vous aider",
        text: "Avec les formules payantes, notre équipe vous guide dans votre migration par appel vidéo, chat ou e-mail.",
      },
    },
  },
];

/** Switching from another tool: import and bulk add, with the support team alongside. */
export async function MigrationSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section aria-labelledby="migration-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="migration-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px]"
          >
            {t.title}
          </h2>
          <p className="mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            <span className="font-semibold text-navy">{t.leadStrong}</span> {t.lead}
          </p>

          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, copy }) => {
              const { title, text } = copy[locale];
              return (
                <li key={title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-blue">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.links.contact}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-green px-6 text-[15px] font-semibold text-white transition-colors hover:bg-green-hover"
            >
              {t.contact}
            </a>
            <a
              href={siteConfig.links.signup}
              className="inline-flex h-12 items-center rounded-lg border border-line px-6 text-[15px] font-semibold text-navy transition-colors hover:border-[#B9C5D3] hover:bg-surface"
            >
              {t.start}
            </a>
          </div>
          <p className="mt-3 text-[13px] text-muted">{t.note}</p>
        </div>

        <MigrationVisual />
      </Container>
    </section>
  );
}
