import type { Locale, Localized } from "@/lib/i18n";

/** Points of a five-pointed star centred on (cx, cy). */
function star(cx: number, cy: number, outer: number) {
  const inner = outer * 0.4;
  return Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

/** The ring of twelve stars, computed once. */
const STARS = Array.from({ length: 12 }, (_, i) => {
  const angle = (Math.PI / 6) * i - Math.PI / 2;
  return star(32 + 21 * Math.cos(angle), 32 + 21 * Math.sin(angle), 3.6);
});

const COPY: Localized<{ gdpr: string; gdprLabel: string; bits: string; encryption: string; sslLabel: string }> = {
  en: { gdpr: "GDPR", gdprLabel: "GDPR compliant", bits: "256 BIT", encryption: "ENCRYPTION", sslLabel: "256-bit SSL encryption" },
  fr: { gdpr: "RGPD", gdprLabel: "Conforme au RGPD", bits: "256 BITS", encryption: "CHIFFREMENT", sslLabel: "Chiffrement SSL 256 bits" },
};

/** GDPR and 256-bit SSL badges for the footer. */
export function TrustBadges({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <ul className="flex items-center gap-3">
      <li>
        <svg viewBox="0 0 64 64" role="img" aria-label={t.gdprLabel} className="h-14 w-14">
          <circle cx="32" cy="32" r="31" fill="#1E4FA3" />
          {STARS.map((points) => (
            <polygon key={points} points={points} fill="#FFD43B" />
          ))}
          <text x="32" y="36.5" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800" letterSpacing="0.3" fontFamily="inherit">
            {t.gdpr}
          </text>
        </svg>
      </li>
      <li>
        <svg viewBox="0 0 56 64" role="img" aria-label={t.sslLabel} className="h-14 w-auto">
          <path d="M28 2 52 10v20c0 15.5-10.2 26.6-24 32C14.2 56.6 4 45.5 4 30V10L28 2Z" fill="#F7C948" stroke="#E0AE23" strokeWidth="1.5" />
          <text x="28" y="22" textAnchor="middle" fill="#0A2540" fontSize="8" fontWeight="800" fontFamily="inherit">
            {t.bits}
          </text>
          <text x="28" y="37" textAnchor="middle" fill="#0A2540" fontSize="15" fontWeight="800" fontFamily="inherit">
            SSL
          </text>
          <text x="28" y="46" textAnchor="middle" fill="#0A2540" fontSize={locale === "fr" ? 5 : 5.6} fontWeight="700" letterSpacing="0.2" fontFamily="inherit">
            {t.encryption}
          </text>
        </svg>
      </li>
    </ul>
  );
}
