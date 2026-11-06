import Link from "next/link";

import { siteConfig } from "@/config/site";

import type { LegalDocument } from "./legal-page";

const email = <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>;

export const privacyEn: LegalDocument = {
  title: "Privacy Policy",
  lead: "How InvoiceBirds collects, uses and protects personal data, and the choices and rights you have.",
  updated: "6 November 2026",
  summary: [
    "We never sell your personal data or use it for advertising.",
    "We use your data to provide, secure and improve InvoiceBirds, and to support you.",
    "The client data you add to InvoiceBirds is yours. We process it only on your instructions.",
    "Your data is encrypted in transit, and you can download or delete it at any time.",
    `You can ask us anything about your data at ${siteConfig.email}.`,
  ],
  intro: (
    <p>
      This Privacy Policy explains how InvoiceBirds (“<strong>InvoiceBirds</strong>”, “<strong>we</strong>”, “<strong>us</strong>” or
      “<strong>our</strong>”) processes personal data when you visit invoicebirds.com (the “<strong>Website</strong>”), create an account
      or use the InvoiceBirds application and related services (together with the Website, the “<strong>Services</strong>”), subscribe
      to our newsletter or contact us. Please read it together with our <Link href="/terms">Terms of Service</Link>.
    </p>
  ),
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: (
        <>
          <p>
            For the purposes of the EU General Data Protection Regulation (“<strong>GDPR</strong>”), the UK GDPR and other applicable data
            protection laws, InvoiceBirds is the controller of the personal data described in this policy, except where section 2 provides
            otherwise.
          </p>
          <p>You can contact us about any privacy matter, including to exercise your rights, at {email}.</p>
        </>
      ),
    },
    {
      id: "our-role",
      title: "Our role for the data you manage",
      body: (
        <>
          <p>
            When you use InvoiceBirds, you may add information about your own clients and contacts, such as names, email and postal
            addresses, tax identification numbers and the content of invoices, estimates, proposals and contracts (“
            <strong>Customer Data</strong>”).
          </p>
          <p>
            For Customer Data, you are the controller and InvoiceBirds acts as your processor. We process Customer Data only to provide the
            Services to you, on your documented instructions and in accordance with the data protection terms in section 13 of our{" "}
            <Link href="/terms#data-protection">Terms of Service</Link>.
          </p>
          <p>
            If you are a client of one of our customers and want to exercise your rights over data that a business holds about you in
            InvoiceBirds, please contact that business directly. If you contact us instead, we will forward your request to it.
          </p>
        </>
      ),
    },
    {
      id: "data-we-collect",
      title: "Personal data we collect",
      body: (
        <>
          <h3>Information you provide</h3>
          <ul>
            <li>
              <strong>Account information:</strong> your name, email address, password (stored only in hashed form) and language
              preference.
            </li>
            <li>
              <strong>Business profile:</strong> your business name, logo, address, phone number, website, tax and company registration
              numbers, the bank or payment details you choose to display on your documents, and your default settings.
            </li>
            <li>
              <strong>Subscription and billing information:</strong> your plan, billing period, billing address and transaction history.
              Card details are collected and processed by our payment provider. We do not store full card numbers.
            </li>
            <li>
              <strong>Communications:</strong> the messages you send to our team by email, chat or video call, and any feedback you give
              us.
            </li>
            <li>
              <strong>Newsletter:</strong> your email address and your subscription preferences.
            </li>
          </ul>
          <h3>Customer Data</h3>
          <p>The information about your clients and contacts described in section 2.</p>
          <h3>Requests to Birdy</h3>
          <p>The instructions you give Birdy, our smart assistant, and the drafts that Birdy prepares in response.</p>
          <h3>Information collected automatically</h3>
          <ul>
            <li>
              <strong>Device and log data:</strong> IP address, browser type and version, operating system, pages viewed, referring pages,
              and the dates and times of access.
            </li>
            <li>
              <strong>Usage data:</strong> how you use features of the Services, so that we can keep them reliable and improve them.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> as described in section 12.
            </li>
          </ul>
          <h3>Information from third parties</h3>
          <p>
            When you connect Stripe to accept online payments, we receive payment information from Stripe, such as the status, amount and
            date of a payment, so that your invoices can be marked as paid.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How we use personal data and our legal bases",
      body: (
        <>
          <p>We use personal data only for the following purposes, each based on a legal basis under the GDPR:</p>
          <ul>
            <li>
              <strong>To create and manage your account and provide the Services</strong>, including sending your documents and the
              payment reminders and notifications you have turned on. <em>Legal basis: performance of our contract with you (Article
              6(1)(b) GDPR).</em>
            </li>
            <li>
              <strong>To process your subscription and payments</strong> and to issue invoices for our own fees.{" "}
              <em>Legal bases: performance of a contract, and compliance with our legal obligations, including tax and accounting rules
              (Article 6(1)(c)).</em>
            </li>
            <li>
              <strong>To provide support</strong>, including migration help on paid plans. <em>Legal basis: performance of a contract.</em>
            </li>
            <li>
              <strong>To keep the Services secure</strong>, prevent fraud and abuse, and enforce our Terms.{" "}
              <em>Legal basis: our legitimate interests in protecting our users and our business (Article 6(1)(f)).</em>
            </li>
            <li>
              <strong>To understand how the Services are used and improve them</strong>, using aggregated or pseudonymised data wherever
              possible. <em>Legal basis: our legitimate interest in developing a better product.</em>
            </li>
            <li>
              <strong>To send service announcements</strong>, such as security notices or changes to our terms.{" "}
              <em>Legal bases: performance of a contract and compliance with legal obligations.</em>
            </li>
            <li>
              <strong>To send our newsletter and product news.</strong>{" "}
              <em>
                Legal basis: your consent (Article 6(1)(a)), or, for existing customers and where the law allows it, our legitimate
                interest in telling you about similar services.
              </em>{" "}
              You can unsubscribe at any time.
            </li>
            <li>
              <strong>To comply with the law</strong>, respond to lawful requests from public authorities, and establish, exercise or defend
              legal claims. <em>Legal bases: compliance with legal obligations and our legitimate interests.</em>
            </li>
          </ul>
          <p>
            Where we rely on legitimate interests, we have balanced those interests against your rights and freedoms. You can object to this
            processing as described in section 11.
          </p>
        </>
      ),
    },
    {
      id: "birdy",
      title: "Birdy, our smart assistant",
      body: (
        <>
          <p>
            Birdy prepares and edits documents from your instructions, using the clients, items, prices and tax settings saved in your
            account. To do this, the content of your request and the relevant data in your account are processed by Birdy and by the
            service providers that power its language processing, acting on our behalf.
          </p>
          <ul>
            <li>Birdy acts only on your requests and only within your own account.</li>
            <li>Nothing that Birdy prepares is sent to anyone until you have reviewed and approved it.</li>
            <li>
              Birdy does not make decisions about you that produce legal effects or similarly significant effects within the meaning of
              Article 22 GDPR.
            </li>
            <li>
              We require these providers to process data only to provide their service to us, to keep it confidential and secure, and not to
              use your requests or Customer Data to train their own general-purpose models.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "payments",
      title: "Online payments",
      body: (
        <p>
          When you connect a Stripe account to accept card payments from your clients, those payments are processed by Stripe, Inc. and its
          affiliates (“<strong>Stripe</strong>”) under Stripe’s own terms and{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            privacy policy
          </a>
          . Card details entered by your clients are collected directly by Stripe and are never stored on our servers.
        </p>
      ),
    },
    {
      id: "sharing",
      title: "How we share personal data",
      body: (
        <>
          <p>We do not sell personal data, and we do not share it for targeted advertising. We share it only as follows:</p>
          <ul>
            <li>
              <strong>Service providers</strong> that host our infrastructure, deliver emails, process payments, provide customer support
              tools, measure usage and power Birdy. They act on our instructions under written contracts that include data protection
              obligations.
            </li>
            <li>
              <strong>The people you send documents to.</strong> When you send an invoice, estimate, proposal or contract, or share a link,
              the recipient sees the content you chose to send, together with your business details.
            </li>
            <li>
              <strong>Professional advisers</strong>, such as lawyers, accountants and auditors, who are bound by duties of confidentiality.
            </li>
            <li>
              <strong>Public authorities</strong>, where required by law, a court order or a valid legal request, or where necessary to
              protect the rights, property or safety of InvoiceBirds, our users or others.
            </li>
            <li>
              <strong>A successor business</strong>, in connection with a merger, acquisition, financing or sale of all or part of our
              business, provided that your personal data remains protected as described in this policy. We will notify you before your data
              becomes subject to a different privacy policy.
            </li>
          </ul>
          <p>We may also share aggregated or anonymised information that does not identify you.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "International transfers",
      body: (
        <p>
          Some of our service providers are located outside the European Economic Area (EEA) and the United Kingdom. When we transfer
          personal data to a country that is not recognised as providing an adequate level of protection, we rely on appropriate safeguards,
          such as the Standard Contractual Clauses adopted by the European Commission and the UK International Data Transfer Addendum,
          together with supplementary measures where needed. You can ask us for a copy of these safeguards at {email}.
        </p>
      ),
    },
    {
      id: "retention",
      title: "How long we keep personal data",
      body: (
        <>
          <p>We keep personal data only for as long as necessary for the purposes described in this policy:</p>
          <ul>
            <li>
              <strong>Account data and Customer Data</strong> are kept while your account is active. When you delete your account, we delete
              or anonymise them within 30 days. Copies held in encrypted backups are overwritten within a further 90 days.
            </li>
            <li>
              <strong>Billing records</strong> for our own fees are kept for the period required by applicable tax and accounting laws, which
              can be up to 10 years.
            </li>
            <li>
              <strong>Support communications</strong> are kept for up to 3 years after your last contact with us.
            </li>
            <li>
              <strong>Newsletter data</strong> is kept until you unsubscribe. We then keep only your email address on a suppression list, so
              that we do not contact you again.
            </li>
            <li>
              <strong>Log data</strong> is kept for up to 12 months, unless we need it for longer to investigate a security incident.
            </li>
          </ul>
          <p>
            You are responsible for keeping your own invoices and business records for as long as the law requires. Please download any
            documents you need before you delete your account.
          </p>
        </>
      ),
    },
    {
      id: "security",
      title: "Security",
      body: (
        <>
          <p>
            We use technical and organisational measures designed to protect personal data against accidental or unlawful destruction, loss,
            alteration, unauthorised disclosure and unauthorised access. These include:
          </p>
          <ul>
            <li>encryption of data in transit using TLS with 256-bit encryption;</li>
            <li>access to production systems restricted to authorised personnel who need it, and logged;</li>
            <li>optional two-factor authentication for your account; and</li>
            <li>share links that give access only to the document you chose to share.</li>
          </ul>
          <p>
            No system is completely secure. If a personal data breach is likely to result in a risk to your rights and freedoms, we will
            notify the competent supervisory authority and, where required, you, without undue delay.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: (
        <>
          <p>Subject to the conditions set by applicable law, you have the right to:</p>
          <ul>
            <li>access your personal data and receive a copy of it;</li>
            <li>have inaccurate or incomplete data corrected;</li>
            <li>have your data erased;</li>
            <li>restrict the processing of your data;</li>
            <li>receive your data in a structured, commonly used and machine-readable format, and have it transmitted to another controller;</li>
            <li>object at any time to processing based on our legitimate interests, and to direct marketing;</li>
            <li>withdraw your consent at any time, without affecting the lawfulness of processing carried out before; and</li>
            <li>where French law applies, give instructions about what happens to your personal data after your death.</li>
          </ul>
          <p>
            You can update most of your information in Settings, and delete your account in Settings, under Profile. To exercise any other
            right, write to us at {email}. We will reply within one month. For complex or numerous requests, this period may be extended by
            two further months, in which case we will let you know. We may ask you to confirm your identity before we act on a request.
          </p>
          <p>
            You also have the right to lodge a complaint with a supervisory authority, in particular in the country where you live or work,
            such as the Commission Nationale de l’Informatique et des Libertés (CNIL) in France or the Information Commissioner’s Office
            (ICO) in the United Kingdom. We would, however, appreciate the chance to address your concerns first.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and similar technologies",
      body: (
        <>
          <p>
            We use cookies and similar technologies that are strictly necessary to run the Services, for example to keep you signed in, to
            protect forms against abuse and to remember your language choice. These do not require your consent.
          </p>
          <p>
            We use analytics or other non-essential cookies only with your consent where the law requires it, and you can withdraw that
            consent at any time. You can also block or delete cookies in your browser settings. If you block strictly necessary cookies,
            parts of the Services may not work.
          </p>
        </>
      ),
    },
    {
      id: "emails",
      title: "Emails we send",
      body: (
        <p>
          We send service emails that are part of the Services, such as account, security and billing messages. You can choose which
          notifications you receive in Settings. We send our newsletter and marketing emails only as described in section 4, and every one
          of them includes a link to unsubscribe.
        </p>
      ),
    },
    {
      id: "children",
      title: "Children",
      body: (
        <p>
          The Services are intended for professionals and businesses and are not directed at children. We do not knowingly collect personal
          data from anyone under 16. If you believe that a child has provided us with personal data, please contact us and we will delete
          it.
        </p>
      ),
    },
    {
      id: "third-party",
      title: "Third-party websites and services",
      body: (
        <p>
          The Services may link to, or integrate with, websites and services run by third parties, such as Stripe. Their handling of your
          data is governed by their own privacy policies, and we encourage you to read them.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: (
        <p>
          We may update this policy from time to time. The date at the top shows when it was last changed. If we make a material change, we
          will tell you by email or in the app, where reasonably possible at least 30 days before the change takes effect.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      body: <p>For any question about this policy or your personal data, write to us at {email}.</p>,
    },
  ],
};
