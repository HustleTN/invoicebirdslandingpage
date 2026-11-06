# InvoiceBirds — Homepage Implementation Brief

**Version:** 2026-10-31  
**Scope:** Redesign and complete the existing homepage. Preserve the existing hero product showcase. Documentation pages are out of scope.  
**Suggested repository path:** `docs/invoicebirds-homepage-brief.md`

This brief contains the agreed page direction, copy, visual treatments and acceptance criteria. It is an implementation specification, not evidence that every product claim has been verified. Use the copy and offer below, but resolve factual conflicts against the actual product configuration before public launch. Do not silently invent missing policies.

## 1. Objective and implementation approach

Make InvoiceBirds immediately understandable: unlimited invoicing, a connected proposal-to-payment workflow, online payments and Birdy to reduce repetitive administration. Birdy is prominent, not present in every section.

Inspect the existing homepage, components, styles, assets, routes and package scripts before editing. Reuse the existing Next.js, TypeScript and Tailwind setup. Do not restart the project, replace the framework, upgrade dependencies unnecessarily or introduce a new billing integration.

Work in three passes:
1. Structure and copy: assemble the complete static page and preserve the hero showcase.
2. Visual refinement: typography, palette, spacing, illustrations, photography and responsive layouts.
3. Behavior and verification: interactions, restrained motion, accessibility, responsive inspection and project checks.

Keep the page understandable with motion disabled. Preserve unrelated work and existing working routes. Check the working tree before editing; do not reset or discard existing changes. Do not deploy or trigger real invoices, emails or payments. Marketing demonstrations remain frontend-only.

## 2. Non-negotiable visual direction

### Palette and typography

- Deep navy: `#0A2540`.
- Supporting blue: `#114077`.
- Primary green: `#06B047`.
- White: `#FFFFFF`.
- Restrained shades and tints derived from these colors.
- Solid `#0A2540` hero background. No decorative gradient.
- Use the existing Satoshi font setup and readable body weights.
- Use the new green for homepage accents rather than previous green values. Do not unnecessarily recolor the preserved product UI.
- Check contrast rather than assuming brand colors work in every text/background combination. Navy text on green is the preferred primary-button treatment, subject to contrast verification.

### Layout

Use a main content width around 1280px, consistent responsive gutters and generous but purposeful spacing. Most sections are white or very lightly tinted; reserve large navy areas for the hero and closing CTA.

Use typography, alignment, whitespace and fine borders for hierarchy. Headings should feel confident, not oversized. Not every section needs an eyebrow, a boxed surface or a button.

### Avoid

- Shadows, including hover shadows; glow; glassmorphism; decorative gradients.
- Unnecessary nested marketing containers: no large rounded box around a grid of smaller rounded boxes.
- Generic AI-style bento grids, meaningless floating objects and excessive decorative pills or icons.
- Repeated large dashboard screenshots, chat windows in every section or oversized mascot illustrations throughout.
- Repeating the same three-card layout under each heading.
- Unnecessary all-caps labels, exaggerated rounding and decorative clutter.

Actual product UI may retain its necessary internal structure. The preservation rule takes precedence over redesigning the hero internals: do not change the approved product visual merely to flatten it. Apply the no-shadow rule to new marketing UI and any editable outer presentation; report a conflict inside the preserved hero rather than rebuilding it.

## 3. Asset and preservation rules

**Keep the already-generated hero product showcase.** Preserve its invoice builder, left navigation, Birdy chat popup, send-email popup, sample data and working animation choreography. Reuse the actual component; do not replace it with a new mockup, screenshot or illustration.

Allowed hero changes: surrounding layout, outer positioning, size and responsive presentation. Keep the light product surfaces readable against the navy background; do not turn the entire product UI dark.

Inspect these directories and use the actual filenames:
- Logo SVG: `public/images/svgs/`.
- Birdy: `public/images/birdy-wave` with the existing extension.
- People photography: `public/images/`.

Use a suitable existing logo variant on navy. Do not recreate the logo as text, draw a substitute mascot or fetch random stock photography. Flag missing assets instead of presenting placeholders as finished work.

## 4. Page order and visual rhythm

| Order | Section | Visual treatment |
| --- | --- | --- |
| 1 | Header and hero | Preserved large product showcase with Birdy and email popups |
| 2 | Connected document workflow | Minimal interactive isometric illustration |
| 3 | Birdy and saved business information | Compact saved-data and chat demonstration |
| 4 | Online payments and follow-ups | Focused client-facing invoice/payment close-up |
| 5 | EU e-invoicing | Compact feature band with a small illustration |
| 6 | Made for the way you work | Four photographs with short captions |
| 7 | Software comparison | Short, factual, switchable comparison |
| 8 | Pricing | Three clear plan columns |
| 9 | FAQ | Six concise, accessible accordions |
| 10 | Final CTA and footer | Typography, one primary action and real links |

The hero is the largest visual moment. The e-invoicing band, audience block, comparison and FAQ are compact, not full-screen presentations. Do not add a separate setup section, full reports dashboard or generic feature inventory.

## 5. Header and hero

### Header

Integrate the header into the navy hero. Use the existing logo. Suggested navigation: Product, Birdy, Pricing, FAQ. Right-side actions: Log in and Start for free.

Use real authentication destinations and meaningful homepage anchors. Do not invent routes, dead documentation links or empty modal actions.

### Exact copy

**Eyebrow:** AI invoicing software for freelancers and small businesses

**H1:** Smarter invoicing. From proposal to paid.

A deliberate line break after “invoicing.” is appropriate on larger screens, but keep one semantic H1.

**Subheader:** Create unlimited invoices, manage proposals and contracts, and accept online payments. Ask Birdy to prepare the details, or use the builder for full control.

**Primary CTA:** Start for free

**Secondary CTA:** See Birdy in action

**Reassurance:** No credit card required · Unlimited invoices on every plan

### Presentation and behavior

Solid `#0A2540` background, white headline, quieter light subheader and green primary action. Center the copy above the existing product showcase. Use restrained color emphasis rather than several differently colored headline words.

Preserve the current demo. Do not substitute a new invoice example or rebuild its animation. “See Birdy in action” should scroll to the Birdy section or activate an existing functioning demo.

Do not imply that Birdy is available on Free unless confirmed. Where the current policy supports it, add a discreet “Birdy included in paid plans” clarification. No invented free AI trial or request allowance.

## 6. Connected document workflow

**Eyebrow:** ONE CONNECTED CLIENT WORKFLOW

**Heading:** Proposals, contracts and invoices. Connected.

**Description:** Agree on the work, confirm the details and create your invoice without entering the same client information again.

**Supporting line:** Start with the document you need. Keep the next step connected.

### Visual

Use the installed `/hairline-create` skill, or reuse the existing Hairline illustration work. If unavailable, report that limitation rather than claiming to have used it.

Four primary objects: Proposal, Contract, Invoice, Payment. Include a smaller optional Estimate → Invoice branch. These are connected capabilities, not four compulsory steps.

Use white surfaces, thin navy strokes, restrained blue/green accents, recognizable document details and subtle connectors. No shadows, gradients, glow or heavy glossy 3D rendering.

Animate useful information carrying forward rather than constant object movement. An approved estimate converting into an invoice is the clearest example. Only demonstrate supported transformations; do not imply unsupported automatic conversions.

Keep the example business-neutral. Do not reuse the towing/recovery example from earlier work. No chat or large dashboard here.

**Availability note:** Proposals and contracts are included with Growth.

**Optional text link:** Explore the document workflow — include only with a real destination.

## 7. Birdy and saved business information

**Eyebrow:** MEET BIRDY

**Heading:** Create invoices with AI. Keep full control.

**Description:** Birdy uses your saved clients, services, prices and VAT settings to prepare invoices you can review and edit. No retyping the same details.

**Supporting line:** Use the builder whenever you prefer. Birdy is an assistant, not a requirement.

### Visual

A compact left/right layout, noticeably smaller and quieter than the hero. Reuse the actual Birdy chat UI and existing mascot asset.

**Left: saved workspace information**, divided with whitespace or hairlines, not a grid of nested cards:
- Client: Lumen Labs — billing details saved.
- Services: Design retainer — €1,200; Website support — €300.
- Settings: VAT — 20%; Payment terms — 14 days.

**Right: conversation**

> User: Prepare an invoice for Lumen Labs using the design retainer and website support.
>
> Birdy: Draft ready. I used your saved client details, prices, VAT and payment terms.

Compact result:
- Subtotal: €1,500.
- VAT 20%: €300.
- Total: €1,800.
- Status: Draft — not sent.

> User: Make it due in 30 days.
>
> Birdy: Updated to 30-day payment terms. Ready for your review.

**Demo action:** Review invoice.

Briefly highlight the source information when used. Play once on entry, hold the completed result and optionally offer replay. No scenario tabs, repeated application navigation or giant chat window. All data is illustrative; the demo must not perform real account actions.

**Capability line:** Prepare invoices · Update details · Find overdue balances

**Optional text link:** Explore Birdy — only with a real destination.

Do not put more Birdy chat windows in later sections.

## 8. Online payments and follow-ups

**Eyebrow:** ONLINE PAYMENTS & FOLLOW-UPS

**Heading:** Make it easy for clients to pay.

**Description:** Add a payment link to your invoice, see what has been paid and follow up on what is overdue—all in one place.

Supporting points:

**Pay from the invoice**  
Give clients a direct way to pay online.

**Know what needs attention**  
See paid, outstanding and overdue invoices.

**Follow up without starting over**  
Use payment reminders to keep the conversation moving.

### Visual

One client-facing invoice/payment close-up with a prominent Pay invoice action. A small adjacent list can show Sent, Overdue and Paid on separate sample invoices. Do not show a draft immediately becoming paid. Keep the demonstration inert or clearly local; do not initiate a real checkout.

Do not add a full analytics dashboard or chart. A small “Payments via Stripe” label is appropriate; do not imply a Stripe endorsement.

**Supporting line:** Keep expenses, payment history and tax reports organized alongside your invoices.

**CTA:** Start for free

No guaranteed collection, instant settlement or numerical payment-speed claims without evidence. Do not suggest every plan includes automatic reminders if the offer restricts them to paid plans.

## 9. Compact EU e-invoicing band

**Heading:** EU e-invoices. Same simple workflow.

**Description:** Export supported structured e-invoices and read incoming invoice files without leaving InvoiceBirds.

**Format labels, subject to verified support:** ZUGFeRD / Factur-X · XRechnung · UBL

**Text link:** See supported formats — only with a real destination.

Use one small document-to-structured-file illustration. This is a compact band, not another large feature showcase.

No flag grids, regulatory timelines, complicated network diagrams or blanket compliance guarantees. File export is not the same as network delivery; do not claim network sending/receiving without verified integration support. Do not publish an unverified currency count.

## 10. Made for the way you work

**Heading:** Made for the way you work.

**Description:** Simple invoicing for freelancers, agencies, consultants and service businesses.

Use four existing people images from `public/images/`, with consistent crop, aspect ratio and visual treatment.

| Audience | Copy |
| --- | --- |
| Freelancers | Send professional invoices without losing time to admin. |
| Agencies & studios | Keep proposals, contracts and client billing connected. |
| Consultants | Invoice project fees and ongoing work with less repetition. |
| Service businesses | Quote the job, send the invoice and track payment. |

Four columns on desktop, two on tablet and a readable stacked layout on small screens. Headings and short descriptions sit directly beneath photographs. No enclosing card backgrounds, individual buttons, Birdy, product screenshots or continuous animation.

Do not imply stock-photo subjects are customers. Do not fabricate testimonials, customer logos, ratings or adoption numbers.

## 11. Software comparison

**Heading:** Compare invoicing software. Find your fit.

**Description:** Compare plans, limits and workflows—not just the starting price.

Build a compact two-product comparison: InvoiceBirds remains visible while the visitor selects FreshBooks, Bonsai or Zoho Invoice. Maximum six meaningful rows at once. No huge multi-company table.

Suggested plan pairings:
- InvoiceBirds Professional versus FreshBooks Lite.
- InvoiceBirds Growth versus Bonsai Essentials.
- InvoiceBirds Free versus Zoho Invoice.

These are selected workflow comparisons, not claims of identical scope. The InvoiceBirds plan, values and label must change consistently with the selected pairing.

Possible rows: standard subscription price, invoice limit, client limit, AI-assisted creation/editing, proposals/contracts and payment reminders. Use only relevant, verifiable facts.

### Verification requirements

Verify competitor claims using current official pricing and product documentation before publication. Use standard prices, not temporary promotional rates. Include plan name, billing basis, region/currency, source links and the real verification date.

Do not fabricate limitations, claim competitors have no AI without checking or suggest unlimited invoices are exclusive to InvoiceBirds. Give competitors credit for features they provide. Use plain language, not aggressive red-cross marketing.

Keep comparison data separate from rendering code. If a value cannot be verified, omit the unsupported row and record the gap in the handoff. If no reliable comparison can be produced, keep the incomplete component out of the public page and report the blocker rather than publishing placeholders.

**Optional text link:** See the full comparison — include only if a useful destination exists.

## 12. Pricing

**Heading:** Unlimited invoices. Clear pricing.

**Description:** Start free. Upgrade for Birdy, more automation or the complete proposal-to-payment workflow.

Three plans: Free, Professional, Growth. Use the requested prices below; resolve any discrepancy with actual checkout/configuration rather than silently changing the offer or modifying billing.

**Toggle:** Monthly / Yearly — Save 50%. Yearly selected initially. Show the actual annual charge immediately beneath the monthly equivalent. No hidden tooltip billing terms.

### Free

**Description:** For getting started.

**Price:** $0/month

Features:
- Unlimited invoices.
- 3 clients, 3 saved items and 3 estimates.
- Supported e-invoice exports.
- Online payments via Stripe.
- Expense tracking.
- InvoiceBirds branding.

**CTA:** Start for free  
**Note:** No credit card required.

Do not invent a Free-plan Birdy allowance. Validate feature caps against actual configuration before launch.

### Professional

**Description:** For invoicing with less admin.

**Monthly billing:** $16/month  
**Yearly billing:** $8/month — Billed $96 annually

**Prominent allowance:** 250 Birdy requests/month

Features:
- Everything in Free.
- Unlimited clients, estimates and saved items.
- Automatic payment reminders.
- Custom templates and brand colors.
- Tax reports and custom tax labels.
- Remove InvoiceBirds branding.

**CTA:** Choose Professional

### Growth

**Description:** For the full client workflow.

**Monthly billing:** $24/month  
**Yearly billing:** $12/month — Billed $144 annually

**Prominent allowance:** 500 Birdy requests/month

Features:
- Everything in Professional.
- Proposals with online acceptance.
- Contracts with online signatures.
- Connected proposal, contract and invoice workflows.
- Document status tracking.
- Bulk editing and priority support.

**CTA:** Choose Growth

### Presentation and policy

Use three clean columns with fine borders/dividers and no enclosing outer card. Growth can use a restrained navy treatment. No shadows, unnecessary feature mini-cards or unverified “Most popular” badge. “Full client workflow” is a suitable plan label.

Birdy allowances remain immediately visible and monthly even under annual billing. Do not imply an annual allowance is delivered upfront.

**Below-card link:** Compare all plan features — only with a valid destination or genuinely implemented in-page detail.

Connect buttons to the existing signup/upgrade flow. Do not construct a new checkout integration.

Do not publish “No transaction fees,” “No hidden costs” or “No extra charges” until the charging model is verified. Subscription, payment and AI policies must agree with checkout and terms. Do not invent rollover, overage charges, request counting, additional-request purchases or free trials.

## 13. FAQ

**Heading:** Your invoicing questions, answered.

Use short, accessible accordions:

1. **Is InvoiceBirds free, and what are the limits?** Explain unlimited invoice creation separately from client, saved-item and estimate limits.
2. **Do I have to use Birdy?** No. Create and edit documents directly in the builder whenever you prefer. Birdy is there when you want help with repetitive work.
3. **What can Birdy do, and how do requests work?** Describe verified capabilities and 250/500 monthly allowances. Explain approval before sending. Use only confirmed request-metering and limit behavior.
4. **How can my clients pay, and what fees apply?** State confirmed payment methods and the reconciled fee policy. Do not invent the answer.
5. **Can I create proposals and contracts too?** Yes. Growth includes proposals and contracts alongside invoicing, so you can manage the client workflow in one workspace.
6. **Which e-invoice formats are supported?** List verified formats and link to an existing useful coverage page where available.

Keep unresolved policy details in the handoff, not visible TODOs or guessed claims. Omit an unsupported answer until the missing fact is resolved. This is a buying-objection section, not a documentation manual.

## 14. Final CTA and footer

Solid `#0A2540` closing section.

**Heading:** Less admin. More time for your business.

**Description:** Create your next invoice and keep the work that follows in one place.

**CTA:** Start for free

**Reassurance:** No credit card required.

White text, clear green button, accessible contrast and ample whitespace. No additional dashboard, feature grid or large mascot.

Use a compact footer with the existing logo, working product/authentication/legal links and real destinations. Documentation pages are a later task; do not create empty pages now.

## 15. Motion, responsiveness, accessibility and SEO

### Motion and responsive behavior

Only the existing hero has a continuous demonstration loop. Elsewhere use short entry transitions and intentional interactions. Birdy plays once and holds. Comparison and billing tabs change on selection, not an autoplay timer. Avoid parallax and constant floating.

Respect `prefers-reduced-motion`, show a complete static state and provide an accessible pause/replay treatment where necessary for moving content. On mobile adapt the hero presentation without rebuilding it: prioritize a readable invoice and chat rather than a tiny desktop screenshot. Prevent popups covering essential content or causing overflow.

Make navigation, comparison selectors, billing controls and accordions keyboard-accessible with meaningful labels, visible focus, logical reading order and appropriate expanded/selected states. Stack pricing and comparisons sensibly on small screens.

### SEO copy

**Title:** AI Invoicing Software for Small Businesses | InvoiceBirds

**Meta description:** Create unlimited invoices, connect proposals and contracts, and accept online payments. Let Birdy handle the busywork. Start free with InvoiceBirds.

One H1, descriptive H2s, real HTML text and core content available before animations. Avoid keyword stuffing. Use useful image alt text and empty alt for genuinely decorative imagery. Optimize local assets using the project's established conventions.

Prefer server-rendered static marketing content with small client-side interactive components. Reuse existing animation utilities; avoid heavy dependencies for simple effects. Do not make conversion promises or search-ranking guarantees.

## 16. Completion checklist and handoff

Check the applicable items and distinguish performed checks from unavailable ones:

- Existing hero product component and choreography preserved; light product UI remains readable.
- Solid `#0A2540` hero and closing backgrounds.
- Palette uses `#0A2540`, `#114077`, `#06B047`, white and restrained derived tints.
- No new shadows, decorative gradients, glow or unnecessary nested marketing cards.
- Birdy chat appears only in the hero and dedicated Birdy section.
- Page order and supplied headings are implemented without extra large feature sections.
- Existing logo, Birdy and audience photography used correctly.
- Invoice demo arithmetic is correct: €1,500 + €300 VAT = €1,800.
- Prices toggle correctly: $16/$24 monthly or $8/$12 monthly equivalent billed $96/$144 annually.
- Plan comparisons use consistent labels, actual sources and real verification dates.
- All CTA destinations are real; no dead links, fake approvals, live email sends or demo payments.
- Product features, plan caps, fees and AI limits are checked or explicitly recorded as unresolved.
- No invented testimonials, competitor facts, payment-speed claims or compliance promises.
- Desktop/tablet/mobile layouts checked with available tools; no horizontal overflow.
- Keyboard, focus, contrast and reduced-motion behavior checked with available tools.
- Applicable type, lint, test and production-build commands run from the actual package scripts.

Finish with a brief handoff listing changed files/sections, preserved components, checks actually run, any failed or unavailable checks, and unresolved factual/policy blockers. Do not claim visual verification from a build alone. Do not publish or deploy as part of this task.

The final result should be one coherent, restrained product homepage—not a collection of unrelated landing-page templates.
