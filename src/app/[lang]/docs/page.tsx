import { redirect } from "next/navigation";

import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

/** The docs start with the first guide. */
export default async function DocsIndex() {
  redirect(localizeHref(await getLocale(), "/docs/create-an-invoice"));
}
