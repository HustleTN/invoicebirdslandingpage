import Link from "next/link";

import { siteConfig } from "@/config/site";

import type { LegalDocument } from "./legal-page";

const email = <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>;

export const termsEn: LegalDocument = {
  title: "Terms of Service",
  lead: "The agreement between you and InvoiceBirds for using our website, our app and our services.",
  updated: "6 November 2026",
  summary: [
    "The Free plan is free. Paid plans renew automatically until you cancel, and you can cancel at any time.",
    "You own your content and your client data. We use it only to provide InvoiceBirds to you.",
    "Birdy prepares drafts, and nothing is sent without your approval. Always review documents before you send them.",
    "You remain responsible for your invoices, taxes and legal obligations. InvoiceBirds does not give tax or legal advice.",
    "Online card payments are processed by Stripe under your own agreement with Stripe.",
  ],
  intro: (
    <p>
      Please read these Terms carefully. They set out your rights and obligations when you use InvoiceBirds, including important limits on
      our liability in section 17. If you are a consumer, section 19 explains the rights that you keep in all cases.
    </p>
  ),
  sections: [
    {
      id: "agreement",
      title: "Agreement to these Terms",
      body: (
        <>
          <p>
            These Terms of Service (the “<strong>Terms</strong>”) form a legally binding agreement between you and InvoiceBirds (“
            <strong>InvoiceBirds</strong>”, “<strong>we</strong>”, “<strong>us</strong>” or “<strong>our</strong>”) governing your access
            to and use of invoicebirds.com, the InvoiceBirds web application and all related services, features and content (the “
            <strong>Services</strong>”).
          </p>
          <p>
            By creating an account, accepting these Terms or using the Services, you agree to these Terms and acknowledge our{" "}
            <Link href="/privacy">Privacy Policy</Link>. If you use the Services on behalf of a company or other organisation, you confirm that you
            are authorised to accept these Terms on its behalf, and “you” then refers to that organisation. If you do not agree to these
            Terms, you must not use the Services.
          </p>
        </>
      ),
    },
    {
      id: "eligibility",
      title: "Eligibility",
      body: (
        <p>
          You must be at least 18 years old and have the legal capacity to enter into a binding contract. The Services are designed for
          freelancers, professionals and businesses to manage their commercial activity.
        </p>
      ),
    },
    {
      id: "account",
      title: "Your account",
      body: (
        <ul>
          <li>You must provide accurate and complete information when you register, and keep it up to date.</li>
          <li>
            You are responsible for keeping your login details confidential and for all activity that takes place under your account. We
            strongly recommend that you turn on two-factor authentication.
          </li>
          <li>Each login is personal to one individual and must not be shared.</li>
          <li>You must tell us without delay at {email} if you suspect any unauthorised use of your account.</li>
        </ul>
      ),
    },
    {
      id: "plans",
      title: "Plans, fees and billing",
      body: (
        <>
          <h3>4.1 Free plan</h3>
          <p>
            The Free plan is provided free of charge, with the features and limits shown on our pricing page at the time you use it. We may
            change those features and limits from time to time.
          </p>
          <h3>4.2 Paid subscriptions</h3>
          <p>
            The Professional and Growth plans are subscriptions billed in advance, monthly or yearly, at the price shown when you subscribe.
            Prices exclude applicable taxes, such as VAT, which are added where required.
          </p>
          <h3>4.3 Automatic renewal</h3>
          <p>
            Paid subscriptions renew automatically at the end of each billing period for a period of the same length, unless you cancel before
            the renewal date. You authorise us and our payment provider to charge your payment method for each renewal.
          </p>
          <h3>4.4 Changing or cancelling your plan</h3>
          <p>
            You can upgrade, downgrade, switch between monthly and yearly billing, or cancel at any time in Settings, under Billing &amp;
            Plans. Upgrades take effect immediately, and any price difference may be prorated as shown at checkout. Downgrades and
            cancellations take effect at the end of the current billing period, and you keep access to your paid features until then.
          </p>
          <h3>4.5 Refunds</h3>
          <p>
            Except where required by law, including under section 19, or where these Terms expressly provide otherwise, fees already paid are
            non-refundable, including for partially used billing periods.
          </p>
          <h3>4.6 Birdy requests</h3>
          <p>
            Paid plans include a monthly allowance of Birdy requests, as shown on our pricing page. Unused requests do not carry over to the
            following month.
          </p>
          <h3>4.7 Price changes</h3>
          <p>
            We may change our prices. We will notify you at least 30 days in advance, and the new price will apply from your next renewal. If
            you do not agree to the new price, you may cancel before it takes effect.
          </p>
          <h3>4.8 Failed payments</h3>
          <p>
            If a payment fails, we may retry the charge. If the amount remains unpaid after we have notified you, we may suspend your paid
            features or move your account to the Free plan until payment is made.
          </p>
        </>
      ),
    },
    {
      id: "birdy",
      title: "Birdy, our smart assistant",
      body: (
        <p>
          Birdy prepares and updates drafts based on your instructions and the data in your account. Birdy’s suggestions may sometimes be
          incomplete or inaccurate. You must review every draft before you approve, send or rely on it, and you are responsible for the
          documents you issue. Nothing that Birdy prepares is sent without your approval. Your requests to Birdy must comply with section 10.
        </p>
      ),
    },
    {
      id: "your-documents",
      title: "Your documents and compliance",
      body: (
        <>
          <p>InvoiceBirds is a software tool. We do not provide legal, tax, accounting or financial advice. You alone are responsible for:</p>
          <ul>
            <li>
              the accuracy and completeness of the documents you create and send, including amounts, tax rates, tax identification numbers
              and any mandatory information;
            </li>
            <li>
              identifying and meeting your invoicing, tax, e-invoicing, record-keeping and consumer protection obligations in every country
              where you do business; and
            </li>
            <li>keeping copies of your documents for as long as the law requires.</li>
          </ul>
          <p>
            Templates, default texts and sample clauses, including proposal and contract examples, are provided for convenience only and
            should be reviewed by a qualified professional before you rely on them. E-invoice exports follow the published specifications of
            the formats we support, but you remain responsible for confirming that a format is accepted by your recipient and meets the rules
            that apply to you.
          </p>
        </>
      ),
    },
    {
      id: "payments",
      title: "Online payments",
      body: (
        <p>
          Online card payments are provided by Stripe. To accept them, you must create or connect a Stripe account and accept Stripe’s
          terms, including the Stripe Connected Account Agreement. InvoiceBirds is not a bank or payment institution and is not a party to
          the payment transactions between you and your clients. Stripe’s fees, payout schedules, holds, refunds and disputes are governed by
          your agreement with Stripe. We are not responsible for Stripe’s services, or for any failure or delay in payments processed by
          Stripe.
        </p>
      ),
    },
    {
      id: "signatures",
      title: "Proposals, contracts and electronic signatures",
      body: (
        <p>
          The Services allow your clients to accept proposals and sign contracts electronically. Whether an electronic signature is valid
          and enforceable for a particular agreement depends on the applicable law and on the agreement itself, and is your responsibility.
          InvoiceBirds is not a party, agent or trust service provider in relation to any agreement between you and your clients.
        </p>
      ),
    },
    {
      id: "your-content",
      title: "Your content",
      body: (
        <>
          <p>
            You keep all rights in the content and Customer Data that you upload to or create with the Services (“<strong>Your Content</strong>
            ”). You grant InvoiceBirds a worldwide, non-exclusive, royalty-free licence to host, store, copy, process, transmit and display
            Your Content solely to provide, secure and support the Services for you, and as you otherwise instruct. This licence ends when
            Your Content is deleted from the Services, subject to the backup periods described in our Privacy Policy.
          </p>
          <p>
            You confirm that you have all the rights, permissions and legal bases needed to upload Your Content and to allow us to process it
            under these Terms, including for the personal data of your clients and contacts.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: (
        <>
          <p>You agree not to, and not to allow anyone else to:</p>
          <ul>
            <li>use the Services for any unlawful, fraudulent or deceptive purpose, including issuing false or misleading documents;</li>
            <li>send spam or unsolicited messages through the Services;</li>
            <li>upload content that infringes the rights of others, or that is unlawful, harmful or defamatory, or contains malicious code;</li>
            <li>
              attempt to gain unauthorised access to the Services, to other accounts or to our systems, or probe, scan or test their
              vulnerability without our written permission;
            </li>
            <li>interfere with or disrupt the integrity or performance of the Services, including through excessive automated requests;</li>
            <li>
              copy, modify, reverse engineer, decompile or create derivative works of the Services, except to the extent expressly permitted
              by law;
            </li>
            <li>resell, sublicense or provide the Services to third parties, except as expressly permitted by us in writing; or</li>
            <li>use the Services or Birdy to build a competing product, or extract data from the Services by automated means.</li>
          </ul>
        </>
      ),
    },
    {
      id: "our-ip",
      title: "Our intellectual property",
      body: (
        <p>
          The Services, including the software, design, text, graphics, the Birdy character, logos and trademarks, are owned by InvoiceBirds
          or its licensors and are protected by intellectual property laws. Subject to these Terms, we grant you a limited, non-exclusive,
          non-transferable and revocable right to use the Services for your own business purposes. All rights not expressly granted are
          reserved. If you send us feedback or suggestions, we may use them freely and without any obligation to you.
        </p>
      ),
    },
    {
      id: "third-party",
      title: "Third-party services",
      body: (
        <p>
          The Services may integrate with, or link to, services provided by third parties, such as Stripe. Your use of those services is
          governed by their own terms, and we are not responsible for them. We may stop supporting an integration if its provider changes or
          ends it.
        </p>
      ),
    },
    {
      id: "data-protection",
      title: "Data protection",
      body: (
        <>
          <p>
            Our <Link href="/privacy">Privacy Policy</Link> explains how we process personal data as a controller. For Customer Data, you are the
            controller and InvoiceBirds is your processor. In that capacity, and in accordance with Article 28 of the GDPR, we will:
          </p>
          <ol>
            <li>process Customer Data only on your documented instructions, which are these Terms and your use of the Services, unless the law requires otherwise;</li>
            <li>ensure that the people authorised to process Customer Data are bound by confidentiality;</li>
            <li>implement appropriate technical and organisational security measures;</li>
            <li>
              engage sub-processors only under written contracts that impose equivalent data protection obligations, and inform you of any
              intended change to our sub-processors, giving you the opportunity to object. You give us a general authorisation to engage
              sub-processors on these terms;
            </li>
            <li>
              taking into account the nature of the processing, assist you in responding to requests from data subjects and in meeting your
              obligations regarding security, breach notification, data protection impact assessments and prior consultation;
            </li>
            <li>notify you without undue delay after becoming aware of a personal data breach affecting Customer Data;</li>
            <li>
              at the end of the Services, delete Customer Data after giving you the opportunity to download it, unless the law requires us to
              keep it; and
            </li>
            <li>
              make available to you the information necessary to demonstrate compliance with these obligations, and allow for and contribute
              to audits conducted with reasonable notice and subject to confidentiality.
            </li>
          </ol>
          <p>
            Where Customer Data is transferred outside the European Economic Area or the United Kingdom, we rely on the safeguards described
            in our Privacy Policy. The list of our current sub-processors is available on request at {email}.
          </p>
        </>
      ),
    },
    {
      id: "availability",
      title: "Availability and changes to the Services",
      body: (
        <p>
          We work to keep the Services available and reliable, but we do not guarantee that they will be uninterrupted or error-free. We may
          carry out maintenance, which we try to schedule so as to limit disruption. We continuously improve the Services and may add, change
          or remove features. If a change materially reduces the core functionality of your paid plan during your current billing period, we
          will tell you in advance, and you may cancel and receive a prorated refund of the fees paid for the remainder of that period.
        </p>
      ),
    },
    {
      id: "termination",
      title: "Suspension and termination",
      body: (
        <>
          <p>
            You may stop using the Services at any time and delete your account in Settings, under Profile. Deleting your account
            permanently deletes Your Content, subject to the backup periods described in our Privacy Policy, so please download anything you
            need first.
          </p>
          <p>
            We may suspend or terminate your access to the Services if you materially breach these Terms, including by failing to pay, if
            your use creates a security or legal risk for us, our users or third parties, or if we are required to do so by law. Where
            reasonable, we will give you notice and an opportunity to remedy the issue first. Unless the termination results from unlawful use
            of the Services, you will have 30 days to download Your Content.
          </p>
          <p>
            We may also discontinue the Services entirely by giving you at least 60 days’ notice, in which case we will refund any fees you
            have prepaid for the period after termination.
          </p>
          <p>
            On termination, your right to use the Services ends. Provisions which by their nature should survive termination, including
            sections 4 (for amounts due), 6, 11 and 16 to 22, will remain in effect.
          </p>
        </>
      ),
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      body: (
        <p>
          To the fullest extent permitted by law, the Services are provided “as is” and “as available”, and we disclaim all warranties,
          whether express or implied, including any implied warranties of merchantability, fitness for a particular purpose and
          non-infringement. Nothing in this section affects any statutory rights that cannot be excluded or limited by contract.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: (
        <>
          <p>
            <strong>17.1</strong> Nothing in these Terms limits or excludes liability for death or personal injury caused by negligence, for
            fraud or fraudulent misrepresentation, for gross negligence or wilful misconduct, or for any other liability that cannot be limited
            or excluded by law.
          </p>
          <p>
            <strong>17.2</strong> Subject to section 17.1, InvoiceBirds will not be liable, whether in contract, tort (including negligence)
            or otherwise, for any indirect or consequential loss, for any loss of profits, revenue, business, goodwill or anticipated savings,
            or for any loss or corruption of data that you could have avoided by keeping your own copies.
          </p>
          <p>
            <strong>17.3</strong> Subject to section 17.1, our total liability arising out of or in connection with these Terms in any period
            of 12 months is limited to the greater of (a) the fees you paid us for the Services in the 12 months before the event giving rise
            to the claim and (b) 100 US dollars.
          </p>
        </>
      ),
    },
    {
      id: "indemnity",
      title: "Indemnity",
      body: (
        <p>
          If you use the Services for business purposes, you agree to indemnify InvoiceBirds against any third-party claims, and the
          resulting damages, losses and reasonable costs, including legal fees, arising from Your Content, your breach of these Terms or your
          violation of the law or of the rights of a third party. We will notify you promptly of any such claim and let you take control of
          its defence.
        </p>
      ),
    },
    {
      id: "consumers",
      title: "If you are a consumer",
      body: (
        <>
          <p>
            The Services are intended for professional use. If you nevertheless use them as a consumer, you benefit from the mandatory
            protections of the law of your country of residence, and nothing in these Terms limits those rights.
          </p>
          <p>
            If you are a consumer in the European Union or the United Kingdom, you may withdraw from a paid subscription within 14 days of
            subscribing, without giving any reason. If you asked us to start providing the Services during that period, we may keep an amount
            proportionate to the Services provided before you withdrew. To withdraw, write to us at {email}.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to these Terms",
      body: (
        <p>
          We may update these Terms from time to time. If we make a material change, we will notify you by email or in the app at least 30
          days before it takes effect. If you do not agree to the updated Terms, you may cancel your subscription and close your account
          before they take effect. If you continue to use the Services after that date, you accept the updated Terms.
        </p>
      ),
    },
    {
      id: "governing-law",
      title: "Governing law and disputes",
      body: (
        <>
          <p>
            These Terms, and any dispute or claim arising out of or in connection with them, are governed by the laws of the country in which
            InvoiceBirds has its registered office, without regard to its conflict of laws rules.
          </p>
          <p>
            Before starting any proceedings, you and we agree to try to resolve the dispute amicably by writing to the other party. You can
            reach us at {email}. If the dispute is not resolved within 30 days, it will be submitted to the competent courts of the place of
            InvoiceBirds’ registered office, unless mandatory law gives you the right to bring proceedings elsewhere, in particular as a
            consumer.
          </p>
        </>
      ),
    },
    {
      id: "general",
      title: "General",
      body: (
        <ul>
          <li>
            <strong>Entire agreement.</strong> These Terms, together with our Privacy Policy and the details of your plan, form the entire
            agreement between you and InvoiceBirds regarding the Services.
          </li>
          <li>
            <strong>Assignment.</strong> You may not transfer your rights or obligations under these Terms without our prior written consent.
            We may transfer them in connection with a merger, acquisition or sale of assets, and we will notify you if we do.
          </li>
          <li>
            <strong>Severability.</strong> If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions
            will remain in full force and effect.
          </li>
          <li>
            <strong>No waiver.</strong> A failure or delay in exercising a right does not amount to a waiver of that right.
          </li>
          <li>
            <strong>Force majeure.</strong> Neither party is liable for a failure or delay caused by events beyond its reasonable control.
          </li>
          <li>
            <strong>Notices.</strong> We may send you notices by email to the address on your account or in the app. You can send notices to
            us at {email}.
          </li>
          <li>
            <strong>Language.</strong> These Terms are available in English and in French. In the event of any inconsistency, the English
            version prevails, except where the law requires otherwise.
          </li>
        </ul>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      body: <p>For any question about these Terms, write to us at {email}.</p>,
    },
  ],
};
