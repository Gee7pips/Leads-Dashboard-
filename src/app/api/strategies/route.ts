import { NextResponse } from 'next/server'

export async function GET() {
  const strategies = [
    {
      id: 'speed-to-lead',
      category: 'Speed-to-Lead',
      icon: 'Zap',
      title: 'Contact Within 5 Minutes',
      description:
        'Speed-to-lead is the #1 conversion factor. Contacting a lead within 5 minutes makes you 21x more likely to qualify them. After 30 minutes, conversion drops 10x. After 24 hours, the lead is effectively cold.',
      keyInsight: '5 min response = 21x qualification rate',
      actionableSteps: [
        'Set up instant notifications for new leads via WhatsApp/email',
        'Prepare a lead response template for each sector',
        'Use WhatsApp as first contact method (highest response rate in SA)',
        'Follow up missed calls within 15 minutes',
        'Track response time as a KPI',
      ],
    },
    {
      id: 'protolead-method',
      category: 'ProtoLead Method',
      icon: 'Rocket',
      title: 'Build → Call → WhatsApp → Visit → Close',
      description:
        'The ProtoLead Method is our proprietary outreach framework. Build a demo site first, then use it as a conversation starter. This shifts the dynamic from selling to demonstrating value.',
      keyInsight: 'Demo-first approach eliminates the "cold call" barrier',
      actionableSteps: [
        'Identify Tier 1 leads (4.7-5.0★ rating) for ProtoLead treatment',
        'Build a tailored demo site in 1-2 days (use sector templates)',
        'Initial phone call: "I built something for your practice" — no pitch',
        'WhatsApp follow-up with demo link + 15-second voice note',
        'In-person visit for Tier 1 leads with printed mockup/brochure',
        'Close with 50% deposit (R2,000-R8,500 upfront)',
      ],
    },
    {
      id: 'cold-email-frameworks',
      category: 'Cold Email Frameworks',
      icon: 'Mail',
      title: 'Observation → Problem → Proof → Ask',
      description:
        'Every sentence must earn its place. Lead with their world, not yours. Use interest-based CTAs that beat meeting requests. Subject lines should be 2-4 words, lowercase, internal-looking.',
      keyInsight: 'Interest-based CTAs outperform meeting requests by 3x',
      actionableSteps: [
        'Observation: "I noticed [specific detail about their business]"',
        'Problem: "Most [sector] practices in [area] are invisible to online searches"',
        'Proof: "We helped [similar business] get 8-15 new enquiries/month"',
        'Ask: "Mind if I send a 2-minute video showing what yours could look like?"',
        'Follow up 3-5 times with increasing gaps (Day 1, 3, 7, 14, 21)',
        'Never use "Just checking in" — each follow-up adds something new',
      ],
    },
    {
      id: 'lead-scoring',
      category: 'Lead Scoring',
      icon: 'Star',
      title: 'Tier 1 (4.7-5.0★) = ProtoLead Demo First',
      description:
        'Not all leads are equal. Tier 1 leads with high Google ratings are proven businesses with existing customers — they just need a digital home. Prioritize resources accordingly.',
      keyInsight: 'Tier 1 = HIGH PRIORITY | Tier 2 = SOLID | Tier 3 = EMERGING',
      actionableSteps: [
        'Tier 1 (4.7-5.0★): Build ProtoLead demo first, call second, visit third',
        'Tier 2 (4.0-4.6★): Direct phone call with tailored pitch, demo on request',
        'Tier 3 (<4.0★): Phone outreach with affordable entry package (Vula/Molar)',
        'Score leads: Rating (30%) + Website quality (20%) + Sector value (20%) + Location (15%) + Response rate (15%)',
        'Review and re-score leads quarterly',
        'Focus 60% of time on Tier 1, 30% on Tier 2, 10% on Tier 3',
      ],
    },
    {
      id: 'objection-handling',
      category: 'Objection Handling',
      icon: 'Shield',
      title: 'Price, Timing, Competition, Status Quo',
      description:
        'Every objection is a buying signal. The prospect is engaged enough to push back. Use the framework: Acknowledge → Reframe → Proof → Ask.',
      keyInsight: 'Loss aversion: "Don\'t miss out" beats "You could gain" by 2x',
      actionableSteps: [
        'Price: "I understand. Let me show you the ROI — our dental clients see 864-981% return"',
        'Timing: "Perfect timing actually — we have a 5-7 day delivery, you could be live in 2 weeks"',
        'Competition: "We\'re 100% Black & Youth-Owned, B-BBEE Level 1 — that\'s 135% procurement recognition"',
        'Status Quo: "Your competitors who went online are getting 5-13 new patients/month you\'re missing"',
        'Technical: "Built on Next.js, the same framework used by Vercel and Nike. 99.9% uptime."',
        'Always end with: "What would make this work for you?"',
      ],
    },
    {
      id: 'follow-up-cadence',
      category: 'Follow-Up Cadence',
      icon: 'Repeat',
      title: '3-5 Touches with Increasing Gaps',
      description:
        'It takes ~7 touchpoints to convert. Each follow-up must add something new — a different angle, fresh proof, or a new insight. Never repeat the same message.',
      keyInsight: 'The Rule of 7: ~7 touchpoints before converting',
      actionableSteps: [
        'Touch 1 (Day 0): Initial outreach (call/WhatsApp/email)',
        'Touch 2 (Day 1): Follow up with demo link or case study',
        'Touch 3 (Day 3): Different angle — ROI stats or competitor insight',
        'Touch 4 (Day 7): Social proof — testimonial from similar business',
        'Touch 5 (Day 14): Breakup email — "Should I close your file?" (often triggers response)',
        'Track every touch in the CRM/Activity log',
      ],
    },
    {
      id: 'roi-calculator',
      category: 'ROI Calculator',
      icon: 'TrendingUp',
      title: 'Show the ROI — Numbers Don\'t Lie',
      description:
        'Our dental clients see 864-981% ROI in Year 1. Use conservative estimates: 5-13 new patients per month from organic search. Payback period is just ~37 days.',
      keyInsight: 'Average payback period: ~37 days',
      actionableSteps: [
        'Molar (R4,499): 5 new patients/mo × R750 = R45,000/yr. ROI: 901%. Payback: 36 days.',
        'Crown (R8,999): 9 new patients/mo × R900 = R97,200/yr. ROI: 981%. Payback: 37 days.',
        'Implant (R16,999): 13 new patients/mo × R1,050 = R163,800/yr. ROI: 864%. Payback: 37 days.',
        'Vula (R3,999): 3 new leads/mo × R500 avg = R18,000/yr. ROI: 450%.',
        'Khula (R7,999): 6 new leads/mo × R800 avg = R57,600/yr. ROI: 720%.',
        'Always frame as: "How much is each lost patient costing you right now?"',
      ],
      pricing: {
        dental: [
          { name: 'Molar', price: 4499, tagline: 'Get found. Get called.', roi: 901, paybackDays: 36 },
          { name: 'Crown', price: 8999, tagline: 'Fill the chair. Own the schedule.', roi: 981, paybackDays: 37, popular: true },
          { name: 'Implant', price: 16999, tagline: 'The full machine. Runs while you sleep.', roi: 864, paybackDays: 37 },
        ],
        general: [
          { name: 'Vula', price: 3999, tagline: 'Get online and start getting calls' },
          { name: 'Khula', price: 7999, tagline: 'Convert visitors into paying clients', popular: true },
          { name: 'Premium', price: 14999, tagline: 'A fully managed digital engine' },
        ],
        school: [
          { name: 'Presenca', price: 4999, tagline: 'Be found and trusted online' },
          { name: 'Ikredibo', price: 9999, tagline: 'Build community trust & enrolment', popular: true },
          { name: 'Isibindi', price: 18999, tagline: 'Full content control + 24/7 AI' },
        ],
      },
    },
    {
      id: 'bbbee-advantage',
      category: 'B-BBEE Advantage',
      icon: 'Award',
      title: 'Leverage Level 1 Status for Government & Corporate',
      description:
        'Carter Digitals is 100% Black & Youth-Owned with B-BBEE Level 1 status. This means 135% procurement recognition. Government departments and corporate clients MUST buy from suppliers like us.',
      keyInsight: 'Level 1 = 135% Procurement Recognition | CSD Registered',
      actionableSteps: [
        'Lead every corporate/government pitch with B-BBEE credentials',
        'Target government tenders requiring B-BBEE Level 1 suppliers',
        'Highlight: CIPC 2025/907839/07, CSD Registered, POPIA Compliant',
        'Use in proposals: "By choosing Carter Digitals, you maximize your B-BBEE scorecard points"',
        'Target sectors with government mandates: Education, Healthcare, Public Infrastructure',
        'Prepare a B-BBEE compliance one-pager for every corporate pitch',
      ],
    },
  ]

  return NextResponse.json(strategies)
}
