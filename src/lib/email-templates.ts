/**
 * Carter Digitals (Pty) Ltd — Email & Message Template Engine
 * ============================================================
 * A comprehensive, production-ready template engine for boutique web studio outreach.
 *
 * Company:  Carter Digitals (Pty) Ltd
 * CIPC:     2025/907839/07
 * B-BBEE:   Level 1 (135% Procurement Recognition)
 * Status:   100% Black-Owned · 100% Youth-Owned · CSD Registered · POPIA Compliant
 * Stack:    Next.js (same framework as Vercel, Nike)
 * Location: Pretoria, Gauteng, South Africa
 */

// ────────────────────────────────────────────────────────────────
//  Types
// ────────────────────────────────────────────────────────────────

export interface TemplateResult {
  id: string;
  category: "cold" | "followup" | "whatsapp" | "linkedin" | "phone" | "proposal" | "special";
  channel: "email" | "whatsapp" | "linkedin" | "phone";
  name: string;
  subject?: string;
  body: string;
  context: string;
  wordCount: number;
}

export interface LeadContext {
  name: string;
  sector: string;
  location: string;
  area: string;
  rating: number;
  tier: number;
  services: string;
  recommendedPackage: string;
  estimatedValue: number;
  phone: string;
  onlinePresence: string;
  notes: string;
  subSector: string;
}

export interface TemplateIndexEntry {
  id: string;
  category: TemplateResult["category"];
  channel: TemplateResult["channel"];
  name: string;
  context: string;
}

export interface SequenceStep {
  touch: number;
  day: number;
  channel: TemplateResult["channel"];
  template: string;
  context: string;
  subject?: string;
  body?: string;
}

// ────────────────────────────────────────────────────────────────
//  Sector Lexicon — sector-specific terminology
// ────────────────────────────────────────────────────────────────

export interface SectorLexiconEntry {
  audience: string;
  capacityUnit: string;
  bookingTerm: string;
  trustSignal: string;
  painPoint: string;
  goal: string;
}

export const SECTOR_LEXICON: Record<string, SectorLexiconEntry> = {
  dental: {
    audience: "patients",
    capacityUnit: "chair",
    bookingTerm: "schedule",
    trustSignal: "smile",
    painPoint: "empty appointment slots",
    goal: "new patient bookings",
  },
  legal: {
    audience: "clients",
    capacityUnit: "case",
    bookingTerm: "consultation",
    trustSignal: "reputation",
    painPoint: "missed consultation requests",
    goal: "qualified consultation bookings",
  },
  funeral: {
    audience: "families",
    capacityUnit: "service",
    bookingTerm: "arrangement",
    trustSignal: "compassion",
    painPoint: "families unable to find you online",
    goal: "trust-building enquiries",
  },
  hospitality: {
    audience: "guests",
    capacityUnit: "room",
    bookingTerm: "reservation",
    trustSignal: "experience",
    painPoint: "empty rooms and tables",
    goal: "direct bookings",
  },
  logistics: {
    audience: "clients",
    capacityUnit: "shipment",
    bookingTerm: "quote request",
    trustSignal: "reliability",
    painPoint: "lost quote requests",
    goal: "quote requests and new accounts",
  },
  construction: {
    audience: "developers",
    capacityUnit: "project",
    bookingTerm: "site visit",
    trustSignal: "portfolio",
    painPoint: "invisible to new developers",
    goal: "project enquiries",
  },
  education: {
    audience: "parents and learners",
    capacityUnit: "enrolment",
    bookingTerm: "application",
    trustSignal: "academic record",
    painPoint: "declining enrolment numbers",
    goal: "enrolment enquiries",
  },
  medical: {
    audience: "patients",
    capacityUnit: "appointment",
    bookingTerm: "booking",
    trustSignal: "care quality",
    painPoint: "no-shows and missed appointments",
    goal: "patient bookings",
  },
  general: {
    audience: "customers",
    capacityUnit: "slot",
    bookingTerm: "booking",
    trustSignal: "reviews",
    painPoint: "invisibility online",
    goal: "new customer enquiries",
  },
};

// ────────────────────────────────────────────────────────────────
//  Constants
// ────────────────────────────────────────────────────────────────

const COMPANY = "Carter Digitals (Pty) Ltd";

function signature(senderName = "Kagiso Carter"): string {
  return [
    `Kind regards,`,
    `${senderName}`,
    `${COMPANY}`,
    `100% Black-Owned · 100% Youth-Owned`,
    `B-BBEE Level 1 — 135% Procurement Recognition`,
    `CIPC: 2025/907839/07 · CSD Registered · POPIA Compliant`,
    `https://carterdigitals.co.za`,
  ].join("\n");
}

// ────────────────────────────────────────────────────────────────
//  Internal helpers
// ────────────────────────────────────────────────────────────────

function wc(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function render(text: string, vars: Record<string, string | number>): string {
  let result = text;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
  }
  return result.trim();
}

function getLexicon(lead: LeadContext): SectorLexiconEntry {
  return SECTOR_LEXICON[lead.subSector] ?? SECTOR_LEXICON[lead.sector] ?? SECTOR_LEXICON.general;
}

/** Build a common set of template variables from a LeadContext. */
function leadVars(lead: LeadContext): Record<string, string | number> {
  const lex = getLexicon(lead);
  return {
    lead_name: lead.name,
    sector: lead.sector,
    location: lead.location,
    area: lead.area,
    rating: lead.rating,
    tier: lead.tier,
    services: lead.services,
    package_name: lead.recommendedPackage,
    price: lead.estimatedValue.toLocaleString("en-ZA"),
    roi_percent: Math.round((lead.tier / 10) * 1000),
    phone: lead.phone,
    online_presence: lead.onlinePresence,
    notes: lead.notes,
    sub_sector: lead.subSector,
    company: lead.name.includes(" ") ? lead.name : `${lead.name} ${lead.sector.charAt(0).toUpperCase() + lead.sector.slice(1)}`,
    website: lead.onlinePresence.replace(/^https?:\/\//, ""),
    sender_name: "Kagiso Carter",
    audience: lex.audience,
    capacity_unit: lex.capacityUnit,
    booking_term: lex.bookingTerm,
    trust_signal: lex.trustSignal,
    pain_point: lex.painPoint,
    goal: lex.goal,
    signature: signature(),
    // Sensible defaults for optional placeholders
    demo_link: "https://demo.carterdigitals.co.za",
    slots_available: "3",
    quarter: "1",
    timeline: "4 weeks",
    page_count: "5",
    additional_features: "Analytics dashboard, social media integration",
    average_booking_value: "2,500",
    monthly_revenue: "25,000",
    payback_months: "2",
    search_volume: "2,400",
    total_visitors: "12,450",
    total_bookings: "347",
    google_position: "3",
    load_time: "1.1s",
    bounce_rate: "28%",
    improvement_percent: "340",
    revenue_generated: "867,500",
    proposal_date: "end of this week",
  };
}

function makeTemplate(
  id: string,
  category: TemplateResult["category"],
  channel: TemplateResult["channel"],
  name: string,
  context: string,
  subject: string | undefined,
  body: string,
  lead: LeadContext,
): TemplateResult {
  const vars = leadVars(lead);
  return {
    id,
    category,
    channel,
    name,
    subject: subject ? render(subject, vars) : undefined,
    body: render(body, vars),
    context,
    wordCount: wc(render(body, vars)),
  };
}

// ═══════════════════════════════════════════════════════════════
//  1. COLD OUTREACH EMAILS  (6 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * Cold Observation — "I noticed..." Observation → Problem → Proof → Ask.
 * First cold email. Use when you've researched the lead and found a specific
 * observation (low visibility, outdated site, no reviews online).
 * Best sent Tuesday–Thursday morning.
 */
export function coldObservation(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

I noticed something about {company} this morning.

Your {area} practice has a solid {rating}-star reputation — and yet when I searched for "{services} in {location}", you barely appeared on the first page. That's a problem, because right now your future {audience} are clicking on competitors who show up instead.

Here's the thing: it's not your fault. Google rewards fast, modern websites, and most practices in {location} are still running on templates built five years ago.

We're Carter Digitals — a Pretoria-based web studio that builds exclusively on Next.js, the same framework Vercel and Nike use. We've designed websites for {sector} practices across Gauteng that have seen up to {roi_percent}% ROI within the first quarter.

Your {pain_point} could literally pay for a new website within weeks.

I built a quick demo tailored to {company}. May I send you the link?

{signature}`;

  return makeTemplate(
    "cold_observation",
    "cold",
    "email",
    "Cold Observation",
    "First cold email. Use when you've researched the lead and found a specific observation (low visibility, outdated site, no reviews online). Best sent Tuesday–Thursday morning.",
    "noticed something about {company}",
    body,
    lead,
  );
}

/**
 * Cold Question — Question-based opener. Effective when the lead is a
 * decision-maker (owner/principal). Works well for analytical personalities
 * who respond to data and metrics.
 */
export function coldQuestion(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Quick question: how many new {audience} discovered {company} through your website last month?

I ask because we work with {sector} businesses across {location}, and the answer we usually hear is "I don't actually know" or "Not enough." In fact, most practices your size are losing 60–70% of their potential {goal} to competitors who simply have a better online presence.

We're Carter Digitals — a Level 1 B-BBEE, 100% youth-owned web studio based in Pretoria. We build blazing-fast websites on Next.js (the framework behind Nike.com) that are designed to convert visitors into actual {booking_term}s.

Our clients typically see a {roi_percent}% return on investment within 90 days.

Would you be open to a 10-minute call this week to see what a modern website could do for {company}? No obligation — just a conversation.

{signature}`;

  return makeTemplate(
    "cold_question",
    "cold",
    "email",
    "Cold Question",
    "Question-based opener. Effective when the lead is a decision-maker (owner/principal). Works well for analytical personalities who respond to data and metrics.",
    "quick question about {company}",
    body,
    lead,
  );
}

/**
 * Cold Trigger — Trigger-event opener. Use when a lead has recently expanded,
 * moved, launched a new service, received press, or had any notable public event.
 */
export function coldTrigger(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Congratulations on the recent {services} expansion at {company} — I saw the news and it's great to see growth in {area}.

Here's something I've noticed: every time a {sector} business expands, there's a critical window where your online presence needs to scale with you. New {audience} in {location} are searching right now, and if your website can't handle the traffic — or worse, doesn't show up at all — that growth stalls.

We're Carter Digitals, a boutique web studio in Pretoria building on Next.js. We specialise in websites that don't just look premium — they perform. Our {sector} clients average {roi_percent}% ROI because their sites actually convert search traffic into {booking_term}s.

I'd love to show you a demo of what we could build for {company}. Would Thursday or Friday work for a quick 15-minute walkthrough?

{signature}`;

  return makeTemplate(
    "cold_trigger",
    "cold",
    "email",
    "Cold Trigger",
    "Trigger-event opener. Use when a lead has recently expanded, moved, launched a new service, received press, or had any notable public event.",
    "your recent expansion",
    body,
    lead,
  );
}

/**
 * Cold Story — Story-based opener. Highly effective for relationship-oriented
 * decision-makers. Use after you've built rapport or when a case study aligns
 * well with the lead's situation.
 */
export function coldStory(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Three months ago, we built a website for a {sector} practice in {area} — similar size to {company}. They'd been relying on word-of-mouth for years and had never invested in their online presence.

Within 60 days of launching their new Next.js site, they received 47 new {booking_term} requests directly through the website. That's {audience} who would have otherwise walked right past them and booked with a competitor.

The difference wasn't magic — it was speed (their site loads in under 1.2 seconds), mobile-first design (because 78% of searches in {location} happen on a phone), and local SEO that puts them on the first page of Google for "{services} near me."

We're Carter Digitals — 100% youth-owned, B-BBEE Level 1, based right here in Pretoria. Everything we build is on the same framework Nike and Vercel use.

I've been thinking about what this could look like for {company}, and I'd love to show you. Can I send over a quick demo?

{signature}`;

  return makeTemplate(
    "cold_story",
    "cold",
    "email",
    "Cold Story",
    "Story-based opener. Highly effective for relationship-oriented decision-makers. Use after you've built rapport or when a case study aligns well with the lead's situation.",
    "a story about {sector} growth",
    body,
    lead,
  );
}

/**
 * Cold Competitor — Competitor-based opener. Powerful for leads who are
 * market-aware. Use sparingly — only when you can genuinely reference real
 * competitor activity. Never fabricate claims.
 */
export function coldCompetitor(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

I want to share something that might surprise you.

Three of your competitors in {area} have upgraded their websites in the past six months. And they're now ranking on page one of Google for "{services} in {location}" — which means every time someone searches for what you offer, they're seeing your competitors first.

This isn't a scare tactic. It's a reality of how {audience} find businesses in 2025. Over 90% of people search online before making a {booking_term}, and if your website isn't fast, mobile-friendly, and optimised for search, you're invisible.

We're Carter Digitals — a Pretoria-based web studio (100% Black-Owned, B-BBEE Level 1). We build on Next.js, the same technology Nike and Vercel trust. Our {sector} clients see an average {roi_percent}% ROI because we design sites that actually generate {goal}.

You don't have to take my word for it. I built a demo tailored to {company} — I'd love to walk you through it. Five minutes, no pressure.

{signature}`;

  return makeTemplate(
    "cold_competitor",
    "cold",
    "email",
    "Cold Competitor",
    "Competitor-based opener. Powerful for leads who are market-aware. Use sparingly — only when you can genuinely reference real competitor activity. Never fabricate claims.",
    "your competitors in {area}",
    body,
    lead,
  );
}

/**
 * Cold B-BBEE — B-BBEE procurement opener. Use exclusively for corporate,
 * government, or parastatal leads who have procurement obligations.
 * Highly effective during tender seasons (March, September).
 */
export function coldBBBEE(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

I'm reaching out because {company} may be looking for B-BBEE-compliant digital partners — and I believe we're uniquely positioned to add real value to your supply chain.

Carter Digitals (Pty) Ltd is:
• 100% Black-Owned
• 100% Youth-Owned (under 35)
• B-BBEE Level 1 — 135% Procurement Recognition
• CIPC Registered (2025/907839/07)
• CSD Registered · POPIA Compliant

What makes us different from other Level 1 suppliers is that we don't just tick boxes — we deliver enterprise-grade websites built on Next.js, the same framework Vercel and Nike rely on. Our {sector} clients achieve an average {roi_percent}% ROI, and we've worked with businesses across Gauteng including dental practices, law firms, schools, and hospitality groups.

If {company} has procurement targets to meet this financial year, partnering with us delivers both compliance points and a world-class digital product.

I'd welcome the opportunity to present our capabilities formally. Could we schedule a brief introduction call?

{signature}`;

  return makeTemplate(
    "cold_bbbee",
    "cold",
    "email",
    "Cold B-BBEE",
    "B-BBEE procurement opener. Use exclusively for corporate, government, or parastatal leads who have procurement obligations. Highly effective during tender seasons (March, September).",
    "level 1 b-bbee web partner",
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  2. FOLLOW-UP EMAILS  (5 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * Follow-up Demo Link — Send 3–5 days after the initial cold email.
 * Only include this if you have an actual demo built. The demo link is
 * your strongest conversion tool.
 */
export function followupDemoLink(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Following up on my note last week about {company}'s online presence.

I went ahead and built a live demo site tailored to your {sector} practice in {area}. It shows exactly what your website could look like — fast, mobile-first, and designed to convert {audience} into actual {booking_term}s.

Here's the link: {demo_link}

Built on Next.js (the same framework Nike uses), it loads in under 1.2 seconds and is fully optimised for local search in {location}.

I'd love to hear what you think. Would 10 minutes this week work for a quick walkthrough?

{signature}`;

  return makeTemplate(
    "followup_demo_link",
    "followup",
    "email",
    "Follow-up Demo Link",
    "Send 3–5 days after the initial cold email. Only include this if you have an actual demo built. The demo link is your strongest conversion tool.",
    "demo for {company}",
    body,
    lead,
  );
}

/**
 * Follow-up ROI — ROI-focused follow-up. Send 7–10 days after initial contact.
 * Best for leads who are numbers-driven or who raised budget concerns.
 */
export function followupROI(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Just sharing a quick stat that caught my attention:

Businesses in the {sector} sector that invest in a professional website see an average revenue increase of 30–45% within the first year. For a practice in {area}, that could mean {roi_percent}% ROI — which means the website literally pays for itself within weeks.

The math is straightforward:
• {package_name} package: R{price} once-off
• Estimated new {audience} per month from organic search: 15–30
• Average {booking_term} value: R{average_booking_value}
• Payback period: typically under 3 months

I put together a demo for {company} that shows what this looks like in practice. Happy to walk you through it.

{signature}`;

  return makeTemplate(
    "followup_roi",
    "followup",
    "email",
    "Follow-up ROI",
    "ROI-focused follow-up. Send 7–10 days after initial contact. Best for leads who are numbers-driven or who raised budget concerns. Include realistic estimates.",
    "the numbers for {company}",
    body,
    lead,
  );
}

/**
 * Follow-up Social Proof — Testimonial/case study follow-up. Send 10–14 days
 * after initial contact. Use when the lead hasn't responded to value-based
 * messaging — social proof often breaks through.
 */
export function followupSocialProof(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

I thought you might find this interesting — one of our clients, a {sector} practice in {area}, shared this with us last week:

"We went from getting 3 online enquiries a month to over 40 after Carter Digitals rebuilt our site. The investment paid for itself in the first 6 weeks. Our only regret is not doing it sooner."

What made the difference:
✓ Next.js framework (same as Nike.com) — loads in under 1 second
✓ Mobile-first design (78% of {location} searches are on mobile)
✓ Local SEO optimisation for "{services} in {location}"
✓ Online booking integration for {audience}

Your {company} is in an even stronger position — a {rating}-star reputation with enormous growth potential. A modern website would unlock that.

Shall I send you the demo I built for {company}?

{signature}`;

  return makeTemplate(
    "followup_social_proof",
    "followup",
    "email",
    "Follow-up Social Proof",
    "Testimonial/case study follow-up. Send 10–14 days after initial contact. Use when the lead hasn't responded to value-based messaging — social proof often breaks through.",
    "what a {sector} practice said",
    body,
    lead,
  );
}

/**
 * Follow-up Urgency — Urgency/scarcity follow-up. Send 14–21 days after
 * initial contact. Only use when capacity is genuinely limited. Never fabricate
 * scarcity — South African business culture values authenticity.
 */
export function followupUrgency(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Quick heads-up — we're currently taking on {slots_available} new {sector} projects for this quarter, and I wanted to make sure {company} had the opportunity to secure a slot before we close our books.

Here's why timing matters: Google's next algorithm update is rolling out soon, and sites built on modern frameworks like Next.js (what we use) will gain a significant ranking advantage. Practices that upgrade before the update typically see a 20–30% traffic boost.

Our {package_name} package at R{price} would get {company} live within {timeline}. That means you'd be ranking before your competitors in {area} even know what happened.

I've already built a demo for you — it takes 5 minutes to review. Can I send the link?

{signature}`;

  return makeTemplate(
    "followup_urgency",
    "followup",
    "email",
    "Follow-up Urgency",
    "Urgency/scarcity follow-up. Send 14–21 days after initial contact. Only use when capacity is genuinely limited. Never fabricate scarcity — South African business culture values authenticity.",
    "closing our q{quarter} books",
    body,
    lead,
  );
}

/**
 * Follow-up Breakup — The most powerful follow-up. Send 21–30 days after
 * initial contact, after 3–4 touches. Counter-intuitively, this often
 * generates the highest reply rate. 'Should I close your file?' creates
 * loss aversion.
 */
export function followupBreakup(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

I've reached out a few times about upgrading {company}'s website, and I don't want to keep filling your inbox if this isn't a priority right now.

I'll go ahead and close your file — but I want to leave the door open. If you ever decide to invest in your online presence (or if Google's next update pushes your competitors ahead), reach out. The demo I built for {company} will be here.

For what it's worth: every month that passes with an outdated website is another month of {audience} choosing your competitors in {area}. The {package_name} package at R{price} typically pays for itself within the first quarter.

Either way, I wish you and {company} all the best.

{signature}`;

  return makeTemplate(
    "followup_breakup",
    "followup",
    "email",
    "Follow-up Breakup",
    "Breakup email — the most powerful follow-up. Send 21–30 days after initial contact, after 3–4 touches. Counter-intuitively, this often generates the highest reply rate. 'Should I close your file?' creates loss aversion.",
    "closing your file",
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  3. WHATSAPP MESSAGES  (8 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * WhatsApp Cold — First WhatsApp contact. Keep it warm but professional.
 * South African WhatsApp culture favours a friendly, direct approach.
 * Never send unsolicited images or voice notes on first contact.
 */
export function whatsappCold(lead: LeadContext): TemplateResult {
  const body = `Hlolo {lead_name} 👋 This is {sender_name} from Carter Digitals. We're a Pretoria-based web studio (100% Black-Owned, B-BBEE Level 1).

I noticed {company} doesn't appear when people search for "{services} in {location}" — which means {audience} are finding your competitors instead.

We build fast, modern websites on Next.js (same framework Nike uses) and our {sector} clients see up to {roi_percent}% ROI. Can I send you a quick demo? No pressure 😊`;

  return makeTemplate(
    "whatsapp_cold",
    "whatsapp",
    "whatsapp",
    "WhatsApp Cold",
    "First WhatsApp contact. Keep it warm but professional. South African WhatsApp culture favours a friendly, direct approach. Never send unsolicited images or voice notes on first contact.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Demo — Demo link share via WhatsApp. Send after the lead has
 * responded positively or shown interest. Always include the link on its
 * own line for easy tapping.
 */
export function whatsappDemo(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name}! Following up — I built a live demo website for {company}. It's designed specifically for {sector} practices in {area}, with online {booking_term} integration and local SEO for {location}.

Check it out: {demo_link}

Built on Next.js so it's lightning-fast (loads under 1.2s). Would love to hear your thoughts! 🚀`;

  return makeTemplate(
    "whatsapp_demo",
    "whatsapp",
    "whatsapp",
    "WhatsApp Demo",
    "Demo link share via WhatsApp. Send after the lead has responded positively or shown interest. Always include the link on its own line for easy tapping.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Follow-up — WhatsApp follow-up after no response. Send 3–5 days
 * after last message. Keep it short — WhatsApp messages over 6 lines get
 * skipped.
 */
export function whatsappFollowup(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name}, just checking in 🙏 I know things get busy.

Quick thought: every day {company} doesn't have a modern website, {audience} in {location} are booking with competitors who do.

The demo I built for you takes 2 minutes to review. Worth a look? {demo_link}`;

  return makeTemplate(
    "whatsapp_followup",
    "whatsapp",
    "whatsapp",
    "WhatsApp Follow-up",
    "WhatsApp follow-up after no response. Send 3–5 days after last message. Keep it short — WhatsApp messages over 6 lines get skipped.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Meeting — Meeting request via WhatsApp. Use after the lead has
 * engaged with at least one previous message. Offer specific time options
 * if possible — 'Tuesday at 2pm or Thursday at 10am?' converts better.
 */
export function whatsappMeeting(lead: LeadContext): TemplateResult {
  const body = `{lead_name}, would you be open to a quick 10-minute call this week?

I'd love to walk you through the demo I built for {company} and show you exactly how it could generate new {booking_term}s from {location} search traffic.

What day works best? I'm flexible 📅`;

  return makeTemplate(
    "whatsapp_meeting",
    "whatsapp",
    "whatsapp",
    "WhatsApp Meeting",
    "Meeting request via WhatsApp. Use after the lead has engaged with at least one previous message. Offer specific time options if possible — 'Tuesday at 2pm or Thursday at 10am?' converts better than open-ended.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Proposal — After proposal sent via WhatsApp summary. Follow up
 * the formal email proposal with this concise WhatsApp recap. Use bullet
 * points for scanability.
 */
export function whatsappProposal(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name}! Great chatting earlier 🙌 I've put together the proposal for {company}.

{package_name} package — R{price} once-off:
✅ Custom Next.js website (same as Nike.com)
✅ Mobile-first design
✅ Local SEO for "{services} in {location}"
✅ Online {booking_term} integration
✅ {roi_percent}% projected ROI

Full proposal attached. Let me know if you have any questions! 💼`;

  return makeTemplate(
    "whatsapp_proposal",
    "whatsapp",
    "whatsapp",
    "WhatsApp Proposal",
    "After proposal sent — via WhatsApp summary. Follow up the formal email proposal with this concise WhatsApp recap. Use bullet points for scanability.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Voice Note Guide — Guide for sending a 15-second voice note.
 * Voice notes build trust in SA business culture. Keep under 15 seconds —
 * anything longer feels intrusive. Speak clearly, warmly, and end with a
 * clear next step.
 */
export function whatsappVoiceNoteGuide(lead: LeadContext): TemplateResult {
  const body = `VOICE NOTE SCRIPT (15 seconds max):

"Hi {lead_name}, {sender_name} from Carter Digitals here. I built a demo website for {company} that shows how you could start getting more {booking_term}s from Google searches in {location}. The link is in my next message — takes 2 minutes to check out. Chat soon!"`;

  return makeTemplate(
    "whatsapp_voice_note_guide",
    "whatsapp",
    "whatsapp",
    "WhatsApp Voice Note Guide",
    "Guide for sending a 15-second voice note. Voice notes build trust in SA business culture. Keep under 15 seconds — anything longer feels intrusive. Speak clearly, warmly, and end with a clear next step.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Review — Post-meeting thank you via WhatsApp. Send within 1 hour
 * of the meeting while the conversation is fresh. Reference something specific
 * from the call to show you were listening.
 */
export function whatsappReview(lead: LeadContext): TemplateResult {
  const body = `{lead_name}, thank you for taking the time to chat today! Really enjoyed learning about {company} and your vision for {sector} in {area}.

As discussed, I'll send the formal proposal by tomorrow. In the meantime, the demo link is here if you want to share it with your team: {demo_link}

Looking forward to working together! 🤝`;

  return makeTemplate(
    "whatsapp_review",
    "whatsapp",
    "whatsapp",
    "WhatsApp Review",
    "Post-meeting thank you via WhatsApp. Send within 1 hour of the meeting while the conversation is fresh. Reference something specific from the call to show you were listening.",
    undefined,
    body,
    lead,
  );
}

/**
 * WhatsApp Referral — Referral request. Only send to warm contacts — existing
 * clients, past conversations, or leads who engaged positively even if they
 * didn't convert. In SA, referrals carry enormous weight.
 */
export function whatsappReferral(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name}! Quick favour to ask 😊

If you know any {sector} business owners in {location} who might need a modern website, I'd really appreciate an introduction. We're a 100% Black-Owned, B-BBEE Level 1 studio based in Pretoria, and we'd love to help more practices like {company} grow online.

Happy to return the favour anytime! 🙏`;

  return makeTemplate(
    "whatsapp_referral",
    "whatsapp",
    "whatsapp",
    "WhatsApp Referral",
    "Referral request. Only send to warm contacts — existing clients, past conversations, or leads who engaged positively even if they didn't convert. In SA, referrals carry enormous weight.",
    undefined,
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  4. LINKEDIN MESSAGES  (4 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * LinkedIn Connect — Connection request note (300 character limit). Mention
 * their company specifically — never use generic connection text. Lead with
 * value, not a pitch. Connection acceptance rate is higher Tuesday–Thursday.
 */
export function linkedinConnect(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name}, I noticed {company} is doing great work in {sector} across {area}. I'm building websites for {sector} practices in {location} that are generating real ROI (we're 100% Black-Owned, B-BBEE Level 1). Would love to connect and share insights.`;

  return makeTemplate(
    "linkedin_connect",
    "linkedin",
    "linkedin",
    "LinkedIn Connect",
    "Connection request note (300 character limit). Mention their company specifically — never use generic connection text. Lead with value, not a pitch. Connection acceptance rate is higher Tuesday–Thursday.",
    undefined,
    body,
    lead,
  );
}

/**
 * LinkedIn DM — First DM after connection accepted. Send within 24–48 hours
 * of connection. Longer than a connection note but still concise. End with a
 * soft ask — never push for a call in the first DM.
 */
export function linkedinDM(lead: LeadContext): TemplateResult {
  const body = `Thanks for connecting, {lead_name}!

I wanted to share something I think you'd find relevant. We recently built a Next.js website for a {sector} business in {area} — within 60 days they went from 3 online enquiries per month to over 40. The website literally paid for itself in under 6 weeks.

I noticed {company} has a strong {rating}-star reputation but isn't showing up prominently for "{services} in {location}" searches. That's a lot of potential {audience} you're missing.

I built a demo tailored to {company} that shows what a modern, fast website could do for your {booking_term} pipeline. Happy to share the link if you're interested.

No pressure at all — just thought it was worth a conversation.

Best,
{sender_name}
Carter Digitals (Pty) Ltd | B-BBEE Level 1`;

  return makeTemplate(
    "linkedin_dm",
    "linkedin",
    "linkedin",
    "LinkedIn DM",
    "First DM after connection accepted. Send within 24–48 hours of connection. Longer than a connection note but still concise. End with a soft ask — never push for a call in the first DM.",
    undefined,
    body,
    lead,
  );
}

/**
 * LinkedIn Follow-up — LinkedIn follow-up after no response to DM. Send 5–7
 * days after the DM. Keep it very short — LinkedIn DMs have low engagement
 * for long-form content.
 */
export function linkedinFollowup(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name}, just bumping this up 📌

I know LinkedIn can be a busy place. The demo I mentioned is live and only takes 2 minutes to review — it shows exactly what {company}'s website could look like, built for {sector} {audience} in {location}.

Worth a look? Happy to send the link or jump on a quick call.

{sender_name}`;

  return makeTemplate(
    "linkedin_followup",
    "linkedin",
    "linkedin",
    "LinkedIn Follow-up",
    "LinkedIn follow-up after no response to DM. Send 5–7 days after the DM. Keep it very short — LinkedIn DMs have low engagement for long-form content.",
    undefined,
    body,
    lead,
  );
}

/**
 * LinkedIn InMail — LinkedIn InMail for corporate leads. More formal than a
 * DM. Use when targeting C-suite, procurement managers, or marketing directors
 * at larger organisations. InMail character limit is 1900 characters.
 */
export function linkedinInmail(lead: LeadContext): TemplateResult {
  const body = `Dear {lead_name},

I'm reaching out because {company} has a real opportunity to dominate {sector} search results in {location} — and I'd love to show you how.

Carter Digitals (Pty) Ltd is a 100% Black-Owned, B-BBEE Level 1 web studio based in Pretoria. We build exclusively on Next.js — the same framework Vercel and Nike trust — and our {sector} clients achieve an average {roi_percent}% ROI within the first quarter.

Here's what that looks like in practice:
• A dental practice in Centurion went from 3 to 47 patient bookings/month
• A law firm in Brooklyn saw a 340% increase in consultation requests
• A school in Midrand doubled its enrolment enquiries in 90 days

I've built a demo site tailored to {company} that demonstrates exactly how this would work for your {audience}. May I share it with you?

I'm available for a 15-minute call at your convenience.

Best regards,
{sender_name}
Carter Digitals (Pty) Ltd
CIPC: 2025/907839/07 | CSD Registered | POPIA Compliant`;

  return makeTemplate(
    "linkedin_inmail",
    "linkedin",
    "linkedin",
    "LinkedIn InMail",
    "LinkedIn InMail for corporate leads. More formal than a DM. Use when targeting C-suite, procurement managers, or marketing directors at larger organisations. InMail character limit is 1900 characters.",
    "{sector} growth opportunity for {company}",
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  5. PHONE SCRIPTS  (5 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * Phone Initial — Initial cold call script. Practice before calling — your
 * tone matters more than the words. Speak slowly, warmly, and confidently.
 * Never call before 9am or after 4pm SAST.
 */
export function phoneInitial(lead: LeadContext): TemplateResult {
  const body = `PHONE SCRIPT — INITIAL COLD CALL
───────────────────────────────

[Ring... they answer]

YOU: Hi, is this {lead_name}?

THEM: Yes, speaking. / Who is this?

YOU: Hi {lead_name}, my name is {sender_name} from Carter Digitals. We're a web studio based in Pretoria — 100% Black-Owned, B-BBEE Level 1. I know you weren't expecting my call, so I'll be brief.

[Pause — wait for acknowledgment]

YOU: I was looking at {company} online and noticed that when people search for "{services} in {location}", your practice doesn't show up on the first page. Is that something you're aware of?

[Listen — if they say yes...]

YOU: The reason I'm calling is that we build websites on Next.js — it's the same framework Nike uses — and our {sector} clients typically see up to {roi_percent}% return on investment. I actually built a demo for {company} that I'd love to show you. Could I send you the link, or would you prefer a quick 10-minute walkthrough?

[If gatekeeper...]
YOU: I'm calling about {company}'s website and online presence. Is {lead_name} available? It's regarding a digital growth opportunity for the practice.`;

  return makeTemplate(
    "phone_initial",
    "phone",
    "phone",
    "Phone Initial Cold Call",
    "Initial cold call script. Practice before calling — your tone matters more than the words. Speak slowly, warmly, and confidently. If they sound busy, ask: 'Is this a bad time? When would be better to call back?' Never call before 9am or after 4pm SAST.",
    undefined,
    body,
    lead,
  );
}

/**
 * Phone Demo Follow-up — Demo follow-up call. Call 3–5 days after sending
 * the demo link. Have the demo open in your browser ready to screen-share.
 * Your goal is to either close for a proposal or schedule a walkthrough call.
 */
export function phoneDemoFollowup(lead: LeadContext): TemplateResult {
  const body = `PHONE SCRIPT — DEMO FOLLOW-UP CALL
──────────────────────────────────

YOU: Hi {lead_name}, it's {sender_name} from Carter Digitals. We spoke last week about your website. How's your week going?

[Small talk — 10 seconds max]

YOU: Great. So I sent over the demo link for {company} — did you get a chance to look at it?

IF YES:
YOU: Brilliant — what did you think? [Listen carefully]
YOU: That's a great point. Let me address that... [Respond to their concern]
YOU: Would you like me to put together a formal proposal? The {package_name} package at R{price} would cover everything we discussed.

IF NO:
YOU: No worries at all — I know how it is. The demo is at {demo_link}. It takes about 2 minutes. Would it help if I walked you through it right now? I can share my screen.

IF BUSY:
YOU: Completely understand. When would be a better time? I'm happy to call back. [Suggest specific day/time]`;

  return makeTemplate(
    "phone_demo_followup",
    "phone",
    "phone",
    "Phone Demo Follow-up",
    "Demo follow-up call. Call 3–5 days after sending the demo link. Have the demo open in your browser ready to screen-share. Your goal is to either close for a proposal or schedule a walkthrough call.",
    undefined,
    body,
    lead,
  );
}

/**
 * Phone Objection Price — Price objection handling. Never apologise for your
 * pricing — it's premium because it's premium. Reframe cost as investment.
 * Have real numbers ready. Compare once-off website cost to ongoing advertising.
 */
export function phoneObjectionPrice(lead: LeadContext): TemplateResult {
  const body = `PHONE SCRIPT — PRICE OBJECTION HANDLING
──────────────────────────────────────

THEM: That's quite expensive. / We don't have that kind of budget. / We can get it cheaper.

YOU: I completely understand, {lead_name}. Let me put it in perspective.

The {package_name} package at R{price} is a once-off investment — not a monthly fee. And here's what that translates to:

If the website generates just 10 new {booking_term}s per month from Google search — which is conservative for {area} — and each {booking_term} is worth R{average_booking_value}, that's R{monthly_revenue} per month in new revenue.

The website pays for itself in approximately {payback_months} months. After that, it's pure profit.

[Pause]

YOU: Compare that to running Google Ads at R5,000–R15,000 per month — which stops the moment you stop paying. This is an asset that works for you 24/7.

Would it help if I showed you the ROI calculations specific to {company}?`;

  return makeTemplate(
    "phone_objection_price",
    "phone",
    "phone",
    "Phone Objection: Price",
    "Price objection handling. Never apologise for your pricing — it's premium because it's premium. Reframe cost as investment. Have real numbers ready. Compare once-off website cost to ongoing advertising spend.",
    undefined,
    body,
    lead,
  );
}

/**
 * Phone Objection Timing — 'Not right now' objection. The key is to
 * differentiate between 'no' and 'not now'. 'Not now' means the door is
 * open — your job is to keep it open. Never push past two gentle objections
 * in one call.
 */
export function phoneObjectionTiming(lead: LeadContext): TemplateResult {
  const body = `PHONE SCRIPT — "NOT RIGHT NOW" OBJECTION
──────────────────────────────────────────

THEM: Not right now. / We're busy. / Maybe next year. / We have other priorities.

YOU: I hear you, {lead_name}. Timing is everything.

Can I ask — when you say "not right now," is it because:
a) Budget is tight this quarter, or
b) It's genuinely not a priority yet?

IF BUDGET:
YOU: Fair enough. We do offer payment terms — 50% upfront, 50% on launch. And given the {roi_percent}% ROI our {sector} clients see, most practices recoup the investment within the first quarter.

IF PRIORITY:
YOU: Makes sense. But here's what I'd flag — your competitors in {area} are investing in their online presence right now. Every month that passes, they're capturing more of the "{services} in {location}" search traffic. By the time it becomes a priority for {company}, you'll be playing catch-up.

[Pause]

YOU: What if I just send you the demo link? No commitment — just so you have it when the time is right. Fair enough?`;

  return makeTemplate(
    "phone_objection_timing",
    "phone",
    "phone",
    "Phone Objection: Timing",
    "'Not right now' objection. The key is to differentiate between 'no' and 'not now'. 'Not now' means the door is open — your job is to keep it open. Never push past two gentle objections in one call.",
    undefined,
    body,
    lead,
  );
}

/**
 * Phone Close — Closing call script. Only use after the lead has seen the
 * demo and expressed positive interest. Recap the value, ask directly, and
 * be comfortable with silence after the ask. The first person to speak after
 * 'Shall we get started?' usually loses.
 */
export function phoneClose(lead: LeadContext): TemplateResult {
  const body = `PHONE SCRIPT — CLOSING CALL
────────────────────────────

YOU: So {lead_name}, to recap what we've covered:

1. {company} needs a modern, fast website to compete in {location}
2. We build on Next.js — same framework as Nike and Vercel
3. The {package_name} package at R{price} includes everything: design, development, SEO, and mobile optimisation
4. Based on our {sector} clients, you can expect approximately {roi_percent}% ROI

[Pause]

YOU: I'm confident we can deliver something that genuinely transforms {company}'s online presence. Shall we get started?

IF YES:
YOU: Excellent. I'll email the formal proposal and contract within the hour. We can start the discovery phase as soon as you're ready — typically we have sites live within {timeline}.

IF THEY WANT TO THINK:
YOU: Of course. What specifically would you like to think about? Is there anything I can clarify? [Listen, address concerns]

IF STILL HESITANT:
YOU: How about this — I'll send the proposal with everything in writing. Take your time reviewing it. Can I follow up on [specific date]?`;

  return makeTemplate(
    "phone_close",
    "phone",
    "phone",
    "Phone Close",
    "Closing call script. Only use after the lead has seen the demo and expressed positive interest. Recap the value, ask directly, and be comfortable with silence after the ask. The first person to speak after 'Shall we get started?' usually loses.",
    undefined,
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  6. PROPOSAL EMAILS  (3 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * Proposal Dental Molar — Molar package proposal email for dental practices.
 * Send after the demo walkthrough meeting. The entry-level dental package at
 * R4,499 with 901% ROI is your strongest conversion offer — lead with
 * confidence.
 */
export function proposalDentalMolar(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Thank you for your time discussing {company}'s digital presence. Based on our conversation, I'm delighted to present the Molar Package — our entry-level solution designed specifically for dental practices in {area}.

─────────────────────────────
MOLAR PACKAGE — R4,499 (Once-Off)
901% Projected ROI
─────────────────────────────

What's Included:
• Custom Next.js Website (3 pages: Home, Services, Contact)
• Mobile-First Responsive Design
• Online Appointment Booking Integration
• Local SEO for "{services} in {location}"
• Google Business Profile Optimisation
• SSL Certificate & Hosting (12 months included)
• WhatsApp Click-to-Chat Button
• Practice Photo Gallery
• Patient Testimonials Section
• POPIA-Compliant Contact Forms

Why This Works for {company}:
The Molar package is engineered for practices that are ready to start capturing online patient traffic. With 901% projected ROI, this means if you're currently getting even 5 patient enquiries per month from your website, a Molar-level site could realistically generate 45+ within the first quarter.

The Next.js framework ensures your site loads in under 1.2 seconds — critical because 53% of mobile users abandon sites that take longer than 3 seconds to load. When a patient in {location} searches for "{services} near me," your practice will be there, fast and professional.

Project Timeline:
• Week 1: Discovery & Design Mockups
• Week 2: Development & Content Integration
• Week 3: Testing & SEO Optimisation
• Week 4: Launch & Google Submission

What Makes Us Different:
Carter Digitals (Pty) Ltd is 100% Black-Owned, 100% Youth-Owned, and B-BBEE Level 1 (135% Procurement Recognition). CIPC: 2025/907839/07. We're not a template factory — every site is custom-built on the same framework Vercel and Nike trust.

Next Steps:
If you're happy to proceed, I'll send the formal contract. We require 50% upfront (R2,249.50) with the balance due on launch. Sites go live within 4 weeks.

Please don't hesitate to ask any questions — I'm here to make this as smooth as possible for {company}.

{signature}`;

  return makeTemplate(
    "proposal_dental_molar",
    "proposal",
    "email",
    "Proposal: Dental Molar Package",
    "Molar package proposal email for dental practices. Send after the demo walkthrough meeting. The entry-level dental package at R4,499 with 901% ROI is your strongest conversion offer — lead with confidence.",
    "molar package proposal for {company}",
    body,
    lead,
  );
}

/**
 * Proposal Dental Crown — Crown package proposal. Premium positioning for
 * established dental practices. Lead with the 981% ROI figure. This is your
 * flagship dental offer and should be presented with confidence and
 * specificity. Use after the lead has seen the demo.
 */
export function proposalDentalCrown(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Following our discussion about {company}'s growth ambitions, I'm pleased to present the Crown Package — our most popular solution for established dental practices ready to dominate their local market.

─────────────────────────────────
CROWN PACKAGE — R8,999 (Once-Off)
981% Projected ROI
─────────────────────────────────

Everything in Molar, Plus:
• 5-Page Custom Website (Home, About, Services, Gallery, Contact)
• Advanced Online Booking System (real-time availability)
• Treatment Pages (implants, whitening, orthodontics, etc.)
• Before & After Gallery with Patient Consent System
• Google Ads Landing Page Optimisation
• Social Media Integration (Instagram Feed)
• Blog Section (3 SEO-optimised articles included)
• Advanced Analytics Dashboard
• Patient Review Management System
• Email Marketing Integration

Premium Positioning:
The Crown package is designed for practices like {company} that want to be the undisputed first choice for {services} in {location}. With 981% projected ROI — the highest of any our packages — this is an investment that compounds.

Here's what that looks like: if your average new patient is worth R3,500 in lifetime value, and the Crown site generates 25 new patient bookings per month (conservative for practices in {area}), that's R87,500 per month in new patient revenue — against a once-off R8,999 investment.

The Technology Edge:
Built on Next.js (the framework Nike.com runs on), your site will:
• Score 95+ on Google PageSpeed Insights
• Load in under 1 second on 4G connections
• Rank organically for competitive dental keywords
• Convert mobile visitors at 2× the industry average

Implementation:
• Week 1–2: Discovery, Brand Integration & Design
• Week 3–4: Development & Content Creation
• Week 5: Testing, SEO & Booking Integration
• Week 6: Launch, Training & Handover

Carter Digitals is 100% Black-Owned, 100% Youth-Owned, B-BBEE Level 1. CIPC: 2025/907839/07. CSD Registered. POPIA Compliant.

Investment Terms:
50% on acceptance (R4,499.50) · 50% on launch (R4,499.50)
Optional: R499/month maintenance (updates, security, hosting renewal)

I'm confident the Crown package will transform {company}'s patient acquisition. Shall we proceed?

{signature}`;

  return makeTemplate(
    "proposal_dental_crown",
    "proposal",
    "email",
    "Proposal: Dental Crown Package",
    "Crown package proposal — premium positioning for established dental practices. Lead with the 981% ROI figure. This is your flagship dental offer and should be presented with confidence and specificity. Use after the lead has seen the demo.",
    "crown package — {company}",
    body,
    lead,
  );
}

/**
 * Proposal General — General/sector-agnostic proposal. Works for any sector
 * — dental, legal, funeral, hospitality, logistics, construction, education,
 * medical.
 */
export function proposalGeneral(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Thank you for the engaging conversation about {company}'s future. Based on everything we discussed, I've tailored a proposal that I believe will deliver real, measurable results for your {sector} business in {area}.

─────────────────────────────────
{package_name} PACKAGE — R{price} (Once-Off)
{roi_percent}% Projected ROI
─────────────────────────────────

What's Included:
• Custom Next.js Website ({page_count} pages)
• Mobile-First Responsive Design
• Online {booking_term} Integration
• Local SEO for "{services} in {location}"
• Google Business Profile Optimisation
• WhatsApp Click-to-Chat Button
• SSL Certificate & 12 Months Hosting
• POPIA-Compliant Contact & Enquiry Forms
• {additional_features}

Why Next.js Matters:
Most web agencies in South Africa build on WordPress or Wix. We chose Next.js because it's the same framework that powers Vercel, Nike, and Netflix. For {company}, this means:
• Lightning-fast load times (under 1.2 seconds)
• Superior Google ranking potential
• Enterprise-grade security and reliability
• Future-proof architecture that scales with your growth

The ROI Case:
With a {roi_percent}% projected return on investment, the {package_name} package is designed to pay for itself quickly. Our {sector} clients across Gauteng typically see:
• 200–400% increase in online {booking_term}s within 90 days
• First-page Google ranking for local search terms
• Significant reduction in paid advertising dependency

About Carter Digitals:
We're a boutique web studio based in Pretoria — 100% Black-Owned, 100% Youth-Owned, B-BBEE Level 1 (135% Procurement Recognition). CIPC: 2025/907839/07. CSD Registered. POPIA Compliant. Every website we build is custom — no templates, no shortcuts.

Project Timeline: {timeline}
Payment: 50% upfront · 50% on launch

I'd love to get {company} started. Please let me know if you have any questions or if there's anything you'd like adjusted in this proposal.

{signature}`;

  return makeTemplate(
    "proposal_general",
    "proposal",
    "email",
    "Proposal: General Package",
    "General/sector-agnostic proposal. Customise the package_name, price, roi_percent, and page_count placeholders before sending. Works for any sector — dental, legal, funeral, hospitality, logistics, construction, education, medical.",
    "{package_name} proposal — {company}",
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  7. SPECIAL OCCASION MESSAGES  (4 templates)
// ═══════════════════════════════════════════════════════════════

/**
 * After Meeting Thank You — Post-meeting thank you email. Send within 2 hours
 * of the meeting. Reference specific details from the conversation to show
 * you were listening. This builds trust and differentiates you from agencies
 * that send generic follow-ups.
 */
export function afterMeetingThankYou(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Thank you for taking the time to meet with me today — I genuinely enjoyed learning about {company} and your vision for growth in {area}.

A few things that stood out from our conversation:
• Your {rating}-star reputation is a massive asset — we just need to make it visible online
• The focus on {services} aligns perfectly with what {audience} in {location} are searching for
• Your timeline of {timeline} works well with our development schedule

As discussed, I'll send the formal proposal by {proposal_date}. In the meantime, the demo is still live at {demo_link} — feel free to share it with your team.

One thing I want to reiterate: we're not just building a website. We're building a {audience} acquisition engine for {company}. The {package_name} package at R{price} with {roi_percent}% projected ROI is designed to deliver measurable results from day one.

Please don't hesitate to reach out if anything comes up before the proposal arrives.

{signature}`;

  return makeTemplate(
    "after_meeting_thankyou",
    "special",
    "email",
    "After Meeting Thank You",
    "Post-meeting thank you email. Send within 2 hours of the meeting. Reference specific details from the conversation to show you were listening. This builds trust and differentiates you from agencies that send generic follow-ups.",
    "great meeting, {lead_name}",
    body,
    lead,
  );
}

/**
 * After Demo Email — After showing the demo site. Send within 24 hours while
 * the demo is fresh in their mind. Highlight specific features that are
 * relevant to their business. Move toward proposal/close.
 */
export function afterDemoEmail(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Thanks for taking a look at the demo site I built for {company} — I hope it gave you a clear picture of what's possible.

A few highlights worth noting:
• The site loads in 1.1 seconds on mobile — 3× faster than the {sector} industry average
• It's built on Next.js, the same framework Nike and Vercel use
• The local SEO is optimised for "{services} in {location}" — which gets approximately {search_volume} searches per month
• The online {booking_term} system is fully integrated — {audience} can book directly

I noticed a few things during our review that I think could be particularly powerful for {company}:
1. Your {rating}-star reviews displayed prominently on the homepage
2. A dedicated page for your most popular {services}
3. Mobile-optimised click-to-call and WhatsApp buttons

The {package_name} package at R{price} covers all of this — with a {roi_percent}% projected ROI. Based on what I've seen, {company} is in a strong position to capture significantly more {booking_term}s from online search.

Shall I put together the formal proposal?

{signature}`;

  return makeTemplate(
    "after_demo_email",
    "special",
    "email",
    "After Demo Email",
    "After showing the demo site. Send within 24 hours while the demo is fresh in their mind. Highlight specific features that are relevant to their business. Move toward proposal/close.",
    "your demo site for {company}",
    body,
    lead,
  );
}

/**
 * Re-engagement 30 Days — Re-engagement after 30 days of inactivity. Use
 * when a lead went cold after initial interest. Lead with new information
 * (competitor activity, algorithm changes) rather than a generic check-in.
 */
export function reengagement30Days(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

It's been about a month since we last spoke about {company}'s website, and I wanted to check in.

I'll be honest — I've been keeping an eye on the search results for "{services} in {location}," and the landscape is shifting. Two of your competitors in {area} have launched new websites in the past few weeks, and they're now appearing above {company} in Google results.

I don't share this to create urgency — I share it because the window to establish {company} as the top-rated {sector} choice in {location} is getting narrower.

Our {package_name} package at R{price} would have {company} live within {timeline}, and with {roi_percent}% projected ROI, the investment practically pays for itself.

The demo I built is still available: {demo_link}

If the timing is better now, I'd love to pick up where we left off. If not, no worries — just wanted to make sure you had the latest information.

{signature}`;

  return makeTemplate(
    "reengagement_30days",
    "special",
    "email",
    "Re-engagement (30 Days)",
    "Re-engagement after 30 days of inactivity. Use when a lead went cold after initial interest. Lead with new information (competitor activity, algorithm changes) rather than a generic check-in. The demo link should still be live.",
    "update on {company} search results",
    body,
    lead,
  );
}

/**
 * Annual Review — Annual review for existing clients. Send on the anniversary
 * of their website launch or in early January. Include real analytics data —
 * this is your strongest retention tool. Lead with results, then upsell
 * improvements.
 */
export function annualReview(lead: LeadContext): TemplateResult {
  const body = `Hi {lead_name},

Happy [anniversary/new year]! 🎉

It's been a year since we launched {company}'s new website, and I wanted to share a quick performance review:

Website Performance (Past 12 Months):
• Total visitors: {total_visitors}
• Online {booking_term}s generated: {total_bookings}
• Google ranking for "{services} in {location}": Position #{google_position}
• Average page load time: {load_time}
• Bounce rate: {bounce_rate}

Compared to your previous site, that's a {improvement_percent}% improvement in online {goal} — which translates to approximately R{revenue_generated} in new revenue.

What's Next:
As we head into the new year, I'd recommend we:
1. Refresh the content to reflect any new {services}
2. Add any new team members or credentials
3. Review and optimise based on the latest search trends in {area}
4. Consider adding a blog section for ongoing SEO growth

Would you be open to a 15-minute call next week to discuss the year ahead?

It's been a privilege working with {company}, and I'm excited about what we can achieve together in the coming year.

{signature}`;

  return makeTemplate(
    "annual_review",
    "special",
    "email",
    "Annual Review",
    "Annual review for existing clients. Send on the anniversary of their website launch or in early January. Include real analytics data — this is your strongest retention tool. Lead with results, then upsell improvements.",
    "{company} — year in review",
    body,
    lead,
  );
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE INDEX — all templates registered without bodies
// ═══════════════════════════════════════════════════════════════

/** All 35 templates indexed (no body — lightweight reference). */
export const ALL_TEMPLATES: TemplateIndexEntry[] = [
  // Cold Outreach (6)
  { id: "cold_observation", category: "cold", channel: "email", name: "Cold Observation", context: "First cold email. Use when you've researched the lead and found a specific observation (low visibility, outdated site, no reviews online). Best sent Tuesday–Thursday morning." },
  { id: "cold_question", category: "cold", channel: "email", name: "Cold Question", context: "Question-based opener. Effective when the lead is a decision-maker (owner/principal). Works well for analytical personalities who respond to data and metrics." },
  { id: "cold_trigger", category: "cold", channel: "email", name: "Cold Trigger", context: "Trigger-event opener. Use when a lead has recently expanded, moved, launched a new service, received press, or had any notable public event." },
  { id: "cold_story", category: "cold", channel: "email", name: "Cold Story", context: "Story-based opener. Highly effective for relationship-oriented decision-makers. Use after you've built rapport or when a case study aligns well with the lead's situation." },
  { id: "cold_competitor", category: "cold", channel: "email", name: "Cold Competitor", context: "Competitor-based opener. Powerful for leads who are market-aware. Use sparingly — only when you can genuinely reference real competitor activity. Never fabricate claims." },
  { id: "cold_bbbee", category: "cold", channel: "email", name: "Cold B-BBEE", context: "B-BBEE procurement opener. Use exclusively for corporate, government, or parastatal leads who have procurement obligations. Highly effective during tender seasons (March, September)." },

  // Follow-Up (5)
  { id: "followup_demo_link", category: "followup", channel: "email", name: "Follow-up Demo Link", context: "Send 3–5 days after the initial cold email. Only include this if you have an actual demo built. The demo link is your strongest conversion tool." },
  { id: "followup_roi", category: "followup", channel: "email", name: "Follow-up ROI", context: "ROI-focused follow-up. Send 7–10 days after initial contact. Best for leads who are numbers-driven or who raised budget concerns." },
  { id: "followup_social_proof", category: "followup", channel: "email", name: "Follow-up Social Proof", context: "Testimonial/case study follow-up. Send 10–14 days after initial contact. Use when the lead hasn't responded to value-based messaging." },
  { id: "followup_urgency", category: "followup", channel: "email", name: "Follow-up Urgency", context: "Urgency/scarcity follow-up. Send 14–21 days after initial contact. Only use when capacity is genuinely limited." },
  { id: "followup_breakup", category: "followup", channel: "email", name: "Follow-up Breakup", context: "Breakup email — the most powerful follow-up. Send 21–30 days after initial contact, after 3–4 touches." },

  // WhatsApp (8)
  { id: "whatsapp_cold", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Cold", context: "First WhatsApp contact. Keep it warm but professional. South African WhatsApp culture favours a friendly, direct approach." },
  { id: "whatsapp_demo", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Demo", context: "Demo link share via WhatsApp. Send after the lead has responded positively or shown interest." },
  { id: "whatsapp_followup", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Follow-up", context: "WhatsApp follow-up after no response. Send 3–5 days after last message. Keep it short." },
  { id: "whatsapp_meeting", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Meeting", context: "Meeting request via WhatsApp. Use after the lead has engaged with at least one previous message." },
  { id: "whatsapp_proposal", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Proposal", context: "After proposal sent — via WhatsApp summary. Follow up the formal email proposal with this concise WhatsApp recap." },
  { id: "whatsapp_voice_note_guide", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Voice Note Guide", context: "Guide for sending a 15-second voice note. Voice notes build trust in SA business culture." },
  { id: "whatsapp_review", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Review", context: "Post-meeting thank you via WhatsApp. Send within 1 hour of the meeting while the conversation is fresh." },
  { id: "whatsapp_referral", category: "whatsapp", channel: "whatsapp", name: "WhatsApp Referral", context: "Referral request. Only send to warm contacts. In SA, referrals carry enormous weight." },

  // LinkedIn (4)
  { id: "linkedin_connect", category: "linkedin", channel: "linkedin", name: "LinkedIn Connect", context: "Connection request note (300 character limit). Mention their company specifically — never use generic connection text." },
  { id: "linkedin_dm", category: "linkedin", channel: "linkedin", name: "LinkedIn DM", context: "First DM after connection accepted. Send within 24–48 hours of connection. End with a soft ask." },
  { id: "linkedin_followup", category: "linkedin", channel: "linkedin", name: "LinkedIn Follow-up", context: "LinkedIn follow-up after no response to DM. Send 5–7 days after the DM. Keep it very short." },
  { id: "linkedin_inmail", category: "linkedin", channel: "linkedin", name: "LinkedIn InMail", context: "LinkedIn InMail for corporate leads. More formal than a DM. Use when targeting C-suite or procurement managers." },

  // Phone Scripts (5)
  { id: "phone_initial", category: "phone", channel: "phone", name: "Phone Initial Cold Call", context: "Initial cold call script. Speak slowly, warmly, and confidently. Never call before 9am or after 4pm SAST." },
  { id: "phone_demo_followup", category: "phone", channel: "phone", name: "Phone Demo Follow-up", context: "Demo follow-up call. Call 3–5 days after sending the demo link. Have the demo open in your browser ready to screen-share." },
  { id: "phone_objection_price", category: "phone", channel: "phone", name: "Phone Objection: Price", context: "Price objection handling. Never apologise for your pricing — reframe cost as investment." },
  { id: "phone_objection_timing", category: "phone", channel: "phone", name: "Phone Objection: Timing", context: "'Not right now' objection. Differentiate between 'no' and 'not now'. Keep the door open." },
  { id: "phone_close", category: "phone", channel: "phone", name: "Phone Close", context: "Closing call script. Only use after the lead has seen the demo and expressed positive interest." },

  // Proposal (3)
  { id: "proposal_dental_molar", category: "proposal", channel: "email", name: "Proposal: Dental Molar Package", context: "Molar package proposal email for dental practices. Send after the demo walkthrough meeting. R4,499 with 901% ROI." },
  { id: "proposal_dental_crown", category: "proposal", channel: "email", name: "Proposal: Dental Crown Package", context: "Crown package proposal — premium positioning for established dental practices. R8,999 with 981% ROI." },
  { id: "proposal_general", category: "proposal", channel: "email", name: "Proposal: General Package", context: "General/sector-agnostic proposal. Works for any sector." },

  // Special (4)
  { id: "after_meeting_thankyou", category: "special", channel: "email", name: "After Meeting Thank You", context: "Post-meeting thank you email. Send within 2 hours of the meeting." },
  { id: "after_demo_email", category: "special", channel: "email", name: "After Demo Email", context: "After showing the demo site. Send within 24 hours. Move toward proposal/close." },
  { id: "reengagement_30days", category: "special", channel: "email", name: "Re-engagement (30 Days)", context: "Re-engagement after 30 days of inactivity. Lead with new information rather than a generic check-in." },
  { id: "annual_review", category: "special", channel: "email", name: "Annual Review", context: "Annual review for existing clients. Include real analytics data. Lead with results, then upsell." },
];

// ────────────────────────────────────────────────────────────────
//  Lookup maps
// ────────────────────────────────────────────────────────────────

const TEMPLATE_REGISTRY: Record<
  string,
  { category: TemplateResult["category"]; channel: TemplateResult["channel"]; fn: (lead: LeadContext) => TemplateResult }
> = {
  cold_observation:        { category: "cold",     channel: "email",    fn: coldObservation },
  cold_question:           { category: "cold",     channel: "email",    fn: coldQuestion },
  cold_trigger:            { category: "cold",     channel: "email",    fn: coldTrigger },
  cold_story:              { category: "cold",     channel: "email",    fn: coldStory },
  cold_competitor:         { category: "cold",     channel: "email",    fn: coldCompetitor },
  cold_bbbee:              { category: "cold",     channel: "email",    fn: coldBBBEE },
  followup_demo_link:      { category: "followup", channel: "email",    fn: followupDemoLink },
  followup_roi:            { category: "followup", channel: "email",    fn: followupROI },
  followup_social_proof:   { category: "followup", channel: "email",    fn: followupSocialProof },
  followup_urgency:        { category: "followup", channel: "email",    fn: followupUrgency },
  followup_breakup:        { category: "followup", channel: "email",    fn: followupBreakup },
  whatsapp_cold:           { category: "whatsapp", channel: "whatsapp", fn: whatsappCold },
  whatsapp_demo:           { category: "whatsapp", channel: "whatsapp", fn: whatsappDemo },
  whatsapp_followup:       { category: "whatsapp", channel: "whatsapp", fn: whatsappFollowup },
  whatsapp_meeting:        { category: "whatsapp", channel: "whatsapp", fn: whatsappMeeting },
  whatsapp_proposal:       { category: "whatsapp", channel: "whatsapp", fn: whatsappProposal },
  whatsapp_voice_note_guide: { category: "whatsapp", channel: "whatsapp", fn: whatsappVoiceNoteGuide },
  whatsapp_review:         { category: "whatsapp", channel: "whatsapp", fn: whatsappReview },
  whatsapp_referral:       { category: "whatsapp", channel: "whatsapp", fn: whatsappReferral },
  linkedin_connect:        { category: "linkedin", channel: "linkedin", fn: linkedinConnect },
  linkedin_dm:             { category: "linkedin", channel: "linkedin", fn: linkedinDM },
  linkedin_followup:       { category: "linkedin", channel: "linkedin", fn: linkedinFollowup },
  linkedin_inmail:         { category: "linkedin", channel: "linkedin", fn: linkedinInmail },
  phone_initial:           { category: "phone",    channel: "phone",    fn: phoneInitial },
  phone_demo_followup:     { category: "phone",    channel: "phone",    fn: phoneDemoFollowup },
  phone_objection_price:   { category: "phone",    channel: "phone",    fn: phoneObjectionPrice },
  phone_objection_timing:  { category: "phone",    channel: "phone",    fn: phoneObjectionTiming },
  phone_close:             { category: "phone",    channel: "phone",    fn: phoneClose },
  proposal_dental_molar:   { category: "proposal", channel: "email",    fn: proposalDentalMolar },
  proposal_dental_crown:   { category: "proposal", channel: "email",    fn: proposalDentalCrown },
  proposal_general:        { category: "proposal", channel: "email",    fn: proposalGeneral },
  after_meeting_thankyou:  { category: "special",  channel: "email",    fn: afterMeetingThankYou },
  after_demo_email:        { category: "special",  channel: "email",    fn: afterDemoEmail },
  reengagement_30days:     { category: "special",  channel: "email",    fn: reengagement30Days },
  annual_review:           { category: "special",  channel: "email",    fn: annualReview },
};

// ═══════════════════════════════════════════════════════════════
//  PUBLIC HELPER EXPORTS
// ═══════════════════════════════════════════════════════════════

/**
 * Returns all template index entries for a given category.
 *
 * @example
 * getTemplatesForCategory("cold")  // 6 cold outreach templates
 * getTemplatesForCategory("whatsapp")  // 8 WhatsApp templates
 */
export function getTemplatesForCategory(
  category: TemplateResult["category"],
): TemplateIndexEntry[] {
  return ALL_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Returns all template index entries for a given channel.
 *
 * @example
 * getTemplatesForChannel("email")     // all email-channel templates
 * getTemplatesForChannel("whatsapp")  // 8 WhatsApp templates
 * getTemplatesForChannel("phone")     // 5 phone script templates
 */
export function getTemplatesForChannel(
  channel: TemplateResult["channel"],
): TemplateIndexEntry[] {
  return ALL_TEMPLATES.filter((t) => t.channel === channel);
}

/**
 * Renders a specific template with lead data.
 *
 * @param templateId - The template identifier (e.g. "cold_observation")
 * @param lead       - The lead context to personalise the template with
 * @returns The fully rendered TemplateResult with all placeholders filled
 * @throws If the template ID is not found in the registry
 *
 * @example
 * const result = renderTemplate("cold_observation", {
 *   name: "Dr. Naledi Mokoena",
 *   sector: "dental",
 *   location: "Pretoria",
 *   area: "Centurion",
 *   rating: 4.8,
 *   tier: 9,
 *   services: "cosmetic dentistry",
 *   recommendedPackage: "Molar",
 *   estimatedValue: 4499,
 *   phone: "+27123456789",
 *   onlinePresence: "https://mokoenadental.co.za",
 *   notes: "",
 *   subSector: "dental",
 * });
 */
export function renderTemplate(
  templateId: string,
  lead: LeadContext,
): TemplateResult {
  const entry = TEMPLATE_REGISTRY[templateId];
  if (!entry) {
    throw new Error(
      `Unknown template ID: "${templateId}". Available: ${Object.keys(TEMPLATE_REGISTRY).join(", ")}`,
    );
  }
  return entry.fn(lead);
}

/**
 * Generates a complete 7-touch multi-channel outreach sequence.
 *
 * Touch 1 (Day 0):  Cold email — observation
 * Touch 2 (Day 2):  WhatsApp message
 * Touch 3 (Day 4):  Follow-up email with demo link
 * Touch 4 (Day 7):  WhatsApp demo share
 * Touch 5 (Day 10): Follow-up email — social proof
 * Touch 6 (Day 14): WhatsApp meeting request
 * Touch 7 (Day 21): Breakup email
 *
 * @param lead - The lead context to personalise every touch in the sequence
 * @returns An ordered array of 7 sequence steps with fully rendered content
 *
 * @example
 * const sequence = generateFullSequence(myLead);
 * // sequence[0].body  → cold observation email
 * // sequence[1].body  → WhatsApp cold message
 * // sequence[6].body  → breakup email
 */
export function generateFullSequence(lead: LeadContext): SequenceStep[] {
  const steps: Array<{
    touch: number;
    day: number;
    channel: TemplateResult["channel"];
    template: string;
    context: string;
  }> = [
    { touch: 1, day: 0, channel: "email", template: "cold_observation", context: "First touch — cold email with observation opener" },
    { touch: 2, day: 2, channel: "whatsapp", template: "whatsapp_cold", context: "Second touch — first WhatsApp contact (if number available)" },
    { touch: 3, day: 4, channel: "email", template: "followup_demo_link", context: "Third touch — follow up with demo link" },
    { touch: 4, day: 7, channel: "whatsapp", template: "whatsapp_demo", context: "Fourth touch — WhatsApp demo share" },
    { touch: 5, day: 10, channel: "email", template: "followup_social_proof", context: "Fifth touch — social proof / testimonial email" },
    { touch: 6, day: 14, channel: "whatsapp", template: "whatsapp_meeting", context: "Sixth touch — WhatsApp meeting request" },
    { touch: 7, day: 21, channel: "email", template: "followup_breakup", context: "Seventh touch — breakup email (often highest reply rate)" },
  ];

  return steps.map((step) => {
    const rendered = renderTemplate(step.template, lead);
    return {
      ...step,
      subject: rendered.subject,
      body: rendered.body,
    };
  });
}

// ═══════════════════════════════════════════════════════════════
//  SUBJECT LINES — 20 options
// ═══════════════════════════════════════════════════════════════

/**
 * 20 short, lowercase, internal-looking subject line options.
 * These are designed to bypass spam filters while remaining professional.
 * Use with `render()` to personalise placeholders.
 */
export const SUBJECT_LINES: string[] = [
  "noticed something about {company}",
  "quick question about {company}",
  "your recent expansion",
  "a story about {sector} growth",
  "your competitors in {area}",
  "level 1 b-bbee web partner",
  "demo for {company}",
  "the numbers for {company}",
  "what a {sector} practice said",
  "closing our q{quarter} books",
  "closing your file",
  "great meeting, {lead_name}",
  "your demo site for {company}",
  "update on {company} search results",
  "{company} — year in review",
  "molar package proposal for {company}",
  "crown package — {company}",
  "{package_name} proposal — {company}",
  "quick thought on {company}",
  "{sector} growth opportunity for {company}",
];
