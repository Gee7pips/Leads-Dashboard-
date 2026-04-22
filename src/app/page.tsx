'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Flame,
  DollarSign,
  Stethoscope,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Rocket,
  Shield,
  Award,
  Repeat,
  ChevronRight,
  X,
  Plus,
  ArrowRight,
  Activity,
  Target,
  BarChart3,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  Hotel,
  Truck,
  HardHat,
  Gavel,
  HeartPulse,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart'
import { toast } from 'sonner'

// ─── Types ───────────────────────────────────────────────────────────
interface LeadActivity {
  id: string
  leadId: string
  type: string
  summary: string
  outcome: string
  date: string
  createdAt: string
  lead?: { id: string; name: string }
}

interface Lead {
  id: string
  name: string
  sector: string
  subSector: string
  location: string
  area: string
  phone: string
  rating: number
  tier: number
  stage: string
  status: string
  source: string
  notes: string
  address: string
  hours: string
  services: string
  onlinePresence: string
  recommendedPackage: string
  estimatedValue: number
  hasWebsite: boolean
  lastContact: string | null
  nextAction: string
  nextActionDate: string | null
  hotLead: boolean
  createdAt: string
  updatedAt: string
  activities: LeadActivity[]
}

interface DashboardStats {
  totalLeads: number
  hotLeads: number
  dentalLeads: number
  pipelineValue: number
  conversionRate: number
  bySector: { sector: string; count: number }[]
  byTier: { tier: string; count: number }[]
  byStage: { stage: string; label: string; count: number }[]
  recentActivities: (LeadActivity & { lead: { id: string; name: string } })[]
  activePipeline: number
  wonLeads: number
  lostLeads: number
}

// ─── Constants ───────────────────────────────────────────────────────
const STAGES = [
  'new',
  'contacted',
  'demo_sent',
  'meeting_booked',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
] as const

const STAGE_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  demo_sent: 'Demo Sent',
  meeting_booked: 'Meeting Booked',
  proposal_sent: 'Proposal Sent',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

const STAGE_COLORS: Record<string, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  contacted: 'bg-sky-100 text-sky-700 border-sky-200',
  demo_sent: 'bg-violet-100 text-violet-700 border-violet-200',
  meeting_booked: 'bg-amber-100 text-amber-700 border-amber-200',
  proposal_sent: 'bg-orange-100 text-orange-700 border-orange-200',
  negotiation: 'bg-rose-100 text-rose-700 border-rose-200',
  won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  lost: 'bg-red-100 text-red-700 border-red-200',
}

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  Dental: <Stethoscope className="h-4 w-4" />,
  Legal: <Gavel className="h-4 w-4" />,
  Funeral: <HeartPulse className="h-4 w-4" />,
  Hospitality: <Hotel className="h-4 w-4" />,
  Logistics: <Truck className="h-4 w-4" />,
  Construction: <HardHat className="h-4 w-4" />,
  Education: <GraduationCap className="h-4 w-4" />,
  Medical: <HeartPulse className="h-4 w-4" />,
}

const SECTOR_COLORS: Record<string, string> = {
  Dental: '#059669',
  Legal: '#d97706',
  Funeral: '#dc2626',
  Hospitality: '#7c3aed',
  Logistics: '#0891b2',
  Construction: '#ea580c',
  Education: '#2563eb',
  Medical: '#db2777',
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  call: <Phone className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
  meeting: <Calendar className="h-3.5 w-3.5" />,
  proposal: <Target className="h-3.5 w-3.5" />,
  demo: <Rocket className="h-3.5 w-3.5" />,
  note: <AlertCircle className="h-3.5 w-3.5" />,
}

const STRATEGY_ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
  Mail: <Mail className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Repeat: <Repeat className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Award: <Award className="h-6 w-6" />,
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(dateStr)
}

function TierBadge({ tier }: { tier: number }) {
  const colors = {
    1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    2: 'bg-amber-100 text-amber-700 border-amber-200',
    3: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  return (
    <Badge variant="outline" className={colors[tier] || colors[3]}>
      Tier {tier}
    </Badge>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leadDialogOpen, setLeadDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSector, setFilterSector] = useState('all')
  const [filterTier, setFilterTier] = useState('all')
  const [filterStage, setFilterStage] = useState('all')
  const [filterHot, setFilterHot] = useState('all')

  // Activity form
  const [activityType, setActivityType] = useState('note')
  const [activitySummary, setActivitySummary] = useState('')
  const [activityOutcome, setActivityOutcome] = useState('')

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [])

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (filterSector !== 'all') params.set('sector', filterSector)
      if (filterTier !== 'all') params.set('tier', filterTier)
      if (filterStage !== 'all') params.set('stage', filterStage)
      if (filterHot !== 'all') params.set('hotLead', filterHot)
      const res = await fetch(`/api/leads?${params.toString()}`)
      const data = await res.json()
      setLeads(data)
    } catch (err) {
      console.error('Error fetching leads:', err)
    }
  }, [searchQuery, filterSector, filterTier, filterStage, filterHot])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchStats(), fetchLeads()])
      setLoading(false)
    }
    load()
  }, [fetchStats, fetchLeads])

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLeads()
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, fetchLeads])

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setLeadDialogOpen(true)
  }

  const updateLeadStage = async (leadId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })
      const updated = await res.json()
      setSelectedLead(updated)
      fetchStats()
      fetchLeads()
      toast.success(`Lead moved to ${STAGE_LABELS[newStage]}`)
    } catch {
      toast.error('Failed to update lead stage')
    }
  }

  const addActivity = async (leadId: string) => {
    if (!activitySummary.trim()) {
      toast.error('Please enter an activity summary')
      return
    }
    try {
      await fetch(`/api/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activityType,
          summary: activitySummary,
          outcome: activityOutcome,
        }),
      })
      setActivitySummary('')
      setActivityOutcome('')
      // Refresh
      const res = await fetch(`/api/leads/${leadId}`)
      const updated = await res.json()
      setSelectedLead(updated)
      fetchStats()
      toast.success('Activity added successfully')
    } catch {
      toast.error('Failed to add activity')
    }
  }

  // Pipeline data
  const pipelineStages = STAGES.filter((s) => s !== 'won' && s !== 'lost')
  const pipelineLeads = pipelineStages.map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    leads: (stats?.byStage.find((s) => s.stage === stage)?.count || 0),
    items: leads.filter((l) => l.stage === stage),
  }))

  // Chart configs
  const sectorChartConfig: ChartConfig = {
    Dental: { label: 'Dental', color: '#059669' },
    Legal: { label: 'Legal', color: '#d97706' },
    Funeral: { label: 'Funeral', color: '#dc2626' },
    Hospitality: { label: 'Hospitality', color: '#7c3aed' },
    Logistics: { label: 'Logistics', color: '#0891b2' },
    Construction: { label: 'Construction', color: '#ea580c' },
    Education: { label: 'Education', color: '#2563eb' },
    Medical: { label: 'Medical', color: '#db2777' },
  }

  const tierChartConfig: ChartConfig = {
    count: { label: 'Leads', color: '#059669' },
  }

  const funnelChartConfig: ChartConfig = {
    count: { label: 'Leads', color: '#059669' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Header ─── */}
      <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">
                C
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Carter Digitals</h1>
                <p className="text-xs text-emerald-400 font-medium">
                  Built Different. Built African. Built to Win.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-xs">
                B-BBEE Level 1
              </Badge>
              <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs">
                135% Procurement
              </Badge>
            </div>
          </div>
          {/* Navigation Tabs */}
          <nav className="-mb-px">
            <div className="flex gap-0">
              {[
                { value: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4 mr-1.5" /> },
                { value: 'leads', label: 'Leads', icon: <Users className="h-4 w-4 mr-1.5" /> },
                { value: 'pipeline', label: 'Pipeline', icon: <Activity className="h-4 w-4 mr-1.5" /> },
                { value: 'strategies', label: 'Strategies', icon: <Target className="h-4 w-4 mr-1.5" /> },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? 'border-emerald-400 text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        ) : (
          <>
            {/* ═══ DASHBOARD TAB ═══ */}
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Leads</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalLeads}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stats.activePipeline} active</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Hot Leads</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1 text-amber-600">{stats.hotLeads}</p>
                          <p className="text-xs text-muted-foreground mt-1">Priority contacts</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                          <Flame className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Pipeline Value</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(stats.pipelineValue)}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stats.wonLeads} won | {stats.lostLeads} lost</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Dental Leads</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.dentalLeads}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stats.conversionRate}% conversion rate</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
                          <Stethoscope className="h-6 w-6 text-teal-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Pipeline Funnel */}
                  <Card className="lg:col-span-3 border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Pipeline Funnel</CardTitle>
                      <CardDescription>Lead distribution across sales stages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={funnelChartConfig} className="h-[280px] w-full">
                        <BarChart data={stats.byStage} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {stats.byStage.map((entry, index) => (
                              <Cell key={entry.stage} fill={index < 6 ? '#059669' : entry.stage === 'won' ? '#10b981' : '#ef4444'} opacity={1 - index * 0.08} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* By Sector */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Leads by Sector</CardTitle>
                      <CardDescription>Distribution across target sectors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={sectorChartConfig} className="h-[300px] w-full">
                        <PieChart>
                          <Pie
                            data={stats.bySector}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="count"
                            nameKey="sector"
                            paddingAngle={2}
                          >
                            {stats.bySector.map((entry) => (
                              <Cell key={entry.sector} fill={SECTOR_COLORS[entry.sector] || '#6b7280'} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent nameKey="sector" />} />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* By Tier */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Leads by Tier</CardTitle>
                      <CardDescription>Lead quality distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={tierChartConfig} className="h-[300px] w-full">
                        <BarChart data={stats.byTier} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="tier" tick={{ fontSize: 12 }} width={50} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {stats.byTier.map((entry, index) => (
                              <Cell key={entry.tier} fill={['#059669', '#d97706', '#6b7280'][index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                    <CardDescription>Latest interactions across all leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {stats.recentActivities.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>
                      ) : (
                        stats.recentActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                              const lead = leads.find((l) => l.id === activity.leadId)
                              if (lead) openLeadDetail(lead)
                            }}
                          >
                            <div className="mt-0.5 h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                              {ACTIVITY_ICONS[activity.type] || <AlertCircle className="h-3.5 w-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{activity.lead?.name}</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                                  {activity.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5 truncate">{activity.summary}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatRelativeDate(activity.date)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ═══ LEADS TAB ═══ */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                {/* Search & Filters */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, sector, or location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={filterSector} onValueChange={setFilterSector}>
                          <SelectTrigger className="w-[130px]">
                            <Filter className="h-4 w-4 mr-1.5" />
                            <SelectValue placeholder="Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sectors</SelectItem>
                            <SelectItem value="Dental">Dental</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Funeral">Funeral</SelectItem>
                            <SelectItem value="Hospitality">Hospitality</SelectItem>
                            <SelectItem value="Logistics">Logistics</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={filterTier} onValueChange={setFilterTier}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tiers</SelectItem>
                            <SelectItem value="1">Tier 1</SelectItem>
                            <SelectItem value="2">Tier 2</SelectItem>
                            <SelectItem value="3">Tier 3</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={filterStage} onValueChange={setFilterStage}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            {STAGES.map((s) => (
                              <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={filterHot} onValueChange={setFilterHot}>
                          <SelectTrigger className="w-[100px]">
                            <Flame className="h-4 w-4 mr-1.5" />
                            <SelectValue placeholder="Hot" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="true">Hot Only</SelectItem>
                            <SelectItem value="false">Not Hot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leads Table */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50">
                            <TableHead className="text-xs font-semibold">Name</TableHead>
                            <TableHead className="text-xs font-semibold">Sector</TableHead>
                            <TableHead className="text-xs font-semibold hidden sm:table-cell">Tier</TableHead>
                            <TableHead className="text-xs font-semibold hidden md:table-cell">Rating</TableHead>
                            <TableHead className="text-xs font-semibold">Stage</TableHead>
                            <TableHead className="text-xs font-semibold hidden lg:table-cell">Area</TableHead>
                            <TableHead className="text-xs font-semibold hidden sm:table-cell">Value</TableHead>
                            <TableHead className="text-xs font-semibold text-center">Hot</TableHead>
                            <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leads.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                                No leads found matching your filters
                              </TableCell>
                            </TableRow>
                          ) : (
                            leads.map((lead) => (
                              <TableRow
                                key={lead.id}
                                className="cursor-pointer hover:bg-emerald-50/30 transition-colors"
                                onClick={() => openLeadDetail(lead)}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {lead.hotLead && <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                    <span className="font-medium text-sm truncate max-w-[160px]">{lead.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    {SECTOR_ICONS[lead.sector] || <Building2 className="h-3.5 w-3.5" />}
                                    <span className="text-sm">{lead.sector}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <TierBadge tier={lead.tier} />
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <StarRating rating={lead.rating} />
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`text-[11px] ${STAGE_COLORS[lead.stage]}`}>
                                    {STAGE_LABELS[lead.stage]}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                  {lead.area || lead.location}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-sm font-medium">
                                  {lead.estimatedValue > 0 ? formatCurrency(lead.estimatedValue) : '—'}
                                </TableCell>
                                <TableCell className="text-center">
                                  {lead.hotLead ? (
                                    <Flame className="h-4 w-4 text-amber-500 mx-auto" />
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openLeadDetail(lead)
                                    }}
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-xs text-muted-foreground text-center">
                  Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* ═══ PIPELINE TAB ═══ */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Sales Pipeline</h2>
                    <p className="text-sm text-muted-foreground">Drag leads between stages to update their progress</p>
                  </div>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    {stats?.activePipeline || 0} active deals · {formatCurrency(stats?.pipelineValue || 0)}
                  </Badge>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                  {pipelineStages.map((stage) => {
                    const stageLeads = leads.filter((l) => l.stage === stage.stage)
                    const stageCount = stats?.byStage.find((s) => s.stage === stage.stage)?.count || 0
                    return (
                      <div key={stage.stage} className="flex-shrink-0 w-[280px] sm:w-[300px]">
                        <div className="flex items-center gap-2 mb-3 px-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <h3 className="text-sm font-semibold">{stage.label}</h3>
                          <Badge variant="secondary" className="ml-auto text-xs">{stageCount}</Badge>
                        </div>
                        <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                          {stageLeads.length === 0 ? (
                            <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
                              <p className="text-xs text-muted-foreground">No leads</p>
                            </div>
                          ) : (
                            stageLeads.map((lead) => (
                              <div
                                key={lead.id}
                                className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => openLeadDetail(lead)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{lead.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{lead.sector}</p>
                                  </div>
                                  {lead.hotLead && <Flame className="h-4 w-4 text-amber-500 shrink-0" />}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-1.5">
                                    <TierBadge tier={lead.tier} />
                                    <span className="text-xs text-muted-foreground">{lead.rating.toFixed(1)}★</span>
                                  </div>
                                  {lead.estimatedValue > 0 && (
                                    <span className="text-xs font-semibold text-emerald-600">
                                      {formatCurrency(lead.estimatedValue)}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <Select
                                    value={lead.stage}
                                    onValueChange={(val) => updateLeadStage(lead.id, val)}
                                    onOpenChange={(open) => { if (!open) return }}
                                  >
                                    <SelectTrigger className="h-7 text-xs border-gray-200 w-full" onClick={(e) => e.stopPropagation()}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent onClick={(e) => e.stopPropagation()}>
                                      {STAGES.map((s) => (
                                        <SelectItem key={s} value={s} className="text-xs">
                                          {STAGE_LABELS[s]}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Won / Lost Summary */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card className="border-0 shadow-sm border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold">Won</span>
                        <span className="ml-auto text-2xl font-bold text-emerald-600">{stats?.wonLeads || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm border-l-4 border-l-red-400">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-semibold">Lost</span>
                        <span className="ml-auto text-2xl font-bold text-red-500">{stats?.lostLeads || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* ═══ STRATEGIES TAB ═══ */}
            {activeTab === 'strategies' && <StrategiesTab />}
          </>
        )}
      </main>

      {/* ─── Lead Detail Dialog ─── */}
      <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div>
                    <DialogTitle className="text-xl">{selectedLead.name}</DialogTitle>
                    <DialogDescription className="mt-1">
                      {selectedLead.sector} · {selectedLead.location}
                    </DialogDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {selectedLead.hotLead && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 border">
                        <Flame className="h-3 w-3 mr-1" /> Hot Lead
                      </Badge>
                    )}
                    <TierBadge tier={selectedLead.tier} />
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Contact Details</h4>
                    <div className="space-y-1.5">
                      {selectedLead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <a href={`tel:${selectedLead.phone}`} className="text-emerald-600 hover:underline">
                            {selectedLead.phone}
                          </a>
                        </div>
                      )}
                      {selectedLead.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                          <span>{selectedLead.address}</span>
                        </div>
                      )}
                      {selectedLead.hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedLead.hours}</span>
                        </div>
                      )}
                      {selectedLead.area && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedLead.area}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Lead Profile</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <StarRating rating={selectedLead.rating} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stage</span>
                        <Badge variant="outline" className={STAGE_COLORS[selectedLead.stage]}>
                          {STAGE_LABELS[selectedLead.stage]}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className={
                          selectedLead.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          selectedLead.status === 'converted' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }>
                          {selectedLead.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Est. Value</span>
                        <span className="font-semibold">
                          {selectedLead.estimatedValue > 0 ? formatCurrency(selectedLead.estimatedValue) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Source</span>
                        <span className="capitalize">{selectedLead.source}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Website</span>
                        <span>{selectedLead.hasWebsite ? <Globe className="h-3.5 w-3.5 text-emerald-600" /> : <span className="text-red-500 text-xs">None</span>}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services & Package */}
                {(selectedLead.services || selectedLead.recommendedPackage) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Services & Package</h4>
                    {selectedLead.services && (
                      <p className="text-sm bg-gray-50 rounded-lg p-3">{selectedLead.services}</p>
                    )}
                    {selectedLead.recommendedPackage && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Recommended:</span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border">
                          {selectedLead.recommendedPackage}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedLead.notes && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Notes</h4>
                    <p className="text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{selectedLead.notes}</p>
                  </div>
                )}

                {/* Next Action */}
                {selectedLead.nextAction && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Next Action</h4>
                    <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <ArrowRight className="h-4 w-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">{selectedLead.nextAction}</p>
                        {selectedLead.nextActionDate && (
                          <p className="text-xs text-amber-600 mt-0.5">
                            Due: {formatDate(selectedLead.nextActionDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage Management */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Update Stage</h4>
                  <Select
                    value={selectedLead.stage}
                    onValueChange={(val) => updateLeadStage(selectedLead.id, val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Activities */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Activity History ({selectedLead.activities?.length || 0})
                  </h4>

                  {/* Add Activity */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2">
                      <Select value={activityType} onValueChange={setActivityType}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">📞 Call</SelectItem>
                          <SelectItem value="email">📧 Email</SelectItem>
                          <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                          <SelectItem value="meeting">📅 Meeting</SelectItem>
                          <SelectItem value="proposal">📋 Proposal</SelectItem>
                          <SelectItem value="demo">🚀 Demo</SelectItem>
                          <SelectItem value="note">📝 Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="What happened?"
                      value={activitySummary}
                      onChange={(e) => setActivitySummary(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <Input
                      placeholder="Outcome (optional)"
                      value={activityOutcome}
                      onChange={(e) => setActivityOutcome(e.target.value)}
                    />
                    <Button
                      onClick={() => addActivity(selectedLead.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Activity
                    </Button>
                  </div>

                  {/* Activity List */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {!selectedLead.activities?.length ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No activities recorded yet</p>
                    ) : (
                      selectedLead.activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            {ACTIVITY_ICONS[act.type] || <AlertCircle className="h-3.5 w-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{act.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(act.date)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{act.summary}</p>
                            {act.outcome && (
                              <p className="text-xs text-emerald-600 mt-1">→ {act.outcome}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Strategies Tab Component ────────────────────────────────────────
function StrategiesTab() {
  const [strategies, setStrategies] = useState<Array<{
    id: string
    category: string
    icon: string
    title: string
    description: string
    keyInsight: string
    actionableSteps: string[]
    pricing?: {
      dental: Array<{ name: string; price: number; tagline: string; roi?: number; paybackDays?: number; popular?: boolean }>
      general: Array<{ name: string; price: number; tagline: string; popular?: boolean }>
      school: Array<{ name: string; price: number; tagline: string; popular?: boolean }>
    }
  }>>([])

  useEffect(() => {
    fetch('/api/strategies')
      .then((res) => res.json())
      .then(setStrategies)
      .catch(console.error)
  }, [])

  if (strategies.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Marketing Conversion Strategies</h2>
        <p className="text-sm text-muted-foreground">
          Battle-tested frameworks and playbooks for converting South African SME leads
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  {STRATEGY_ICONS[strategy.icon] || <Target className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-emerald-600 font-medium">{strategy.category}</p>
                  <CardTitle className="text-base mt-0.5">{strategy.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {strategy.description}
              </CardDescription>

              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Zap className="h-3 w-3" /> Key Insight
                </p>
                <p className="text-sm text-emerald-800 mt-1 font-medium">{strategy.keyInsight}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actionable Steps
                </p>
                <ul className="space-y-1.5">
                  {strategy.actionableSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="h-5 w-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ROI Pricing Table */}
              {strategy.pricing && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Package Pricing
                  </p>
                  <div className="space-y-2">
                    {strategy.pricing.dental && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">🦷 Dental Packages</p>
                        <div className="space-y-1.5">
                          {strategy.pricing.dental.map((pkg) => (
                            <div key={pkg.name} className={`rounded-lg p-3 ${pkg.popular ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-100'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold text-sm">{pkg.name}</span>
                                  {pkg.popular && <Badge className="ml-2 bg-emerald-600 text-[10px]">Popular</Badge>}
                                  <p className="text-xs text-muted-foreground">{pkg.tagline}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-emerald-600">{formatCurrency(pkg.price)}</p>
                                  {pkg.roi && (
                                    <p className="text-[10px] text-emerald-600 font-medium">{pkg.roi}% ROI</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {strategy.pricing.general && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">🌐 General Business</p>
                        <div className="space-y-1.5">
                          {strategy.pricing.general.map((pkg) => (
                            <div key={pkg.name} className={`rounded-lg p-3 ${pkg.popular ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-100'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold text-sm">{pkg.name}</span>
                                  {pkg.popular && <Badge className="ml-2 bg-emerald-600 text-[10px]">Popular</Badge>}
                                  <p className="text-xs text-muted-foreground">{pkg.tagline}</p>
                                </div>
                                <p className="font-bold text-emerald-600">{formatCurrency(pkg.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {strategy.pricing.school && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">🎓 School Packages</p>
                        <div className="space-y-1.5">
                          {strategy.pricing.school.map((pkg) => (
                            <div key={pkg.name} className={`rounded-lg p-3 ${pkg.popular ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-100'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold text-sm">{pkg.name}</span>
                                  {pkg.popular && <Badge className="ml-2 bg-emerald-600 text-[10px]">Popular</Badge>}
                                  <p className="text-xs text-muted-foreground">{pkg.tagline}</p>
                                </div>
                                <p className="font-bold text-emerald-600">{formatCurrency(pkg.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
