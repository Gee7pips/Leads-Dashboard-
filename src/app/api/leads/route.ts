import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

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
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}
