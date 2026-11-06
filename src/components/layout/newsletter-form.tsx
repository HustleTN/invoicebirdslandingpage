"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";

const COPY: Localized<{ thanks: string; label: string; placeholder: string; subscribe: string; error: string }> = {
  en: {
    thanks: "Thanks for subscribing. Watch your inbox for our next issue.",
    label: "Email address",
    placeholder: "you@yourbusiness.com",
    subscribe: "Subscribe",
    error: "Something went wrong. Please try again in a moment.",
  },
  fr: {
    thanks: "Merci pour votre inscription. Notre prochain numéro arrivera bientôt dans votre boîte de réception.",
    label: "Adresse e-mail",
    placeholder: "vous@votreentreprise.fr",
    subscribe: "S’abonner",
    error: "Une erreur est survenue. Veuillez réessayer dans un instant.",
  },
};

/** Email signup for the newsletter. Posts to `siteConfig.links.newsletter` once a provider is connected. */
export function NewsletterForm() {
  const t = COPY[useLocale()];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    try {
      const endpoint: string = siteConfig.links.newsletter;
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error(`Newsletter signup failed: ${response.status}`);
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-3.5 text-[15px] font-medium text-white">
        <span className="flex size-6 items-center justify-center rounded-full bg-green text-white">
          <Check size={14} strokeWidth={3} aria-hidden="true" />
        </span>
        {t.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} className="w-full">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.label}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          className="h-12 w-full min-w-0 rounded-lg bg-white/10 sm:flex-1 px-4 text-[15px] text-white outline-none placeholder:text-[#8D9BAE] focus:bg-white/15 focus:ring-4 focus:ring-white/10"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-green px-6 text-[15px] font-semibold text-white transition-colors hover:bg-green-hover disabled:opacity-70"
        >
          {state === "sending" ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : null}
          {t.subscribe}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-[13.5px] text-[#FCA5A5]">
          {t.error}
        </p>
      )}
    </form>
  );
}
