import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getFallbackLead, SEED_LEADS } from '@/lib/seed-data'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    const { id } = await params
    const lead = getFallbackLead(id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json(lead)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        activities: {
          orderBy: { date: 'desc' },
        },
      },
    })

    return NextResponse.json(lead)
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    const { id } = await params
    const body = await request.json()
    const existing = getFallbackLead(id)
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    // Return merged object (not persisted)
    const merged = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return NextResponse.json(merged)
  }
}
