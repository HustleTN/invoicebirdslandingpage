import type { Localized } from "@/lib/i18n";

import type { LegalDocument } from "./legal-page";
import { privacyEn } from "./privacy-policy.en";
import { privacyFr } from "./privacy-policy.fr";
import { termsEn } from "./terms-of-service.en";
import { termsFr } from "./terms-of-service.fr";

export const PRIVACY_POLICY: Localized<LegalDocument> = { en: privacyEn, fr: privacyFr };
export const TERMS_OF_SERVICE: Localized<LegalDocument> = { en: termsEn, fr: termsFr };
