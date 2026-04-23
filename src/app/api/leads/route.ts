import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getFallbackLeads, type LeadFilters } from '@/lib/seed-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')
    const tier = searchParams.get('tier')
    const stage = searchParams.get('stage')
    const status = searchParams.get('status')
    const hotLead = searchParams.get('hotLead')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (sector) where.sector = sector
    if (tier) where.tier = parseInt(tier)
    if (stage) where.stage = stage
    if (status) where.status = status
    if (hotLead === 'true') where.hotLead = true
    if (hotLead === 'false') where.hotLead = false
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sector: { contains: search } },
        { location: { contains: search } },
        { area: { contains: search } },
      ]
    }

    const leads = await db.lead.findMany({
      where,
      include: {
        activities: {
          orderBy: { date: 'desc' },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(leads)
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    const { searchParams } = new URL(request.url)
    const filters: LeadFilters = {
      sector: searchParams.get('sector'),
      tier: searchParams.get('tier'),
      stage: searchParams.get('stage'),
      status: searchParams.get('status'),
      hotLead: searchParams.get('hotLead'),
      search: searchParams.get('search'),
    }
    return NextResponse.json(getFallbackLeads(filters))
  }
}
