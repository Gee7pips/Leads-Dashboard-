'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Flame, DollarSign, Stethoscope, Search, Filter, Eye, Phone, Mail,
  MessageSquare, Calendar, MapPin, Clock, Star, TrendingUp, Zap, Rocket,
  Shield, Award, Repeat, ChevronRight, ChevronLeft, X, Plus, ArrowRight,
  Activity, Target, BarChart3, Globe, CheckCircle2, XCircle, AlertCircle,
  Building2, GraduationCap, Hotel, Truck, HardHat, Gavel, HeartPulse,
  LayoutDashboard, GitBranch, Sparkles, Calculator, ClipboardList, Bell,
  Menu, Copy, RefreshCw, Save, Pencil, Lightbulb, BookOpen, Handshake,
  UserCircle, Send, Crown, Briefcase, ChevronDown, Play, CircleDot,
  ArrowUpRight, ArrowDownRight, Settings, LogOut, Home,
  Download, MailPlus, Timer, MousePointerClick, PieChart as PieChartIcon, type LucideIcon,
  ListChecks, Megaphone, Code2, Palette, Wrench, CheckSquare, TrendingDown,
  FileText, Layers, BarChart2, LineChart as LineChartIcon, Hash, Percent,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
  ResponsiveContainer, FunnelChart, Funnel, LabelList, AreaChart, Area,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend,
  ChartLegendContent, ChartConfig,
} from '@/components/ui/chart'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  RadioGroup, RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  ALL_TEMPLATES, renderTemplate, generateFullSequence,
  getTemplatesForCategory, getTemplatesForChannel,
  type LeadContext, type TemplateResult, type TemplateIndexEntry, type SequenceStep,
} from '@/lib/email-templates'

// ─── Types ───────────────────────────────────────────────────────────
interface LeadActivity {
  id: string; leadId: string; type: string; summary: string; outcome: string
  date: string; createdAt: string; lead?: { id: string; name: string }
}
interface Lead {
  id: string; name: string; sector: string; subSector: string; location: string
  area: string; phone: string; rating: number; tier: number; stage: string
  status: string; source: string; notes: string; address: string; hours: string
  services: string; onlinePresence: string; recommendedPackage: string
  estimatedValue: number; hasWebsite: boolean; lastContact: string | null
  nextAction: string; nextActionDate: string | null; hotLead: boolean
  createdAt: string; updatedAt: string; activities: LeadActivity[]
}
interface DashboardStats {
  totalLeads: number; hotLeads: number; dentalLeads: number; pipelineValue: number
  conversionRate: number; bySector: { sector: string; count: number }[]
  byTier: { tier: string; count: number }[]
  byStage: { stage: string; label: string; count: number }[]
  recentActivities: (LeadActivity & { lead: { id: string; name: string } })[]
  activePipeline: number; wonLeads: number; lostLeads: number
}
type PageId = 'dashboard' | 'leads' | 'pipeline' | 'email' | 'strategies' | 'pricing' | 'analytics' | 'campaigns' | 'kabelo' | 'sihle'

// ─── Constants ───────────────────────────────────────────────────────
const STAGES = ['new','contacted','demo_sent','meeting_booked','proposal_sent','negotiation','won','lost'] as const
const STAGE_LABELS: Record<string,string> = {
  new:'New',contacted:'Contacted',demo_sent:'Demo Sent',meeting_booked:'Meeting Booked',
  proposal_sent:'Proposal Sent',negotiation:'Negotiation',won:'Won',lost:'Lost',
}
const STAGE_COLORS: Record<string,string> = {
  new:'bg-zinc-800 text-zinc-300 border-zinc-700',
  contacted:'bg-sky-950 text-sky-400 border-sky-800',
  demo_sent:'bg-violet-950 text-violet-400 border-violet-800',
  meeting_booked:'bg-amber-950 text-amber-400 border-amber-800',
  proposal_sent:'bg-orange-950 text-orange-400 border-orange-800',
  negotiation:'bg-rose-950 text-rose-400 border-rose-800',
  won:'bg-emerald-950 text-emerald-400 border-emerald-800',
  lost:'bg-red-950 text-red-400 border-red-800',
}
const STAGE_BG_COLORS: Record<string,string> = {
  new:'#52525b',contacted:'#0ea5e9',demo_sent:'#8b5cf6',meeting_booked:'#f59e0b',
  proposal_sent:'#f97316',negotiation:'#f43f5e',won:'#10b981',lost:'#ef4444',
}
const SECTOR_ICONS: Record<string,React.ReactNode> = {
  Dental:<Stethoscope className="h-4 w-4"/>,Legal:<Gavel className="h-4 w-4"/>,
  Funeral:<HeartPulse className="h-4 w-4"/>,Hospitality:<Hotel className="h-4 w-4"/>,
  Logistics:<Truck className="h-4 w-4"/>,Construction:<HardHat className="h-4 w-4"/>,
  Education:<GraduationCap className="h-4 w-4"/>,Medical:<HeartPulse className="h-4 w-4"/>,
}
const SECTOR_COLORS: Record<string,string> = {
  Dental:'#10b981',Legal:'#f59e0b',Funeral:'#ef4444',Hospitality:'#a78bfa',
  Logistics:'#22d3ee',Construction:'#fb923c',Education:'#60a5fa',Medical:'#f472b6',
}
const ACTIVITY_ICONS: Record<string,React.ReactNode> = {
  call:<Phone className="h-3.5 w-3.5"/>,email:<Mail className="h-3.5 w-3.5"/>,
  whatsapp:<MessageSquare className="h-3.5 w-3.5"/>,meeting:<Calendar className="h-3.5 w-3.5"/>,
  proposal:<Target className="h-3.5 w-3.5"/>,demo:<Rocket className="h-3.5 w-3.5"/>,
  note:<AlertCircle className="h-3.5 w-3.5"/>,
}

interface NavSection { label: string; items: { id: PageId; label: string; icon: React.ReactNode; accent?: string }[] }
const NAV_SECTIONS: NavSection[] = [
  { label: 'MAIN', items: [
    { id:'dashboard', label:'Overview', icon:<LayoutDashboard className="h-4 w-4"/> },
    { id:'leads', label:'Leads', icon:<Users className="h-4 w-4"/> },
    { id:'pipeline', label:'Pipeline', icon:<GitBranch className="h-4 w-4"/> },
  ]},
  { label: 'PARTNERS', items: [
    { id:'kabelo', label:'Kabelo', icon:<Code2 className="h-4 w-4"/>, accent:'emerald' },
    { id:'sihle', label:'Sihle', icon:<Megaphone className="h-4 w-4"/>, accent:'amber' },
  ]},
  { label: 'TOOLS', items: [
    { id:'email', label:'Email Generator', icon:<Sparkles className="h-4 w-4"/> },
    { id:'strategies', label:'Strategies', icon:<Target className="h-4 w-4"/> },
    { id:'pricing', label:'Pricing Calc', icon:<Calculator className="h-4 w-4"/> },
  ]},
  { label: 'INSIGHTS', items: [
    { id:'analytics', label:'Analytics', icon:<TrendingUp className="h-4 w-4"/> },
    { id:'campaigns', label:'Campaigns', icon:<ClipboardList className="h-4 w-4"/> },
  ]},
]
const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items)

const PRICING_PACKAGES = {
  dental: [
    { name:'Molar',price:4499,tagline:'Get found. Get called.',roi:901,paybackDays:36,newPatients:5,avgVisit:750 },
    { name:'Crown',price:8999,tagline:'Fill the chair. Own the schedule.',roi:981,paybackDays:37,newPatients:9,avgVisit:900,popular:true },
    { name:'Implant',price:16999,tagline:'The full machine. Runs while you sleep.',roi:864,paybackDays:37,newPatients:13,avgVisit:1050 },
  ],
  general: [
    { name:'Vula',price:3999,tagline:'Get online and start getting calls',newLeads:3,avgValue:500,roi:450 },
    { name:'Khula',price:7999,tagline:'Convert visitors into paying clients',newLeads:6,avgValue:800,roi:720,popular:true },
    { name:'Premium',price:14999,tagline:'A fully managed digital engine',newLeads:12,avgValue:1000,roi:960 },
  ],
  school: [
    { name:'Presenca',price:4999,tagline:'Be found and trusted online' },
    { name:'Ikredibo',price:9999,tagline:'Build community trust & enrolment',popular:true },
    { name:'Isibindi',price:18999,tagline:'Full content control + 24/7 AI' },
  ],
}
const ADD_ONS = [
  { id:'ai-chatbot',name:'AI Chatbot + WhatsApp Automation',desc:'24/7 bot — FAQs, appt capture, after-hours triage',onceOff:4999,monthly:499 },
  { id:'seo-boost',name:'SEO Boost Pack',desc:'5 extra keywords, competitor analysis, backlinks',onceOff:1999,monthly:0 },
  { id:'google-review',name:'Google Review Automation',desc:'Post-visit SMS/WhatsApp review request sequence',onceOff:1499,monthly:149 },
  { id:'social-media',name:'Social Media Starter Pack',desc:'Branded FB + IG setup, 6 content templates',onceOff:2499,monthly:0 },
  { id:'emergency-page',name:'Emergency Landing Page',desc:'Dedicated emergency page, click-to-call, Ads-ready',onceOff:1999,monthly:0 },
  { id:'content-retainer',name:'Monthly Content Retainer',desc:'2 blog posts/mo, social captions, GBP posts',onceOff:0,monthly:699 },
]

const STRATEGIES_DATA = [
  {
    id:'lead-generation',category:'Lead Generation',icon:<Zap className="h-5 w-5"/>,
    strategies:[
      { id:'protolead',title:'ProtoLead Method',difficulty:'Advanced',description:'Build → Call → WhatsApp → Visit → Close. Build a demo site first, then use it as a conversation starter.',keyInsight:'Demo-first approach eliminates the "cold call" barrier',steps:['Identify Tier 1 leads (4.7-5.0★) for ProtoLead treatment','Build tailored demo in 1-2 days using sector templates','Phone call: "I built something for your practice" — no pitch','WhatsApp follow-up with demo link + 15-second voice note','In-person visit for Tier 1 leads with printed mockup/brochure','Close with 50% deposit (R2,000-R8,500 upfront)'] },
      { id:'speed-to-lead',title:'Speed-to-Lead',difficulty:'Intermediate',description:'Contact within 5 minutes makes you 21x more likely to qualify. After 30 min, conversion drops 10x.',keyInsight:'5 min response = 21x qualification rate',steps:['Set up instant notifications for new leads','Prepare lead response templates per sector','Use WhatsApp as first contact method','Follow up missed calls within 15 minutes','Track response time as a KPI'] },
      { id:'lead-scoring',title:'Lead Scoring System',difficulty:'Beginner',description:'Not all leads are equal. Tier 1 leads with high Google ratings are proven businesses that just need a digital home.',keyInsight:'Tier 1 = HIGH PRIORITY | Tier 2 = SOLID | Tier 3 = EMERGING',steps:['Tier 1 (4.7-5.0★): ProtoLead demo first, call second, visit third','Tier 2 (4.0-4.6★): Direct call with tailored pitch, demo on request','Tier 3 (<4.0★): Phone outreach with affordable entry package','Score: Rating 30% + Website 20% + Sector 20% + Location 15% + Response 15%','Focus 60% time on Tier 1, 30% on Tier 2, 10% on Tier 3'] },
      { id:'directory-submissions',title:'Directory Submissions Strategy',difficulty:'Beginner',description:'List businesses on key SA directories (Snupit, Brabys, Yellow Pages, Google Business Profile) to increase visibility.',keyInsight:'GBP + 3 directories = 3x more discoverable within 30 days',steps:['Claim and optimize Google Business Profile first','Submit to Snupit (free + paid options)','Add to Brabys and Yellow Pages SA','Ensure consistent NAP (Name, Address, Phone)','Request reviews on each platform after every job'] },
    ],
  },
  {
    id:'outreach',category:'Outreach & Contact',icon:<Mail className="h-5 w-5"/>,
    strategies:[
      { id:'cold-email',title:'Cold Email Frameworks',difficulty:'Advanced',description:'Four frameworks: Observation → Problem → Proof → Ask | Question → Value → Ask | Trigger → Insight → Ask | Story → Bridge → Ask.',keyInsight:'Interest-based CTAs outperform meeting requests by 3x',steps:['Observation: "I noticed [specific detail]"','Problem: "Most [sector] in [area] are invisible to online searches"','Proof: "We helped [similar business] get 8-15 new enquiries/month"','Ask: "Mind if I send a 2-minute video showing what yours could look like?"','Follow up 3-5 times with increasing gaps (Day 1, 3, 7, 14, 21)','Never use "Just checking in" — each follow-up adds something new'] },
      { id:'whatsapp-outreach',title:'WhatsApp Outreach Templates',difficulty:'Beginner',description:'WhatsApp is the #1 communication tool in South Africa. Use it for initial contact with warm, conversational messages.',keyInsight:'WhatsApp has 95% open rate in SA — far higher than email',steps:['Start with friendly greeting + name reference','Keep under 100 words — scan-friendly','Include one clear question to prompt response','Mention specific benefit relevant to their sector','Attach demo link or short voice note (15 sec max)','Follow up 24-48 hours if no response'] },
      { id:'linkedin-dm',title:'LinkedIn DM Strategy',difficulty:'Intermediate',description:'For B2B and corporate leads. Professional but not stiff. Build connection first, pitch second.',keyInsight:'Personalized connection requests have 3x acceptance rate',steps:['Personalize connection request (find common ground)','Wait for acceptance before sending pitch','Keep DMs under 300 characters','Reference their recent post or company update','Ask for a brief 10-minute chat, not a meeting','Follow up after 1 week with value-add content'] },
      { id:'follow-up-cadence',title:'Follow-Up Cadence (3-5 Touches)',difficulty:'Intermediate',description:'It takes ~7 touchpoints to convert. Each follow-up must add something new — a different angle, fresh proof, or a new insight.',keyInsight:'The Rule of 7: ~7 touchpoints before converting',steps:['Touch 1 (Day 0): Initial outreach (call/WhatsApp/email)','Touch 2 (Day 1): Follow up with demo link or case study','Touch 3 (Day 3): Different angle — ROI stats or competitor insight','Touch 4 (Day 7): Social proof — testimonial from similar business','Touch 5 (Day 14): Breakup email — "Should I close your file?"','Track every touch in the CRM/Activity log'] },
      { id:'phone-scripts',title:'Phone Script Templates',difficulty:'Beginner',description:'Prepared scripts for different scenarios: initial contact, demo follow-up, objection handling, and closing.',keyInsight:'Prepared callers convert 2x more than winging it',steps:['Opening: "Hi, I am Kabelo from Carter Digitals in Pretoria..."','Hook: "I built something I think you would find interesting"','Qualify: "Quick question — do you get patients/clients from Google?"','Value: "Our dental clients see 8-15 new patients/month from their website"','Close: "Would a 2-minute video walkthrough work for you?"','Always get permission before sending anything'] },
    ],
  },
  {
    id:'conversion',category:'Conversion & Closing',icon:<TrendingUp className="h-5 w-5"/>,
    strategies:[
      { id:'objection-handling',title:'Objection Handling',difficulty:'Advanced',description:'Every objection is a buying signal. Use: Acknowledge → Reframe → Proof → Ask.',keyInsight:'Loss aversion: "Don\'t miss out" beats "You could gain" by 2x',steps:['Price: "I understand. Let me show you the ROI — 864-981% return"','Timing: "Perfect timing — 5-7 day delivery, you could be live in 2 weeks"','Competition: "We\'re 100% Black & Youth-Owned, B-BBEE Level 1 — 135% procurement recognition"','Status Quo: "Your competitors who went online are getting 5-13 new patients/month you\'re missing"','Technical: "Built on Next.js, same framework as Vercel and Nike. 99.9% uptime."','Always end with: "What would make this work for you?"'] },
      { id:'roi-demo',title:'ROI Calculator Demo',difficulty:'Intermediate',description:'Our dental clients see 864-981% ROI in Year 1. Use conservative estimates: 5-13 new patients/month from organic search.',keyInsight:'Average payback period: ~37 days',steps:['Molar (R4,499): 5 new patients/mo × R750 = R45,000/yr. ROI: 901%','Crown (R8,999): 9 new patients/mo × R900 = R97,200/yr. ROI: 981%','Implant (R16,999): 13 new patients/mo × R1,050 = R163,800/yr. ROI: 864%','Frame as: "How much is each lost patient costing you right now?"','Show the payback period — most clients break even in ~37 days'] },
      { id:'bbbee-leverage',title:'B-BBEE Advantage Leverage',difficulty:'Intermediate',description:'Carter Digitals is 100% Black & Youth-Owned with B-BBEE Level 1 status. 135% procurement recognition.',keyInsight:'Level 1 = 135% Procurement Recognition | CSD Registered',steps:['Lead every corporate/government pitch with B-BBEE credentials','Target government tenders requiring B-BBEE Level 1 suppliers','Highlight: CIPC 2025/907839/07, CSD Registered, POPIA Compliant','Use in proposals: "Maximize your B-BBEE scorecard points"','Target sectors with government mandates: Education, Healthcare','Prepare B-BBEE compliance one-pager for every corporate pitch'] },
      { id:'demo-tips',title:'Demo/Presentation Tips',difficulty:'Intermediate',description:'How to deliver compelling demos that convert. Show, don\'t tell. Make it personal.',keyInsight:'Personalized demos convert 40% higher than generic ones',steps:['Research the prospect before the demo — know their pain points','Show THEIR business context, not a generic portfolio','Focus on outcomes (new patients, more calls), not features','Keep it under 15 minutes — respect their time','End with a specific next step and timeline','Send follow-up email within 1 hour of the demo'] },
    ],
  },
  {
    id:'retention',category:'Retention & Growth',icon:<Award className="h-5 w-5"/>,
    strategies:[
      { id:'email-sequences',title:'Email Sequence Frameworks',difficulty:'Advanced',description:'Welcome (5-7 emails, 12-14 days), Lead Nurture (6-8 emails, 2-3 weeks), Re-Engagement (3-4 emails, 2 weeks).',keyInsight:'Welcome sequences have 50% higher open rates than standalone emails',steps:['Welcome Email 1 (Immediate): Delivery confirmation + quick win','Welcome Email 2 (Day 1): Your story + why you built this','Welcome Email 3 (Day 3): Social proof + case study','Welcome Email 4 (Day 5): Overcome biggest objection','Nurture: Lead magnet → Problem deep-dive → Solution → Case study → Offer','Re-engagement (30-60 days inactive): "We miss you" + special offer'] },
      { id:'upsell-strategies',title:'Upsell Strategies',difficulty:'Intermediate',description:'Add-ons and retainers to increase client lifetime value. Start with the relationship, upsell after results.',keyInsight:'Existing clients are 5x easier to sell to than new ones',steps:['Wait 30-60 days after launch before upselling','Show results first — "Your site got 500 views this month"','Offer SEO Boost as natural next step','Suggest monthly retainer for ongoing support','Bundle add-ons: "Add chatbot + review automation for R6,498 (save R1,000)"','Annual plan incentive: 2 months free on yearly retainer'] },
      { id:'referral-program',title:'Referral Program',difficulty:'Beginner',description:'Turn satisfied clients into referral sources. Word-of-mouth is the highest-converting channel.',keyInsight:'Referred leads convert 4x faster and spend 2x more',steps:['Ask for referrals 30 days after successful launch','Make it easy: "Know anyone who needs a website? I will give them a free demo"','Offer incentive: R500 off their next renewal for each referral','Create referral card/one-pager clients can share','Thank referrers publicly (with permission)','Track referral sources in CRM'] },
      { id:'health-score',title:'Health Score Model',difficulty:'Advanced',description:'Track client health: Login freq (×0.30) + Feature usage (×0.25) + Support sentiment (×0.15) + Billing (×0.15) + Engagement (×0.15).',keyInsight:'80-100: Healthy (upsell) | 60-79: Monitor | 40-59: At risk | 0-39: Critical',steps:['Track Google Analytics monthly traffic for each client','Monitor review growth (new reviews/month)','Check for broken links or downtime','Send quarterly health report to clients','Proactively contact clients with dropping metrics','Schedule annual website refresh meeting'] },
    ],
  },
]

// ─── Utility Functions ───────────────────────────────────────────────
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',minimumFractionDigits:0,maximumFractionDigits:0}).format(value)
}
function formatDate(dateStr: string|null): string {
  if(!dateStr)return'N/A'
  return new Date(dateStr).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})
}
function formatRelativeDate(dateStr: string): string {
  const d=Math.floor((Date.now()-new Date(dateStr).getTime())/(1000*60*60*24))
  if(d===0)return'Today';if(d===1)return'Yesterday';if(d<7)return`${d} days ago`;return formatDate(dateStr)
}
function leadToContext(lead: Lead): LeadContext {
  return {
    name: lead.name, sector: lead.sector, subSector: lead.subSector,
    location: lead.location, area: lead.area, rating: lead.rating,
    tier: lead.tier, services: lead.services, recommendedPackage: lead.recommendedPackage,
    estimatedValue: lead.estimatedValue, phone: lead.phone,
    onlinePresence: lead.onlinePresence, notes: lead.notes,
  }
}

function ChannelBadge({ channel }: { channel: string }) {
  const styles: Record<string, string> = {
    email: 'bg-sky-950 text-sky-400 border-sky-800',
    whatsapp: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    linkedin: 'bg-violet-950 text-violet-400 border-violet-800',
    phone: 'bg-amber-950 text-amber-400 border-amber-800',
  }
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="h-3 w-3"/>,
    whatsapp: <MessageSquare className="h-3 w-3"/>,
    linkedin: <UserCircle className="h-3 w-3"/>,
    phone: <Phone className="h-3 w-3"/>,
  }
  return <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${styles[channel]||'bg-zinc-800 text-zinc-400'}`}>{icons[channel]}{channel.charAt(0).toUpperCase()+channel.slice(1)}</Badge>
}

// ─── Animated Count Hook ─────────────────────────────────────────────
function useAnimatedCount(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])
  return count
}

// ─── Small Components ────────────────────────────────────────────────
function TierBadge({ tier }: { tier: number }) {
  const c={1:'bg-emerald-950 text-emerald-400 border-emerald-800',2:'bg-amber-950 text-amber-400 border-amber-800',3:'bg-zinc-800 text-zinc-400 border-zinc-700'}
  return <Badge variant="outline" className={`text-[10px] ${c[tier as keyof typeof c]||c[3]}`}>T{tier}</Badge>
}
function StarRating({ rating }: { rating: number }) {
  return (<div className="flex items-center gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} className={`h-3.5 w-3.5 ${s<=Math.round(rating)?'text-amber-400 fill-amber-400':'text-zinc-700'}`}/>)}
  <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span></div>)
}
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const d:Record<string,string>={Beginner:'bg-emerald-950 text-emerald-400',Intermediate:'bg-amber-950 text-amber-400',Advanced:'bg-rose-950 text-rose-400'}
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d[difficulty]||d.Beginner}`}>{difficulty}</span>
}
function LoadingSpinner() {
  return (<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/></div>)
}
function SkeletonCard() {
  return (
    <div className="card-premium p-6 rounded-xl">
      <Skeleton className="h-4 w-24 mb-3 bg-zinc-800"/>
      <Skeleton className="h-8 w-20 mb-2 bg-zinc-800"/>
      <Skeleton className="h-3 w-32 bg-zinc-800"/>
    </div>
  )
}

// ─── Chart Configs ───────────────────────────────────────────────────
const sectorChartConfig: ChartConfig = {
  Dental:{label:'Dental',color:'#10b981'},Legal:{label:'Legal',color:'#f59e0b'},
  Funeral:{label:'Funeral',color:'#ef4444'},Hospitality:{label:'Hospitality',color:'#a78bfa'},
  Logistics:{label:'Logistics',color:'#22d3ee'},Construction:{label:'Construction',color:'#fb923c'},
  Education:{label:'Education',color:'#60a5fa'},Medical:{label:'Medical',color:'#f472b6'},
}
const tierChartConfig: ChartConfig = { count:{label:'Leads',color:'#10b981'} }
const pipelineChartConfig: ChartConfig = {
  count:{label:'Leads',color:'#10b981'},value:{label:'Value (R)',color:'#f59e0b'}
}

// ─── Motion Variants ─────────────────────────────────────────────────
const fadeInUp = { initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:0.35} }
const staggerContainer = { animate:{transition:{staggerChildren:0.07}} }
const scaleIn = { initial:{opacity:0,scale:0.96},animate:{opacity:1,scale:1},transition:{duration:0.25} }

// ─── KPI Card ────────────────────────────────────────────────────────
function KPICard({ label, value, sub, icon, accentClass, trend, trendValue, delay=0 }: {
  label: string; value: string|number; sub: string; icon: React.ReactNode; accentClass: string;
  trend?: 'up'|'down'; trendValue?: string; delay?: number
}) {
  const numVal = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g,'')) || 0
  const animated = useAnimatedCount(numVal, 1400)
  const displayVal = typeof value === 'number' ? animated.toLocaleString() : value

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay}}>
      <div className="card-premium p-5 rounded-xl relative overflow-hidden group hover:border-zinc-600 transition-all duration-300 stat-shine">
        <div className={`absolute top-0 right-0 w-28 h-28 rounded-full -translate-y-10 translate-x-10 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity ${accentClass}`}/>
        <div className="flex items-start justify-between relative">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-bold text-foreground leading-none">{displayVal}</p>
            <div className="flex items-center gap-2">
              {trend && trendValue && (
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend==='up'?'text-emerald-400':'text-red-400'}`}>
                  {trend==='up'?<ArrowUpRight className="h-3 w-3"/>:<ArrowDownRight className="h-3 w-3"/>}{trendValue}
                </span>
              )}
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${accentClass}`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Dashboard View ──────────────────────────────────────────────────
function DashboardView({ stats, leads, openLeadDetail, navigateTo }: {
  stats: DashboardStats; leads: Lead[]; openLeadDetail: (l: Lead) => void; navigateTo: (p: PageId) => void
}) {
  const [activeNiche, setActiveNiche] = useState(0)
  const topHotLeads = useMemo(() =>
    leads.filter(l=>l.hotLead&&l.stage!=='won'&&l.stage!=='lost').sort((a,b)=>b.rating-a.rating).slice(0,5),
  [leads])

  const revenueForecast = useMemo(() => {
    const active = leads.filter(l=>l.stage!=='won'&&l.stage!=='lost'&&l.status==='active')
    const weighted = active.reduce((s,l) => {
      const prob = ({new:0.05,contacted:0.15,demo_sent:0.25,meeting_booked:0.4,proposal_sent:0.6,negotiation:0.75} as Record<string,number>)[l.stage]||0.1
      return s + (l.estimatedValue||0) * prob
    },0)
    const mrr = weighted * 0.08
    return { weightedPipeline: weighted, mrr, arr: mrr*12 }
  },[leads])

  const sectorPerfTable = useMemo(() =>
    stats.bySector.map(s => {
      const sl = leads.filter(l=>l.sector===s.sector)
      const value = sl.reduce((sum,l)=>sum+(l.estimatedValue||0),0)
      const won = sl.filter(l=>l.stage==='won').length
      const avgRating = sl.length>0 ? (sl.reduce((sum,l)=>sum+l.rating,0)/sl.length) : 0
      return { sector:s.sector, leads:s.count, value, conversion: sl.length>0?Math.round((won/sl.length)*100):0, avgRating: avgRating.toFixed(1) }
    }),
  [stats,leads])

  const weeklyTargets = [
    { label: 'Leads Researched', target: 50, current: Math.min(leads.length, 50), color: 'bg-emerald-500' },
    { label: 'Businesses Contacted', target: 40, current: Math.min(leads.filter(l=>l.stage!=='new').length, 40), color: 'bg-sky-500' },
    { label: 'Prototype Links Sent', target: 10, current: Math.min(leads.filter(l=>l.stage==='demo_sent').length, 10), color: 'bg-violet-500' },
    { label: 'Follow-ups Sent', target: 60, current: Math.min(leads.filter(l=>l.activities?.length>0).length * 2, 60), color: 'bg-amber-500' },
    { label: 'Meetings Booked', target: 5, current: Math.min(leads.filter(l=>l.stage==='meeting_booked').length, 5), color: 'bg-rose-500' },
    { label: 'Deals Closed', target: 1, current: Math.min(leads.filter(l=>l.stage==='won').length, 1), color: 'bg-emerald-400' },
  ]

  const niches = [
    { month: 'Month 1', niche: 'Dentists & Doctors', goal: 'Establish first case study', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-900/40' },
    { month: 'Month 2', niche: 'Attorneys', goal: 'Build authority in legal sector', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-900/40' },
    { month: 'Month 3', niche: 'Construction & Real Estate', goal: 'Win higher-value portfolio projects', color: 'text-sky-400', bg: 'bg-sky-950/60 border-sky-900/40' },
    { month: 'Month 4', niche: 'Schools & Training', goal: 'Build long-term retainer relationships', color: 'text-violet-400', bg: 'bg-violet-950/60 border-violet-900/40' },
    { month: 'Month 5', niche: 'Beauty & Wellness', goal: 'Target booking-heavy automation upsells', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-900/40' },
    { month: 'Month 6', niche: 'Guesthouses & Hospitality', goal: 'Target premium system builds', color: 'text-orange-400', bg: 'bg-orange-950/60 border-orange-900/40' },
  ]

  const revenueScenarios = [
    { label: 'Conservative', value: 35000, target: 'R35,000/mo', sub: '2 sites + 5 retainers', color: 'text-emerald-400', bar: 19 },
    { label: 'Strong', value: 86000, target: 'R86,000/mo', sub: '3 sites + 1 system', color: 'text-amber-400', bar: 48 },
    { label: 'Aggressive', value: 180000, target: 'R180,000/mo', sub: '3+2 systems + retainers', color: 'text-violet-400', bar: 100 },
  ]

  const salesMachineSteps = [
    { step: '01', label: 'Pick a Niche', owner: 'Both', color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-900/30' },
    { step: '02', label: 'Build Lead List', owner: 'Sihle', color: 'text-amber-400', bg: 'bg-amber-950/50 border-amber-900/30' },
    { step: '03', label: 'Score Websites', owner: 'Kabelo', color: 'text-sky-400', bg: 'bg-sky-950/50 border-sky-900/30' },
    { step: '04', label: 'Build Prototypes', owner: 'Kabelo', color: 'text-violet-400', bg: 'bg-violet-950/50 border-violet-900/30' },
    { step: '05', label: 'Open Conversations', owner: 'Sihle', color: 'text-rose-400', bg: 'bg-rose-950/50 border-rose-900/30' },
    { step: '06', label: 'Execute Follow-Up', owner: 'Sihle', color: 'text-orange-400', bg: 'bg-orange-950/50 border-orange-900/30' },
  ]

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="initial" animate="animate">

      {/* Hero Banner — LaunchProof Studio */}
      <motion.div {...fadeInUp}>
        <div className="relative rounded-2xl overflow-hidden"
          style={{background:'linear-gradient(135deg, #0d1f17 0%, #0a1520 55%, #0d0d18 100%)', border:'1px solid rgba(16,185,129,0.2)'}}>
          {/* Dot-grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
          {/* Glow orbs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.07]" style={{background:'radial-gradient(circle, #10b981, transparent 70%)'}}/>
          <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full opacity-[0.05]" style={{background:'radial-gradient(circle, #f59e0b, transparent 70%)'}}/>

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Logo */}
                <div className="relative shrink-0 hidden sm:block">
                  <Image src="/launchproof-logo.png" alt="LaunchProof Studio" width={72} height={72} className="rounded-2xl shadow-xl shadow-emerald-500/10 object-contain"/>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">LaunchProof Studio</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                    <span className="text-emerald-400">Kabelo</span> &amp; <span className="text-amber-400">Sihle</span>
                  </h1>
                  <p className="text-sm text-white/40 mt-1 max-w-md italic">
                    &ldquo;Most agencies sell promises. We sell proof.&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs h-8" onClick={()=>toast.info('Report exported!')}>
                  <Download className="h-3.5 w-3.5 mr-1.5"/>Export
                </Button>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs h-8" onClick={()=>navigateTo('email')}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5"/>Generate Email
                </Button>
                <Button size="sm" className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-700/40 text-amber-300 font-semibold text-xs h-8" onClick={()=>navigateTo('pipeline')}>
                  <GitBranch className="h-3.5 w-3.5 mr-1.5"/>Pipeline
                </Button>
              </div>
            </div>

            {/* Revenue scenario bars */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {revenueScenarios.map((s,i)=>(
                <div key={i} className="bg-black/30 border border-white/[0.06] rounded-xl p-4 group hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{s.label}</p>
                    <span className={`text-[10px] font-semibold ${s.color}`}>{s.sub}</span>
                  </div>
                  <p className={`text-xl font-black ${s.color}`}>{s.target}</p>
                  <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full ${s.color.replace('text-','bg-')}`}
                      initial={{width:0}} animate={{width:`${s.bar}%`}} transition={{duration:1,delay:i*0.15,ease:'easeOut'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Row — 5 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard label="Total Leads" value={stats.totalLeads} sub={`${stats.activePipeline} active`} icon={<Users className="h-5 w-5 text-emerald-400"/>} accentClass="bg-emerald-500/10" trend="up" trendValue="+12%" delay={0}/>
        <KPICard label="Hot Leads" value={stats.hotLeads} sub="Priority contacts" icon={<Flame className="h-5 w-5 text-amber-400"/>} accentClass="bg-amber-500/10" trend="up" trendValue="+3" delay={0.06}/>
        <KPICard label="Pipeline Value" value={formatCurrency(stats.pipelineValue)} sub={`${stats.wonLeads} won`} icon={<DollarSign className="h-5 w-5 text-emerald-400"/>} accentClass="bg-emerald-500/10" trend="up" trendValue="+R45K" delay={0.12}/>
        <KPICard label="Conversion" value={`${stats.conversionRate}%`} sub={`of ${stats.totalLeads} leads`} icon={<TrendingUp className="h-5 w-5 text-violet-400"/>} accentClass="bg-violet-500/10" delay={0.18}/>
        <KPICard label="Weighted Rev." value={formatCurrency(revenueForecast.weightedPipeline)} sub="probability-adj." icon={<Activity className="h-5 w-5 text-sky-400"/>} accentClass="bg-sky-500/10" delay={0.24}/>
      </div>

      {/* Row 2: Partner Spotlight + Hot Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Partner cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {/* Kabelo */}
          <motion.div {...fadeInUp} transition={{delay:0.28}}>
            <button onClick={()=>navigateTo('kabelo')} className="w-full text-left card-premium rounded-xl p-4 hover:border-emerald-800/60 hover:bg-emerald-950/20 transition-all group border border-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-emerald-500/20">K</div>
                <div>
                  <p className="font-black text-sm text-foreground">Kabelo</p>
                  <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Build &amp; Strategy</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-emerald-400 ml-auto transition-colors"/>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Builds', value: leads.filter(l=>l.stage==='won').length },
                  { label: 'Protos', value: leads.filter(l=>l.stage==='demo_sent').length },
                  { label: 'Active', value: leads.filter(l=>l.status==='active').length },
                ].map((s,i)=>(
                  <div key={i} className="bg-zinc-800/60 rounded-lg p-2 text-center">
                    <p className="text-base font-black text-emerald-400">{s.value}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </button>
          </motion.div>
          {/* Sihle */}
          <motion.div {...fadeInUp} transition={{delay:0.32}}>
            <button onClick={()=>navigateTo('sihle')} className="w-full text-left card-premium rounded-xl p-4 hover:border-amber-800/60 hover:bg-amber-950/20 transition-all group border border-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-amber-500/20">S</div>
                <div>
                  <p className="font-black text-sm text-foreground">Sihle</p>
                  <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Sales &amp; Outreach</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-amber-400 ml-auto transition-colors"/>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Contacted', value: leads.filter(l=>l.stage!=='new').length },
                  { label: 'Follow-ups', value: leads.filter(l=>l.activities&&l.activities.length>0).length },
                  { label: 'Meetings', value: leads.filter(l=>l.stage==='meeting_booked').length },
                ].map((s,i)=>(
                  <div key={i} className="bg-zinc-800/60 rounded-lg p-2 text-center">
                    <p className="text-base font-black text-amber-400">{s.value}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </button>
          </motion.div>
        </div>

        {/* Hot Leads */}
        <motion.div {...fadeInUp} transition={{delay:0.3}} className="lg:col-span-3">
          <div className="card-premium rounded-xl h-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-400"/>
                <h3 className="text-sm font-semibold text-foreground">Hot Leads</h3>
                <span className="text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full">{topHotLeads.length}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-7" onClick={()=>navigateTo('leads')}>
                All leads <ArrowRight className="h-3 w-3 ml-1"/>
              </Button>
            </div>
            <div className="space-y-2">
              {topHotLeads.length===0
                ? <p className="text-sm text-muted-foreground text-center py-10">No hot leads right now</p>
                : topHotLeads.map((lead,i)=>(
                <motion.div key={lead.id}
                  initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer group border border-transparent hover:border-zinc-700"
                  onClick={()=>openLeadDetail(lead)}
                >
                  <div className="h-8 w-8 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                      {lead.hotLead&&<Flame className="h-3 w-3 text-amber-400 shrink-0"/>}
                    </div>
                    <p className="text-xs text-muted-foreground">{lead.sector} · {lead.area||lead.location}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StarRating rating={lead.rating}/>
                    {lead.estimatedValue>0&&<span className="text-xs font-semibold text-emerald-400 hidden sm:inline">{formatCurrency(lead.estimatedValue)}</span>}
                    <Badge variant="outline" className={`text-[9px] hidden md:inline-flex ${STAGE_COLORS[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors"/>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Pipeline Funnel + Revenue Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fadeInUp} transition={{delay:0.38}} className="lg:col-span-2">
          <div className="card-premium rounded-xl p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Pipeline Funnel</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Stage-by-stage lead distribution</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-7" onClick={()=>navigateTo('pipeline')}>
                Full Board <ArrowRight className="h-3 w-3 ml-1"/>
              </Button>
            </div>
            <div className="space-y-2.5">
              {stats.byStage.map((stage,i)=>{
                const maxCount=Math.max(...stats.byStage.map(s=>s.count),1)
                const pct=(stage.count/maxCount)*100
                const convPct = i>0&&stats.byStage[0].count>0?Math.round((stage.count/stats.byStage[0].count)*100):100
                return (
                  <motion.div key={stage.stage} className="flex items-center gap-3"
                    initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
                    <span className="text-[11px] font-medium w-28 shrink-0 text-right text-muted-foreground">{stage.label}</span>
                    <div className="flex-1 h-8 bg-zinc-800/80 rounded-lg relative overflow-hidden">
                      <motion.div
                        className="h-full rounded-lg"
                        style={{backgroundColor:stage.stage==='won'?'#10b981':stage.stage==='lost'?'#ef4444':STAGE_BG_COLORS[stage.stage]+'40',borderRight:`2px solid ${STAGE_BG_COLORS[stage.stage]}`}}
                        initial={{width:0}} animate={{width:`${Math.max(pct,2)}%`}}
                        transition={{duration:0.7,delay:i*0.05,ease:'easeOut'}}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        <span className="text-xs font-bold text-foreground">{stage.count}</span>
                        <span className="text-[10px] text-muted-foreground">{convPct}%</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.42}}>
          <div className="card-premium rounded-xl h-full p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400"/>
              <h3 className="text-sm font-semibold text-foreground">Revenue Forecast</h3>
            </div>
            <div className="rounded-xl p-4" style={{background:'oklch(0.18 0.04 162 / 0.3)',border:'1px solid oklch(0.25 0.05 162 / 0.4)'}}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Weighted Pipeline</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(revenueForecast.weightedPipeline)}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">probability-adjusted</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-800/60 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">Monthly est.</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(revenueForecast.mrr)}</p>
              </div>
              <div className="bg-zinc-800/60 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">Annual est.</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(revenueForecast.arr)}</p>
              </div>
            </div>
            <div className="bg-zinc-800/40 rounded-lg p-3 space-y-2">
              {[
                { label:'Won', count:stats.wonLeads, color:'text-emerald-400' },
                { label:'Lost', count:stats.lostLeads, color:'text-red-400' },
                { label:'Active', count:stats.activePipeline, color:'text-sky-400' },
              ].map((s,i)=>(
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className={`text-xs font-bold ${s.color}`}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 4: Sector Performance + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeInUp} transition={{delay:0.44}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-4">Sector Performance</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sector</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Leads</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right hidden sm:table-cell">Value</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right hidden md:table-cell">Conv.</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right hidden lg:table-cell">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectorPerfTable.map(s=>(
                  <TableRow key={s.sector} className="border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md flex items-center justify-center" style={{backgroundColor:SECTOR_COLORS[s.sector]+'20',color:SECTOR_COLORS[s.sector]}}>
                          {SECTOR_ICONS[s.sector]||<Building2 className="h-3.5 w-3.5"/>}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.sector}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm text-foreground">{s.leads}</TableCell>
                    <TableCell className="text-right text-sm hidden sm:table-cell text-muted-foreground">{s.value>0?formatCurrency(s.value):'—'}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      <span className={`text-xs font-semibold ${s.conversion>0?'text-emerald-400':'text-muted-foreground'}`}>{s.conversion}%</span>
                    </TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      <span className="text-xs text-amber-400">{s.avgRating}★</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.48}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-2">Leads by Sector</h3>
            <ChartContainer config={sectorChartConfig} className="h-[280px] w-full">
              <PieChart>
                <Pie data={stats.bySector} cx="50%" cy="50%" innerRadius={65} outerRadius={105} dataKey="count" nameKey="sector" paddingAngle={3} animationBegin={200} animationDuration={900}>
                  {stats.bySector.map((entry)=><Cell key={entry.sector} fill={SECTOR_COLORS[entry.sector]||'#52525b'}/>)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent/>}/>
                <ChartLegend content={<ChartLegendContent nameKey="sector"/>}/>
              </PieChart>
            </ChartContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 5: Weekly Targets + Pretoria Domination Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeInUp} transition={{delay:0.5}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-emerald-400"/>
              <h3 className="text-sm font-semibold text-foreground">Weekly Activity Targets</h3>
              <span className="ml-auto text-[10px] text-muted-foreground">This Week</span>
            </div>
            <div className="space-y-3">
              {weeklyTargets.map((t,i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{t.label}</span>
                    <span className="text-xs font-bold text-foreground">{t.current}<span className="text-muted-foreground font-normal text-[11px]">/{t.target}</span></span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div className={`h-full ${t.color} rounded-full`}
                      initial={{width:0}} animate={{width:`${Math.min((t.current/t.target)*100,100)}%`}}
                      transition={{duration:0.8,delay:i*0.08}}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">The Machine</p>
              <p className="text-xs text-emerald-300/60 leading-relaxed">Lead list → Prototype → Outreach → Follow-up → Meeting → Proposal → Deposit → Build → Retainer. Repeat.</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.54}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-400"/>
                <h3 className="text-sm font-semibold text-foreground">Pretoria Domination</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-950/60 border border-amber-900/40 px-2 py-0.5 rounded-full">6-Month</span>
            </div>
            <div className="space-y-1.5">
              {niches.map((n,i)=>(
                <button key={i} onClick={()=>setActiveNiche(i)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${activeNiche===i?n.bg+' border':'bg-zinc-800/30 border-transparent hover:bg-zinc-800/50'}`}>
                  <span className="text-[10px] font-black text-zinc-600 w-12 shrink-0">{n.month}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${activeNiche===i?n.color:'text-foreground'}`}>{n.niche}</p>
                    {activeNiche===i&&<p className="text-[10px] text-muted-foreground mt-0.5 truncate">{n.goal}</p>}
                  </div>
                  {activeNiche===i&&<CheckCircle2 className={`h-4 w-4 shrink-0 ${n.color}`}/>}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 6: Sales Machine + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeInUp} transition={{delay:0.57}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-amber-400"/>
              <h3 className="text-sm font-semibold text-foreground">Sales Machine</h3>
              <span className="text-[10px] text-muted-foreground ml-auto">6-step cycle</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {salesMachineSteps.map((s,i)=>(
                <div key={i} className={`rounded-xl border p-3 ${s.bg}`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`text-[10px] font-black ${s.color}`}>{s.step}</span>
                    <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wider">·</span>
                    <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wider">{s.owner}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">WhatsApp Template</p>
              <p className="text-xs text-zinc-400 leading-relaxed italic">&ldquo;Hi, I&apos;m Sihle. We reviewed your online presence and built a premium preview showing how your business could look. Here is the live link: [prototype]. Would you like a quick breakdown?&rdquo;</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.61}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-violet-400"/>
                <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              </div>
            </div>
            <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
              {stats.recentActivities.length===0
                ? <p className="text-sm text-muted-foreground text-center py-10">No recent activities</p>
                : stats.recentActivities.map((a,i)=>(
                <motion.div key={a.id}
                  initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer border border-transparent hover:border-zinc-700/50"
                  onClick={()=>{const l=leads.find(x=>x.id===a.leadId);if(l)openLeadDetail(l)}}
                >
                  <div className="mt-0.5 h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                    {ACTIVITY_ICONS[a.type]||<AlertCircle className="h-3.5 w-3.5"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-foreground truncate">{a.lead?.name}</span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 bg-zinc-800 border-zinc-700 text-zinc-400 shrink-0">{a.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{a.summary}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatRelativeDate(a.date)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions Bar */}
      <motion.div {...fadeInUp} transition={{delay:0.64}}>
        <div className="card-premium rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mr-1">Quick Actions</span>
            {[
              { label:'Generate Email', icon:<Sparkles className="h-3.5 w-3.5 text-emerald-400"/>, page:'email' as PageId },
              { label:'Hot Leads', icon:<Flame className="h-3.5 w-3.5 text-amber-400"/>, page:'leads' as PageId },
              { label:'Kabelo Board', icon:<Code2 className="h-3.5 w-3.5 text-emerald-400"/>, page:'kabelo' as PageId },
              { label:'Sihle Tracker', icon:<Megaphone className="h-3.5 w-3.5 text-amber-400"/>, page:'sihle' as PageId },
              { label:'Analytics', icon:<BarChart3 className="h-3.5 w-3.5 text-sky-400"/>, page:'analytics' as PageId },
              { label:'Pipeline', icon:<GitBranch className="h-3.5 w-3.5 text-violet-400"/>, page:'pipeline' as PageId },
            ].map((a,i)=>(
              <Button key={i} variant="ghost" size="sm" className="h-8 text-xs border border-zinc-700/60 hover:bg-zinc-800 text-foreground" onClick={()=>navigateTo(a.page)}>
                {a.icon}<span className="ml-1.5">{a.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Leads View ──────────────────────────────────────────────────────
function LeadsView({ leads, searchQuery, setSearchQuery, filterSector, setFilterSector, filterTier, setFilterTier, filterStage, setFilterStage, filterHot, setFilterHot, openLeadDetail, stats, navigateToEmail }: {
  leads:Lead[];searchQuery:string;setSearchQuery:(v:string)=>void;filterSector:string;setFilterSector:(v:string)=>void;
  filterTier:string;setFilterTier:(v:string)=>void;filterStage:string;setFilterStage:(v:string)=>void;
  filterHot:string;setFilterHot:(v:string)=>void;openLeadDetail:(l:Lead)=>void;stats:DashboardStats|null;
  navigateToEmail:(leadId?:string)=>void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = leads.length > 0 && leads.every(l => selectedIds.has(l.id))
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(leads.map(l => l.id)))
  }
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelectedIds(next)
  }

  const avgRating = leads.length > 0 ? (leads.reduce((s,l) => s + l.rating, 0) / leads.length).toFixed(1) : '0'
  const totalValue = leads.reduce((s,l) => s + (l.estimatedValue||0), 0)

  const daysSinceContact = (lastContact: string | null) => {
    if (!lastContact) return '—'
    const d = Math.floor((Date.now() - new Date(lastContact).getTime()) / (1000*60*60*24))
    if (d === 0) return 'Today'
    if (d < 30) return `${d}d`
    return `${Math.floor(d/30)}mo`
  }

  return (
    <motion.div className="space-y-4" {...fadeInUp}>
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total Leads', value:stats?.totalLeads||0, icon:<Users className="h-4 w-4 text-emerald-400"/>, accent:'bg-emerald-500/10' },
          { label:'Hot Leads', value:stats?.hotLeads||0, icon:<Flame className="h-4 w-4 text-amber-400"/>, accent:'bg-amber-500/10', bold:true },
          { label:'Avg Rating', value:`${avgRating}★`, icon:<Star className="h-4 w-4 text-amber-400"/>, accent:'bg-amber-500/10' },
          { label:'Total Value', value:formatCurrency(totalValue), icon:<DollarSign className="h-4 w-4 text-violet-400"/>, accent:'bg-violet-500/10' },
        ].map((s,i) => (
          <div key={i} className="card-premium rounded-xl p-3.5 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.accent}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-base font-bold ${s.bold?'text-amber-400':'text-foreground'}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-premium rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search by name, sector, or location..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="pl-9 bg-zinc-800/60 border-zinc-700 text-foreground placeholder:text-zinc-600 focus:border-primary"/>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger className="w-[130px] bg-zinc-800/60 border-zinc-700 text-foreground"><Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground"/><SelectValue placeholder="Sector"/></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Sectors</SelectItem>
                {['Dental','Legal','Funeral','Hospitality','Logistics','Construction','Education','Medical'].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-[100px] bg-zinc-800/60 border-zinc-700 text-foreground"><SelectValue placeholder="Tier"/></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem><SelectItem value="2">Tier 2</SelectItem><SelectItem value="3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-[130px] bg-zinc-800/60 border-zinc-700 text-foreground"><SelectValue placeholder="Stage"/></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map(s=><SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterHot} onValueChange={setFilterHot}>
              <SelectTrigger className="w-[100px] bg-zinc-800/60 border-zinc-700 text-foreground"><Flame className="h-3.5 w-3.5 mr-1.5 text-amber-400"/><SelectValue placeholder="Hot"/></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All</SelectItem><SelectItem value="true">Hot Only</SelectItem><SelectItem value="false">Not Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-premium rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/40">
                <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} className="border-zinc-600"/></TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sector</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Tier</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Rating</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stage</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Days</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Value</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Hot</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length===0
                ? <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground border-zinc-800">No leads found</TableCell></TableRow>
                : leads.map(lead=>(
                <TableRow key={lead.id}
                  className={`border-zinc-800/50 hover:bg-zinc-800/40 cursor-pointer transition-colors ${selectedIds.has(lead.id)?'bg-zinc-800/60':''}`}
                  onClick={()=>openLeadDetail(lead)}
                >
                  <TableCell onClick={e=>e.stopPropagation()}><Checkbox checked={selectedIds.has(lead.id)} onCheckedChange={()=>toggleSelect(lead.id)} className="border-zinc-600"/></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {lead.hotLead&&<Flame className="h-3.5 w-3.5 text-amber-400 shrink-0"/>}
                      <span className="font-medium text-sm text-foreground truncate max-w-[140px]">{lead.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5" style={{color:SECTOR_COLORS[lead.sector]||'#71717a'}}>
                      {SECTOR_ICONS[lead.sector]||<Building2 className="h-3.5 w-3.5"/>}
                      <span className="text-sm">{lead.sector}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><TierBadge tier={lead.tier}/></TableCell>
                  <TableCell className="hidden md:table-cell"><StarRating rating={lead.rating}/></TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${STAGE_COLORS[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{daysSinceContact(lead.lastContact)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm font-medium text-emerald-400">{lead.estimatedValue>0?formatCurrency(lead.estimatedValue):'—'}</TableCell>
                  <TableCell className="text-center">{lead.hotLead?<Flame className="h-4 w-4 text-amber-400 mx-auto"/>:<span className="text-zinc-700">—</span>}</TableCell>
                  <TableCell className="text-right" onClick={e=>e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5">
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-sky-400 hover:text-sky-300 hover:bg-sky-950" onClick={()=>toast.info(`Call ${lead.phone}`)}>
                          <Phone className="h-3.5 w-3.5"/>
                        </Button></TooltipTrigger><TooltipContent>Call</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950" onClick={()=>toast.info('Opening WhatsApp...')}>
                          <MessageSquare className="h-3.5 w-3.5"/>
                        </Button></TooltipTrigger><TooltipContent>WhatsApp</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-violet-400 hover:text-violet-300 hover:bg-violet-950" onClick={()=>navigateToEmail(lead.id)}>
                          <Mail className="h-3.5 w-3.5"/>
                        </Button></TooltipTrigger><TooltipContent>Email</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={()=>openLeadDetail(lead)} className="text-zinc-400 hover:text-foreground hover:bg-zinc-800 h-7 w-7 p-0">
                          <Eye className="h-3.5 w-3.5"/>
                        </Button></TooltipTrigger><TooltipContent>View</TooltipContent></Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}</p>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}} transition={{type:'spring',stiffness:300,damping:30}}>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-700 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
              <span className="text-sm font-medium">{selectedIds.size} selected</span>
              <Separator orientation="vertical" className="h-6 bg-zinc-700"/>
              <Select onValueChange={(v)=>{if(v){toast.success(`Moving ${selectedIds.size} leads to ${STAGE_LABELS[v]}`);setSelectedIds(new Set())}}}>
                <SelectTrigger className="w-[150px] h-8 text-xs bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Move to Stage"/></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">{STAGES.filter(s=>s!=='won'&&s!=='lost').map(s=><SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}</SelectContent>
              </Select>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-amber-400 hover:text-amber-300 hover:bg-zinc-800" onClick={()=>{toast.success(`Marked ${selectedIds.size} leads as hot`);setSelectedIds(new Set())}}>
                <Flame className="h-3.5 w-3.5 mr-1"/>Mark Hot
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800" onClick={()=>toast.info('Exporting...')}>
                <Download className="h-3.5 w-3.5 mr-1"/>Export
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={()=>setSelectedIds(new Set())}>
                <X className="h-3.5 w-3.5"/>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Pipeline View ────────────────────────────────────────────────────
function PipelineView({ leads, stats, pipelineStages, updateLeadStage, openLeadDetail, navigateToEmail }: {
  leads:Lead[];stats:DashboardStats|null;pipelineStages:readonly string[];updateLeadStage:(id:string,s:string)=>void;openLeadDetail:(l:Lead)=>void;navigateToEmail:(leadId?:string)=>void;
}) {
  const [pipelineSearch, setPipelineSearch] = useState('')

  const filteredLeads = useMemo(() => {
    if (!pipelineSearch.trim()) return leads
    const q = pipelineSearch.toLowerCase()
    return leads.filter(l => l.name.toLowerCase().includes(q) || l.sector.toLowerCase().includes(q) || (l.area||l.location).toLowerCase().includes(q))
  }, [leads, pipelineSearch])

  const avgDealSize = useMemo(() => {
    const active = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost')
    const total = active.reduce((s,l) => s + (l.estimatedValue||0), 0)
    return active.length > 0 ? total / active.length : 0
  }, [leads])

  const stageSummaries = useMemo(() => {
    return pipelineStages.map(stage => {
      const sl = leads.filter(l => l.stage === stage)
      const value = sl.reduce((s,l) => s + (l.estimatedValue||0), 0)
      return { stage, count: sl.length, value }
    })
  }, [leads, pipelineStages])

  return (
    <motion.div className="space-y-4" {...fadeInUp}>
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Pipeline Value', value:formatCurrency(stats?.pipelineValue||0), icon:<DollarSign className="h-4 w-4 text-emerald-400"/>, accent:'bg-emerald-500/10' },
          { label:'Avg Deal Size', value:formatCurrency(avgDealSize), icon:<TrendingUp className="h-4 w-4 text-amber-400"/>, accent:'bg-amber-500/10' },
          { label:'Active Leads', value:stats?.activePipeline||0, icon:<Activity className="h-4 w-4 text-sky-400"/>, accent:'bg-sky-500/10' },
          { label:'Win Rate', value:`${stats?.conversionRate||0}%`, icon:<CheckCircle2 className="h-4 w-4 text-violet-400"/>, accent:'bg-violet-500/10' },
        ].map((m,i) => (
          <div key={i} className="card-premium rounded-xl p-3.5 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${m.accent}`}>{m.icon}</div>
            <div><p className="text-[10px] text-muted-foreground font-medium">{m.label}</p><p className="text-base font-bold text-foreground">{m.value}</p></div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search leads across all stages..." value={pipelineSearch} onChange={(e)=>setPipelineSearch(e.target.value)} className="pl-9 bg-zinc-800/60 border-zinc-700 text-foreground"/>
        </div>
        <Badge variant="outline" className="border-emerald-800 bg-emerald-950/40 text-emerald-400 whitespace-nowrap">{stats?.activePipeline||0} active leads</Badge>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {pipelineStages.map(stage=>{
          const stageLeads=filteredLeads.filter(l=>l.stage===stage)
          const stageValue=stageSummaries.find(s=>s.stage===stage)?.value||0
          return (
            <div key={stage} className="flex-shrink-0 w-[260px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full shrink-0" style={{backgroundColor:STAGE_BG_COLORS[stage]}}/>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex-1">{STAGE_LABELS[stage]}</h3>
                <span className="text-[10px] font-bold bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {stageLeads.length===0
                  ? <div className="border border-dashed border-zinc-800 rounded-xl p-5 text-center"><p className="text-xs text-zinc-600">No leads</p></div>
                  : stageLeads.map(lead=>{
                    const daysInStage = lead.updatedAt ? Math.floor((Date.now()-new Date(lead.updatedAt).getTime())/(1000*60*60*24)) : 0
                    return (
                      <motion.div key={lead.id}
                        className={`card-premium rounded-xl p-3 hover:border-zinc-600 transition-all cursor-pointer ${lead.hotLead?'border-l-2':'border-l-0'}`}
                        style={lead.hotLead?{borderLeftColor:'#f59e0b'}:{}}
                        whileHover={{y:-2}}
                        onClick={()=>openLeadDetail(lead)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5" style={{color:SECTOR_COLORS[lead.sector]||undefined}}>{lead.sector}</p>
                          </div>
                          {lead.hotLead&&<Flame className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5"/>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5"><TierBadge tier={lead.tier}/><span className="text-xs text-amber-400">{lead.rating.toFixed(1)}★</span></div>
                          {lead.estimatedValue>0&&<span className="text-xs font-semibold text-emerald-400">{formatCurrency(lead.estimatedValue)}</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-zinc-800" onClick={e=>e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-sky-400 hover:bg-sky-950" onClick={()=>toast.info(`Call ${lead.phone}`)}><Phone className="h-3 w-3"/></Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-400 hover:bg-emerald-950" onClick={()=>toast.info('WhatsApp...')}><MessageSquare className="h-3 w-3"/></Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-violet-400 hover:bg-violet-950" onClick={()=>navigateToEmail(lead.id)}><Mail className="h-3 w-3"/></Button>
                          <span className="ml-auto text-[10px] text-muted-foreground">{daysInStage}d</span>
                        </div>
                        <div className="mt-2">
                          <Select value={lead.stage} onValueChange={(val)=>updateLeadStage(lead.id,val)}>
                            <SelectTrigger className="h-7 text-[11px] bg-zinc-800/60 border-zinc-700 text-foreground w-full" onClick={e=>e.stopPropagation()}><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800" onClick={e=>e.stopPropagation()}>
                              {STAGES.map(s=><SelectItem key={s} value={s} className="text-xs">{STAGE_LABELS[s]}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )
                  })
                }
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground font-medium">{formatCurrency(stageValue)}</div>
            </div>
          )
        })}
      </div>

      {/* Stage Summary */}
      <div className="card-premium rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Stage Summary</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {stageSummaries.map((s, i) => {
            const convRate = i > 0 && stageSummaries[0].count > 0 ? Math.round((s.count / stageSummaries[0].count) * 100) : 100
            return (
              <div key={s.stage} className="text-center p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                <div className="h-2 w-2 rounded-full mx-auto mb-2" style={{backgroundColor:STAGE_BG_COLORS[s.stage]}}/>
                <p className="text-[10px] text-muted-foreground font-medium">{STAGE_LABELS[s.stage]}</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{s.count}</p>
                <p className="text-[10px] text-emerald-400 font-semibold">{convRate}%</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Won/Lost */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-premium rounded-xl p-4 border-l-4" style={{borderLeftColor:'#10b981'}}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400"/>
            <span className="font-semibold text-foreground">Won</span>
            <span className="ml-auto text-2xl font-bold text-emerald-400">{stats?.wonLeads||0}</span>
          </div>
        </div>
        <div className="card-premium rounded-xl p-4 border-l-4" style={{borderLeftColor:'#ef4444'}}>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400"/>
            <span className="font-semibold text-foreground">Lost</span>
            <span className="ml-auto text-2xl font-bold text-red-400">{stats?.lostLeads||0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Email Generator View ─────────────────────────────────────────────
const TEMPLATE_CATEGORIES = [
  { id:'all', label:'All Templates', count: 35 },
  { id:'cold', label:'Cold Outreach', count: 6 },
  { id:'followup', label:'Follow-Up', count: 5 },
  { id:'whatsapp', label:'WhatsApp', count: 8 },
  { id:'linkedin', label:'LinkedIn', count: 4 },
  { id:'phone', label:'Phone Scripts', count: 5 },
  { id:'proposal', label:'Proposals', count: 3 },
  { id:'special', label:'Special', count: 4 },
] as const

function EmailGeneratorView({ leads, emailLeadId, setEmailLeadId, selectedTemplateId, setSelectedTemplateId, emailCategoryFilter, setEmailCategoryFilter, emailEditedBody, setEmailEditedBody, emailEditing, setEmailEditing, showFullSequence, setShowFullSequence, addActivity, openLeadDetail }: {
  leads:Lead[];emailLeadId:string;setEmailLeadId:(v:string)=>void;
  selectedTemplateId:string|null;setSelectedTemplateId:(v:string|null)=>void;
  emailCategoryFilter:string;setEmailCategoryFilter:(v:string)=>void;
  emailEditedBody:string;setEmailEditedBody:(v:string)=>void;
  emailEditing:boolean;setEmailEditing:(v:boolean)=>void;
  showFullSequence:boolean;setShowFullSequence:(v:boolean)=>void;
  addActivity:(leadId:string)=>Promise<void>;
  openLeadDetail:(l:Lead)=>void;
}) {
  const selectedLead = leads.find(l=>l.id===emailLeadId)
  const sortedLeads = [...leads].sort((a,b)=>{if(a.hotLead!==b.hotLead)return a.hotLead?-1:1;return b.rating-a.rating})

  const filteredTemplates = useMemo(() => {
    if (emailCategoryFilter === 'all') return ALL_TEMPLATES
    return getTemplatesForCategory(emailCategoryFilter as any)
  }, [emailCategoryFilter])

  const renderedTemplate = useMemo<TemplateResult | null>(() => {
    if (!selectedLead || !selectedTemplateId) return null
    try { return renderTemplate(selectedTemplateId, leadToContext(selectedLead)) }
    catch { return null }
  }, [selectedLead, selectedTemplateId])

  const fullSequence = useMemo<SequenceStep[]>(() => {
    if (!selectedLead || !showFullSequence) return []
    return generateFullSequence(leadToContext(selectedLead))
  }, [selectedLead, showFullSequence])

  const displayedBody = emailEditing ? emailEditedBody : (renderedTemplate?.body || '')

  const copyToClipboard = () => {
    let text = displayedBody
    if (renderedTemplate?.subject) text = `Subject: ${renderedTemplate.subject}\n\n${text}`
    navigator.clipboard.writeText(text).then(()=>toast.success('Copied!')).catch(()=>toast.error('Failed to copy'))
  }

  const saveAsActivity = async () => {
    if (!emailLeadId || !displayedBody.trim()) return
    try {
      await fetch(`/api/leads/${emailLeadId}/activities`, {
        method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type: renderedTemplate?.channel === 'whatsapp' ? 'whatsapp' : 'email', summary: `Template: ${renderedTemplate?.name || selectedTemplateId}`, outcome: displayedBody.substring(0,200) })
      })
      toast.success('Saved as activity!')
    } catch { toast.error('Failed to save') }
  }

  const wordCount = displayedBody.split(/\s+/).filter(Boolean).length

  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      <div>
        <h2 className="text-lg font-bold text-foreground">Template Library</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Browse, preview, and send outreach templates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead Selector */}
        <div className="card-premium rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-foreground mb-3">Select a Lead</h3>
          <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto">
            {sortedLeads.length===0
              ? <p className="text-sm text-muted-foreground text-center py-8">No leads available</p>
              : sortedLeads.map(lead=>(
              <button key={lead.id}
                onClick={()=>{setEmailLeadId(lead.id);setSelectedTemplateId(null);setEmailEditing(false);setShowFullSequence(false)}}
                className={`w-full text-left p-3 rounded-xl transition-all border ${emailLeadId===lead.id?'bg-emerald-950/40 border-emerald-800/60':'hover:bg-zinc-800/40 border-transparent'}`}
              >
                <div className="flex items-center gap-2">
                  {lead.hotLead&&<Flame className="h-3.5 w-3.5 text-amber-400 shrink-0"/>}
                  <span className="font-medium text-sm text-foreground truncate">{lead.name}</span>
                  <Eye className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 hover:text-emerald-400" onClick={e=>{e.stopPropagation();openLeadDetail(lead)}}/>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{lead.sector}</span>
                  <TierBadge tier={lead.tier}/>
                  <span className="text-xs text-amber-400 ml-auto">{lead.rating.toFixed(1)}★</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedLead ? (<>
            {/* Lead Info Banner */}
            <motion.div {...scaleIn}>
              <div className="card-elevated rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedLead.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedLead.sector} · {selectedLead.area||selectedLead.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedLead.hotLead&&<Badge className="bg-amber-950 text-amber-400 border-amber-800 border text-[10px]"><Flame className="h-2.5 w-2.5 mr-1"/>Hot</Badge>}
                    <TierBadge tier={selectedLead.tier}/>
                  </div>
                </div>
                {selectedLead.recommendedPackage&&(
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Recommended:</span>
                    <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 border text-[10px]">{selectedLead.recommendedPackage}</Badge>
                    {selectedLead.estimatedValue>0&&<span className="text-xs font-semibold text-emerald-400">{formatCurrency(selectedLead.estimatedValue)}</span>}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Template Library */}
            <motion.div {...scaleIn} transition={{delay:0.05}}>
              <div className="card-premium rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-400"/>
                    <h3 className="text-sm font-semibold text-foreground">Templates</h3>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-zinc-700 bg-zinc-800/60 text-foreground hover:bg-zinc-700"
                    onClick={()=>{setShowFullSequence(!showFullSequence);setSelectedTemplateId(null);setEmailEditing(false)}}>
                    {showFullSequence?<><X className="h-3 w-3 mr-1"/>Close Sequence</>:<><Play className="h-3 w-3 mr-1"/>Full 7-Touch Sequence</>}
                  </Button>
                </div>

                {/* Category pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
                  {TEMPLATE_CATEGORIES.map(cat=>(
                    <button key={cat.id}
                      onClick={()=>{setEmailCategoryFilter(cat.id);setSelectedTemplateId(null)}}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${emailCategoryFilter===cat.id?'bg-primary text-primary-foreground shadow-sm':'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-foreground'}`}
                    >
                      {cat.label} <span className="ml-1 opacity-60">({cat.count})</span>
                    </button>
                  ))}
                </div>

                {showFullSequence ? (
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
                    {fullSequence.length === 0
                      ? <p className="text-sm text-muted-foreground text-center py-8">Select a lead first</p>
                      : fullSequence.map((step, i) => (
                      <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
                        <div className={`rounded-xl border p-3.5 ${i===0?'border-emerald-800/60 bg-emerald-950/20':'border-zinc-800 bg-zinc-800/20'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[10px] font-bold text-foreground">{step.touch}</span>
                              <span className="text-xs font-semibold text-foreground">Day {step.day}</span>
                              <ChannelBadge channel={step.channel}/>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-zinc-400 hover:text-foreground hover:bg-zinc-700"
                              onClick={()=>{const txt=step.subject?`Subject: ${step.subject}\n\n${step.body}`:step.body;navigator.clipboard.writeText(txt).then(()=>toast.success(`Touch ${step.touch} copied!`))}}>
                              <Copy className="h-3 w-3"/>
                            </Button>
                          </div>
                          {step.subject&&<p className="text-xs font-semibold text-foreground mb-1">Sub: {step.subject}</p>}
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">{step.body}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {filteredTemplates.map(t=>(
                      <button key={t.id}
                        onClick={()=>{setSelectedTemplateId(t.id);setEmailEditing(false)}}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${selectedTemplateId===t.id?'border-primary bg-primary/5':'border-zinc-800 hover:bg-zinc-800/60'}`}
                      >
                        <div className="flex items-center gap-2">
                          <ChannelBadge channel={t.channel||'email'}/>
                          <span className="text-sm font-semibold text-foreground">{t.name}</span>
                          {t.touchNumber&&<span className="text-[10px] text-muted-foreground ml-auto">Touch {t.touchNumber}</span>}
                        </div>
                        {t.description&&<p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Preview Area */}
            {renderedTemplate && !showFullSequence && (
              <motion.div {...scaleIn} transition={{delay:0.1}}>
                <div className="card-premium rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-primary"/>
                      <h3 className="text-sm font-semibold text-foreground">{renderedTemplate.name}</h3>
                      <ChannelBadge channel={renderedTemplate.channel||'email'}/>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-800"
                        onClick={()=>{setEmailEditing(!emailEditing);if(!emailEditing)setEmailEditedBody(displayedBody)}}>
                        {emailEditing?<><X className="h-3 w-3 mr-1"/>Cancel</>:<><Pencil className="h-3 w-3 mr-1"/>Edit</>}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950" onClick={copyToClipboard}>
                        <Copy className="h-3 w-3 mr-1"/>Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-950" onClick={saveAsActivity}>
                        <Save className="h-3 w-3 mr-1"/>Save
                      </Button>
                    </div>
                  </div>
                  {renderedTemplate.subject&&(
                    <div className="mb-3 p-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject: </span>
                      <span className="text-sm font-semibold text-foreground">{renderedTemplate.subject}</span>
                    </div>
                  )}
                  {emailEditing
                    ? <Textarea value={emailEditedBody} onChange={e=>setEmailEditedBody(e.target.value)} className="min-h-[200px] text-sm font-mono bg-zinc-800/60 border-zinc-700 text-foreground"/>
                    : <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-800">
                        <pre className="text-sm whitespace-pre-wrap text-foreground font-sans leading-relaxed">{displayedBody}</pre>
                      </div>
                  }
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800">
                    <span className="text-[10px] text-muted-foreground">{wordCount} words</span>
                    <span className="text-[10px] text-muted-foreground">{displayedBody.length} chars</span>
                    {renderedTemplate.wordCount&&<span className="text-[10px] text-emerald-400">{renderedTemplate.wordCount>0&&renderedTemplate.wordCount<=100?'Concise':'Standard length'}</span>}
                  </div>
                </div>
              </motion.div>
            )}
          </>) : (
            <div className="card-premium rounded-xl p-12 text-center">
              <Mail className="h-10 w-10 text-zinc-700 mx-auto mb-3"/>
              <p className="text-sm font-medium text-foreground">Select a lead to get started</p>
              <p className="text-xs text-muted-foreground mt-1">Choose from the left panel to generate personalized outreach</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Strategies View ──────────────────────────────────────────────────
function StrategiesView() {
  const [activeCategory, setActiveCategory] = useState(STRATEGIES_DATA[0].id)
  const activeData = STRATEGIES_DATA.find(d=>d.id===activeCategory)

  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      <div>
        <h2 className="text-lg font-bold text-foreground">Growth Strategies</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Proven frameworks for Sihle&apos;s outreach and Kabelo&apos;s delivery</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STRATEGIES_DATA.map(cat=>(
          <button key={cat.id}
            onClick={()=>setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${activeCategory===cat.id?'bg-emerald-950/50 border-emerald-800/60 text-emerald-400':'bg-zinc-800/40 border-zinc-800 text-muted-foreground hover:bg-zinc-800 hover:text-foreground'}`}
          >
            {cat.icon}{cat.category}
          </button>
        ))}
      </div>

      {/* Strategy Cards */}
      {activeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeData.strategies.map((strat, i) => (
            <motion.div key={strat.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <div className="card-premium rounded-xl p-5 h-full hover:border-zinc-600 transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-foreground text-sm">{strat.title}</h3>
                  <DifficultyBadge difficulty={strat.difficulty}/>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{strat.description}</p>
                <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lightbulb className="h-3 w-3 text-amber-400"/>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Key Insight</span>
                  </div>
                  <p className="text-xs text-amber-300/80 font-medium">{strat.keyInsight}</p>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="steps" className="border-zinc-800">
                    <AccordionTrigger className="text-xs font-semibold text-muted-foreground hover:text-foreground py-2 hover:no-underline">
                      View Action Steps ({strat.steps.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {strat.steps.map((step, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <span className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">{j+1}</span>
                            <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Pricing View ─────────────────────────────────────────────────────
function PricingView({ pricingCategory, setPricingCategory, roiNewPatients, setRoiNewPatients, roiAvgValue, setRoiAvgValue, roiPackage, setRoiPackage, selectedAddOns, setSelectedAddOns, currentPackages, selectedPkg, monthlyRevenue, annualRevenue, paybackDays, netGainY1, roiPercent, addOnTotalOnce, addOnTotalMonthly }: any) {
  const totalMonthly = addOnTotalMonthly
  const year1Cost = selectedPkg.price + addOnTotalOnce + (totalMonthly * 12)

  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      <div>
        <h2 className="text-lg font-bold text-foreground">Pricing Calculator</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Build proposals with live ROI projections</p>
      </div>

      {/* Category selector */}
      <div className="card-premium rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sector</h3>
        <RadioGroup value={pricingCategory} onValueChange={setPricingCategory} className="flex gap-3 flex-wrap">
          {(['dental','general','school'] as const).map(c=>(
            <div key={c} className="flex items-center gap-2">
              <RadioGroupItem value={c} id={c} className="border-zinc-600 text-primary"/>
              <Label htmlFor={c} className="capitalize font-medium text-foreground cursor-pointer">{c}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentPackages.map((pkg: any) => (
          <motion.div key={pkg.name} whileHover={{y:-4}} transition={{type:'spring',stiffness:300}}>
            <div
              className={`card-premium rounded-xl p-5 cursor-pointer transition-all relative overflow-hidden ${roiPackage===pkg.name?'border-primary glow-brand':''} ${pkg.popular?'border-amber-800/60':''}`}
              onClick={()=>setRoiPackage(pkg.name)}
            >
              {pkg.popular&&(
                <div className="absolute top-0 right-0">
                  <div className="text-[10px] font-bold bg-amber-500 text-amber-950 px-3 py-1 rounded-bl-xl">POPULAR</div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{pkg.tagline}</p>
                </div>
                {roiPackage===pkg.name&&<CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>}
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(pkg.price)}</p>
              {pkg.roi&&(
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/40">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Year 1 ROI</p>
                  <p className="text-lg font-bold text-emerald-400">{pkg.roi}%</p>
                  {pkg.paybackDays&&<p className="text-[10px] text-emerald-600">Payback in ~{pkg.paybackDays} days</p>}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROI Sliders */}
      {pricingCategory === 'dental' && (
        <div className="card-premium rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5">ROI Projection</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">New patients/month</Label>
                <span className="text-sm font-bold text-emerald-400">{roiNewPatients[0]}</span>
              </div>
              <Slider min={1} max={30} step={1} value={roiNewPatients} onValueChange={setRoiNewPatients} className="[&_[role=slider]]:bg-primary"/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Avg visit value (R)</Label>
                <span className="text-sm font-bold text-emerald-400">R{roiAvgValue[0]}</span>
              </div>
              <Slider min={200} max={3000} step={50} value={roiAvgValue} onValueChange={setRoiAvgValue} className="[&_[role=slider]]:bg-primary"/>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label:'Monthly Revenue', value:formatCurrency(monthlyRevenue), color:'text-emerald-400' },
              { label:'Annual Revenue', value:formatCurrency(annualRevenue), color:'text-emerald-400' },
              { label:'ROI Year 1', value:`${roiPercent}%`, color:roiPercent>500?'text-emerald-400':'text-amber-400' },
            ].map((r,i) => (
              <div key={i} className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground font-medium">{r.label}</p>
                <p className={`text-base font-bold mt-0.5 ${r.color}`}>{r.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-amber-950/30 border border-amber-900/40 rounded-xl p-3">
            <p className="text-sm font-bold text-amber-400">Payback period: <span className="text-foreground">{paybackDays} days</span></p>
            <p className="text-xs text-amber-600 mt-0.5">Net gain Year 1: {formatCurrency(netGainY1)}</p>
          </div>
        </div>
      )}

      {/* Add-ons */}
      <div className="card-premium rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Add-Ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {ADD_ONS.map(addon=>(
            <div key={addon.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${selectedAddOns.includes(addon.id)?'border-primary bg-primary/5':'border-zinc-800 hover:bg-zinc-800/60'}`}
              onClick={()=>{
                setSelectedAddOns((prev: string[]) =>
                  prev.includes(addon.id) ? prev.filter((id: string) => id !== addon.id) : [...prev, addon.id]
                )
              }}
            >
              <Checkbox checked={selectedAddOns.includes(addon.id)} className="mt-0.5 border-zinc-600" readOnly/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{addon.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{addon.desc}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  {addon.onceOff>0&&<span className="text-xs font-bold text-emerald-400">{formatCurrency(addon.onceOff)} once-off</span>}
                  {addon.monthly>0&&<span className="text-xs font-bold text-amber-400">{formatCurrency(addon.monthly)}/mo</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card-premium rounded-xl p-5 border-emerald-900/40" style={{background:'oklch(0.16 0.03 162 / 0.3)',borderColor:'oklch(0.25 0.06 162 / 0.4)'}}>
        <h3 className="text-sm font-semibold text-foreground mb-4">Investment Summary</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label:'Base Package', value:formatCurrency(selectedPkg.price) },
            { label:'Add-Ons (once-off)', value:formatCurrency(addOnTotalOnce) },
            { label:'Monthly Total', value:`${formatCurrency(totalMonthly)}/mo` },
          ].map((s,i) => (
            <div key={i} className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/40">
          <div>
            <p className="text-sm font-bold text-emerald-400">Total Investment (Year 1)</p>
            <p className="text-xs text-emerald-600">Once-off + 12 months add-ons</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(year1Cost)}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Analytics View ───────────────────────────────────────────────────
function AnalyticsView({ stats, leads, analyticsData }: { stats:DashboardStats; leads:Lead[]; analyticsData:any }) {
  const d = analyticsData
  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Deep insights into pipeline performance</p>
        </div>
        <Badge variant="outline" className="border-zinc-700 bg-zinc-800/60 text-muted-foreground">All Time</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Lead Velocity" value={d?.leadVelocity||0} sub="total leads" icon={<MousePointerClick className="h-5 w-5 text-sky-400"/>} accentClass="bg-sky-500/10" delay={0}/>
        <KPICard label="Avg Deal Size" value={d?.avgDealSize>0?formatCurrency(d.avgDealSize):'N/A'} sub="won deals" icon={<DollarSign className="h-5 w-5 text-emerald-400"/>} accentClass="bg-emerald-500/10" delay={0.08}/>
        <KPICard label="Hot Conversion" value={`${d?.hotLeads>0?Math.round((d.hotConverted/d.hotLeads)*100):0}%`} sub={`${d?.hotConverted||0}/${d?.hotLeads||0} converted`} icon={<Flame className="h-5 w-5 text-amber-400"/>} accentClass="bg-amber-500/10" delay={0.16}/>
        <KPICard label="Conversion Rate" value={`${stats.conversionRate}%`} sub={`${stats.wonLeads}/${stats.totalLeads} won`} icon={<TrendingUp className="h-5 w-5 text-violet-400"/>} accentClass="bg-violet-500/10" delay={0.24}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeInUp} transition={{delay:0.3}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-3">Leads by Area</h3>
            <ChartContainer config={tierChartConfig} className="h-[280px] w-full">
              <BarChart data={d?.byArea} layout="vertical" margin={{top:5,right:20,left:80,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a"/>
                <XAxis type="number" tick={{fontSize:11,fill:'#71717a'}}/>
                <YAxis type="category" dataKey="area" tick={{fontSize:11,fill:'#71717a'}} width={80}/>
                <ChartTooltip content={<ChartTooltipContent/>}/>
                <Bar dataKey="count" fill="#10b981" radius={[0,6,6,0]}/>
              </BarChart>
            </ChartContainer>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.35}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-3">Value by Sector</h3>
            <ChartContainer config={sectorChartConfig} className="h-[280px] w-full">
              <BarChart data={d?.bySectorValue} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a"/>
                <XAxis dataKey="sector" tick={{fontSize:10,fill:'#71717a'}}/>
                <YAxis tick={{fontSize:11,fill:'#71717a'}}/>
                <ChartTooltip content={<ChartTooltipContent/>}/>
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {d?.bySectorValue.map((e:any)=><Cell key={e.sector} fill={SECTOR_COLORS[e.sector]||'#52525b'}/>)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.4}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-3">Conversion by Sector</h3>
            <ChartContainer config={sectorChartConfig} className="h-[280px] w-full">
              <BarChart data={d?.conversionBySector} layout="vertical" margin={{top:5,right:20,left:80,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a"/>
                <XAxis type="number" tick={{fontSize:11,fill:'#71717a'}} unit="%"/>
                <YAxis type="category" dataKey="sector" tick={{fontSize:11,fill:'#71717a'}} width={80}/>
                <ChartTooltip content={<ChartTooltipContent/>}/>
                <Bar dataKey="conversion" fill="#f59e0b" radius={[0,6,6,0]}/>
              </BarChart>
            </ChartContainer>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.45}}>
          <div className="card-premium rounded-xl p-5 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-3">Conversion by Tier</h3>
            <ChartContainer config={tierChartConfig} className="h-[280px] w-full">
              <BarChart data={d?.conversionByTier} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a"/>
                <XAxis dataKey="tier" tick={{fontSize:11,fill:'#71717a'}}/>
                <YAxis tick={{fontSize:11,fill:'#71717a'}} unit="%"/>
                <ChartTooltip content={<ChartTooltipContent/>}/>
                <Bar dataKey="conversion" radius={[6,6,0,0]}>
                  {d?.conversionByTier.map((_:any,i:number)=><Cell key={i} fill={['#10b981','#f59e0b','#71717a'][i]}/>)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </motion.div>
      </div>

      {/* Geographic table */}
      <motion.div {...fadeInUp} transition={{delay:0.5}}>
        <div className="card-premium rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Geographic Distribution</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Area</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Leads</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">%</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d?.byArea.map((a:any)=>(
                <TableRow key={a.area} className="border-zinc-800/50 hover:bg-zinc-800/40">
                  <TableCell className="text-sm text-foreground">{a.area}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">{a.count}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{leads.length>0?((a.count/leads.length)*100).toFixed(1):0}%</TableCell>
                  <TableCell>
                    <div className="w-32 h-1.5 bg-zinc-800 rounded-full">
                      <motion.div className="h-1.5 bg-emerald-500 rounded-full" initial={{width:0}} animate={{width:`${leads.length>0?(a.count/leads.length)*100:0}%`}} transition={{duration:0.8}}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Funnel */}
      <motion.div {...fadeInUp} transition={{delay:0.55}}>
        <div className="card-premium rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-2">Stage Conversion Funnel</h3>
          <p className="text-xs text-muted-foreground mb-4">Drop-off at each stage</p>
          <div className="space-y-2.5">
            {stats.byStage.map((stage,i)=>{
              const maxCount=Math.max(...stats.byStage.map(s=>s.count),1)
              const pct=(stage.count/maxCount)*100
              return (
                <motion.div key={stage.stage} className="flex items-center gap-3" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
                  <span className="text-[11px] font-medium w-28 truncate text-muted-foreground">{stage.label}</span>
                  <div className="flex-1 h-8 bg-zinc-800/80 rounded-lg relative overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg"
                      style={{backgroundColor: stage.stage==='won'?'#10b981': stage.stage==='lost'?'#ef444440': STAGE_BG_COLORS[stage.stage]+'40', borderRight:`2px solid ${STAGE_BG_COLORS[stage.stage]}`}}
                      initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.7,delay:i*0.05}}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{stage.count}</span>
                  </div>
                  {i>0&&stats.byStage[i-1].count>0&&(
                    <span className="text-[10px] text-muted-foreground w-12 text-right">{stage.count>0?Math.round((stage.count/stats.byStage[0].count)*100):0}%</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Campaigns View ───────────────────────────────────────────────────
function CampaignsView({ leads, stats, navigateToEmail, openLeadDetail }: {
  leads:Lead[];stats:DashboardStats|null;navigateToEmail:(id?:string)=>void;openLeadDetail:(l:Lead)=>void;
}) {
  const campaigns = useMemo(()=>{
    const tier1Dental=leads.filter(l=>l.sector==='Dental'&&l.tier===1&&l.stage!=='won'&&l.stage!=='lost')
    const tier2Leads=leads.filter(l=>l.tier===2&&l.stage!=='won'&&l.stage!=='lost')
    const funeralSchools=leads.filter(l=>(l.sector==='Funeral'||l.sector==='Education')&&l.stage!=='won'&&l.stage!=='lost')
    return [
      {id:'protolead',name:'ProtoLead Campaign',desc:'Build demos for Tier 1 dental leads',icon:<Rocket className="h-5 w-5"/>,accentClass:'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',leads:tier1Dental},
      {id:'cold-email',name:'Cold Email Blast',desc:'Send personalized emails to Tier 2 leads',icon:<Mail className="h-5 w-5"/>,accentClass:'text-amber-400 bg-amber-950/40 border-amber-800/40',leads:tier2Leads},
      {id:'whatsapp-outreach',name:'WhatsApp Outreach',desc:'Message funeral homes and schools',icon:<MessageSquare className="h-5 w-5"/>,accentClass:'text-violet-400 bg-violet-950/40 border-violet-800/40',leads:funeralSchools},
    ]
  },[leads])

  const outreachQueue = useMemo(()=>leads.filter(l=>l.hotLead&&l.stage!=='won'&&l.stage!=='lost'&&l.status==='active').slice(0,10),[leads])

  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      <div>
        <h2 className="text-lg font-bold text-foreground">Campaigns</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Track outreach campaigns and daily priorities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign, i) => (
          <motion.div key={campaign.id} {...fadeInUp} transition={{delay:i*0.08}}>
            <div className="card-premium rounded-xl p-5 h-full hover:border-zinc-600 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${campaign.accentClass}`}>{campaign.icon}</div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">{campaign.name}</h3>
                  <p className="text-xs text-muted-foreground">{campaign.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Target Leads</span>
                <Badge variant="outline" className="border-zinc-700 bg-zinc-800/60 text-foreground">{campaign.leads.length}</Badge>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full mb-4 overflow-hidden">
                <motion.div className="h-full bg-emerald-500 rounded-full" initial={{width:0}} animate={{width:`${Math.min(campaign.leads.length*5, 100)}%`}} transition={{duration:0.8}}/>
              </div>
              <div className="space-y-1.5">
                {campaign.leads.length===0
                  ? <p className="text-xs text-muted-foreground text-center py-4">No leads</p>
                  : campaign.leads.slice(0,5).map(lead=>(
                  <div key={lead.id} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-700/50">
                    {lead.hotLead&&<Flame className="h-3 w-3 text-amber-400 shrink-0"/>}
                    <span className="truncate flex-1 text-sm text-foreground">{lead.name}</span>
                    <Badge variant="outline" className={`text-[9px] ${STAGE_COLORS[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-400 hover:bg-emerald-950 shrink-0" onClick={()=>navigateToEmail(lead.id)}>
                      <Sparkles className="h-3 w-3"/>
                    </Button>
                  </div>
                ))}
                {campaign.leads.length>5&&<p className="text-xs text-muted-foreground text-center pt-1">+{campaign.leads.length-5} more</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Outreach Queue */}
      <motion.div {...fadeInUp} transition={{delay:0.28}}>
        <div className="card-premium rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="h-5 w-5 text-amber-400"/>
            <h3 className="text-base font-bold text-foreground">Outreach Queue</h3>
            <Badge variant="outline" className="border-amber-800 bg-amber-950/40 text-amber-400">{outreachQueue.length} hot leads</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Priority leads that need contact today</p>
          {outreachQueue.length===0
            ? <p className="text-sm text-muted-foreground text-center py-8">No hot leads in queue</p>
            : (
            <div className="space-y-2">
              {outreachQueue.map(lead=>(
                <motion.div key={lead.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-900/30 bg-amber-950/10 hover:bg-amber-950/20 hover:border-amber-800/50 transition-all"
                  whileHover={{x:4}}
                >
                  <Flame className="h-4 w-4 text-amber-400 shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.sector} · {lead.area||lead.location}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {lead.phone&&(
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-950 border border-sky-900/40" onClick={()=>window.open(`tel:${lead.phone}`)}>
                        <Phone className="h-3 w-3 mr-1"/>Call
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950 border border-emerald-900/40" onClick={()=>navigateToEmail(lead.id)}>
                      <Mail className="h-3 w-3 mr-1"/>Email
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-950 border border-violet-900/40"
                      onClick={()=>lead.phone&&window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g,'')}`)}>
                      <MessageSquare className="h-3 w-3 mr-1"/>WhatsApp
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Lead Detail Dialog ───────────────────────────────────────────────
function LeadDetailDialog({ lead, updateLeadStage, addActivity, activityType, setActivityType, activitySummary, setActivitySummary, activityOutcome, setActivityOutcome, navigateToEmail }: {
  lead:Lead;updateLeadStage:(id:string,s:string)=>void;addActivity:(id:string)=>void;
  activityType:string;setActivityType:(v:string)=>void;activitySummary:string;setActivitySummary:(v:string)=>void;
  activityOutcome:string;setActivityOutcome:(v:string)=>void;navigateToEmail:(id?:string)=>void;
}) {
  return (<>
    <DialogHeader>
      <div className="flex items-center gap-3">
        <div>
          <DialogTitle className="text-xl text-foreground">{lead.name}</DialogTitle>
          <DialogDescription className="mt-0.5" style={{color:SECTOR_COLORS[lead.sector]||undefined}}>{lead.sector} · {lead.location}</DialogDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {lead.hotLead&&<Badge className="bg-amber-950 text-amber-400 border-amber-800 border text-[10px]"><Flame className="h-2.5 w-2.5 mr-1"/>Hot</Badge>}
          <TierBadge tier={lead.tier}/>
        </div>
      </div>
    </DialogHeader>
    <div className="space-y-5 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Details</h4>
          <div className="space-y-2 bg-zinc-800/40 rounded-xl p-3 border border-zinc-800">
            {lead.phone&&<div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground"/><a href={`tel:${lead.phone}`} className="text-emerald-400 hover:underline">{lead.phone}</a></div>}
            {lead.address&&<div className="flex items-start gap-2 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5"/><span className="text-foreground">{lead.address}</span></div>}
            {lead.hours&&<div className="flex items-center gap-2 text-sm"><Clock className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-foreground">{lead.hours}</span></div>}
            {lead.area&&<div className="flex items-center gap-2 text-sm"><Building2 className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-foreground">{lead.area}</span></div>}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lead Profile</h4>
          <div className="space-y-2 bg-zinc-800/40 rounded-xl p-3 border border-zinc-800">
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Rating</span><StarRating rating={lead.rating}/></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Stage</span><Badge variant="outline" className={STAGE_COLORS[lead.stage]}>{STAGE_LABELS[lead.stage]}</Badge></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge variant="outline" className={lead.status==='active'?'bg-emerald-950 text-emerald-400 border-emerald-800':'bg-zinc-800 text-zinc-400 border-zinc-700'}>{lead.status}</Badge></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Est. Value</span><span className="font-bold text-emerald-400">{lead.estimatedValue>0?formatCurrency(lead.estimatedValue):'N/A'}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Website</span>{lead.hasWebsite?<Globe className="h-3.5 w-3.5 text-emerald-400"/>:<span className="text-red-400 text-xs">None</span>}</div>
          </div>
        </div>
      </div>
      {(lead.services||lead.recommendedPackage)&&(
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Services & Package</h4>
          {lead.services&&<p className="text-sm bg-zinc-800/40 border border-zinc-800 rounded-xl p-3 text-foreground">{lead.services}</p>}
          {lead.recommendedPackage&&(
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Recommended:</span>
              <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 border text-[10px]">{lead.recommendedPackage}</Badge>
            </div>
          )}
        </div>
      )}
      {lead.notes&&(
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notes</h4>
          <p className="text-sm bg-zinc-800/40 border border-zinc-800 rounded-xl p-3 whitespace-pre-wrap text-foreground">{lead.notes}</p>
        </div>
      )}
      {lead.nextAction&&(
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Next Action</h4>
          <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-900/40 rounded-xl p-3">
            <ArrowRight className="h-4 w-4 text-amber-400 shrink-0"/>
            <div>
              <p className="text-sm font-medium text-amber-300">{lead.nextAction}</p>
              {lead.nextActionDate&&<p className="text-xs text-amber-600 mt-0.5">Due: {formatDate(lead.nextActionDate)}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Update Stage</h4>
        <Select value={lead.stage} onValueChange={(val)=>updateLeadStage(lead.id,val)}>
          <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-foreground"><SelectValue/></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{STAGES.map(s=><SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button onClick={()=>navigateToEmail(lead.id)} variant="outline" className="w-full border-zinc-700 bg-zinc-800/60 text-foreground hover:bg-zinc-700">
        <Sparkles className="h-4 w-4 mr-2 text-emerald-400"/>Generate Email for {lead.name}
      </Button>
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activity History ({lead.activities?.length||0})</h4>
        <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-4 space-y-3">
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-[130px] bg-zinc-800/60 border-zinc-700 text-foreground"><SelectValue/></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {['call','email','whatsapp','meeting','proposal','demo','note'].map(t=><SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Textarea placeholder="What happened?" value={activitySummary} onChange={e=>setActivitySummary(e.target.value)} className="min-h-[60px] bg-zinc-800/60 border-zinc-700 text-foreground"/>
          <Input placeholder="Outcome (optional)" value={activityOutcome} onChange={e=>setActivityOutcome(e.target.value)} className="bg-zinc-800/60 border-zinc-700 text-foreground"/>
          <Button onClick={()=>addActivity(lead.id)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="sm">
            <Plus className="h-4 w-4 mr-1"/>Add Activity
          </Button>
        </div>
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {!lead.activities?.length
            ? <p className="text-sm text-muted-foreground text-center py-6">No activities recorded</p>
            : lead.activities.map(act=>(
            <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-800/20">
              <div className="mt-0.5 h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">{ACTIVITY_ICONS[act.type]||<AlertCircle className="h-3.5 w-3.5"/>}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-zinc-800 border-zinc-700 text-zinc-400">{act.type}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(act.date)}</span>
                </div>
                <p className="text-sm mt-1 text-foreground">{act.summary}</p>
                {act.outcome&&<p className="text-xs text-emerald-400 mt-1">→ {act.outcome}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>)
}

// ─── Kabelo View ─────────────────────────────────────────────────────
function KabeloView({ leads, stats, navigateTo }: { leads: Lead[]; stats: DashboardStats | null; navigateTo: (p: PageId) => void }) {
  const [activeTab, setActiveTab] = useState<'board'|'checklist'|'prototypes'>('board')
  const [tasks, setTasks] = useState([
    { id:'k1', title:'Build dental practice prototype', sector:'Dental', priority:'high', done:false, due:'Jun 25' },
    { id:'k2', title:'Design attorney landing page template', sector:'Legal', priority:'high', done:false, due:'Jun 27' },
    { id:'k3', title:'Set up construction portfolio site', sector:'Construction', priority:'medium', done:false, due:'Jul 2' },
    { id:'k4', title:'Update S&K credentials page', sector:'General', priority:'medium', done:true, due:'Jun 20' },
    { id:'k5', title:'Build school enrolment form', sector:'Education', priority:'low', done:false, due:'Jul 5' },
    { id:'k6', title:'Create beauty salon booking prototype', sector:'Beauty', priority:'medium', done:false, due:'Jul 8' },
    { id:'k7', title:'Deploy first Neon DB schema', sector:'Tech', priority:'high', done:true, due:'Jun 18' },
    { id:'k8', title:'Optimize page speed for Crown package', sector:'Dental', priority:'medium', done:false, due:'Jul 3' },
  ])
  const [notes, setNotes] = useState('Kabelo: Focus on getting 3 prototypes built this week for the dental niche. The Crown package demo needs to be polished before Sihle sends the next batch of outreach.')

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id===id ? {...t, done:!t.done} : t))

  const prototypePipeline = [
    { name:'Pretoria Dental Centre', sector:'Dental', status:'Building', progress:65, color:'bg-emerald-500' },
    { name:'Mokoena & Associates', sector:'Legal', status:'Review', progress:90, color:'bg-amber-500' },
    { name:'Apex Construction', sector:'Construction', status:'Planned', progress:15, color:'bg-sky-500' },
    { name:'Bright Minds Academy', sector:'Education', status:'Building', progress:40, color:'bg-violet-500' },
    { name:'Glam Studio SA', sector:'Beauty', status:'Planned', progress:5, color:'bg-rose-500' },
  ]

  const deliverableChecklist = [
    { id:'d1', label:'Discovery notes', done:true },
    { id:'d2', label:'Business goal definition', done:true },
    { id:'d3', label:'Target customer profile', done:true },
    { id:'d4', label:'Competitor review', done:false },
    { id:'d5', label:'Prototype build', done:false },
    { id:'d6', label:'Client feedback session', done:false },
    { id:'d7', label:'Final design approval', done:false },
    { id:'d8', label:'Written sign-off', done:false },
    { id:'d9', label:'Development build', done:false },
    { id:'d10', label:'Mobile testing', done:false },
    { id:'d11', label:'Contact form testing', done:false },
    { id:'d12', label:'SEO basics', done:false },
    { id:'d13', label:'Analytics setup', done:false },
    { id:'d14', label:'Go-live launch', done:false },
    { id:'d15', label:'30-day post-launch review', done:false },
  ]
  const [checklist, setChecklist] = useState(deliverableChecklist)
  const toggleCheck = (id: string) => setChecklist(prev => prev.map(c => c.id===id ? {...c, done:!c.done} : c))
  const checkPct = Math.round((checklist.filter(c=>c.done).length/checklist.length)*100)

  const doneTasks = tasks.filter(t=>t.done).length
  const totalTasks = tasks.length

  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden" style={{background:'linear-gradient(135deg, #0d1f17 0%, #0a1520 60%, #0d0d18 100%)', border:'1px solid rgba(16,185,129,0.25)'}}>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.08]" style={{background:'radial-gradient(circle, #10b981, transparent 70%)'}}/>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/20 shrink-0">K</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded-full">Build &amp; Strategy</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Kabelo&apos;s Workspace</h1>
              <p className="text-sm text-white/40 mt-1">Prototypes. Design. Build. Delivery. — Kabelo brings the vision to life.</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-400">{doneTasks}<span className="text-sm text-zinc-600">/{totalTasks}</span></p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Tasks Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-sky-400">{prototypePipeline.filter(p=>p.status==='Building').length}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">In Build</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Prototypes Built', value: leads.filter(l=>l.stage==='demo_sent'||l.stage==='won').length, color:'text-emerald-400', bg:'bg-emerald-500/10', icon:<Code2 className="h-5 w-5 text-emerald-400"/> },
          { label:'Builds Won', value: stats?.wonLeads||0, color:'text-amber-400', bg:'bg-amber-500/10', icon:<Award className="h-5 w-5 text-amber-400"/> },
          { label:'Active Projects', value: leads.filter(l=>l.status==='active'&&l.stage==='won').length, color:'text-sky-400', bg:'bg-sky-500/10', icon:<Layers className="h-5 w-5 text-sky-400"/> },
          { label:'Tasks Complete', value: `${doneTasks}/${totalTasks}`, color:'text-violet-400', bg:'bg-violet-500/10', icon:<CheckSquare className="h-5 w-5 text-violet-400"/> },
        ].map((s,i)=>(
          <div key={i} className="card-premium rounded-xl p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.bg} shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-800/60 rounded-xl w-fit">
        {([['board','Task Board'],['checklist','Project Checklist'],['prototypes','Prototype Pipeline']] as const).map(([t,label])=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab===t?'bg-emerald-600 text-white shadow-sm':'text-muted-foreground hover:text-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab==='board'&&(
          <motion.div key="board" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-premium rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Build Tasks</h3>
                  <span className="text-[10px] text-muted-foreground">{doneTasks}/{totalTasks} done</span>
                </div>
                <div className="space-y-2">
                  {tasks.map(task=>(
                    <div key={task.id} onClick={()=>toggleTask(task.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${task.done?'bg-zinc-800/20 border-zinc-800/40 opacity-60':'bg-zinc-800/40 border-zinc-700/60 hover:border-emerald-800/60'}`}>
                      <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${task.done?'bg-emerald-500 border-emerald-500':'border-zinc-600 hover:border-emerald-500'}`}>
                        {task.done&&<CheckCircle2 className="h-3 w-3 text-white"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.done?'line-through text-muted-foreground':'text-foreground'}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{task.sector}</span>
                          <span className="text-[10px] text-zinc-600">·</span>
                          <span className="text-[10px] text-zinc-500">Due {task.due}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${task.priority==='high'?'bg-rose-950 text-rose-400':task.priority==='medium'?'bg-amber-950 text-amber-400':'bg-zinc-800 text-zinc-500'}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="card-premium rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Build Notes</h3>
                  <Textarea
                    value={notes} onChange={e=>setNotes(e.target.value)}
                    className="min-h-[120px] bg-zinc-800/60 border-zinc-700 text-foreground resize-none text-sm"
                    placeholder="Add build notes, decisions, blockers..."
                  />
                  <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs" onClick={()=>toast.success('Notes saved!')}>
                    <Save className="h-3.5 w-3.5 mr-1.5"/>Save Notes
                  </Button>
                </div>
                <div className="card-premium rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Offer Stack</h3>
                  <div className="space-y-2">
                    {[
                      { name:'Launch Package', price:'R6,500', desc:'Small businesses — clean, credible presence', color:'text-emerald-400' },
                      { name:'Growth Package', price:'R15,000', desc:'Established businesses — trust + lead gen', color:'text-amber-400' },
                      { name:'Premium System', price:'R35,000+', desc:'Apps, portals, dashboards, automation', color:'text-violet-400' },
                    ].map((p,i)=>(
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.desc}</p>
                        </div>
                        <p className={`text-sm font-black ${p.color}`}>{p.price}</p>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="mt-3 w-full text-xs border border-zinc-700 hover:bg-zinc-800 text-foreground" onClick={()=>navigateTo('pricing')}>
                    <Calculator className="h-3.5 w-3.5 mr-1.5"/>Open Pricing Calculator
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab==='checklist'&&(
          <motion.div key="checklist" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
            <div className="card-premium rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Client Project Checklist</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{checklist.filter(c=>c.done).length}/{checklist.length}</span>
                  <div className="h-2 w-32 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500 rounded-full" initial={{width:0}} animate={{width:`${checkPct}%`}} transition={{duration:0.8}}/>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{checkPct}%</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checklist.map((item,i)=>(
                  <div key={item.id} onClick={()=>toggleCheck(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${item.done?'bg-emerald-950/20 border-emerald-900/30 opacity-70':'bg-zinc-800/40 border-zinc-700/60 hover:border-emerald-800/40'}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${item.done?'bg-emerald-500 border-emerald-500':'border-zinc-600'}`}>
                      {item.done&&<CheckCircle2 className="h-3.5 w-3.5 text-white"/>}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[10px] font-black text-zinc-600 w-5">{String(i+1).padStart(2,'0')}</span>
                      <span className={`text-sm ${item.done?'line-through text-muted-foreground':'text-foreground'}`}>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab==='prototypes'&&(
          <motion.div key="prototypes" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
            <div className="card-premium rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground">Prototype Pipeline</h3>
                <Button size="sm" variant="ghost" className="text-xs border border-zinc-700 hover:bg-zinc-800 text-foreground h-7" onClick={()=>toast.info('Add prototype flow coming soon')}>
                  <Plus className="h-3.5 w-3.5 mr-1.5"/>Add Prototype
                </Button>
              </div>
              <div className="space-y-3">
                {prototypePipeline.map((p,i)=>(
                  <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/60 hover:border-zinc-600 transition-all">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:SECTOR_COLORS[p.sector]+'20',color:SECTOR_COLORS[p.sector]}}>
                      {SECTOR_ICONS[p.sector]||<Layers className="h-5 w-5"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${p.status==='Building'?'bg-emerald-950 text-emerald-400':p.status==='Review'?'bg-amber-950 text-amber-400':'bg-zinc-800 text-zinc-500'}`}>{p.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${p.color} rounded-full`} initial={{width:0}} animate={{width:`${p.progress}%`}} transition={{duration:0.8,delay:i*0.08}}/>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground w-8 text-right">{p.progress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Sihle View ───────────────────────────────────────────────────────
function SihleView({ leads, stats, navigateTo, openLeadDetail }: { leads: Lead[]; stats: DashboardStats | null; navigateTo: (p: PageId) => void; openLeadDetail: (l: Lead) => void }) {
  const [activeTab, setActiveTab] = useState<'outreach'|'followups'|'tracker'>('outreach')
  const [outreachNotes, setOutreachNotes] = useState('Sihle: Push hard on dentist niche this week. 40 contacts minimum. Use the Crown package prototype as the main hook. Remember: the goal is conversations, not closes — keep messages under 100 words.')

  const outreachQueue = useMemo(() =>
    leads.filter(l=>l.stage==='new'||l.stage==='contacted').sort((a,b)=>b.rating-a.rating).slice(0,8),
  [leads])

  const followUpQueue = useMemo(() =>
    leads.filter(l=>['contacted','demo_sent','meeting_booked'].includes(l.stage)).sort((a,b)=>{
      const da = a.lastContact ? new Date(a.lastContact).getTime() : 0
      const db = b.lastContact ? new Date(b.lastContact).getTime() : 0
      return da - db
    }).slice(0,8),
  [leads])

  const weeklyOutreach = [
    { label:'Leads Researched', target:50, current:Math.min(leads.length,50), color:'bg-emerald-500' },
    { label:'Businesses Contacted', target:40, current:Math.min(leads.filter(l=>l.stage!=='new').length,40), color:'bg-sky-500' },
    { label:'Prototype Links Sent', target:10, current:Math.min(leads.filter(l=>l.stage==='demo_sent').length,10), color:'bg-violet-500' },
    { label:'Follow-ups Sent', target:60, current:Math.min(leads.filter(l=>l.activities&&l.activities.length>0).length*2,60), color:'bg-amber-500' },
    { label:'Calls / Voice Notes', target:20, current:Math.min(leads.filter(l=>l.activities?.some(a=>a.type==='call')).length,20), color:'bg-rose-500' },
    { label:'Meetings Booked', target:5, current:Math.min(leads.filter(l=>l.stage==='meeting_booked').length,5), color:'bg-emerald-400' },
    { label:'Proposals Sent', target:3, current:Math.min(leads.filter(l=>l.stage==='proposal_sent').length,3), color:'bg-orange-500' },
    { label:'Deals Closed', target:1, current:Math.min(leads.filter(l=>l.stage==='won').length,1), color:'bg-emerald-400' },
  ]

  const followUpSequence = [
    { day:'Day 1', action:'Send prototype link', channel:'WhatsApp', tip:'Lead with the prototype. Keep under 100 words.' },
    { day:'Day 2', action:'Ask if they viewed it', channel:'WhatsApp', tip:'"Did you get a chance to check the preview?"' },
    { day:'Day 4', action:'Send a short voice note', channel:'WhatsApp', tip:'15 seconds max. Friendly tone. Ask one question.' },
    { day:'Day 7', action:'Offer 15-min walkthrough', channel:'Call', tip:'"5 minutes on a call — I can show you exactly what changes."' },
    { day:'Day 14', action:'Send before/after comparison', channel:'Email', tip:'Visual proof beats verbal promises every time.' },
    { day:'Day 30', action:'Check in with entry offer', channel:'WhatsApp', tip:'"We have a R6,500 starter package — no obligation."' },
  ]

  const contactedLeads = leads.filter(l=>l.stage!=='new').length
  const meetingsBooked = leads.filter(l=>l.stage==='meeting_booked').length
  const proposalsSent = leads.filter(l=>l.stage==='proposal_sent').length

  return (
    <motion.div className="space-y-5" {...fadeInUp}>
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden" style={{background:'linear-gradient(135deg, #1a1200 0%, #0d1520 55%, #0d0d18 100%)', border:'1px solid rgba(245,158,11,0.25)'}}>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.08]" style={{background:'radial-gradient(circle, #f59e0b, transparent 70%)'}}/>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-amber-500/20 shrink-0">S</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-950/80 border border-amber-800/50 px-2 py-0.5 rounded-full">Sales &amp; Outreach</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Sihle&apos;s Workspace</h1>
              <p className="text-sm text-white/40 mt-1">Conversations. Conversions. Closings. — Sihle opens the door.</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">{contactedLeads}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Contacted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-400">{meetingsBooked}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Meetings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-violet-400">{proposalsSent}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Proposals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Leads', value:stats?.totalLeads||0, color:'text-amber-400', bg:'bg-amber-500/10', icon:<Users className="h-5 w-5 text-amber-400"/> },
          { label:'Hot Leads', value:stats?.hotLeads||0, color:'text-rose-400', bg:'bg-rose-500/10', icon:<Flame className="h-5 w-5 text-rose-400"/> },
          { label:'Meetings Booked', value:meetingsBooked, color:'text-emerald-400', bg:'bg-emerald-500/10', icon:<Calendar className="h-5 w-5 text-emerald-400"/> },
          { label:'Proposals Sent', value:proposalsSent, color:'text-violet-400', bg:'bg-violet-500/10', icon:<Send className="h-5 w-5 text-violet-400"/> },
        ].map((s,i)=>(
          <div key={i} className="card-premium rounded-xl p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.bg} shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-800/60 rounded-xl w-fit">
        {([['outreach','Outreach Queue'],['followups','Follow-Up Sequence'],['tracker','Weekly Tracker']] as const).map(([t,label])=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab===t?'bg-amber-600 text-white shadow-sm':'text-muted-foreground hover:text-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab==='outreach'&&(
          <motion.div key="outreach" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-premium rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Outreach Queue</h3>
                  <span className="text-[10px] text-muted-foreground">{outreachQueue.length} leads ready</span>
                </div>
                <div className="space-y-2">
                  {outreachQueue.length===0
                    ? <p className="text-sm text-muted-foreground text-center py-8">No leads in outreach queue</p>
                    : outreachQueue.map((lead,i)=>(
                    <motion.div key={lead.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 hover:border-amber-800/50 transition-all group cursor-pointer"
                      onClick={()=>openLeadDetail(lead)}>
                      <div className="h-8 w-8 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                          {lead.hotLead&&<Flame className="h-3 w-3 text-amber-400 shrink-0"/>}
                        </div>
                        <p className="text-xs text-muted-foreground">{lead.sector} · {lead.area||lead.location}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <StarRating rating={lead.rating}/>
                        <TierBadge tier={lead.tier}/>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button size="sm" className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-white text-xs" onClick={()=>navigateTo('leads')}>
                  <Users className="h-3.5 w-3.5 mr-1.5"/>View All Leads
                </Button>
              </div>

              <div className="space-y-4">
                <div className="card-premium rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Outreach Notes</h3>
                  <Textarea
                    value={outreachNotes} onChange={e=>setOutreachNotes(e.target.value)}
                    className="min-h-[100px] bg-zinc-800/60 border-zinc-700 text-foreground resize-none text-sm"
                    placeholder="Daily outreach notes, targets, blockers..."
                  />
                  <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-500 text-white text-xs" onClick={()=>toast.success('Notes saved!')}>
                    <Save className="h-3.5 w-3.5 mr-1.5"/>Save Notes
                  </Button>
                </div>
                <div className="card-premium rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">WhatsApp Template</h3>
                  <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Hi, I&apos;m Sihle. We reviewed your current online presence and built a quick premium preview showing how your business could look with a stronger, more modern website.
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-2">
                      Here is the live preview: <span className="text-amber-400">[prototype link]</span>
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-2">
                      Would you like me to send a quick breakdown?
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="mt-3 w-full text-xs border border-zinc-700 hover:bg-zinc-800 text-foreground" onClick={()=>{navigator.clipboard?.writeText('Hi, I\'m Sihle. We reviewed your current online presence and built a quick premium preview showing how your business could look. Here is the live preview: [prototype link]. Would you like a quick breakdown?');toast.success('Template copied!')}}>
                    <Copy className="h-3.5 w-3.5 mr-1.5"/>Copy Template
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="w-full text-xs border border-zinc-700 hover:bg-zinc-800 text-foreground h-9" onClick={()=>navigateTo('email')}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-emerald-400"/>Open Email Generator
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab==='followups'&&(
          <motion.div key="followups" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-premium rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Follow-Up Cadence</h3>
                <div className="space-y-2">
                  {followUpSequence.map((s,i)=>(
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                      <div className="h-8 w-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-amber-400">{s.day.replace('Day ','D')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-foreground">{s.action}</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{s.channel}</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">{s.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Rule of 7</p>
                  <p className="text-xs text-amber-300/60">It takes ~7 touchpoints to convert. Each follow-up must add something new — a different angle, fresh proof, or a new insight. Never just &ldquo;checking in.&rdquo;</p>
                </div>
              </div>
              <div className="card-premium rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Follow-Up Queue</h3>
                  <span className="text-[10px] text-muted-foreground">{followUpQueue.length} leads</span>
                </div>
                <div className="space-y-2">
                  {followUpQueue.length===0
                    ? <p className="text-sm text-muted-foreground text-center py-8">No leads in follow-up queue</p>
                    : followUpQueue.map((lead,i)=>(
                    <div key={lead.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 hover:border-amber-800/50 transition-all cursor-pointer group" onClick={()=>openLeadDetail(lead)}>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className={`text-[9px] ${STAGE_COLORS[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</Badge>
                          {lead.lastContact&&<span className="text-[10px] text-muted-foreground">{formatRelativeDate(lead.lastContact)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-950" onClick={e=>{e.stopPropagation();toast.info(`Call ${lead.phone}`)}}><Phone className="h-3.5 w-3.5"/></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-emerald-400 hover:bg-emerald-950" onClick={e=>{e.stopPropagation();toast.info('Opening WhatsApp...')}}><MessageSquare className="h-3.5 w-3.5"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab==='tracker'&&(
          <motion.div key="tracker" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-premium rounded-xl p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Target className="h-4 w-4 text-amber-400"/>
                  <h3 className="text-sm font-semibold text-foreground">Weekly Activity Tracker</h3>
                  <span className="ml-auto text-[10px] text-muted-foreground">This Week</span>
                </div>
                <div className="space-y-4">
                  {weeklyOutreach.map((t,i)=>{
                    const pct = Math.min((t.current/t.target)*100,100)
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-foreground">{t.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-foreground">{t.current}<span className="text-muted-foreground font-normal text-[11px]">/{t.target}</span></span>
                            <span className={`text-[10px] font-bold ${pct>=100?'text-emerald-400':pct>=60?'text-amber-400':'text-zinc-500'}`}>{Math.round(pct)}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${t.color} rounded-full`} initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,delay:i*0.07}}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-4">
                <div className="card-premium rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Sales Psychology Tips</h3>
                  <div className="space-y-2.5">
                    {[
                      { tip:'Show before asking. The prototype link eliminates cold call friction.', color:'text-amber-400' },
                      { tip:'WhatsApp has a 95% open rate in SA. Always lead there.', color:'text-emerald-400' },
                      { tip:'"Don\'t miss out" beats "You could gain" by 2x. Use loss framing.', color:'text-sky-400' },
                      { tip:'Interest-based CTAs outperform meeting requests by 3x.', color:'text-violet-400' },
                      { tip:'Most money is made in follow-up — not the first message.', color:'text-rose-400' },
                    ].map((s,i)=>(
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                        <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${s.color.replace('text-','bg-')}`}/>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-premium rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">B-BBEE Advantage</h3>
                  <div className="bg-emerald-950/30 border border-emerald-900/30 rounded-xl p-3 space-y-1.5">
                    {[
                      { label:'Status', value:'B-BBEE Level 1', color:'text-emerald-400' },
                      { label:'Recognition', value:'135% Procurement', color:'text-amber-400' },
                      { label:'CIPC Reg.', value:'2025/907839/07', color:'text-foreground' },
                      { label:'Ownership', value:'100% Black & Youth-Owned', color:'text-emerald-400' },
                    ].map((r,i)=>(
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{r.label}</span>
                        <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-2">Lead every corporate pitch with B-BBEE credentials. Target government sectors: Education, Healthcare.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats,setStats]=useState<DashboardStats|null>(null)
  const [leads,setLeads]=useState<Lead[]>([])
  const [selectedLead,setSelectedLead]=useState<Lead|null>(null)
  const [leadDialogOpen,setLeadDialogOpen]=useState(false)
  const [activePage,setActivePage]=useState<PageId>('dashboard')
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const [searchQuery,setSearchQuery]=useState('')
  const [filterSector,setFilterSector]=useState('all')
  const [filterTier,setFilterTier]=useState('all')
  const [filterStage,setFilterStage]=useState('all')
  const [filterHot,setFilterHot]=useState('all')
  const [activityType,setActivityType]=useState('note')
  const [activitySummary,setActivitySummary]=useState('')
  const [activityOutcome,setActivityOutcome]=useState('')
  const [emailLeadId,setEmailLeadId]=useState('')
  const [selectedTemplateId,setSelectedTemplateId]=useState<string|null>(null)
  const [emailCategoryFilter,setEmailCategoryFilter]=useState('all')
  const [emailEditedBody,setEmailEditedBody]=useState('')
  const [emailEditing,setEmailEditing]=useState(false)
  const [showFullSequence,setShowFullSequence]=useState(false)
  const [pricingCategory,setPricingCategory]=useState<'dental'|'general'|'school'>('dental')
  const [roiNewPatients,setRoiNewPatients]=useState([5])
  const [roiAvgValue,setRoiAvgValue]=useState([750])
  const [roiPackage,setRoiPackage]=useState('Crown')
  const [selectedAddOns,setSelectedAddOns]=useState<string[]>([])

  const fetchStats = useCallback(async()=>{try{const res=await fetch('/api/stats');setStats(await res.json())}catch(e){console.error(e)}},[])
  const fetchLeads = useCallback(async()=>{
    try{const p=new URLSearchParams()
      if(searchQuery)p.set('search',searchQuery);if(filterSector!=='all')p.set('sector',filterSector)
      if(filterTier!=='all')p.set('tier',filterTier);if(filterStage!=='all')p.set('stage',filterStage)
      if(filterHot!=='all')p.set('hotLead',filterHot)
      const res=await fetch(`/api/leads?${p.toString()}`);setLeads(await res.json())
    }catch(e){console.error(e)}},[searchQuery,filterSector,filterTier,filterStage,filterHot])

  useEffect(()=>{(async()=>{setLoading(true);await Promise.all([fetchStats(),fetchLeads()]);setLoading(false)})()},[])
  useEffect(()=>{const t=setTimeout(fetchLeads,300);return()=>clearTimeout(t)},[searchQuery,filterSector,filterTier,filterStage,filterHot])

  const openLeadDetail=(lead:Lead)=>{setSelectedLead(lead);setLeadDialogOpen(true)}
  const updateLeadStage=async(leadId:string,newStage:string)=>{
    try{const res=await fetch(`/api/leads/${leadId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stage:newStage})});
    setSelectedLead(await res.json());fetchStats();fetchLeads();toast.success(`Moved to ${STAGE_LABELS[newStage]}`)}
    catch{toast.error('Failed to update stage')}
  }
  const addActivity=async(leadId:string)=>{
    if(!activitySummary.trim()){toast.error('Enter an activity summary');return}
    try{await fetch(`/api/leads/${leadId}/activities`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:activityType,summary:activitySummary,outcome:activityOutcome})});
    setActivitySummary('');setActivityOutcome('');const res=await fetch(`/api/leads/${leadId}`);setSelectedLead(await res.json());fetchStats();toast.success('Activity added')}
    catch{toast.error('Failed to add activity')}
  }

  const currentPackages=PRICING_PACKAGES[pricingCategory]
  const selectedPkg=currentPackages.find(p=>p.name===roiPackage)||currentPackages[0]
  const monthlyRevenue=roiNewPatients[0]*roiAvgValue[0]
  const annualRevenue=monthlyRevenue*12
  const paybackDays=monthlyRevenue>0?Math.round((selectedPkg.price/monthlyRevenue)*30):999
  const netGainY1=annualRevenue-selectedPkg.price
  const roiPercent=selectedPkg.price>0?Math.round((netGainY1/selectedPkg.price)*100):0
  const addOnTotalOnce=selectedAddOns.reduce((sum,id)=>{const a=ADD_ONS.find(x=>x.id===id);return sum+(a?.onceOff||0)},0)
  const addOnTotalMonthly=selectedAddOns.reduce((sum,id)=>{const a=ADD_ONS.find(x=>x.id===id);return sum+(a?.monthly||0)},0)

  const analyticsData = useMemo(()=>{
    if(!leads.length||!stats)return null
    const byArea=new Map<string,number>();const bySectorValue=new Map<string,number>()
    leads.forEach(l=>{const area=l.area||l.location||'Unknown';byArea.set(area,(byArea.get(area)||0)+1);bySectorValue.set(l.sector,(bySectorValue.get(l.sector)||0)+(l.estimatedValue||0))})
    const conversionBySector=stats.bySector.map(s=>{const sl=leads.filter(l=>l.sector===s.sector);const won=sl.filter(l=>l.stage==='won').length;return{sector:s.sector,conversion:sl.length>0?Math.round((won/sl.length)*100):0}})
    const conversionByTier=stats.byTier.map(t=>{const tn=parseInt(t.tier.replace('Tier ',''));const tl=leads.filter(l=>l.tier===tn);const won=tl.filter(l=>l.stage==='won').length;return{tier:t.tier,conversion:tl.length>0?Math.round((won/tl.length)*100):0}})
    const hotL=leads.filter(l=>l.hotLead);const hotC=hotL.filter(l=>l.stage==='won').length
    const avgDeal=leads.filter(l=>l.stage==='won').length>0?leads.filter(l=>l.stage==='won').reduce((s,l)=>s+(l.estimatedValue||0),0)/leads.filter(l=>l.stage==='won').length:0
    return{byArea:Array.from(byArea.entries()).map(([area,count])=>({area,count})).sort((a,b)=>b.count-a.count),bySectorValue:Array.from(bySectorValue.entries()).map(([sector,value])=>({sector,value})).sort((a,b)=>b.value-a.value),conversionBySector,conversionByTier,hotLeads:hotL.length,hotConverted:hotC,avgDealSize:avgDeal,leadVelocity:leads.length}
  },[leads,stats])

  const pipelineStages=STAGES.filter(s=>s!=='won'&&s!=='lost')
  const pageTitle=ALL_NAV_ITEMS.find(n=>n.id===activePage)?.label||'Overview'
  const navigateToEmail=(leadId?:string)=>{setActivePage('email');if(leadId){setEmailLeadId(leadId);setSelectedTemplateId(null);setEmailEditing(false);setShowFullSequence(false)}}
  const navigateTo=(page:PageId)=>setActivePage(page)

  // ── Sidebar ──
  const SidebarContent=()=>(
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <motion.div
          className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-emerald-500/10"
          whileHover={{scale:1.05}} transition={{type:'spring',stiffness:300}}
        >
          <Image src="/launchproof-logo.png" alt="LaunchProof Studio" width={36} height={36} className="w-full h-full object-cover"/>
        </motion.div>
        {!sidebarCollapsed&&(
          <div className="min-w-0">
            <h1 className="text-sm font-black text-foreground tracking-tight truncate leading-tight">LaunchProof</h1>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-tight">Studio</p>
          </div>
        )}
      </div>

      <div className="mx-4 h-px bg-zinc-800"/>

      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map(section=>(
          <div key={section.label}>
            {!sidebarCollapsed&&<p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.15em] px-3 mb-2">{section.label}</p>}
            <div className="space-y-0.5">
              {section.items.map(item=>(
                <TooltipProvider key={item.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={()=>{setActivePage(item.id);setSidebarOpen(false)}}
                        className={`w-full flex items-center gap-3 rounded-xl transition-all duration-150 ${sidebarCollapsed?'justify-center px-2 py-2.5':'px-3 py-2.5'} ${
                          activePage===item.id
                            ? item.accent==='amber'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-900/50'
                              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50'
                            :'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 border border-transparent'
                        }`}
                      >
                        {item.icon}
                        {!sidebarCollapsed&&<span className="text-sm font-semibold">{item.label}</span>}
                        {!sidebarCollapsed&&activePage===item.id&&<ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60"/>}
                      </button>
                    </TooltipTrigger>
                    {sidebarCollapsed&&<TooltipContent side="right" className="bg-zinc-800 border-zinc-700 text-foreground"><p>{item.label}</p></TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-4 h-px bg-zinc-800"/>

      {/* Partner Profiles */}
      {!sidebarCollapsed ? (
        <div className="p-4 space-y-2">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.15em] px-1 mb-3">Partners</p>
          {[
            { initials:'KB', name:'Kabelo', role:'Build & Strategy', color:'from-emerald-500 to-teal-600' },
            { initials:'SG', name:'Sihle', role:'Sales & Outreach', color:'from-amber-500 to-orange-600' },
          ].map(p=>(
            <div key={p.initials} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{p.initials}</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 space-y-2 flex flex-col items-center">
          {[
            { initials:'KB', color:'from-emerald-500 to-teal-600' },
            { initials:'SG', color:'from-amber-500 to-orange-600' },
          ].map(p=>(
            <div key={p.initials} className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-xs`}>{p.initials}</div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">

        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col border-r border-zinc-800/60 transition-all duration-300 shrink-0 relative ${sidebarCollapsed?'w-[68px]':'w-[240px]'}`}
          style={{background:'oklch(0.08 0.005 240)'}}>
          <SidebarContent/>
          <button
            onClick={()=>setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute top-1/2 -right-3 z-10 w-6 h-6 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-foreground hover:bg-zinc-700 transition-colors shadow-lg"
          >
            {sidebarCollapsed?<ChevronRight className="h-3.5 w-3.5"/>:<ChevronLeft className="h-3.5 w-3.5"/>}
          </button>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[260px] p-0 border-zinc-800" style={{background:'oklch(0.08 0.005 240)'}}>
            <SidebarContent/>
          </SheetContent>
        </Sheet>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-zinc-800/60 backdrop-blur-xl" style={{background:'oklch(0.10 0.005 240 / 0.85)'}}>
            <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
              <button onClick={()=>setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
                <Menu className="h-5 w-5"/>
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-zinc-600 text-xs hidden sm:inline">LaunchProof Studio</span>
                <ChevronRight className="h-3 w-3 text-zinc-700 hidden sm:inline"/>
                <span className="font-bold text-foreground">{pageTitle}</span>
              </div>

              <div className="flex-1"/>

              {/* Global search */}
              <div className="hidden md:flex relative w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600"/>
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  className="pl-9 h-8 bg-zinc-800/60 border-zinc-700 text-foreground placeholder:text-zinc-600 text-sm focus:border-primary"
                />
              </div>

              {/* Quick Action */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-sm text-zinc-400 hover:text-foreground hover:bg-zinc-800 h-8">
                    <Plus className="h-4 w-4"/><span className="hidden md:inline text-xs">Quick Action</span><ChevronDown className="h-3 w-3"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={()=>toast.info('Navigate to Leads')} className="text-foreground hover:bg-zinc-800"><Plus className="h-4 w-4 mr-2"/>New Lead</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>navigateToEmail()} className="text-foreground hover:bg-zinc-800"><Sparkles className="h-4 w-4 mr-2"/>Generate Email</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>toast.info('Report exported!')} className="text-foreground hover:bg-zinc-800"><Download className="h-4 w-4 mr-2"/>Export Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="relative p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors">
                    <Bell className="h-4.5 w-4.5"/>
                    {stats?.hotLeads ? (
                      <span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 bg-amber-500 rounded-full text-[9px] font-bold text-amber-950 flex items-center justify-center px-1">{stats.hotLeads}</span>
                    ) : null}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-zinc-700 text-foreground"><p>{stats?.hotLeads||0} hot leads</p></TooltipContent>
              </Tooltip>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-800 hover:bg-zinc-800/50 rounded-lg pr-2 py-1 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-[10px]">KB</div>
                    <span className="text-xs font-semibold text-zinc-300 hidden xl:inline">Kabelo</span>
                    <ChevronDown className="h-3 w-3 text-zinc-600 hidden xl:inline"/>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem className="text-foreground hover:bg-zinc-800"><Settings className="h-4 w-4 mr-2"/>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800"/>
                  <DropdownMenuItem className="text-red-400 hover:bg-zinc-800 hover:text-red-400"><LogOut className="h-4 w-4 mr-2"/>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
              {loading ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[1,2,3,4].map(i=><SkeletonCard key={i}/>)}</div>
                  <div className="card-premium rounded-xl h-64 animate-pulse"/>
                  <div className="card-premium rounded-xl h-64 animate-pulse"/>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={activePage} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
                    {activePage==='dashboard'&&stats&&<DashboardView stats={stats} leads={leads} openLeadDetail={openLeadDetail} navigateTo={navigateTo}/>}
                    {activePage==='leads'&&<LeadsView leads={leads} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterSector={filterSector} setFilterSector={setFilterSector} filterTier={filterTier} setFilterTier={setFilterTier} filterStage={filterStage} setFilterStage={setFilterStage} filterHot={filterHot} setFilterHot={setFilterHot} openLeadDetail={openLeadDetail} stats={stats} navigateToEmail={navigateToEmail}/>}
                    {activePage==='pipeline'&&<PipelineView leads={leads} stats={stats} pipelineStages={pipelineStages} updateLeadStage={updateLeadStage} openLeadDetail={openLeadDetail} navigateToEmail={navigateToEmail}/>}
                    {activePage==='kabelo'&&<KabeloView leads={leads} stats={stats} navigateTo={navigateTo}/>}
                    {activePage==='sihle'&&<SihleView leads={leads} stats={stats} navigateTo={navigateTo} openLeadDetail={openLeadDetail}/>}
                    {activePage==='email'&&<EmailGeneratorView leads={leads} emailLeadId={emailLeadId} setEmailLeadId={setEmailLeadId} selectedTemplateId={selectedTemplateId} setSelectedTemplateId={setSelectedTemplateId} emailCategoryFilter={emailCategoryFilter} setEmailCategoryFilter={setEmailCategoryFilter} emailEditedBody={emailEditedBody} setEmailEditedBody={setEmailEditedBody} emailEditing={emailEditing} setEmailEditing={setEmailEditing} showFullSequence={showFullSequence} setShowFullSequence={setShowFullSequence} addActivity={addActivity} openLeadDetail={openLeadDetail}/>}
                    {activePage==='strategies'&&<StrategiesView/>}
                    {activePage==='pricing'&&<PricingView pricingCategory={pricingCategory} setPricingCategory={setPricingCategory} roiNewPatients={roiNewPatients} setRoiNewPatients={setRoiNewPatients} roiAvgValue={roiAvgValue} setRoiAvgValue={setRoiAvgValue} roiPackage={roiPackage} setRoiPackage={setRoiPackage} selectedAddOns={selectedAddOns} setSelectedAddOns={setSelectedAddOns} currentPackages={currentPackages} selectedPkg={selectedPkg} monthlyRevenue={monthlyRevenue} annualRevenue={annualRevenue} paybackDays={paybackDays} netGainY1={netGainY1} roiPercent={roiPercent} addOnTotalOnce={addOnTotalOnce} addOnTotalMonthly={addOnTotalMonthly}/>}
                    {activePage==='analytics'&&analyticsData&&<AnalyticsView stats={stats!} leads={leads} analyticsData={analyticsData}/>}
                    {activePage==='campaigns'&&<CampaignsView leads={leads} stats={stats} navigateToEmail={navigateToEmail} openLeadDetail={openLeadDetail}/>}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </main>
        </div>

        {/* Lead Detail Dialog */}
        <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-zinc-900 border-zinc-800">
            {selectedLead&&<LeadDetailDialog lead={selectedLead} updateLeadStage={updateLeadStage} addActivity={addActivity} activityType={activityType} setActivityType={setActivityType} activitySummary={activitySummary} setActivitySummary={setActivitySummary} activityOutcome={activityOutcome} setActivityOutcome={setActivityOutcome} navigateToEmail={navigateToEmail}/>}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
