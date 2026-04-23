import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getFallbackStats } from '@/lib/seed-data'

export async function GET() {
  try {
    const [totalLeads, leads] = await Promise.all([
      db.lead.count(),
      db.lead.findMany(),
    ])

    const hotLeads = leads.filter((l) => l.hotLead).length
    const dentalLeads = leads.filter((l) => l.sector === 'Dental').length

    const activeLeads = leads.filter(
      (l) => l.status === 'active' && l.stage !== 'won' && l.stage !== 'lost'
    )
    const pipelineValue = activeLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0)

    const wonLeads = leads.filter((l) => l.stage === 'won').length
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

    // By sector
    const sectorMap: Record<string, number> = {}
    leads.forEach((l) => {
      sectorMap[l.sector] = (sectorMap[l.sector] || 0) + 1
    })
    const bySector = Object.entries(sectorMap)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count)

    // By tier
    const tierMap: Record<string, number> = {}
    leads.forEach((l) => {
      const key = `Tier ${l.tier}`
      tierMap[key] = (tierMap[key] || 0) + 1
    })
    const byTier = [
      { tier: 'Tier 1', count: tierMap['Tier 1'] || 0 },
      { tier: 'Tier 2', count: tierMap['Tier 2'] || 0 },
      { tier: 'Tier 3', count: tierMap['Tier 3'] || 0 },
    ]

    // By stage
    const stages = [
      'new',
      'contacted',
      'demo_sent',
      'meeting_booked',
      'proposal_sent',
      'negotiation',
      'won',
      'lost',
    ]
    const stageLabels: Record<string, string> = {
      new: 'New',
      contacted: 'Contacted',
      demo_sent: 'Demo Sent',
      meeting_booked: 'Meeting Booked',
      proposal_sent: 'Proposal Sent',
      negotiation: 'Negotiation',
      won: 'Won',
      lost: 'Lost',
    }
    const byStage = stages.map((stage) => ({
      stage,
      label: stageLabels[stage],
      count: leads.filter((l) => l.stage === stage).length,
    }))

    // Recent activities
    const recentActivities = await db.activity.findMany({
      include: {
        lead: {
          select: { id: true, name: true },
        },
      },
      orderBy: { date: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      totalLeads,
      hotLeads,
      dentalLeads,
      pipelineValue,
      conversionRate,
      bySector,
      byTier,
      byStage,
      recentActivities,
      activePipeline: activeLeads.length,
      wonLeads,
      lostLeads: leads.filter((l) => l.stage === 'lost').length,
    })
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    return NextResponse.json(getFallbackStats())
  }
}
