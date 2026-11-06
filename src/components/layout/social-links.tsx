import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n";

/** Brand marks, 24×24, drawn in currentColor. */
const ICONS: Record<(typeof siteConfig.social)[number]["name"], ReactNode> = {
  LinkedIn: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
    />
  ),
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </g>
  ),
  X: (
    <path
      fill="currentColor"
      d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.49h2.04L6.49 3.24H4.3l13.31 17.4Z"
    />
  ),
  Facebook: (
    <path
      fill="currentColor"
      d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
    />
  ),
};

/** Round icon links to the InvoiceBirds social profiles. */
export function SocialLinks({ locale }: { locale: Locale }) {
  const on = locale === "fr" ? "sur" : "on";
  return (
    <ul className="flex items-center gap-2">
      {siteConfig.social.map(({ name, href }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.name} ${on} ${name}`}
            className="flex size-9 items-center justify-center rounded-full bg-white/[0.07] text-[#B8C4D3] transition-colors hover:bg-white/15 hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[17px]">
              {ICONS[name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
