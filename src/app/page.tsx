'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
type PageId = 'dashboard' | 'leads' | 'pipeline' | 'email' | 'strategies' | 'pricing' | 'analytics' | 'campaigns'

// ─── Constants ───────────────────────────────────────────────────────
const STAGES = ['new','contacted','demo_sent','meeting_booked','proposal_sent','negotiation','won','lost'] as const
const STAGE_LABELS: Record<string,string> = {
  new:'New',contacted:'Contacted',demo_sent:'Demo Sent',meeting_booked:'Meeting Booked',
  proposal_sent:'Proposal Sent',negotiation:'Negotiation',won:'Won',lost:'Lost',
}
const STAGE_COLORS: Record<string,string> = {
  new:'bg-slate-100 text-slate-700 border-slate-200',contacted:'bg-sky-100 text-sky-700 border-sky-200',
  demo_sent:'bg-violet-100 text-violet-700 border-violet-200',meeting_booked:'bg-amber-100 text-amber-700 border-amber-200',
  proposal_sent:'bg-orange-100 text-orange-700 border-orange-200',negotiation:'bg-rose-100 text-rose-700 border-rose-200',
  won:'bg-emerald-100 text-emerald-700 border-emerald-200',lost:'bg-red-100 text-red-700 border-red-200',
}
const STAGE_BG_COLORS: Record<string,string> = {
  new:'#94a3b8',contacted:'#0ea5e9',demo_sent:'#8b5cf6',meeting_booked:'#f59e0b',
  proposal_sent:'#f97316',negotiation:'#f43f5e',won:'#10b981',lost:'#ef4444',
}
const SECTOR_ICONS: Record<string,React.ReactNode> = {
  Dental:<Stethoscope className="h-4 w-4"/>,Legal:<Gavel className="h-4 w-4"/>,
  Funeral:<HeartPulse className="h-4 w-4"/>,Hospitality:<Hotel className="h-4 w-4"/>,
  Logistics:<Truck className="h-4 w-4"/>,Construction:<HardHat className="h-4 w-4"/>,
  Education:<GraduationCap className="h-4 w-4"/>,Medical:<HeartPulse className="h-4 w-4"/>,
}
const SECTOR_COLORS: Record<string,string> = {
  Dental:'#059669',Legal:'#d97706',Funeral:'#dc2626',Hospitality:'#7c3aed',
  Logistics:'#0891b2',Construction:'#ea580c',Education:'#2563eb',Medical:'#db2777',
}
const ACTIVITY_ICONS: Record<string,React.ReactNode> = {
  call:<Phone className="h-3.5 w-3.5"/>,email:<Mail className="h-3.5 w-3.5"/>,
  whatsapp:<MessageSquare className="h-3.5 w-3.5"/>,meeting:<Calendar className="h-3.5 w-3.5"/>,
  proposal:<Target className="h-3.5 w-3.5"/>,demo:<Rocket className="h-3.5 w-3.5"/>,
  note:<AlertCircle className="h-3.5 w-3.5"/>,
}

interface NavSection { label: string; items: { id: PageId; label: string; icon: React.ReactNode }[] }
const NAV_SECTIONS: NavSection[] = [
  { label: 'MAIN', items: [
    { id:'dashboard', label:'Dashboard', icon:<LayoutDashboard className="h-5 w-5"/> },
    { id:'leads', label:'Leads', icon:<Users className="h-5 w-5"/> },
    { id:'pipeline', label:'Pipeline', icon:<GitBranch className="h-5 w-5"/> },
  ]},
  { label: 'TOOLS', items: [
    { id:'email', label:'Email Generator', icon:<Sparkles className="h-5 w-5"/> },
    { id:'strategies', label:'Strategies', icon:<Target className="h-5 w-5"/> },
    { id:'pricing', label:'Pricing Calculator', icon:<Calculator className="h-5 w-5"/> },
  ]},
  { label: 'INSIGHTS', items: [
    { id:'analytics', label:'Analytics', icon:<TrendingUp className="h-5 w-5"/> },
    { id:'campaigns', label:'Campaigns', icon:<ClipboardList className="h-5 w-5"/> },
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

const EMAIL_TEMPLATES = [
  { id:'cold-intro', name:'Cold Introduction', type:'cold', tone:'professional', desc:'First contact email introducing Carter Digitals' },
  { id:'follow-up', name:'Follow-Up Touch', type:'followup', tone:'friendly', desc:'Second touch with added value angle' },
  { id:'demo-invite', name:'Demo Invite', type:'cold', tone:'casual', desc:'Invite to see a custom-built demo site' },
  { id:'proposal-follow', name:'Proposal Follow-Up', type:'followup', tone:'professional', desc:'Check in after sending a proposal' },
  { id:'breakup', name:'Breakup Email', type:'breakup', tone:'professional', desc:'Professional closing — leave the door open' },
  { id:'whatsapp-opener', name:'WhatsApp Opener', type:'whatsapp', tone:'casual', desc:'Short conversational WhatsApp message' },
  { id:'linkedin-connect', name:'LinkedIn Connection', type:'linkedin', tone:'professional', desc:'Connection request with personalized note' },
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
    name: lead.name,
    sector: lead.sector,
    subSector: lead.subSector,
    location: lead.location,
    area: lead.area,
    rating: lead.rating,
    tier: lead.tier,
    services: lead.services,
    recommendedPackage: lead.recommendedPackage,
    estimatedValue: lead.estimatedValue,
    phone: lead.phone,
    onlinePresence: lead.onlinePresence,
    notes: lead.notes,
  }
}

function ChannelBadge({ channel }: { channel: string }) {
  const styles: Record<string, string> = {
    email: 'bg-sky-100 text-sky-700 border-sky-200',
    whatsapp: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    linkedin: 'bg-violet-100 text-violet-700 border-violet-200',
    phone: 'bg-amber-100 text-amber-700 border-amber-200',
  }
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="h-3 w-3"/>,
    whatsapp: <MessageSquare className="h-3 w-3"/>,
    linkedin: <UserCircle className="h-3 w-3"/>,
    phone: <Phone className="h-3 w-3"/>,
  }
  return <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${styles[channel]||'bg-gray-100 text-gray-700'}`}>{icons[channel]}{channel.charAt(0).toUpperCase()+channel.slice(1)}</Badge>
}

// ─── Animated Count Hook ─────────────────────────────────────────────
function useAnimatedCount(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    let start = 0; const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * target)
      setCount(start)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])
  return count
}

// ─── Small Components ────────────────────────────────────────────────
function TierBadge({ tier }: { tier: number }) {
  const c={1:'bg-emerald-100 text-emerald-700 border-emerald-200',2:'bg-amber-100 text-amber-700 border-amber-200',3:'bg-slate-100 text-slate-700 border-slate-200'}
  return <Badge variant="outline" className={c[tier]||c[3]}>Tier {tier}</Badge>
}
function StarRating({ rating }: { rating: number }) {
  return (<div className="flex items-center gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} className={`h-3.5 w-3.5 ${s<=Math.round(rating)?'text-amber-400 fill-amber-400':'text-gray-300'}`}/>)}
  <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span></div>)
}
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const d:Record<string,string>={Beginner:'bg-emerald-100 text-emerald-700',Intermediate:'bg-amber-100 text-amber-700',Advanced:'bg-rose-100 text-rose-700'}
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d[difficulty]||d.Beginner}`}>{difficulty}</span>
}
function LoadingSpinner() {
  return (<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"/></div>)
}
function SkeletonCard() {
  return <Card className="border-0 shadow-sm"><CardContent className="p-6"><Skeleton className="h-4 w-24 mb-2"/><Skeleton className="h-8 w-16 mb-1"/><Skeleton className="h-3 w-32"/></CardContent></Card>
}

// ─── Chart Configs ───────────────────────────────────────────────────
const sectorChartConfig: ChartConfig = {
  Dental:{label:'Dental',color:'#059669'},Legal:{label:'Legal',color:'#d97706'},Funeral:{label:'Funeral',color:'#dc2626'},
  Hospitality:{label:'Hospitality',color:'#7c3aed'},Logistics:{label:'Logistics',color:'#0891b2'},
  Construction:{label:'Construction',color:'#ea580c'},Education:{label:'Education',color:'#2563eb'},Medical:{label:'Medical',color:'#db2777'},
}
const tierChartConfig: ChartConfig = { count:{label:'Leads',color:'#059669'} }
const funnelChartConfig: ChartConfig = { count:{label:'Leads',color:'#059669'} }
const pipelineChartConfig: ChartConfig = {
  count:{label:'Leads',color:'#059669'},value:{label:'Value (R)',color:'#d97706'}
}

// ─── Motion Variants ─────────────────────────────────────────────────
const fadeInUp = { initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:0.4} }
const staggerContainer = { animate:{transition:{staggerChildren:0.08}} }
const scaleIn = { initial:{opacity:0,scale:0.95},animate:{opacity:1,scale:1},transition:{duration:0.3} }

// ─── Animated KPI Card ──────────────────────────────────────────────
function AnimatedKPICard({ label, value, sub, icon, bg, valueColor, trend, trendValue, delay=0 }: {
  label: string; value: string|number; sub: string; icon: React.ReactNode; bg: string;
  valueColor?: string; trend?: 'up'|'down'; trendValue?: string; delay?: number
}) {
  const numVal = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g,'')) || 0
  const animated = useAnimatedCount(numVal, 1500)
  const displayVal = typeof value === 'number' ? animated : value

  return (
    <motion.div {...fadeInUp} transition={{duration:0.4,delay}}>
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
          <div className={`h-full w-full ${bg.replace('50','500')} rounded-full -translate-y-8 translate-x-8`}/>
        </div>
        <CardContent className="p-4 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className={`text-2xl sm:text-3xl font-bold ${valueColor||'text-gray-900'}`}>{displayVal}</p>
              <div className="flex items-center gap-2">
                {trend && trendValue && (
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend==='up'?'text-emerald-600':'text-red-500'}`}>
                    {trend==='up'?<ArrowUpRight className="h-3 w-3"/>:<ArrowDownRight className="h-3 w-3"/>}{trendValue}
                  </span>
                )}
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
            <motion.div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center`} whileHover={{scale:1.1,rotate:5}} transition={{type:'spring',stiffness:300}}>
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Mini Sparkline ──────────────────────────────────────────────────
function MiniSparkline({ data, color='#059669', width=80, height=32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if(data.length<2) return null
  const min = Math.min(...data); const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v,i) => `${(i/(data.length-1))*width},${height-((v-min)/range)*height}`).join(' ')
  return (
    <svg width={width} height={height} className="inline-block">
      <defs><linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#grad-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Dashboard View ──────────────────────────────────────────────────
function DashboardView({ stats, leads, openLeadDetail }: { stats: DashboardStats; leads: Lead[]; openLeadDetail: (l: Lead) => void }) {
  const [selectedSector, setSelectedSector] = useState<string|null>(null)

  const topHotLeads = useMemo(() =>
    leads.filter(l=>l.hotLead&&l.stage!=='won'&&l.stage!=='lost').sort((a,b)=>b.rating-a.rating).slice(0,5),
  [leads])

  const revenueForecast = useMemo(() => {
    const active = leads.filter(l=>l.stage!=='won'&&l.stage!=='lost'&&l.status==='active')
    const weighted = active.reduce((s,l) => {
      const prob = {new:0.05,contacted:0.15,demo_sent:0.25,meeting_booked:0.4,proposal_sent:0.6,negotiation:0.75}[l.stage]||0.1
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

  const sparkData = useMemo(() => {
    return stats.byStage.map(s => s.count)
  }, [stats])

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {/* Welcome Banner */}
      <motion.div {...fadeInUp}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white overflow-hidden relative">
          <CardContent className="p-5 sm:p-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Welcome back, Kabelo</h2>
                <p className="text-emerald-100 mt-1 text-sm">Here&apos;s what&apos;s happening with your pipeline today.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0" onClick={()=>toast.info('Report exported!')}>
                  <Download className="h-4 w-4 mr-1.5"/>Export
                </Button>
                <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50">
                  <Sparkles className="h-4 w-4 mr-1.5"/>Quick Generate
                </Button>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"/>
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-16"/>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedKPICard label="Total Leads" value={stats.totalLeads} sub={`${stats.activePipeline} active pipeline`} icon={<Users className="h-6 w-6 text-emerald-600"/>} bg="bg-emerald-50" trend="up" trendValue="+12%" delay={0}/>
        <AnimatedKPICard label="Hot Leads" value={stats.hotLeads} sub="Priority contacts" icon={<Flame className="h-6 w-6 text-amber-500"/>} bg="bg-amber-50" valueColor="text-amber-600" trend="up" trendValue="+3" delay={0.1}/>
        <AnimatedKPICard label="Pipeline Value" value={stats.pipelineValue} sub={`${stats.wonLeads} won | ${stats.lostLeads} lost`} icon={<DollarSign className="h-6 w-6 text-emerald-600"/>} bg="bg-emerald-50" trend="up" trendValue="+R45K" delay={0.2}/>
        <AnimatedKPICard label="Conversion" value={`${stats.conversionRate}%`} sub={`of ${stats.totalLeads} total leads`} icon={<TrendingUp className="h-6 w-6 text-violet-600"/>} bg="bg-violet-50" valueColor="text-violet-600" delay={0.3}/>
      </div>

      {/* Revenue Forecast + Top Leads Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp} transition={{delay:0.35}} className="lg:col-span-1">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-600"/>Revenue Forecast</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium">Weighted Pipeline</p>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(revenueForecast.weightedPipeline)}</p>
                <p className="text-xs text-emerald-500 mt-1">probability-adjusted value</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Monthly (est.)</p><p className="text-lg font-bold">{formatCurrency(revenueForecast.mrr)}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Annual (est.)</p><p className="text-lg font-bold">{formatCurrency(revenueForecast.arr)}</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.4}} className="lg:col-span-2">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Flame className="h-4 w-4 text-amber-500"/>Top Hot Leads</CardTitle><CardDescription>Highest-priority leads to contact first</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topHotLeads.length===0?<p className="text-sm text-muted-foreground text-center py-6">No hot leads right now</p>:topHotLeads.map((lead,i)=>(
                  <motion.div key={lead.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50/50 transition-colors cursor-pointer group" onClick={()=>openLeadDetail(lead)}>
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">#{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><p className="font-medium text-sm truncate">{lead.name}</p><Flame className="h-3.5 w-3.5 text-amber-500"/></div>
                      <div className="flex items-center gap-2 mt-0.5"><span className="text-xs text-muted-foreground">{lead.sector}</span><span className="text-xs text-muted-foreground">·</span><span className="text-xs text-muted-foreground">{lead.area||lead.location}</span></div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StarRating rating={lead.rating}/>
                      {lead.estimatedValue>0&&<span className="text-xs font-semibold text-emerald-600">{formatCurrency(lead.estimatedValue)}</span>}
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600 transition-colors"/>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Funnel */}
      <motion.div {...fadeInUp} transition={{delay:0.45}}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Pipeline Funnel</CardTitle><CardDescription>Lead distribution with conversion flow</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.byStage.map((stage,i)=>{
                const maxCount=Math.max(...stats.byStage.map(s=>s.count),1)
                const pct=(stage.count/maxCount)*100
                const convPct = i>0&&stats.byStage[0].count>0?Math.round((stage.count/stats.byStage[0].count)*100):100
                return (
                  <motion.div key={stage.stage} className="flex items-center gap-3" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}>
                    <span className="text-xs font-medium w-24 shrink-0 truncate text-right">{stage.label}</span>
                    <div className="flex-1 h-9 bg-gray-100 rounded-lg relative overflow-hidden">
                      <motion.div className={`h-full rounded-lg ${stage.stage==='won'?'bg-emerald-500':stage.stage==='lost'?'bg-red-400':'bg-gradient-to-r from-emerald-400 to-teal-400'}`}
                        initial={{width:0}} animate={{width:`${Math.max(pct,2)}%`}} transition={{duration:0.6,delay:i*0.05,ease:'easeOut'}}/>
                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        <span className="text-xs font-bold text-gray-700 drop-shadow-sm">{stage.count}</span>
                        <span className="text-xs text-gray-500">{convPct}%</span>
                      </div>
                    </div>
                    {i>0&&stats.byStage[i-1].count>0&&(
                      <span className={`text-xs font-semibold w-16 text-right ${stage.count>0?'text-emerald-600':'text-red-500'}`}>
                        {stats.byStage[i-1].count>0?Math.round((stage.count/stats.byStage[i-1].count)*100):0}%
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sector Performance Table + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp} transition={{delay:0.5}}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sector Performance</CardTitle></CardHeader>
            <CardContent>
              <Table><TableHeader><TableRow className="bg-gray-50/50">
                <TableHead className="text-xs font-semibold cursor-pointer hover:text-emerald-600" onClick={()=>setSelectedSector(selectedSector?null:null)}>Sector</TableHead>
                <TableHead className="text-xs font-semibold text-right">Leads</TableHead>
                <TableHead className="text-xs font-semibold text-right hidden sm:table-cell">Value</TableHead>
                <TableHead className="text-xs font-semibold text-right hidden md:table-cell">Conv.</TableHead>
                <TableHead className="text-xs font-semibold text-right hidden lg:table-cell">Rating</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {sectorPerfTable.map(s=>(
                  <TableRow key={s.sector} className="cursor-pointer hover:bg-emerald-50/30" onClick={()=>{setSelectedSector(s.sector);toast.info(`Filtered: ${s.sector}`)}}>
                    <TableCell><div className="flex items-center gap-2">{SECTOR_ICONS[s.sector]||<Building2 className="h-3.5 w-3.5"/>}<span className="text-sm font-medium">{s.sector}</span></div></TableCell>
                    <TableCell className="text-right font-semibold">{s.leads}</TableCell>
                    <TableCell className="text-right text-sm hidden sm:table-cell font-medium">{s.value>0?formatCurrency(s.value):'—'}</TableCell>
                    <TableCell className="text-right hidden md:table-cell"><span className={`text-xs font-semibold ${s.conversion>0?'text-emerald-600':'text-muted-foreground'}`}>{s.conversion}%</span></TableCell>
                    <TableCell className="text-right hidden lg:table-cell"><span className="text-xs">{s.avgRating}★</span></TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.55}}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Leads by Sector</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={sectorChartConfig} className="h-[300px] w-full">
                <PieChart><Pie data={stats.bySector} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="sector" paddingAngle={2} animationBegin={200} animationDuration={800}>
                  {stats.bySector.map((entry)=><Cell key={entry.sector} fill={SECTOR_COLORS[entry.sector]||'#6b7280'}/>)}
                </Pie><ChartTooltip content={<ChartTooltipContent/>}/><ChartLegend content={<ChartLegendContent nameKey="sector"/>}/></PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tier Distribution + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp} transition={{delay:0.6}}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Lead Quality Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={tierChartConfig} className="h-[280px] w-full">
                <BarChart data={stats.byTier} layout="vertical" margin={{top:5,right:20,left:50,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fontSize:11}}/>
                  <YAxis type="category" dataKey="tier" tick={{fontSize:12}} width={50}/>
                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <Bar dataKey="count" radius={[0,6,6,0]} animationDuration={800}>
                    {stats.byTier.map((entry,index)=><Cell key={entry.tier} fill={['#059669','#d97706','#6b7280'][index]}/>)}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{delay:0.65}}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                {stats.recentActivities.length===0?<p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>:stats.recentActivities.map((a,i)=>(
                  <motion.div key={a.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={()=>{const l=leads.find(x=>x.id===a.leadId);if(l)openLeadDetail(l)}}>
                    <div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 text-xs">{ACTIVITY_ICONS[a.type]||<AlertCircle className="h-3.5 w-3.5"/>}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5"><span className="font-medium text-sm truncate">{a.lead?.name}</span><Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0">{a.type}</Badge></div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{a.summary}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatRelativeDate(a.date)}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div {...fadeInUp} transition={{delay:0.7}}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions:</span>
              <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs"><Sparkles className="h-3.5 w-3.5 mr-1.5"/>Generate Email</Button>
              <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50 text-xs"><Flame className="h-3.5 w-3.5 mr-1.5"/>View Hot Leads</Button>
              <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50 text-xs"><ClipboardList className="h-3.5 w-3.5 mr-1.5"/>Campaigns</Button>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs"><BarChart3 className="h-3.5 w-3.5 mr-1.5"/>Run Analysis</Button>
            </div>
          </CardContent>
        </Card>
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
  const [bulkStage, setBulkStage] = useState('')

  const allSelected = leads.length > 0 && leads.every(l => selectedIds.has(l.id))

  const toggleSelectAll = () => {
    if (allSelected) { setSelectedIds(new Set()) }
    else { setSelectedIds(new Set(leads.map(l => l.id))) }
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
    if (d === 1) return '1d'
    if (d < 30) return `${d}d`
    return `${Math.floor(d/30)}mo`
  }

  return (
    <motion.div className="space-y-4" {...fadeInUp}>
      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center"><Users className="h-4 w-4 text-emerald-600"/></div>
          <div><p className="text-xs text-muted-foreground">Total Leads</p><p className="text-lg font-bold">{stats?.totalLeads||0}</p></div>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center"><Flame className="h-4 w-4 text-amber-500"/></div>
          <div><p className="text-xs text-muted-foreground">Hot Leads</p><p className="text-lg font-bold text-amber-600">{stats?.hotLeads||0}</p></div>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sky-50 flex items-center justify-center"><Star className="h-4 w-4 text-sky-600"/></div>
          <div><p className="text-xs text-muted-foreground">Avg Rating</p><p className="text-lg font-bold">{avgRating}★</p></div>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center"><DollarSign className="h-4 w-4 text-violet-600"/></div>
          <div><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold">{formatCurrency(totalValue)}</p></div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm"><CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input placeholder="Search by name, sector, or location..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="pl-9"/></div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterSector} onValueChange={setFilterSector}><SelectTrigger className="w-[130px]"><Filter className="h-4 w-4 mr-1.5"/><SelectValue placeholder="Sector"/></SelectTrigger><SelectContent><SelectItem value="all">All Sectors</SelectItem>{['Dental','Legal','Funeral','Hospitality','Logistics','Construction','Education','Medical'].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={filterTier} onValueChange={setFilterTier}><SelectTrigger className="w-[110px]"><SelectValue placeholder="Tier"/></SelectTrigger><SelectContent><SelectItem value="all">All Tiers</SelectItem><SelectItem value="1">Tier 1</SelectItem><SelectItem value="2">Tier 2</SelectItem><SelectItem value="3">Tier 3</SelectItem></SelectContent></Select>
            <Select value={filterStage} onValueChange={setFilterStage}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Stage"/></SelectTrigger><SelectContent><SelectItem value="all">All Stages</SelectItem>{STAGES.map(s=><SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}</SelectContent></Select>
            <Select value={filterHot} onValueChange={setFilterHot}><SelectTrigger className="w-[100px]"><Flame className="h-4 w-4 mr-1.5"/><SelectValue placeholder="Hot"/></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="true">Hot Only</SelectItem><SelectItem value="false">Not Hot</SelectItem></SelectContent></Select>
          </div>
        </div>
      </CardContent></Card>

      {/* Table */}
      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50/50">
          <TableHead className="text-xs font-semibold w-10"><Checkbox checked={allSelected} onCheckedChange={toggleSelectAll}/></TableHead>
          <TableHead className="text-xs font-semibold">Name</TableHead><TableHead className="text-xs font-semibold">Sector</TableHead>
          <TableHead className="text-xs font-semibold hidden sm:table-cell">Tier</TableHead><TableHead className="text-xs font-semibold hidden md:table-cell">Rating</TableHead>
          <TableHead className="text-xs font-semibold">Stage</TableHead>
          <TableHead className="text-xs font-semibold hidden lg:table-cell">Last Action</TableHead>
          <TableHead className="text-xs font-semibold hidden sm:table-cell">Days</TableHead>
          <TableHead className="text-xs font-semibold hidden sm:table-cell">Value</TableHead>
          <TableHead className="text-xs font-semibold text-center">Hot</TableHead>
          <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
        </TableRow></TableHeader><TableBody>
          {leads.length===0?<TableRow><TableCell colSpan={11} className="text-center py-12 text-muted-foreground">No leads found</TableCell></TableRow>:
            leads.map(lead=>(
              <TableRow key={lead.id} className={`cursor-pointer hover:bg-emerald-50/30 ${selectedIds.has(lead.id)?'bg-emerald-50/50':''}`} onClick={()=>openLeadDetail(lead)}>
                <TableCell onClick={(e)=>e.stopPropagation()}><Checkbox checked={selectedIds.has(lead.id)} onCheckedChange={()=>toggleSelect(lead.id)}/></TableCell>
                <TableCell><div className="flex items-center gap-2">{lead.hotLead&&<Flame className="h-3.5 w-3.5 text-amber-500 shrink-0"/>}<span className="font-medium text-sm truncate max-w-[160px]">{lead.name}</span></div></TableCell>
                <TableCell><div className="flex items-center gap-1.5">{SECTOR_ICONS[lead.sector]||<Building2 className="h-3.5 w-3.5"/>}<span className="text-sm">{lead.sector}</span></div></TableCell>
                <TableCell className="hidden sm:table-cell"><TierBadge tier={lead.tier}/></TableCell>
                <TableCell className="hidden md:table-cell"><StarRating rating={lead.rating}/></TableCell>
                <TableCell><Badge variant="outline" className={`text-[11px] ${STAGE_COLORS[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[120px] truncate">{lead.nextAction||'—'}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{daysSinceContact(lead.lastContact)}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm font-medium">{lead.estimatedValue>0?formatCurrency(lead.estimatedValue):'—'}</TableCell>
                <TableCell className="text-center">{lead.hotLead?<Flame className="h-4 w-4 text-amber-500 mx-auto"/>:<span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="text-right" onClick={(e)=>e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-0.5">
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50" onClick={()=>toast.info(`Call ${lead.phone}`)}><Phone className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>Call</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={()=>toast.info('Opening WhatsApp...')}><MessageSquare className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>WhatsApp</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-violet-600 hover:text-violet-700 hover:bg-violet-50" onClick={()=>navigateToEmail(lead.id)}><Mail className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>Email</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={()=>openLeadDetail(lead)} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-7 w-7 p-0"><Eye className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>View Details</TooltipContent></Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
    <p className="text-xs text-muted-foreground text-center">Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}</p>

    {/* Bulk Action Bar */}
    <AnimatePresence>
      {selectedIds.size > 0 && (
        <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}} transition={{type:'spring',stiffness:300,damping:30}}>
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <Separator orientation="vertical" className="h-6 bg-gray-600"/>
            <Select value={bulkStage} onValueChange={(v)=>{if(v!=='_'){toast.success(`Moving ${selectedIds.size} leads to ${STAGE_LABELS[v]}`);setSelectedIds(new Set());setBulkStage('')}}}>
              <SelectTrigger className="w-[150px] h-8 text-xs bg-gray-800 border-gray-700 text-white"><SelectValue placeholder="Move to Stage"/></SelectTrigger>
              <SelectContent>{STAGES.filter(s=>s!=='won'&&s!=='lost').map(s=><SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-amber-400 hover:text-amber-300 hover:bg-gray-800" onClick={()=>{toast.success(`Marked ${selectedIds.size} leads as hot`);setSelectedIds(new Set())}}>
              <Flame className="h-3.5 w-3.5 mr-1"/>Mark Hot
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-gray-800" onClick={()=>toast.info('Exporting selected leads...')}>
              <Download className="h-3.5 w-3.5 mr-1"/>Export
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white hover:bg-gray-800" onClick={()=>setSelectedIds(new Set())}>
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
      {/* Pipeline Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center"><DollarSign className="h-4 w-4 text-emerald-600"/></div>
          <div><p className="text-xs text-muted-foreground">Pipeline Value</p><p className="text-lg font-bold">{formatCurrency(stats?.pipelineValue||0)}</p></div>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-amber-600"/></div>
          <div><p className="text-xs text-muted-foreground">Avg Deal Size</p><p className="text-lg font-bold">{formatCurrency(avgDealSize)}</p></div>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sky-50 flex items-center justify-center"><Activity className="h-4 w-4 text-sky-600"/></div>
          <div><p className="text-xs text-muted-foreground">Velocity (week)</p><p className="text-lg font-bold">3 <span className="text-xs font-normal text-muted-foreground">moved</span></p></div>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-violet-600"/></div>
          <div><p className="text-xs text-muted-foreground">Win Rate</p><p className="text-lg font-bold">{stats?.conversionRate||0}%</p></div>
        </CardContent></Card>
      </div>

      {/* Search + Header */}
      <div className="flex items-center gap-3 flex-col sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input placeholder="Search leads across all stages..." value={pipelineSearch} onChange={(e)=>setPipelineSearch(e.target.value)} className="pl-9"/></div>
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{stats?.activePipeline||0} active leads</Badge>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map(stage=>{
          const stageLeads=filteredLeads.filter(l=>l.stage===stage)
          const stageCount=stats?.byStage.find(s=>s.stage===stage)?.count||0
          const stageValue=stageSummaries.find(s=>s.stage===stage)?.value||0
          return (
            <div key={stage} className="flex-shrink-0 w-[280px] sm:w-[300px]">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="h-2.5 w-2.5 rounded-full" style={{backgroundColor:STAGE_BG_COLORS[stage]}}/>
                <h3 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">{stageCount}</Badge>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
                {stageLeads.length===0?<div className="border border-dashed border-gray-200 rounded-xl p-6 text-center"><p className="text-xs text-muted-foreground">No leads</p></div>:stageLeads.map(lead=>{
                  const daysInStage = lead.updatedAt ? Math.floor((Date.now()-new Date(lead.updatedAt).getTime())/(1000*60*60*24)) : 0
                  return (
                  <motion.div key={lead.id} className={`bg-white rounded-xl border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${lead.hotLead?'border-l-4 border-l-amber-400 border-r border-t border-b border-gray-200':'border border-gray-200'}`} whileHover={{y:-2}} onClick={()=>openLeadDetail(lead)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{lead.sector}</p>
                      </div>
                      {lead.hotLead&&<Flame className="h-4 w-4 text-amber-500 shrink-0"/>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <TierBadge tier={lead.tier}/>
                        <span className="text-xs text-muted-foreground">{lead.rating.toFixed(1)}★</span>
                      </div>
                      {lead.estimatedValue>0&&<span className="text-xs font-semibold text-emerald-600">{formatCurrency(lead.estimatedValue)}</span>}
                    </div>
                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100" onClick={(e)=>e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50" onClick={()=>toast.info(`Call ${lead.phone}`)}><Phone className="h-3 w-3"/></Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={()=>toast.info('Opening WhatsApp...')}><MessageSquare className="h-3 w-3"/></Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-violet-600 hover:text-violet-700 hover:bg-violet-50" onClick={()=>navigateToEmail(lead.id)}><Mail className="h-3 w-3"/></Button>
                      <span className="ml-auto text-[10px] text-muted-foreground">{daysInStage}d</span>
                    </div>
                    <div className="mt-2">
                      <Select value={lead.stage} onValueChange={(val)=>updateLeadStage(lead.id,val)} onOpenChange={(open)=>{if(!open)return}}>
                        <SelectTrigger className="h-7 text-xs border-gray-200 w-full" onClick={(e)=>e.stopPropagation()}><SelectValue/></SelectTrigger>
                        <SelectContent onClick={(e)=>e.stopPropagation()}>{STAGES.map(s=><SelectItem key={s} value={s} className="text-xs">{STAGE_LABELS[s]}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )})}
              </div>
              <div className="mt-2 px-1 text-xs text-muted-foreground">{formatCurrency(stageValue)} total</div>
            </div>
          )
        })}
      </div>

      {/* Stage Summary Bar */}
      <Card className="border-0 shadow-sm"><CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Stage Summary</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {stageSummaries.map((s, i) => {
            const convRate = i > 0 && stageSummaries[0].count > 0
              ? Math.round((s.count / stageSummaries[0].count) * 100) : 100
            return (
              <div key={s.stage} className="text-center">
                <div className="h-2 w-2 rounded-full mx-auto mb-1.5" style={{backgroundColor:STAGE_BG_COLORS[s.stage]}}/>
                <p className="text-xs text-muted-foreground">{STAGE_LABELS[s.stage]}</p>
                <p className="text-sm font-bold">{s.count}</p>
                <p className="text-[10px] text-muted-foreground">{formatCurrency(s.value)}</p>
                <p className="text-[10px] font-medium text-emerald-600">{convRate}% conv</p>
              </div>
            )
          })}
        </div>
      </CardContent></Card>

      {/* Won/Lost */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600"/><span className="font-semibold">Won</span><span className="ml-auto text-2xl font-bold text-emerald-600">{stats?.wonLeads||0}</span></div></CardContent></Card>
        <Card className="border-0 shadow-sm border-l-4 border-l-red-400"><CardContent className="p-4"><div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500"/><span className="font-semibold">Lost</span><span className="ml-auto text-2xl font-bold text-red-500">{stats?.lostLeads||0}</span></div></CardContent></Card>
      </div>
    </motion.div>
  )
}

// ─── Email Generator View (Template Library) ───────────────────────────
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
    navigator.clipboard.writeText(text).then(()=>toast.success('Copied to clipboard!')).catch(()=>toast.error('Failed to copy'))
  }

  const saveAsActivity = async () => {
    if (!emailLeadId || !displayedBody.trim()) return
    try {
      await fetch(`/api/leads/${emailLeadId}/activities`, {
        method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          type: renderedTemplate?.channel === 'whatsapp' ? 'whatsapp' : renderedTemplate?.channel === 'phone' ? 'call' : 'email',
          summary: `Template: ${renderedTemplate?.name || selectedTemplateId}`,
          outcome: displayedBody.substring(0, 200)
        })
      })
      toast.success('Saved as activity!')
    } catch { toast.error('Failed to save activity') }
  }

  const wordCount = displayedBody.split(/\s+/).filter(Boolean).length
  const charCount = displayedBody.length

  return (
    <motion.div className="space-y-6" {...fadeInUp}>
      <div><h2 className="text-lg font-semibold">Template Library</h2><p className="text-sm text-muted-foreground">Browse, preview, and send outreach templates from the library</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Selector */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Select a Lead</CardTitle></CardHeader>
          <CardContent><div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto">
            {sortedLeads.length===0?<p className="text-sm text-muted-foreground text-center py-8">No leads available</p>:
              sortedLeads.map(lead=>(
                <button key={lead.id} onClick={()=>{setEmailLeadId(lead.id);setSelectedTemplateId(null);setEmailEditing(false);setShowFullSequence(false)}}
                  className={`w-full text-left p-3 rounded-lg transition-all ${emailLeadId===lead.id?'bg-emerald-50 border border-emerald-200 shadow-sm':'hover:bg-gray-50 border border-transparent'}`}>
                  <div className="flex items-center gap-2">{lead.hotLead&&<Flame className="h-3.5 w-3.5 text-amber-500 shrink-0"/>}<span className="font-medium text-sm truncate">{lead.name}</span>
                    <Eye className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 cursor-pointer hover:text-emerald-600" onClick={(e)=>{e.stopPropagation();openLeadDetail(lead)}}/></div>
                  <div className="flex items-center gap-2 mt-1"><span className="text-xs text-muted-foreground">{lead.sector}</span><TierBadge tier={lead.tier}/><span className="text-xs text-muted-foreground ml-auto">{lead.rating.toFixed(1)}★</span></div>
                </button>
              ))}
          </div></CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {selectedLead ? (<>
            {/* Lead Info */}
            <motion.div {...scaleIn}><Card className="border-0 shadow-sm"><CardContent className="p-4">
              <div className="flex items-start justify-between"><div><h3 className="font-semibold">{selectedLead.name}</h3><p className="text-sm text-muted-foreground">{selectedLead.sector} · {selectedLead.area||selectedLead.location}</p></div>
                <div className="flex items-center gap-2">{selectedLead.hotLead&&<Badge className="bg-amber-100 text-amber-700 border-amber-200 border"><Flame className="h-3 w-3 mr-1"/>Hot</Badge>}<TierBadge tier={selectedLead.tier}/></div></div>
              {selectedLead.recommendedPackage&&(<div className="mt-2 flex items-center gap-2"><span className="text-xs text-muted-foreground">Recommended:</span><Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border">{selectedLead.recommendedPackage}</Badge>{selectedLead.estimatedValue>0&&<span className="text-xs font-semibold text-emerald-600">{formatCurrency(selectedLead.estimatedValue)}</span>}</div>)}
            </CardContent>
          </Card></motion.div>

            {/* Category Tabs + Template Library */}
            <motion.div {...scaleIn} transition={{delay:0.05}}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-600"/>Template Library</CardTitle>
                    <Button variant="outline" size="sm" className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={()=>{setShowFullSequence(!showFullSequence);setSelectedTemplateId(null);setEmailEditing(false)}}>
                      {showFullSequence?<><X className="h-3 w-3 mr-1"/>Close Sequence</>:<><Play className="h-3 w-3 mr-1"/>Full Sequence (7 Touches)</>}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {TEMPLATE_CATEGORIES.map(cat=>(
                      <button key={cat.id} onClick={()=>{setEmailCategoryFilter(cat.id);setSelectedTemplateId(null)}}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${emailCategoryFilter===cat.id?'bg-emerald-600 text-white shadow-sm':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {cat.label} <span className="ml-1 opacity-70">({cat.count})</span>
                      </button>
                    ))}
                  </div>

                  {/* Full Sequence View */}
                  {showFullSequence ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {fullSequence.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Select a lead to generate sequence</p> :
                        fullSequence.map((step, i) => (
                          <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
                            <div className={`rounded-lg border p-3 ${i===0?'border-emerald-200 bg-emerald-50/30':'border-gray-200'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">{step.touch}</span>
                                  <span className="text-xs font-medium">Day {step.day}</span>
                                  <ChannelBadge channel={step.channel}/>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={()=>{const txt=step.subject?`Subject: ${step.subject}\n\n${step.body}`:step.body;navigator.clipboard.writeText(txt).then(()=>toast.success(`Touch ${step.touch} copied!`))}}><Copy className="h-3 w-3"/></Button>
                              </div>
                              {step.subject && <p className="text-xs font-semibold text-sky-700 mb-1">Subject: {step.subject}</p>}
                              <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4">{step.body}</p>
                              <p className="text-[10px] text-muted-foreground mt-1.5 italic">{step.context}</p>
                            </div>
                          </motion.div>
                        ))
                      }
                    </div>
                  ) : (
                  /* Template List */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                    {filteredTemplates.length===0?<p className="text-sm text-muted-foreground text-center py-8 col-span-2">No templates in this category</p>:
                      filteredTemplates.map(tmpl=>(
                        <button key={tmpl.id} onClick={()=>{setSelectedTemplateId(tmpl.id);setEmailEditing(false);setShowFullSequence(false)}}
                          className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${selectedTemplateId===tmpl.id?'border-emerald-200 bg-emerald-50 shadow-sm':'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold truncate">{tmpl.name}</p>
                            <ChannelBadge channel={tmpl.channel}/>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{tmpl.context}</p>
                        </button>
                      ))
                    }
                  </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Template Preview Panel */}
            {renderedTemplate && !showFullSequence && (
              <motion.div {...scaleIn} transition={{delay:0.1}}>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">{renderedTemplate.name}</CardTitle>
                        <ChannelBadge channel={renderedTemplate.channel}/>
                        <Badge variant="secondary" className="text-[10px]">{renderedTemplate.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"><Copy className="h-4 w-4 mr-1"/>Copy</Button>
                        <Button variant="ghost" size="sm" onClick={()=>{setEmailEditing(!emailEditing);if(!emailEditing)setEmailEditedBody(renderedTemplate.body)}} className="text-gray-600 hover:bg-gray-100"><Pencil className="h-4 w-4 mr-1"/>{emailEditing?'Preview':'Edit'}</Button>
                        <Button variant="ghost" size="sm" onClick={saveAsActivity} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"><Save className="h-4 w-4 mr-1"/>Save</Button>
                        <Button variant="ghost" size="sm" onClick={()=>{setShowFullSequence(true);setSelectedTemplateId(null)}} className="text-gray-600 hover:bg-gray-100"><Play className="h-4 w-4 mr-1"/>Sequence</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {renderedTemplate.subject&&(<div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subject Line</p><div className="bg-gray-50 rounded-lg p-3"><p className="font-medium text-sm">{renderedTemplate.subject}</p></div></div>)}
                    <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{renderedTemplate.channel==='whatsapp'?'Message':renderedTemplate.channel==='phone'?'Script':renderedTemplate.channel==='linkedin'?'DM':'Body'}</p>
                      {emailEditing?(<Textarea value={emailEditedBody} onChange={(e)=>setEmailEditedBody(e.target.value)} className="min-h-[200px] text-sm"/>):(<div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed">{displayedBody}</div>)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{renderedTemplate.wordCount} words</span>
                      <span>{charCount} characters</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>):(
            <Card className="border-0 shadow-sm"><CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mb-4"/><h3 className="font-semibold text-gray-600">Select a Lead</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">Choose a lead to browse and preview personalized outreach templates.</p>
            </CardContent></Card>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Strategies View ─────────────────────────────────────────────────
function StrategiesView() {
  return (
    <motion.div className="space-y-6" {...fadeInUp}>
      <div><h2 className="text-lg font-semibold">Marketing Strategy Hub</h2><p className="text-sm text-muted-foreground">Battle-tested frameworks and playbooks for converting SA SME leads</p></div>
      <Accordion type="multiple" defaultValue={['lead-generation','outreach']} className="space-y-3">
        {STRATEGIES_DATA.map(cat=>(
          <AccordionItem key={cat.id} value={cat.id} className="bg-white rounded-xl border-0 shadow-sm px-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">{cat.icon}</div><span className="font-semibold">{cat.category}</span><Badge variant="secondary" className="ml-2">{cat.strategies.length}</Badge></div></AccordionTrigger>
            <AccordionContent className="px-6 pb-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.strategies.map(strat=>(
                <Card key={strat.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">{strat.title}</CardTitle><DifficultyBadge difficulty={strat.difficulty}/></div></CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{strat.description}</p>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100"><p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5"><Lightbulb className="h-3 w-3"/>Key Insight</p><p className="text-sm text-emerald-800 mt-1 font-medium">{strat.keyInsight}</p></div>
                    <div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps</p>{strat.steps.map((step,i)=>(<div key={i} className="flex items-start gap-2 text-sm"><span className="h-5 w-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span><span>{step}</span></div>))}</div>
                  </CardContent>
                </Card>
              ))}
            </div></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  )
}

// ─── Pricing Calculator View ──────────────────────────────────────────
function PricingView({ pricingCategory, setPricingCategory, roiNewPatients, setRoiNewPatients, roiAvgValue, setRoiAvgValue, roiPackage, setRoiPackage, selectedAddOns, setSelectedAddOns, currentPackages, selectedPkg, monthlyRevenue, annualRevenue, paybackDays, netGainY1, roiPercent, addOnTotalOnce, addOnTotalMonthly }: any) {
  const toggleAddOn = (id: string) => setSelectedAddOns(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
  const totalOnceOff = selectedPkg.price+addOnTotalOnce
  const totalMonthly = addOnTotalMonthly
  const year1Cost = totalOnceOff+(totalMonthly*12)

  return (
    <motion.div className="space-y-6" {...fadeInUp}>
      <div><h2 className="text-lg font-semibold">Pricing Calculator</h2><p className="text-sm text-muted-foreground">Compare packages, calculate ROI, and build custom quotes</p></div>
      <Card className="border-0 shadow-sm"><CardContent className="p-4">
        <RadioGroup value={pricingCategory} onValueChange={(v:any)=>setPricingCategory(v)} className="flex flex-wrap gap-2">
          {(['dental','general','school'] as const).map(cat=>(<Label key={cat} htmlFor={cat} className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${pricingCategory===cat?'bg-emerald-50 border border-emerald-200':'bg-gray-50 border border-transparent hover:bg-gray-100'}`}>
            <RadioGroupItem value={cat} id={cat}/><span className="text-sm font-medium capitalize">{cat}</span></Label>))}
        </RadioGroup>
      </CardContent></Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentPackages.map((pkg:any)=>(
          <motion.div key={pkg.name} whileHover={{y:-4}} transition={{type:'spring',stiffness:300}}>
            <Card className={`border-0 shadow-sm ${pkg.popular?'ring-2 ring-emerald-500':'hover:shadow-md'} transition-shadow`}>
              {pkg.popular&&<div className="bg-emerald-500 text-white text-xs font-semibold text-center py-1 rounded-t-xl">Most Popular</div>}
              <CardContent className="p-5">
                <div className="flex items-center gap-2"><Crown className={`h-5 w-5 ${pkg.popular?'text-emerald-600':'text-gray-400'}`}/><h3 className="font-bold text-lg">{pkg.name}</h3></div>
                <p className="text-sm text-muted-foreground mt-1">{pkg.tagline}</p>
                <p className="text-3xl font-bold text-emerald-600 mt-3">{formatCurrency(pkg.price)}</p>
                <p className="text-xs text-muted-foreground">once-off</p>
                {pkg.roi&&<Badge className="mt-3 bg-emerald-100 text-emerald-700 border-emerald-200 border">{pkg.roi}% ROI</Badge>}
                <Button onClick={()=>setRoiPackage(pkg.name)} variant={roiPackage===pkg.name?'default':'outline'} className={`mt-4 w-full ${roiPackage===pkg.name?'bg-emerald-600 hover:bg-emerald-700':''}`}>{roiPackage===pkg.name?'Selected':'Select Package'}</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="text-base font-semibold">Interactive ROI Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><Label className="text-sm font-medium">New Patients/Clients per Month: <strong className="text-emerald-600">{roiNewPatients[0]}</strong></Label><Slider value={roiNewPatients} onValueChange={setRoiNewPatients} min={1} max={30} step={1} className="mt-2"/></div>
              <div><Label className="text-sm font-medium">Average Visit/Job Value: <strong className="text-emerald-600">{formatCurrency(roiAvgValue[0])}</strong></Label><Slider value={roiAvgValue} onValueChange={setRoiAvgValue} min={500} max={5000} step={50} className="mt-2"/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Monthly Revenue</p><p className="text-lg font-bold">{formatCurrency(monthlyRevenue)}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Annual Revenue</p><p className="text-lg font-bold">{formatCurrency(annualRevenue)}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Payback Period</p><p className="text-lg font-bold">{paybackDays>365?'N/A':`~${paybackDays} days`}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Net Gain Year 1</p><p className="text-lg font-bold text-emerald-600">{formatCurrency(netGainY1)}</p></div>
            </div>
          </div>
          <motion.div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 text-center" initial={{scale:0.95}} animate={{scale:1}}>
            <p className="text-sm text-emerald-700 font-medium">Return on Investment</p>
            <p className="text-5xl font-bold text-emerald-600 mt-1">{roiPercent}%</p>
            <Progress value={Math.min(roiPercent,1000)} className="mt-4 h-3"/>
            <p className="text-xs text-emerald-600 mt-2">Investment: {formatCurrency(selectedPkg.price)} → Annual return: {formatCurrency(annualRevenue)}</p>
          </motion.div>
        </CardContent></Card>
      <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="text-base font-semibold">Package Builder — Add-Ons</CardTitle><CardDescription>Customize your package with optional add-ons</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {ADD_ONS.map(addOn=>(<div key={addOn.id} onClick={()=>toggleAddOn(addOn.id)} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${selectedAddOns.includes(addOn.id)?'bg-emerald-50 border-emerald-200':'hover:bg-gray-50 border-transparent'}`}>
            <Checkbox checked={selectedAddOns.includes(addOn.id)} className="mt-0.5"/><div className="flex-1"><p className="text-sm font-medium">{addOn.name}</p><p className="text-xs text-muted-foreground">{addOn.desc}</p></div>
            <div className="text-right shrink-0"><p className="text-sm font-semibold text-emerald-600">{addOn.onceOff>0?formatCurrency(addOn.onceOff):''}</p><p className="text-xs text-muted-foreground">{addOn.monthly>0?`+ ${formatCurrency(addOn.monthly)}/mo`:addOn.onceOff===0?`${formatCurrency(addOn.monthly)}/mo`:'once-off'}</p></div>
          </div>))}
          <Separator/>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Base Package</p><p className="font-bold">{formatCurrency(selectedPkg.price)}</p></div>
            <div className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Add-Ons (Once-off)</p><p className="font-bold">{formatCurrency(addOnTotalOnce)}</p></div>
            <div className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Total</p><p className="font-bold">{formatCurrency(totalMonthly)}/mo</p></div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-center justify-between">
            <div><p className="text-sm font-medium text-emerald-700">Total Investment (Year 1)</p><p className="text-xs text-emerald-600">Once-off + 12 months add-ons</p></div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(year1Cost)}</p>
          </div>
        </CardContent></Card>
    </motion.div>
  )
}

// ─── Analytics View ───────────────────────────────────────────────────
function AnalyticsView({ stats, leads, analyticsData, openLeadDetail }: {
  stats:DashboardStats;leads:Lead[];analyticsData:any;openLeadDetail:(l:Lead)=>void;
}) {
  const d = analyticsData
  return (
    <motion.div className="space-y-6" {...fadeInUp}>
      <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Analytics</h2><p className="text-sm text-muted-foreground">Deeper insights into your sales pipeline performance</p></div>
        <Badge variant="outline" className="border-emerald-200 text-emerald-700">All Time</Badge></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedKPICard label="Lead Velocity" value={d?.leadVelocity||0} sub="total leads" icon={<MousePointerClick className="h-6 w-6 text-blue-600"/>} bg="bg-blue-50" delay={0}/>
        <AnimatedKPICard label="Avg Deal Size" value={d?.avgDealSize>0?formatCurrency(d.avgDealSize):'N/A'} sub="won deals" icon={<DollarSign className="h-6 w-6 text-emerald-600"/>} bg="bg-emerald-50" delay={0.1}/>
        <AnimatedKPICard label="Hot Conversion" value={`${d?.hotLeads>0?Math.round((d.hotConverted/d.hotLeads)*100):0}%`} sub={`${d?.hotConverted||0}/${d?.hotLeads||0} converted`} icon={<Flame className="h-6 w-6 text-amber-500"/>} bg="bg-amber-50" valueColor="text-amber-600" delay={0.2}/>
        <AnimatedKPICard label="Conversion Rate" value={`${stats.conversionRate}%`} sub={`${stats.wonLeads}/${stats.totalLeads} won`} icon={<TrendingUp className="h-6 w-6 text-violet-600"/>} bg="bg-violet-50" valueColor="text-violet-600" delay={0.3}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp} transition={{delay:0.35}}><Card className="border-0 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Leads by Area</CardTitle></CardHeader><CardContent>
          <ChartContainer config={tierChartConfig} className="h-[300px] w-full"><BarChart data={d?.byArea} layout="vertical" margin={{top:5,right:20,left:80,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fontSize:11}}/><YAxis type="category" dataKey="area" tick={{fontSize:11}} width={80}/>
            <ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="count" fill="#059669" radius={[0,6,6,0]}/>
          </BarChart></ChartContainer>
          </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp} transition={{delay:0.4}}><Card className="border-0 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Estimated Value by Sector</CardTitle></CardHeader><CardContent>
          <ChartContainer config={sectorChartConfig} className="h-[300px] w-full"><BarChart data={d?.bySectorValue} margin={{top:5,right:20,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="sector" tick={{fontSize:10}}/><YAxis tick={{fontSize:11}}/>
            <ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="value" radius={[6,6,0,0]}>{d?.bySectorValue.map((e:any)=><Cell key={e.sector} fill={SECTOR_COLORS[e.sector]||'#6b7280'}/>)}</Bar>
          </BarChart></ChartContainer>
          </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp} transition={{delay:0.45}}><Card className="border-0 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Conversion Rate by Sector</CardTitle></CardHeader><CardContent>
          <ChartContainer config={sectorChartConfig} className="h-[300px] w-full"><BarChart data={d?.conversionBySector} layout="vertical" margin={{top:5,right:20,left:80,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fontSize:11}} unit="%"/><YAxis type="category" dataKey="sector" tick={{fontSize:11}} width={80}/>
            <ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="conversion" fill="#d97706" radius={[0,6,6,0]}/>
          </BarChart></ChartContainer>
          </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp} transition={{delay:0.5}}><Card className="border-0 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Conversion Rate by Tier</CardTitle></CardHeader><CardContent>
          <ChartContainer config={tierChartConfig} className="h-[300px] w-full"><BarChart data={d?.conversionByTier} margin={{top:5,right:20,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="tier" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} unit="%"/>
            <ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="conversion" radius={[6,6,0,0]}>{d?.conversionByTier.map((_:any,i:number)=><Cell key={i} fill={['#059669','#d97706','#6b7280'][i]}/>)}</Bar>
          </BarChart></ChartContainer>
          </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div {...fadeInUp} transition={{delay:0.55}}><Card className="border-0 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Geographic Distribution</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow className="bg-gray-50/50"><TableHead className="text-xs font-semibold">Area</TableHead><TableHead className="text-xs font-semibold text-right">Leads</TableHead><TableHead className="text-xs font-semibold text-right">Percentage</TableHead><TableHead className="text-xs font-semibold">Distribution</TableHead></TableRow></TableHeader>
          <TableBody>{d?.byArea.map((a:any)=>(<TableRow key={a.area}><TableCell className="text-sm">{a.area}</TableCell><TableCell className="text-right font-semibold">{a.count}</TableCell>
            <TableCell className="text-right text-sm">{leads.length>0?((a.count/leads.length)*100).toFixed(1):0}%</TableCell>
            <TableCell><div className="w-32 h-2 bg-gray-100 rounded-full"><motion.div className="h-2 bg-emerald-500 rounded-full" initial={{width:0}} animate={{width:`${leads.length>0?(a.count/leads.length)*100:0}%`}} transition={{duration:0.8}}/></div></TableCell>
          </TableRow>))}</TableBody></Table>
      </CardContent>
          </Card>
        </motion.div>
      <motion.div {...fadeInUp} transition={{delay:0.6}}><Card className="border-0 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Stage Conversion Funnel</CardTitle><CardDescription>Drop-off at each stage</CardDescription></CardHeader><CardContent>
        <div className="space-y-2">{stats.byStage.map((stage,i)=>{
          const maxCount=Math.max(...stats.byStage.map(s=>s.count),1);const pct=(stage.count/maxCount)*100
          return (<motion.div key={stage.stage} className="flex items-center gap-3" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}>
            <span className="text-xs font-medium w-24 truncate">{stage.label}</span>
            <div className="flex-1 h-8 bg-gray-100 rounded relative overflow-hidden"><motion.div className={`h-full rounded ${stage.stage==='won'?'bg-emerald-500':stage.stage==='lost'?'bg-red-400':'bg-emerald-400'}`} initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.6,delay:i*0.05}}/><span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{stage.count}</span></div>
            {i>0&&stats.byStage[i-1].count>0&&(<span className="text-xs text-muted-foreground w-16 text-right">{stage.count>0?Math.round((stage.count/stats.byStage[0].count)*100):0}%</span>)}
          </motion.div>)
        })}</div>
      </CardContent>
          </Card>
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
      {id:'protolead',name:'ProtoLead Campaign',desc:'Build demos for Tier 1 dental leads',icon:<Rocket className="h-5 w-5"/>,color:'text-emerald-600 bg-emerald-50',leads:tier1Dental},
      {id:'cold-email',name:'Cold Email Blast',desc:'Send personalized emails to Tier 2 leads',icon:<Mail className="h-5 w-5"/>,color:'text-amber-600 bg-amber-50',leads:tier2Leads},
      {id:'whatsapp-outreach',name:'WhatsApp Outreach',desc:'Message funeral homes and schools',icon:<MessageSquare className="h-5 w-5"/>,color:'text-violet-600 bg-violet-50',leads:funeralSchools},
    ]
  },[leads])
  const outreachQueue = useMemo(()=>leads.filter(l=>l.hotLead&&l.stage!=='won'&&l.stage!=='lost'&&l.status==='active').slice(0,10),[leads])

  return (
    <motion.div className="space-y-6" {...fadeInUp}>
      <div><h2 className="text-lg font-semibold">Campaigns</h2><p className="text-sm text-muted-foreground">Track outreach campaigns and daily priorities</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign,i)=>(
          <motion.div key={campaign.id} {...fadeInUp} transition={{delay:i*0.1}}>
            <Card className="border-0 shadow-sm h-full"><CardHeader className="pb-3"><div className="flex items-center gap-3"><div className={`h-10 w-10 rounded-xl flex items-center justify-center ${campaign.color}`}>{campaign.icon}</div>
              <div className="min-w-0"><CardTitle className="text-sm font-semibold truncate">{campaign.name}</CardTitle><CardDescription className="text-xs">{campaign.desc}</CardDescription></div></div></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Target Leads</span><Badge variant="secondary">{campaign.leads.length}</Badge></div>
                <Progress value={campaign.leads.length>0?Math.random()*30:0} className="h-2"/>
                <ScrollArea className="max-h-[200px]"><div className="space-y-1.5">
                  {campaign.leads.length===0?<p className="text-xs text-muted-foreground text-center py-4">No leads</p>:campaign.leads.slice(0,5).map(lead=>(
                    <div key={lead.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm">
                      {lead.hotLead&&<Flame className="h-3.5 w-3.5 text-amber-500 shrink-0"/>}<span className="truncate flex-1">{lead.name}</span>
                      <Badge variant="outline" className={`text-[10px] ${STAGE_COLORS[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600" onClick={()=>navigateToEmail(lead.id)}><Sparkles className="h-3 w-3"/></Button>
                    </div>))}
                  {campaign.leads.length>5&&<p className="text-xs text-muted-foreground text-center">+{campaign.leads.length-5} more leads</p>}
                </div></ScrollArea>
              </CardContent></Card>
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeInUp} transition={{delay:0.3}}><Card className="border-0 shadow-sm"><CardHeader className="pb-3">
        <div className="flex items-center gap-2"><Flame className="h-5 w-5 text-amber-500"/><CardTitle className="text-base font-semibold">Outreach Queue</CardTitle><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{outreachQueue.length} hot leads</Badge></div>
        <CardDescription>Priority leads that need contact today</CardDescription></CardHeader><CardContent>
        {outreachQueue.length===0?<p className="text-sm text-muted-foreground text-center py-8">No hot leads in queue</p>:(
          <div className="space-y-2">{outreachQueue.map(lead=>(
            <motion.div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors" whileHover={{x:4}}>
              <Flame className="h-4 w-4 text-amber-500 shrink-0"/><div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{lead.name}</p><p className="text-xs text-muted-foreground">{lead.sector} · {lead.area||lead.location}</p></div>
              <div className="flex items-center gap-1.5 shrink-0">
                {lead.phone&&<Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:bg-emerald-100" onClick={()=>window.open(`tel:${lead.phone}`,'_self')}><Phone className="h-3.5 w-3.5 mr-1"/>Call</Button>}
                <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:bg-emerald-100" onClick={()=>navigateToEmail(lead.id)}><Mail className="h-3.5 w-3.5 mr-1"/>Email</Button>
                <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:bg-emerald-100" onClick={()=>lead.phone&&window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g,'')}`,'_self')}><MessageSquare className="h-3.5 w-3.5 mr-1"/>WhatsApp</Button>
              </div>
            </motion.div>))}</div>)}
      </CardContent>
          </Card>
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
    <DialogHeader><div className="flex items-center gap-3"><div><DialogTitle className="text-xl">{lead.name}</DialogTitle><DialogDescription className="mt-1">{lead.sector} · {lead.location}</DialogDescription></div>
      <div className="ml-auto flex items-center gap-2">{lead.hotLead&&<Badge className="bg-amber-100 text-amber-700 border-amber-200 border"><Flame className="h-3 w-3 mr-1"/>Hot Lead</Badge>}<TierBadge tier={lead.tier}/></div></div></DialogHeader>
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2"><h4 className="text-sm font-semibold text-muted-foreground">Contact Details</h4><div className="space-y-1.5">
          {lead.phone&&<div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground"/><a href={`tel:${lead.phone}`} className="text-emerald-600 hover:underline">{lead.phone}</a></div>}
          {lead.address&&<div className="flex items-start gap-2 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5"/><span>{lead.address}</span></div>}
          {lead.hours&&<div className="flex items-center gap-2 text-sm"><Clock className="h-3.5 w-3.5 text-muted-foreground"/><span>{lead.hours}</span></div>}
          {lead.area&&<div className="flex items-center gap-2 text-sm"><Building2 className="h-3.5 w-3.5 text-muted-foreground"/><span>{lead.area}</span></div>}
        </div></div>
        <div className="space-y-2"><h4 className="text-sm font-semibold text-muted-foreground">Lead Profile</h4><div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Rating</span><StarRating rating={lead.rating}/></div>
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Stage</span><Badge variant="outline" className={STAGE_COLORS[lead.stage]}>{STAGE_LABELS[lead.stage]}</Badge></div>
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge variant="outline" className={lead.status==='active'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-gray-50 text-gray-700 border-gray-200'}>{lead.status}</Badge></div>
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Est. Value</span><span className="font-semibold">{lead.estimatedValue>0?formatCurrency(lead.estimatedValue):'N/A'}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Website</span>{lead.hasWebsite?<Globe className="h-3.5 w-3.5 text-emerald-600"/>:<span className="text-red-500 text-xs">None</span>}</div>
        </div></div>
      </div>
      {(lead.services||lead.recommendedPackage)&&(<div className="space-y-2"><h4 className="text-sm font-semibold text-muted-foreground">Services & Package</h4>
        {lead.services&&<p className="text-sm bg-gray-50 rounded-lg p-3">{lead.services}</p>}
        {lead.recommendedPackage&&<div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Recommended:</span><Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border">{lead.recommendedPackage}</Badge></div>}</div>)}
      {lead.notes&&<div className="space-y-2"><h4 className="text-sm font-semibold text-muted-foreground">Notes</h4><p className="text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{lead.notes}</p></div>}
      {lead.nextAction&&(<div className="space-y-2"><h4 className="text-sm font-semibold text-muted-foreground">Next Action</h4>
        <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-3 border border-amber-200"><ArrowRight className="h-4 w-4 text-amber-600 shrink-0"/><div><p className="text-sm font-medium text-amber-800">{lead.nextAction}</p>{lead.nextActionDate&&<p className="text-xs text-amber-600 mt-0.5">Due: {formatDate(lead.nextActionDate)}</p>}</div></div></div>)}
      <div className="space-y-2"><h4 className="text-sm font-semibold text-muted-foreground">Update Stage</h4>
        <Select value={lead.stage} onValueChange={(val)=>updateLeadStage(lead.id,val)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{STAGES.map(s=><SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}</SelectContent></Select></div>
      <Button onClick={()=>navigateToEmail(lead.id)} variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"><Sparkles className="h-4 w-4 mr-2"/>Generate Email for {lead.name}</Button>
      <div className="space-y-3"><h4 className="text-sm font-semibold text-muted-foreground">Activity History ({lead.activities?.length||0})</h4>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <Select value={activityType} onValueChange={setActivityType}><SelectTrigger className="w-[130px]"><SelectValue/></SelectTrigger><SelectContent>
            <SelectItem value="call">Call</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem><SelectItem value="proposal">Proposal</SelectItem><SelectItem value="demo">Demo</SelectItem><SelectItem value="note">Note</SelectItem>
          </SelectContent></Select>
          <Textarea placeholder="What happened?" value={activitySummary} onChange={(e)=>setActivitySummary(e.target.value)} className="min-h-[60px]"/>
          <Input placeholder="Outcome (optional)" value={activityOutcome} onChange={(e)=>setActivityOutcome(e.target.value)}/>
          <Button onClick={()=>addActivity(lead.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm"><Plus className="h-4 w-4 mr-1"/>Add Activity</Button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {!lead.activities?.length?<p className="text-sm text-muted-foreground text-center py-6">No activities recorded</p>:lead.activities.map(act=>(
            <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100"><div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">{ACTIVITY_ICONS[act.type]||<AlertCircle className="h-3.5 w-3.5"/>}</div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><Badge variant="outline" className="text-[10px] px-1.5 py-0">{act.type}</Badge><span className="text-xs text-muted-foreground">{formatDate(act.date)}</span></div><p className="text-sm mt-1">{act.summary}</p>{act.outcome&&<p className="text-xs text-emerald-600 mt-1">→ {act.outcome}</p>}</div></div>
          ))}
        </div>
      </div>
    </div>
  </>)
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

  useEffect(()=>{(async()=>{setLoading(true);await Promise.all([fetchStats(),fetchLeads()]);setLoading(false)})()},[fetchStats,fetchLeads])
  useEffect(()=>{const t=setTimeout(fetchLeads,300);return()=>clearTimeout(t)},[searchQuery,fetchLeads])

  const openLeadDetail=(lead:Lead)=>{setSelectedLead(lead);setLeadDialogOpen(true)}
  const updateLeadStage=async(leadId:string,newStage:string)=>{try{const res=await fetch(`/api/leads/${leadId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stage:newStage})});setSelectedLead(await res.json());fetchStats();fetchLeads();toast.success(`Lead moved to ${STAGE_LABELS[newStage]}`)}catch{toast.error('Failed to update stage')}}
  const addActivity=async(leadId:string)=>{if(!activitySummary.trim()){toast.error('Enter an activity summary');return}try{await fetch(`/api/leads/${leadId}/activities`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:activityType,summary:activitySummary,outcome:activityOutcome})});setActivitySummary('');setActivityOutcome('');const res=await fetch(`/api/leads/${leadId}`);setSelectedLead(await res.json());fetchStats();toast.success('Activity added')}catch{toast.error('Failed to add activity')}}
  const currentPackages=PRICING_PACKAGES[pricingCategory]
  const selectedPkg=currentPackages.find(p=>p.name===roiPackage)||currentPackages[0]
  const monthlyRevenue=roiNewPatients[0]*roiAvgValue[0];const annualRevenue=monthlyRevenue*12
  const paybackDays=monthlyRevenue>0?Math.round((selectedPkg.price/monthlyRevenue)*30):999
  const netGainY1=annualRevenue-selectedPkg.price;const roiPercent=selectedPkg.price>0?Math.round((netGainY1/selectedPkg.price)*100):0
  const addOnTotalOnce=selectedAddOns.reduce((sum,id)=>{const a=ADD_ONS.find(x=>x.id===id);return sum+(a?.onceOff||0)},0)
  const addOnTotalMonthly=selectedAddOns.reduce((sum,id)=>{const a=ADD_ONS.find(x=>x.id===id);return sum+(a?.monthly||0)},0)

  const analyticsData = useMemo(()=>{if(!leads.length||!stats)return null
    const byArea=new Map<string,number>();const bySectorValue=new Map<string,number>()
    leads.forEach(l=>{const area=l.area||l.location||'Unknown';byArea.set(area,(byArea.get(area)||0)+1);bySectorValue.set(l.sector,(bySectorValue.get(l.sector)||0)+(l.estimatedValue||0))})
    const conversionBySector=stats.bySector.map(s=>{const sl=leads.filter(l=>l.sector===s.sector);const won=sl.filter(l=>l.stage==='won').length;return{sector:s.sector,conversion:sl.length>0?Math.round((won/sl.length)*100):0}})
    const conversionByTier=stats.byTier.map(t=>{const tn=parseInt(t.tier.replace('Tier ',''));const tl=leads.filter(l=>l.tier===tn);const won=tl.filter(l=>l.stage==='won').length;return{tier:t.tier,conversion:tl.length>0?Math.round((won/tl.length)*100):0}})
    const hotL=leads.filter(l=>l.hotLead);const hotC=hotL.filter(l=>l.stage==='won').length
    const avgDeal=leads.filter(l=>l.stage==='won').length>0?leads.filter(l=>l.stage==='won').reduce((s,l)=>s+(l.estimatedValue||0),0)/leads.filter(l=>l.stage==='won').length:0
    return{byArea:Array.from(byArea.entries()).map(([area,count])=>({area,count})).sort((a,b)=>b.count-a.count),bySectorValue:Array.from(bySectorValue.entries()).map(([sector,value])=>({sector,value})).sort((a,b)=>b.value-a.value),conversionBySector,conversionByTier,hotLeads:hotL.length,hotConverted:hotC,avgDealSize:avgDeal,leadVelocity:leads.length}},[leads,stats])

  const pipelineStages=STAGES.filter(s=>s!=='won'&&s!=='lost')
  const pageTitle=ALL_NAV_ITEMS.find(n=>n.id===activePage)?.label||'Dashboard'
  const navigateToEmail=(leadId?:string)=>{setActivePage('email');if(leadId){setEmailLeadId(leadId);setSelectedTemplateId(null);setEmailEditing(false);setShowFullSequence(false)}}

  const SidebarContent=()=>(
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3">
        <motion.div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-lg shadow-emerald-500/20" whileHover={{scale:1.05}}>C</motion.div>
        {!sidebarCollapsed&&(<div className="min-w-0"><h1 className="text-base font-bold text-white tracking-tight truncate">Carter Digitals</h1>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] px-1.5 py-0">B-BBEE Level 1</Badge></div>)}
      </div>
      <Separator className="bg-gray-700/50"/>
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {NAV_SECTIONS.map(section=>(
          <div key={section.label}>
            {!sidebarCollapsed&&<p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1.5">{section.label}</p>}
            <div className="space-y-0.5">
              {section.items.map(item=>(
                <TooltipProvider key={item.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={()=>{setActivePage(item.id);setSidebarOpen(false)}}
                        className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 ${sidebarCollapsed?'justify-center px-2 py-2.5':'px-3 py-2.5'} ${
                          activePage===item.id?'bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/5':'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                        {item.icon}{!sidebarCollapsed&&<span className="text-sm font-medium truncate">{item.label}</span>}
                      </button>
                    </TooltipTrigger>
                    {sidebarCollapsed&&<TooltipContent side="right"><p>{item.label}</p></TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <Separator className="bg-gray-700/50"/>
      <div className={`p-4 ${sidebarCollapsed?'flex justify-center':''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">KK</div>
          {!sidebarCollapsed&&(<div className="min-w-0"><p className="text-sm font-medium text-white truncate">Kabelo Kadiaka</p><p className="text-xs text-gray-400 truncate">Founder</p></div>)}
        </div>
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col bg-gray-950 border-r border-gray-800/50 transition-all duration-300 shrink-0 relative ${sidebarCollapsed?'w-[72px]':'w-[260px]'}`}>
          <SidebarContent/>
          <button onClick={()=>setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex absolute top-1/2 -right-3 z-10 w-6 h-6 items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg">
            {sidebarCollapsed?<ChevronRight className="h-3.5 w-3.5"/>:<ChevronLeft className="h-3.5 w-3.5"/>}
          </button>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}><SheetContent side="left" className="w-[280px] p-0 bg-gray-950 border-gray-800"><SidebarContent/></SheetContent></Sheet>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
              <button onClick={()=>setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><Menu className="h-5 w-5"/></button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-sm">
                <Home className="h-3.5 w-3.5 text-muted-foreground"/>
                <ChevronRight className="h-3 w-3 text-muted-foreground"/>
                <span className="font-semibold text-gray-900">{pageTitle}</span>
              </div>

              <div className="flex-1"/>

              {/* Search */}
              <div className="hidden md:flex relative w-56"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Search leads..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="pl-9 h-9 bg-gray-50 border-gray-200 text-sm"/></div>

              {/* Quick Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900">
                  <Plus className="h-4 w-4"/><span className="hidden md:inline">Quick Action</span><ChevronDown className="h-3 w-3"/></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={()=>toast.info('Navigate to Leads to add a new lead')}><Plus className="h-4 w-4 mr-2"/>New Lead</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>navigateToEmail()}><Sparkles className="h-4 w-4 mr-2"/>Generate Email</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>toast.info('Report exported!')}><Download className="h-4 w-4 mr-2"/>Export Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Tooltip><TooltipTrigger asChild>
                <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"><Bell className="h-5 w-5"/>
                  {stats?.hotLeads?(<span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-amber-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">{stats.hotLeads}</span>):null}</button>
                </TooltipTrigger><TooltipContent><p>{stats?.hotLeads||0} hot leads</p></TooltipContent></Tooltip>

              {/* User */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 hover:bg-gray-50 rounded-lg pr-2 py-1 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">KK</div>
                  <span className="text-sm font-medium text-gray-700 hidden xl:inline">Kabelo</span><ChevronDown className="h-3 w-3 text-gray-400 hidden xl:inline"/></button></DropdownMenuTrigger>
                <DropdownMenuContent align="end"><DropdownMenuItem><Settings className="h-4 w-4 mr-2"/>Settings</DropdownMenuItem><DropdownMenuSeparator/><DropdownMenuItem className="text-red-600"><LogOut className="h-4 w-4 mr-2"/>Sign Out</DropdownMenuItem></DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto"><div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
            {loading?(
              <div className="space-y-6"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><SkeletonCard key={i}/>)}</div><Skeleton className="h-[300px] w-full"/><Skeleton className="h-[300px] w-full"/></div>
            ):(
              <AnimatePresence mode="wait">
                <motion.div key={activePage} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}>
                  {activePage==='dashboard'&&stats&&<DashboardView stats={stats} leads={leads} openLeadDetail={openLeadDetail}/>}
                  {activePage==='leads'&&<LeadsView leads={leads} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterSector={filterSector} setFilterSector={setFilterSector} filterTier={filterTier} setFilterTier={setFilterTier} filterStage={filterStage} setFilterStage={setFilterStage} filterHot={filterHot} setFilterHot={setFilterHot} openLeadDetail={openLeadDetail} stats={stats} navigateToEmail={navigateToEmail}/>}
                  {activePage==='pipeline'&&<PipelineView leads={leads} stats={stats} pipelineStages={pipelineStages} updateLeadStage={updateLeadStage} openLeadDetail={openLeadDetail} navigateToEmail={navigateToEmail}/>}
                  {activePage==='email'&&<EmailGeneratorView leads={leads} emailLeadId={emailLeadId} setEmailLeadId={setEmailLeadId} selectedTemplateId={selectedTemplateId} setSelectedTemplateId={setSelectedTemplateId} emailCategoryFilter={emailCategoryFilter} setEmailCategoryFilter={setEmailCategoryFilter} emailEditedBody={emailEditedBody} setEmailEditedBody={setEmailEditedBody} emailEditing={emailEditing} setEmailEditing={setEmailEditing} showFullSequence={showFullSequence} setShowFullSequence={setShowFullSequence} addActivity={addActivity} openLeadDetail={openLeadDetail}/>}
                  {activePage==='strategies'&&<StrategiesView/>}
                  {activePage==='pricing'&&<PricingView pricingCategory={pricingCategory} setPricingCategory={setPricingCategory} roiNewPatients={roiNewPatients} setRoiNewPatients={setRoiNewPatients} roiAvgValue={roiAvgValue} setRoiAvgValue={setRoiAvgValue} roiPackage={roiPackage} setRoiPackage={setRoiPackage} selectedAddOns={selectedAddOns} setSelectedAddOns={setSelectedAddOns} currentPackages={currentPackages} selectedPkg={selectedPkg} monthlyRevenue={monthlyRevenue} annualRevenue={annualRevenue} paybackDays={paybackDays} netGainY1={netGainY1} roiPercent={roiPercent} addOnTotalOnce={addOnTotalOnce} addOnTotalMonthly={addOnTotalMonthly}/>}
                  {activePage==='analytics'&&analyticsData&&<AnalyticsView stats={stats} leads={leads} analyticsData={analyticsData} openLeadDetail={openLeadDetail}/>}
                  {activePage==='campaigns'&&<CampaignsView leads={leads} stats={stats} navigateToEmail={navigateToEmail} openLeadDetail={openLeadDetail}/>}
                </motion.div>
              </AnimatePresence>
            )}
          </div></main>
        </div>

        {/* Lead Detail Dialog */}
        <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto"><LeadDetailDialog lead={selectedLead!} updateLeadStage={updateLeadStage} addActivity={addActivity} activityType={activityType} setActivityType={setActivityType} activitySummary={activitySummary} setActivitySummary={setActivitySummary} activityOutcome={activityOutcome} setActivityOutcome={setActivityOutcome} navigateToEmail={navigateToEmail}/></DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
