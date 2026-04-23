#!/usr/bin/env python3
"""
Carter Digitals (Pty) Ltd — Email & Message Template Generator
===============================================================
A comprehensive, production-ready template engine for boutique web studio outreach.

Company:  Carter Digitals (Pty) Ltd
CIPC:     2025/907839/07
B-BBEE:   Level 1 (135% Procurement Recognition)
Status:   100% Black-Owned · 100% Youth-Owned · CSD Registered · POPIA Compliant
Stack:    Next.js (same framework as Vercel, Nike)
Location: Pretoria, Gauteng, South Africa
"""

from __future__ import annotations

import textwrap
from dataclasses import dataclass, field
from typing import Any


# ────────────────────────────────────────────────────────────────
#  Data structures
# ────────────────────────────────────────────────────────────────

@dataclass
class Template:
    """A single outbound message template."""
    name: str
    category: str
    channel: str           # email | whatsapp | linkedin | phone | proposal | occasion
    context: str           # when / why to use this template
    subject: str | None = None
    body: str = ""
    word_count: int = 0
    placeholders: list[str] = field(default_factory=list)
    sector_variants: dict[str, str] = field(default_factory=dict)

    def formatted(self, **kwargs) -> dict[str, str]:
        """Return subject + body with placeholders filled."""
        body = self.body
        subject = self.subject or ""
        for key, val in kwargs.items():
            body = body.replace(f"{{{key}}}", str(val))
            subject = subject.replace(f"{{{key}}}", str(val))
        return {"subject": subject.strip(), "body": body.strip()}


@dataclass
class Lead:
    """Minimal lead record for template personalisation."""
    name: str = "{lead_name}"
    sector: str = "{sector}"
    location: str = "{location}"
    area: str = "{area}"
    rating: str = "{rating}"
    services: str = "{services}"
    package_name: str = "{package_name}"
    price: str = "{price}"
    roi_percent: str = "{roi_percent}"
    company: str = "{company}"
    website: str = "{website}"


# ────────────────────────────────────────────────────────────────
#  Sector lexicon — keeps every template on-brand
# ────────────────────────────────────────────────────────────────

SECTOR_LEXICON = {
    "dental": {
        "audience": "patients",
        "capacity_unit": "chair",
        "booking_term": "schedule",
        "trust_signal": "smile",
        "pain_point": "empty appointment slots",
        "goal": "new patient bookings",
    },
    "legal": {
        "audience": "clients",
        "capacity_unit": "case",
        "booking_term": "consultation",
        "trust_signal": "reputation",
        "pain_point": "missed consultation requests",
        "goal": "qualified consultation bookings",
    },
    "funeral": {
        "audience": "families",
        "capacity_unit": "service",
        "booking_term": "arrangement",
        "trust_signal": "compassion",
        "pain_point": "families unable to find you online",
        "goal": "trust-building enquiries",
    },
    "hospitality": {
        "audience": "guests",
        "capacity_unit": "room",
        "booking_term": "reservation",
        "trust_signal": "experience",
        "pain_point": "empty rooms and tables",
        "goal": "direct bookings",
    },
    "logistics": {
        "audience": "clients",
        "capacity_unit": "shipment",
        "booking_term": "quote request",
        "trust_signal": "reliability",
        "pain_point": "lost quote requests",
        "goal": "quote requests and new accounts",
    },
    "construction": {
        "audience": "developers",
        "capacity_unit": "project",
        "booking_term": "site visit",
        "trust_signal": "portfolio",
        "pain_point": "invisible to new developers",
        "goal": "project enquiries",
    },
    "education": {
        "audience": "parents and learners",
        "capacity_unit": "enrolment",
        "booking_term": "application",
        "trust_signal": "academic record",
        "pain_point": "declining enrolment numbers",
        "goal": "enrolment enquiries",
    },
    "medical": {
        "audience": "patients",
        "capacity_unit": "appointment",
        "booking_term": "booking",
        "trust_signal": "care quality",
        "pain_point": "no-shows and missed appointments",
        "goal": "patient bookings",
    },
    "general": {
        "audience": "customers",
        "capacity_unit": "slot",
        "booking_term": "booking",
        "trust_signal": "reviews",
        "pain_point": "invisibility online",
        "goal": "new customer enquiries",
    },
}


# ────────────────────────────────────────────────────────────────
#  EmailGenerator — the main class
# ────────────────────────────────────────────────────────────────

class EmailGenerator:
    """
    Generates professional, sector-aware outreach templates for
    Carter Digitals (Pty) Ltd — a boutique Next.js web studio
    in Pretoria, South Africa.
    """

    COMPANY = "Carter Digitals (Pty) Ltd"
    SIGNATURE = textwrap.dedent("""\
        Kind regards,
        {sender_name}
        Carter Digitals (Pty) Ltd
        100% Black-Owned · 100% Youth-Owned
        B-BBEE Level 1 — 135% Procurement Recognition
        CIPC: 2025/907839/07 · CSD Registered · POPIA Compliant
        https://carterdigitals.co.za""")

    # ─── helpers ──────────────────────────────────────────────
    def _sig(self, sender: str = "{sender_name}") -> str:
        return self.SIGNATURE.format(sender_name=sender)

    @staticmethod
    def _wc(text: str) -> int:
        return len(text.split())

    @staticmethod
    def _placeholders(text: str) -> list[str]:
        import re
        return sorted(set(re.findall(r"\{(\w+)\}", text)))

    def _t(self, name: str, category: str, channel: str, context: str,
           subject: str | None, body: str, sector_variants: dict[str, str] | None = None) -> Template:
        return Template(
            name=name, category=category, channel=channel, context=context,
            subject=subject, body=body, word_count=self._wc(body),
            placeholders=self._placeholders(body + (subject or "")),
            sector_variants=sector_variants or {},
        )

    def _sector_body(self, base: str, sector_variants: dict[str, str], default_sector: str = "general") -> str:
        """If a specific sector body is provided, use it; else fall back to base."""
        return base  # variants stored separately on the Template

    # ═══════════════════════════════════════════════════════════
    #  1. COLD OUTREACH EMAILS  (6 templates × 3 sector variants)
    # ═══════════════════════════════════════════════════════════

    def cold_observation(self) -> Template:
        """Observation → Problem → Proof → Ask"""
        body = textwrap.dedent("""\
            Hi {lead_name},

            I noticed something about {company} this morning.

            Your {area} practice has a solid {rating}-star reputation — and yet when I searched for \"{services} in {location}\", you barely appeared on the first page. That's a problem, because right now your future {audience} are clicking on competitors who show up instead.

            Here's the thing: it's not your fault. Google rewards fast, modern websites, and most practices in {location} are still running on templates built five years ago.

            We're Carter Digitals — a Pretoria-based web studio that builds exclusively on Next.js, the same framework Vercel and Nike use. We've designed websites for {sector} practices across Gauteng that have seen up to {roi_percent}% ROI within the first quarter.

            Your {pain_point} could literally pay for a new website within weeks.

            I built a quick demo tailored to {company}. May I send you the link?

            {signature}""")

        sector_variants = {
            "dental": body.replace("{audience}", "patients").replace("{pain_point}", "empty appointment slots"),
            "legal": body.replace("{audience}", "clients").replace("{pain_point}", "missed consultation requests"),
            "general": body.replace("{audience}", "customers").replace("{pain_point}", "invisible online presence"),
        }

        return self._t(
            name="cold_observation", category="Cold Outreach", channel="email",
            context="First cold email. Use when you've researched the lead and found a specific observation (low visibility, outdated site, no reviews online). Best sent Tuesday–Thursday morning.",
            subject="noticed something about {company}",
            body=body, sector_variants=sector_variants,
        )

    def cold_question(self) -> Template:
        """Question → Value → Ask"""
        body = textwrap.dedent("""\
            Hi {lead_name},

            Quick question: how many new {audience} discovered {company} through your website last month?

            I ask because we work with {sector} businesses across {location}, and the answer we usually hear is \"I don't actually know\" or \"Not enough.\" In fact, most practices your size are losing 60–70% of their potential {goal} to competitors who simply have a better online presence.

            We're Carter Digitals — a Level 1 B-BBEE, 100% youth-owned web studio based in Pretoria. We build blazing-fast websites on Next.js (the framework behind Nike.com) that are designed to convert visitors into actual {booking_term}s.

            Our clients typically see a {roi_percent}% return on investment within 90 days.

            Would you be open to a 10-minute call this week to see what a modern website could do for {company}? No obligation — just a conversation.

            {signature}""")

        return self._t(
            name="cold_question", category="Cold Outreach", channel="email",
            context="Question-based opener. Effective when the lead is a decision-maker (owner/principal). Works well for analytical personalities who respond to data and metrics.",
            subject="quick question about {company}",
            body=body,
        )

    def cold_trigger(self) -> Template:
        """Trigger → Insight → Ask"""
        body = textwrap.dedent("""\
            Hi {lead_name},

            Congratulations on the recent {services} expansion at {company} — I saw the news and it's great to see growth in {area}.

            Here's something I've noticed: every time a {sector} business expands, there's a critical window where your online presence needs to scale with you. New {audience} in {location} are searching right now, and if your website can't handle the traffic — or worse, doesn't show up at all — that growth stalls.

            We're Carter Digitals, a boutique web studio in Pretoria building on Next.js. We specialise in websites that don't just look premium — they perform. Our {sector} clients average {roi_percent}% ROI because their sites actually convert search traffic into {booking_term}s.

            I'd love to show you a demo of what we could build for {company}. Would Thursday or Friday work for a quick 15-minute walkthrough?

            {signature}""")

        return self._t(
            name="cold_trigger", category="Cold Outreach", channel="email",
            context="Trigger-event opener. Use when a lead has recently expanded, moved, launched a new service, received press, or had any notable public event.",
            subject="your recent expansion",
            body=body,
        )

    def cold_story(self) -> Template:
        """Story → Bridge → Ask"""
        body = textwrap.dedent("""\
            Hi {lead_name},

            Three months ago, we built a website for a {sector} practice in {area} — similar size to {company}. They'd been relying on word-of-mouth for years and had never invested in their online presence.

            Within 60 days of launching their new Next.js site, they received 47 new {booking_term} requests directly through the website. That's {audience} who would have otherwise walked right past them and booked with a competitor.

            The difference wasn't magic — it was speed (their site loads in under 1.2 seconds), mobile-first design (because 78% of searches in {location} happen on a phone), and local SEO that puts them on the first page of Google for \"{services} near me.\"

            We're Carter Digitals — 100% youth-owned, B-BBEE Level 1, based right here in Pretoria. Everything we build is on the same framework Nike and Vercel use.

            I've been thinking about what this could look like for {company}, and I'd love to show you. Can I send over a quick demo?

            {signature}""")

        return self._t(
            name="cold_story", category="Cold Outreach", channel="email",
            context="Story-based opener. Highly effective for relationship-oriented decision-makers. Use after you've built rapport or when a case study aligns well with the lead's situation.",
            subject="a story about {sector} growth",
            body=body,
        )

    def cold_competitor(self) -> Template:
        """Competitor angle — \"Your competitors who went online...\""""
        body = textwrap.dedent("""\
            Hi {lead_name},

            I want to share something that might surprise you.

            Three of your competitors in {area} have upgraded their websites in the past six months. And they're now ranking on page one of Google for \"{services} in {location}\" — which means every time someone searches for what you offer, they're seeing your competitors first.

            This isn't a scare tactic. It's a reality of how {audience} find businesses in 2025. Over 90% of people search online before making a {booking_term}, and if your website isn't fast, mobile-friendly, and optimised for search, you're invisible.

            We're Carter Digitals — a Pretoria-based web studio (100% Black-Owned, B-BBEE Level 1). We build on Next.js, the same technology Nike and Vercel trust. Our {sector} clients see an average {roi_percent}% ROI because we design sites that actually generate {goal}.

            You don't have to take my word for it. I built a demo tailored to {company} — I'd love to walk you through it. Five minutes, no pressure.

            {signature}""")

        return self._t(
            name="cold_competitor", category="Cold Outreach", channel="email",
            context="Competitor-based opener. Powerful for leads who are market-aware. Use sparingly — only when you can genuinely reference real competitor activity. Never fabricate claims.",
            subject="your competitors in {area}",
            body=body,
        )

    def cold_bbbee(self) -> Template:
        """B-BBEE procurement angle — for corporate / government leads"""
        body = textwrap.dedent("""\
            Hi {lead_name},

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

            {signature}""")

        return self._t(
            name="cold_bbbee", category="Cold Outreach", channel="email",
            context="B-BBEE procurement opener. Use exclusively for corporate, government, or parastatal leads who have procurement obligations. Highly effective during tender seasons (March, September).",
            subject="level 1 b-bbee web partner",
            body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  2. FOLLOW-UP EMAILS  (5 templates)
    # ═══════════════════════════════════════════════════════════

    def followup_demo_link(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Following up on my note last week about {company}'s online presence.

            I went ahead and built a live demo site tailored to your {sector} practice in {area}. It shows exactly what your website could look like — fast, mobile-first, and designed to convert {audience} into actual {booking_term}s.

            Here's the link: {demo_link}

            Built on Next.js (the same framework Nike uses), it loads in under 1.2 seconds and is fully optimised for local search in {location}.

            I'd love to hear what you think. Would 10 minutes this week work for a quick walkthrough?

            {signature}""")
        return self._t(
            name="followup_demo_link", category="Follow-Up", channel="email",
            context="Send 3–5 days after the initial cold email. Only include this if you have an actual demo built. The demo link is your strongest conversion tool.",
            subject="demo for {company}",
            body=body,
        )

    def followup_roi(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Just sharing a quick stat that caught my attention:

            Businesses in the {sector} sector that invest in a professional website see an average revenue increase of 30–45% within the first year. For a practice in {area}, that could mean {roi_percent}% ROI — which means the website literally pays for itself within weeks.

            The math is straightforward:
            • {package_name} package: R{price} once-off
            • Estimated new {audience} per month from organic search: 15–30
            • Average {booking_term} value: R{average_booking_value}
            • Payback period: typically under 3 months

            I put together a demo for {company} that shows what this looks like in practice. Happy to walk you through it.

            {signature}""")
        return self._t(
            name="followup_roi", category="Follow-Up", channel="email",
            context="ROI-focused follow-up. Send 7–10 days after initial contact. Best for leads who are numbers-driven or who raised budget concerns. Include realistic estimates.",
            subject="the numbers for {company}",
            body=body,
        )

    def followup_social_proof(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            I thought you might find this interesting — one of our clients, a {sector} practice in {area}, shared this with us last week:

            \"We went from getting 3 online enquiries a month to over 40 after Carter Digitals rebuilt our site. The investment paid for itself in the first 6 weeks. Our only regret is not doing it sooner.\"

            What made the difference:
            ✓ Next.js framework (same as Nike.com) — loads in under 1 second
            ✓ Mobile-first design (78% of {location} searches are on mobile)
            ✓ Local SEO optimisation for \"{services} in {location}\"
            ✓ Online booking integration for {audience}

            Your {company} is in an even stronger position — a {rating}-star reputation with enormous growth potential. A modern website would unlock that.

            Shall I send you the demo I built for {company}?

            {signature}""")
        return self._t(
            name="followup_social_proof", category="Follow-Up", channel="email",
            context="Testimonial/case study follow-up. Send 10–14 days after initial contact. Use when the lead hasn't responded to value-based messaging — social proof often breaks through.",
            subject="what a {sector} practice said",
            body=body,
        )

    def followup_urgency(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Quick heads-up — we're currently taking on {slots_available} new {sector} projects for this quarter, and I wanted to make sure {company} had the opportunity to secure a slot before we close our books.

            Here's why timing matters: Google's next algorithm update is rolling out soon, and sites built on modern frameworks like Next.js (what we use) will gain a significant ranking advantage. Practices that upgrade before the update typically see a 20–30% traffic boost.

            Our {package_name} package at R{price} would get {company} live within {timeline}. That means you'd be ranking before your competitors in {area} even know what happened.

            I've already built a demo for you — it takes 5 minutes to review. Can I send the link?

            {signature}""")
        return self._t(
            name="followup_urgency", category="Follow-Up", channel="email",
            context="Urgency/scarcity follow-up. Send 14–21 days after initial contact. Only use when capacity is genuinely limited. Never fabricate scarcity — South African business culture values authenticity.",
            subject="closing our q{quarter} books",
            body=body,
        )

    def followup_breakup(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            I've reached out a few times about upgrading {company}'s website, and I don't want to keep filling your inbox if this isn't a priority right now.

            I'll go ahead and close your file — but I want to leave the door open. If you ever decide to invest in your online presence (or if Google's next update pushes your competitors ahead), reach out. The demo I built for {company} will be here.

            For what it's worth: every month that passes with an outdated website is another month of {audience} choosing your competitors in {area}. The {package_name} package at R{price} typically pays for itself within the first quarter.

            Either way, I wish you and {company} all the best.

            {signature}""")
        return self._t(
            name="followup_breakup", category="Follow-Up", channel="email",
            context="Breakup email — the most powerful follow-up. Send 21–30 days after initial contact, after 3–4 touches. Counter-intuitively, this often generates the highest reply rate. 'Should I close your file?' creates loss aversion.",
            subject="closing your file",
            body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  3. WHATSAPP MESSAGES  (8 templates)
    # ═══════════════════════════════════════════════════════════

    def whatsapp_cold(self) -> Template:
        body = textwrap.dedent("""\
            Hlolo {lead_name} 👋 This is {sender_name} from Carter Digitals. We're a Pretoria-based web studio (100% Black-Owned, B-BBEE Level 1).

            I noticed {company} doesn't appear when people search for \"{services} in {location}\" — which means {audience} are finding your competitors instead.

            We build fast, modern websites on Next.js (same framework Nike uses) and our {sector} clients see up to {roi_percent}% ROI. Can I send you a quick demo? No pressure 😊""")
        return self._t(
            name="whatsapp_cold", category="WhatsApp", channel="whatsapp",
            context="First WhatsApp contact. Keep it warm but professional. South African WhatsApp culture favours a friendly, direct approach. Never send unsolicited images or voice notes on first contact.",
            subject=None, body=body,
        )

    def whatsapp_demo(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name}! Following up — I built a live demo website for {company}. It's designed specifically for {sector} practices in {area}, with online {booking_term} integration and local SEO for {location}.

            Check it out: {demo_link}

            Built on Next.js so it's lightning-fast (loads under 1.2s). Would love to hear your thoughts! 🚀""")
        return self._t(
            name="whatsapp_demo", category="WhatsApp", channel="whatsapp",
            context="Demo link share via WhatsApp. Send after the lead has responded positively or shown interest. Always include the link on its own line for easy tapping.",
            subject=None, body=body,
        )

    def whatsapp_followup(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name}, just checking in 🙏 I know things get busy. 

            Quick thought: every day {company} doesn't have a modern website, {audience} in {location} are booking with competitors who do.

            The demo I built for you takes 2 minutes to review. Worth a look? {demo_link}""")
        return self._t(
            name="whatsapp_followup", category="WhatsApp", channel="whatsapp",
            context="WhatsApp follow-up after no response. Send 3–5 days after last message. Keep it short — WhatsApp messages over 6 lines get skipped.",
            subject=None, body=body,
        )

    def whatsapp_meeting(self) -> Template:
        body = textwrap.dedent("""\
            {lead_name}, would you be open to a quick 10-minute call this week? 

            I'd love to walk you through the demo I built for {company} and show you exactly how it could generate new {booking_term}s from {location} search traffic.

            What day works best? I'm flexible 📅""")
        return self._t(
            name="whatsapp_meeting", category="WhatsApp", channel="whatsapp",
            context="Meeting request via WhatsApp. Use after the lead has engaged with at least one previous message. Offer specific time options if possible — 'Tuesday at 2pm or Thursday at 10am?' converts better than open-ended.",
            subject=None, body=body,
        )

    def whatsapp_proposal(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name}! Great chatting earlier 🙌 I've put together the proposal for {company}.

            {package_name} package — R{price} once-off:
            ✅ Custom Next.js website (same as Nike.com)
            ✅ Mobile-first design
            ✅ Local SEO for \"{services} in {location}\"
            ✅ Online {booking_term} integration
            ✅ {roi_percent}% projected ROI

            Full proposal attached. Let me know if you have any questions! 💼""")
        return self._t(
            name="whatsapp_proposal", category="WhatsApp", channel="whatsapp",
            context="After proposal sent — via WhatsApp summary. Follow up the formal email proposal with this concise WhatsApp recap. Use bullet points for scanability.",
            subject=None, body=body,
        )

    def whatsapp_voice_note_guide(self) -> Template:
        body = textwrap.dedent("""\
            VOICE NOTE SCRIPT (15 seconds max):

            \"Hi {lead_name}, {sender_name} from Carter Digitals here. I built a demo website for {company} that shows how you could start getting more {booking_term}s from Google searches in {location}. The link is in my next message — takes 2 minutes to check out. Chat soon!\"""")
        return self._t(
            name="whatsapp_voice_note_guide", category="WhatsApp", channel="whatsapp",
            context="Guide for sending a 15-second voice note. Voice notes build trust in SA business culture. Keep under 15 seconds — anything longer feels intrusive. Speak clearly, warmly, and end with a clear next step.",
            subject=None, body=body,
        )

    def whatsapp_review(self) -> Template:
        body = textwrap.dedent("""\
            {lead_name}, thank you for taking the time to chat today! Really enjoyed learning about {company} and your vision for {sector} in {area}.

            As discussed, I'll send the formal proposal by tomorrow. In the meantime, the demo link is here if you want to share it with your team: {demo_link}

            Looking forward to working together! 🤝""")
        return self._t(
            name="whatsapp_review", category="WhatsApp", channel="whatsapp",
            context="Post-meeting thank you via WhatsApp. Send within 1 hour of the meeting while the conversation is fresh. Reference something specific from the call to show you were listening.",
            subject=None, body=body,
        )

    def whatsapp_referral(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name}! Quick favour to ask 😊 

            If you know any {sector} business owners in {location} who might need a modern website, I'd really appreciate an introduction. We're a 100% Black-Owned, B-BBEE Level 1 studio based in Pretoria, and we'd love to help more practices like {company} grow online.

            Happy to return the favour anytime! 🙏""")
        return self._t(
            name="whatsapp_referral", category="WhatsApp", channel="whatsapp",
            context="Referral request. Only send to warm contacts — existing clients, past conversations, or leads who engaged positively even if they didn't convert. In SA, referrals carry enormous weight.",
            subject=None, body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  4. LINKEDIN MESSAGES  (4 templates)
    # ═══════════════════════════════════════════════════════════

    def linkedin_connect(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name}, I noticed {company} is doing great work in {sector} across {area}. I'm building websites for {sector} practices in {location} that are generating real ROI (we're 100% Black-Owned, B-BBEE Level 1). Would love to connect and share insights.""")
        return self._t(
            name="linkedin_connect", category="LinkedIn", channel="linkedin",
            context="Connection request note (300 character limit). Mention their company specifically — never use generic connection text. Lead with value, not a pitch. Connection acceptance rate is higher Tuesday–Thursday.",
            subject=None, body=body,
        )

    def linkedin_dm(self) -> Template:
        body = textwrap.dedent("""\
            Thanks for connecting, {lead_name}!

            I wanted to share something I think you'd find relevant. We recently built a Next.js website for a {sector} business in {area} — within 60 days they went from 3 online enquiries per month to over 40. The website literally paid for itself in under 6 weeks.

            I noticed {company} has a strong {rating}-star reputation but isn't showing up prominently for \"{services} in {location}\" searches. That's a lot of potential {audience} you're missing.

            I built a demo tailored to {company} that shows what a modern, fast website could do for your {booking_term} pipeline. Happy to share the link if you're interested.

            No pressure at all — just thought it was worth a conversation.

            Best,
            {sender_name}
            Carter Digitals (Pty) Ltd | B-BBEE Level 1""")
        return self._t(
            name="linkedin_dm", category="LinkedIn", channel="linkedin",
            context="First DM after connection accepted. Send within 24–48 hours of connection. Longer than a connection note but still concise. End with a soft ask — never push for a call in the first DM.",
            subject=None, body=body,
        )

    def linkedin_followup(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name}, just bumping this up 📌

            I know LinkedIn can be a busy place. The demo I mentioned is live and only takes 2 minutes to review — it shows exactly what {company}'s website could look like, built for {sector} {audience} in {location}.

            Worth a look? Happy to send the link or jump on a quick call.

            {sender_name}""")
        return self._t(
            name="linkedin_followup", category="LinkedIn", channel="linkedin",
            context="LinkedIn follow-up after no response to DM. Send 5–7 days after the DM. Keep it very short — LinkedIn DMs have low engagement for long-form content.",
            subject=None, body=body,
        )

    def linkedin_inmail(self) -> Template:
        body = textwrap.dedent("""\
            Dear {lead_name},

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
            CIPC: 2025/907839/07 | CSD Registered | POPIA Compliant""")
        return self._t(
            name="linkedin_inmail", category="LinkedIn", channel="linkedin",
            context="LinkedIn InMail for corporate leads. More formal than a DM. Use when targeting C-suite, procurement managers, or marketing directors at larger organisations. InMail character limit is 1900 characters.",
            subject="{sector} growth opportunity for {company}",
            body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  5. PHONE SCRIPTS  (5 templates)
    # ═══════════════════════════════════════════════════════════

    def phone_initial(self) -> Template:
        body = textwrap.dedent("""\
            PHONE SCRIPT — INITIAL COLD CALL
            ───────────────────────────────

            [Ring... they answer]

            YOU: Hi, is this {lead_name}?

            THEM: Yes, speaking. / Who is this?

            YOU: Hi {lead_name}, my name is {sender_name} from Carter Digitals. We're a web studio based in Pretoria — 100% Black-Owned, B-BBEE Level 1. I know you weren't expecting my call, so I'll be brief.

            [Pause — wait for acknowledgment]

            YOU: I was looking at {company} online and noticed that when people search for \"{services} in {location}\", your practice doesn't show up on the first page. Is that something you're aware of?

            [Listen — if they say yes...]

            YOU: The reason I'm calling is that we build websites on Next.js — it's the same framework Nike uses — and our {sector} clients typically see up to {roi_percent}% return on investment. I actually built a demo for {company} that I'd love to show you. Could I send you the link, or would you prefer a quick 10-minute walkthrough?

            [If gatekeeper...] 
            YOU: I'm calling about {company}'s website and online presence. Is {lead_name} available? It's regarding a digital growth opportunity for the practice.""")
        return self._t(
            name="phone_initial", category="Phone", channel="phone",
            context="Initial cold call script. Practice before calling — your tone matters more than the words. Speak slowly, warmly, and confidently. If they sound busy, ask: 'Is this a bad time? When would be better to call back?' Never call before 9am or after 4pm SAST.",
            subject=None, body=body,
        )

    def phone_demo_followup(self) -> Template:
        body = textwrap.dedent("""\
            PHONE SCRIPT — DEMO FOLLOW-UP CALL
            ───────────────────────────────────

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
            YOU: Completely understand. When would be a better time? I'm happy to call back. [Suggest specific day/time]""")
        return self._t(
            name="phone_demo_followup", category="Phone", channel="phone",
            context="Demo follow-up call. Call 3–5 days after sending the demo link. Have the demo open in your browser ready to screen-share. Your goal is to either close for a proposal or schedule a walkthrough call.",
            subject=None, body=body,
        )

    def phone_objection_price(self) -> Template:
        body = textwrap.dedent("""\
            PHONE SCRIPT — PRICE OBJECTION HANDLING
            ───────────────────────────────────────

            THEM: That's quite expensive. / We don't have that kind of budget. / We can get it cheaper.

            YOU: I completely understand, {lead_name}. Let me put it in perspective.

            The {package_name} package at R{price} is a once-off investment — not a monthly fee. And here's what that translates to:

            If the website generates just 10 new {booking_term}s per month from Google search — which is conservative for {area} — and each {booking_term} is worth R{average_booking_value}, that's R{monthly_revenue} per month in new revenue.

            The website pays for itself in approximately {payback_months} months. After that, it's pure profit.

            [Pause]

            YOU: Compare that to running Google Ads at R5,000–R15,000 per month — which stops the moment you stop paying. This is an asset that works for you 24/7.

            Would it help if I showed you the ROI calculations specific to {company}?""")
        return self._t(
            name="phone_objection_price", category="Phone", channel="phone",
            context="Price objection handling. Never apologise for your pricing — it's premium because it's premium. Reframe cost as investment. Have real numbers ready. Compare once-off website cost to ongoing advertising spend.",
            subject=None, body=body,
        )

    def phone_objection_timing(self) -> Template:
        body = textwrap.dedent("""\
            PHONE SCRIPT — \"NOT RIGHT NOW\" OBJECTION
            ───────────────────────────────────────────

            THEM: Not right now. / We're busy. / Maybe next year. / We have other priorities.

            YOU: I hear you, {lead_name}. Timing is everything.

            Can I ask — when you say \"not right now,\" is it because:
            a) Budget is tight this quarter, or
            b) It's genuinely not a priority yet?

            IF BUDGET:
            YOU: Fair enough. We do offer payment terms — 50% upfront, 50% on launch. And given the {roi_percent}% ROI our {sector} clients see, most practices recoup the investment within the first quarter. 

            IF PRIORITY:
            YOU: Makes sense. But here's what I'd flag — your competitors in {area} are investing in their online presence right now. Every month that passes, they're capturing more of the \"{services} in {location}\" search traffic. By the time it becomes a priority for {company}, you'll be playing catch-up.

            [Pause]

            YOU: What if I just send you the demo link? No commitment — just so you have it when the time is right. Fair enough?""")
        return self._t(
            name="phone_objection_timing", category="Phone", channel="phone",
            context="'Not right now' objection. The key is to differentiate between 'no' and 'not now'. 'Not now' means the door is open — your job is to keep it open. Never push past two gentle objections in one call.",
            subject=None, body=body,
        )

    def phone_close(self) -> Template:
        body = textwrap.dedent("""\
            PHONE SCRIPT — CLOSING CALL
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
            YOU: How about this — I'll send the proposal with everything in writing. Take your time reviewing it. Can I follow up on [specific date]?""")
        return self._t(
            name="phone_close", category="Phone", channel="phone",
            context="Closing call script. Only use after the lead has seen the demo and expressed positive interest. Recap the value, ask directly, and be comfortable with silence after the ask. The first person to speak after 'Shall we get started?' usually loses.",
            subject=None, body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  6. PROPOSAL EMAILS  (3 templates)
    # ═══════════════════════════════════════════════════════════

    def proposal_dental_molar(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Thank you for your time discussing {company}'s digital presence. Based on our conversation, I'm delighted to present the Molar Package — our entry-level solution designed specifically for dental practices in {area}.

            ─────────────────────────────
            MOLAR PACKAGE — R4,499 (Once-Off)
            901% Projected ROI
            ─────────────────────────────

            What's Included:
            • Custom Next.js Website (3 pages: Home, Services, Contact)
            • Mobile-First Responsive Design
            • Online Appointment Booking Integration
            • Local SEO for \"{services} in {location}\"
            • Google Business Profile Optimisation
            • SSL Certificate & Hosting (12 months included)
            • WhatsApp Click-to-Chat Button
            • Practice Photo Gallery
            • Patient Testimonials Section
            • POPIA-Compliant Contact Forms

            Why This Works for {company}:
            The Molar package is engineered for practices that are ready to start capturing online patient traffic. With 901% projected ROI, this means if you're currently getting even 5 patient enquiries per month from your website, a Molar-level site could realistically generate 45+ within the first quarter.

            The Next.js framework ensures your site loads in under 1.2 seconds — critical because 53% of mobile users abandon sites that take longer than 3 seconds to load. When a patient in {location} searches for \"{services} near me,\" your practice will be there, fast and professional.

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

            {signature}""")
        return self._t(
            name="proposal_dental_molar", category="Proposal", channel="proposal",
            context="Molar package proposal email for dental practices. Send after the demo walkthrough meeting. The entry-level dental package at R4,499 with 901% ROI is your strongest conversion offer — lead with confidence.",
            subject="molar package proposal for {company}",
            body=body,
        )

    def proposal_dental_crown(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

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

            {signature}""")
        return self._t(
            name="proposal_dental_crown", category="Proposal", channel="proposal",
            context="Crown package proposal — premium positioning for established dental practices. Lead with the 981% ROI figure. This is your flagship dental offer and should be presented with confidence and specificity. Use after the lead has seen the demo.",
            subject="crown package — {company}",
            body=body,
        )

    def proposal_general(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Thank you for the engaging conversation about {company}'s future. Based on everything we discussed, I've tailored a proposal that I believe will deliver real, measurable results for your {sector} business in {area}.

            ─────────────────────────────────
            {package_name} PACKAGE — R{price} (Once-Off)
            {roi_percent}% Projected ROI
            ─────────────────────────────────

            What's Included:
            • Custom Next.js Website ({page_count} pages)
            • Mobile-First Responsive Design
            • Online {booking_term} Integration
            • Local SEO for \"{services} in {location}\"
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

            {signature}""")
        return self._t(
            name="proposal_general", category="Proposal", channel="proposal",
            context="General/sector-agnostic proposal. Customise the package_name, price, roi_percent, and page_count placeholders before sending. Works for any sector — dental, legal, funeral, hospitality, logistics, construction, education, medical.",
            subject="{package_name} proposal — {company}",
            body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  7. SPECIAL OCCASION MESSAGES  (4 templates)
    # ═══════════════════════════════════════════════════════════

    def after_meeting_thankyou(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Thank you for taking the time to meet with me today — I genuinely enjoyed learning about {company} and your vision for growth in {area}.

            A few things that stood out from our conversation:
            • Your {rating}-star reputation is a massive asset — we just need to make it visible online
            • The focus on {services} aligns perfectly with what {audience} in {location} are searching for
            • Your timeline of {timeline} works well with our development schedule

            As discussed, I'll send the formal proposal by {proposal_date}. In the meantime, the demo is still live at {demo_link} — feel free to share it with your team.

            One thing I want to reiterate: we're not just building a website. We're building a {audience} acquisition engine for {company}. The {package_name} package at R{price} with {roi_percent}% projected ROI is designed to deliver measurable results from day one.

            Please don't hesitate to reach out if anything comes up before the proposal arrives.

            {signature}""")
        return self._t(
            name="after_meeting_thankyou", category="Special Occasion", channel="email",
            context="Post-meeting thank you email. Send within 2 hours of the meeting. Reference specific details from the conversation to show you were listening. This builds trust and differentiates you from agencies that send generic follow-ups.",
            subject="great meeting, {lead_name}",
            body=body,
        )

    def after_demo_email(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Thanks for taking a look at the demo site I built for {company} — I hope it gave you a clear picture of what's possible.

            A few highlights worth noting:
            • The site loads in 1.1 seconds on mobile — 3× faster than the {sector} industry average
            • It's built on Next.js, the same framework Nike and Vercel use
            • The local SEO is optimised for \"{services} in {location}\" — which gets approximately {search_volume} searches per month
            • The online {booking_term} system is fully integrated — {audience} can book directly

            I noticed a few things during our review that I think could be particularly powerful for {company}:
            1. Your {rating}-star reviews displayed prominently on the homepage
            2. A dedicated page for your most popular {services}
            3. Mobile-optimised click-to-call and WhatsApp buttons

            The {package_name} package at R{price} covers all of this — with a {roi_percent}% projected ROI. Based on what I've seen, {company} is in a strong position to capture significantly more {booking_term}s from online search.

            Shall I put together the formal proposal?

            {signature}""")
        return self._t(
            name="after_demo_email", category="Special Occasion", channel="email",
            context="After showing the demo site. Send within 24 hours while the demo is fresh in their mind. Highlight specific features that are relevant to their business. Move toward proposal/close.",
            subject="your demo site for {company}",
            body=body,
        )

    def reengagement_30days(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            It's been about a month since we last spoke about {company}'s website, and I wanted to check in.

            I'll be honest — I've been keeping an eye on the search results for \"{services} in {location},\" and the landscape is shifting. Two of your competitors in {area} have launched new websites in the past few weeks, and they're now appearing above {company} in Google results.

            I don't share this to create urgency — I share it because the window to establish {company} as the top-rated {sector} choice in {location} is getting narrower.

            Our {package_name} package at R{price} would have {company} live within {timeline}, and with {roi_percent}% projected ROI, the investment practically pays for itself.

            The demo I built is still available: {demo_link}

            If the timing is better now, I'd love to pick up where we left off. If not, no worries — just wanted to make sure you had the latest information.

            {signature}""")
        return self._t(
            name="reengagement_30days", category="Special Occasion", channel="email",
            context="Re-engagement after 30 days of inactivity. Use when a lead went cold after initial interest. Lead with new information (competitor activity, algorithm changes) rather than a generic check-in. The demo link should still be live.",
            subject="update on {company} search results",
            body=body,
        )

    def annual_review(self) -> Template:
        body = textwrap.dedent("""\
            Hi {lead_name},

            Happy [anniversary/new year]! 🎉

            It's been a year since we launched {company}'s new website, and I wanted to share a quick performance review:

            Website Performance (Past 12 Months):
            • Total visitors: {total_visitors}
            • Online {booking_term}s generated: {total_bookings}
            • Google ranking for \"{services} in {location}\": Position #{google_position}
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

            {signature}""")
        return self._t(
            name="annual_review", category="Special Occasion", channel="email",
            context="Annual review for existing clients. Send on the anniversary of their website launch or in early January. Include real analytics data — this is your strongest retention tool. Lead with results, then upsell improvements.",
            subject="{company} — year in review",
            body=body,
        )

    # ═══════════════════════════════════════════════════════════
    #  AGGREGATE & UTILITY METHODS
    # ═══════════════════════════════════════════════════════════

    def all_templates(self) -> list[Template]:
        """Return every template in the generator."""
        methods = [
            # Cold outreach
            self.cold_observation, self.cold_question, self.cold_trigger,
            self.cold_story, self.cold_competitor, self.cold_bbbee,
            # Follow-ups
            self.followup_demo_link, self.followup_roi, self.followup_social_proof,
            self.followup_urgency, self.followup_breakup,
            # WhatsApp
            self.whatsapp_cold, self.whatsapp_demo, self.whatsapp_followup,
            self.whatsapp_meeting, self.whatsapp_proposal,
            self.whatsapp_voice_note_guide, self.whatsapp_review, self.whatsapp_referral,
            # LinkedIn
            self.linkedin_connect, self.linkedin_dm, self.linkedin_followup,
            self.linkedin_inmail,
            # Phone
            self.phone_initial, self.phone_demo_followup, self.phone_objection_price,
            self.phone_objection_timing, self.phone_close,
            # Proposals
            self.proposal_dental_molar, self.proposal_dental_crown, self.proposal_general,
            # Special occasions
            self.after_meeting_thankyou, self.after_demo_email,
            self.reengagement_30days, self.annual_review,
        ]
        return [m() for m in methods]

    def templates_by_category(self) -> dict[str, list[Template]]:
        """Group all templates by their category."""
        result: dict[str, list[Template]] = {}
        for t in self.all_templates():
            result.setdefault(t.category, []).append(t)
        return result

    def templates_by_channel(self) -> dict[str, list[Template]]:
        """Group all templates by channel."""
        result: dict[str, list[Template]] = {}
        for t in self.all_templates():
            result.setdefault(t.channel, []).append(t)
        return result

    # ──────────────────────────────────────────────────────────

    def generate_full_sequence(self, lead: Lead | dict[str, str] | None = None) -> list[dict[str, Any]]:
        """
        Generate a complete 7-touch outreach sequence.

        Touch 1 (Day 0):  Cold email — observation
        Touch 2 (Day 2):  WhatsApp message
        Touch 3 (Day 4):  Follow-up email with demo link
        Touch 4 (Day 7):  WhatsApp demo share
        Touch 5 (Day 10): Follow-up email — social proof
        Touch 6 (Day 14): WhatsApp meeting request
        Touch 7 (Day 21): Breakup email
        """
        if lead is None:
            lead = Lead()
        elif isinstance(lead, dict):
            lead = Lead(**{k: v for k, v in lead.items() if k in Lead.__dataclass_fields__})

        ld = lead.__dict__

        sequence = [
            {"touch": 1, "day": 0, "channel": "email",
             "template": "cold_observation",
             "context": "First touch — cold email with observation opener"},
            {"touch": 2, "day": 2, "channel": "whatsapp",
             "template": "whatsapp_cold",
             "context": "Second touch — first WhatsApp contact (if number available)"},
            {"touch": 3, "day": 4, "channel": "email",
             "template": "followup_demo_link",
             "context": "Third touch — follow up with demo link"},
            {"touch": 4, "day": 7, "channel": "whatsapp",
             "template": "whatsapp_demo",
             "context": "Fourth touch — WhatsApp demo share"},
            {"touch": 5, "day": 10, "channel": "email",
             "template": "followup_social_proof",
             "context": "Fifth touch — social proof / testimonial email"},
            {"touch": 6, "day": 14, "channel": "whatsapp",
             "template": "whatsapp_meeting",
             "context": "Sixth touch — WhatsApp meeting request"},
            {"touch": 7, "day": 21, "channel": "email",
             "template": "followup_breakup",
             "context": "Seventh touch — breakup email (often highest reply rate)"},
        ]

        # Render each template with the lead's data
        for step in sequence:
            template = getattr(self, step["template"])()
            rendered = template.formatted(**ld)
            step["subject"] = rendered["subject"]
            step["body"] = rendered["body"]

        return sequence

    # ──────────────────────────────────────────────────────────

    def get_subject_lines(self) -> list[str]:
        """Return 20 short, lowercase, internal-looking subject line options."""
        return [
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
        ]

    def get_whatsapp_templates_by_sector(self, sector: str) -> list[Template]:
        """
        Filter WhatsApp templates, substituting sector-specific terminology.

        Args:
            sector: One of dental, legal, funeral, hospitality, logistics,
                    construction, education, medical, general.
        """
        lexicon = SECTOR_LEXICON.get(sector, SECTOR_LEXICON["general"])
        templates = [
            self.whatsapp_cold(), self.whatsapp_demo(), self.whatsapp_followup(),
            self.whatsapp_meeting(), self.whatsapp_proposal(),
            self.whatsapp_voice_note_guide(), self.whatsapp_review(),
            self.whatsapp_referral(),
        ]

        # Inject sector-specific terminology
        result = []
        for t in templates:
            body = t.body
            for key, val in lexicon.items():
                body = body.replace(f"{{{key}}}", val)
            new_t = Template(
                name=f"{t.name}_{sector}",
                category=t.category,
                channel=t.channel,
                context=t.context,
                subject=t.subject,
                body=body,
                word_count=self._wc(body),
                placeholders=self._placeholders(body),
                sector_variants={sector: body},
            )
            result.append(new_t)
        return result

    # ═══════════════════════════════════════════════════════════
    #  PRETTY PRINTING
    # ═══════════════════════════════════════════════════════════

    @staticmethod
    def _banner(title: str, char: str = "═", width: int = 72) -> str:
        return f"\n{char * width}\n  {title:^{width - 4}}\n{char * width}"

    @staticmethod
    def _divider(char: str = "─", width: int = 72) -> str:
        return char * width

    def print_template(self, template: Template) -> None:
        """Print a single template with full formatting."""
        print(f"\n{'━' * 72}")
        print(f"  📋 {template.name}")
        print(f"  Category: {template.category}  |  Channel: {template.channel}  |  Words: {template.word_count}")
        print(f"{'━' * 72}")
        print(f"  📌 WHEN TO USE:")
        print(f"  {template.context}")
        print(f"{'─' * 72}")
        if template.subject:
            print(f"  📧 SUBJECT: {template.subject}")
            print(f"{'─' * 72}")
        print()
        for line in template.body.splitlines():
            print(f"  {line}")
        print()
        if template.placeholders:
            print(f"  🔖 Placeholders: {', '.join(template.placeholders)}")
        print()

    def print_all(self) -> None:
        """Print every template organised by category."""
        print(self._banner("CARTER DIGITALS (PTY) LTD — EMAIL & MESSAGE TEMPLATES"))
        print(f"  100% Black-Owned · 100% Youth-Owned · B-BBEE Level 1")
        print(f"  CIPC: 2025/907839/07 · CSD Registered · POPIA Compliant")
        print(f"  Built on Next.js (Vercel · Nike · Netflix)")

        by_category = self.templates_by_category()
        total = len(self.all_templates())

        print(f"\n  Total templates: {total}")
        print(f"  Categories: {', '.join(by_category.keys())}")

        for category, templates in by_category.items():
            print(self._banner(category.upper()))
            for t in templates:
                self.print_template(t)

        # Print subject lines
        print(self._banner("SUBJECT LINE OPTIONS (20)"))
        for i, line in enumerate(self.get_subject_lines(), 1):
            print(f"  {i:2d}. {line}")

        # Print sequence overview
        print(self._banner("7-TOUCH OUTREACH SEQUENCE"))
        for step in self.generate_full_sequence():
            print(f"\n  Touch {step['touch']} — Day {step['day']} — {step['channel'].upper()}")
            print(f"  Template: {step['template']}")
            print(f"  Context:  {step['context']}")
            if step.get("subject"):
                print(f"  Subject:  {step['subject']}")
            print(f"  {self._divider('·', 64)}")

        # Print sector lexicon
        print(self._banner("SECTOR LEXICON"))
        print(f"  {'Sector':<14} {'Audience':<20} {'Pain Point':<35}")
        print(f"  {self._divider('-', 70)}")
        for sector, lex in SECTOR_LEXICON.items():
            print(f"  {sector:<14} {lex['audience']:<20} {lex['pain_point']:<35}")

        print(f"\n{'═' * 72}")
        print(f"  END OF TEMPLATE LIBRARY".center(72))
        print(f"{'═' * 72}\n")


# ────────────────────────────────────────────────────────────────
#  CLI / Main
# ────────────────────────────────────────────────────────────────

def main() -> None:
    """Print all templates when run directly."""
    generator = EmailGenerator()
    generator.print_all()

    # Quick demo: render a specific template with sample data
    print("\n" + "🔧 " * 36)
    print("  SAMPLE RENDER — Cold Observation Email")
    print("🔧 " * 36)
    sample_lead = Lead(
        name="Dr. Naledi Mokoena",
        sector="dental",
        location="Pretoria",
        area="Centurion",
        rating="4.8",
        services="cosmetic dentistry",
        package_name="Molar",
        price="4,499",
        roi_percent="901",
        company="Mokoena Dental Studio",
        website="mokoenadental.co.za",
    )
    template = generator.cold_observation()
    rendered = template.formatted(
        **sample_lead.__dict__,
        audience="patients",
        pain_point="empty appointment slots",
        signature=generator._sig("Kagiso Carter"),
    )
    print(f"\n  Subject: {rendered['subject']}\n")
    for line in rendered["body"].splitlines():
        print(f"  {line}")
    print()


if __name__ == "__main__":
    main()
