import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getFallbackCampaigns, SEED_CAMPAIGNS } from '@/lib/seed-data'

export async function GET() {
  try {
    const campaigns = await db.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(campaigns)
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    return NextResponse.json(getFallbackCampaigns())
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, status, targetSector, message } = body

    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 })
    }

    const campaign = await db.campaign.create({
      data: {
        name,
        type: type || 'cold-email',
        status: status || 'draft',
        targetSector: targetSector || '',
        message: message || '',
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    const body = await request.json()
    const { name, type, status, targetSector, message } = body

    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 })
    }

    // Return a mock campaign (not persisted)
    const now = new Date().toISOString()
    const mockCampaign = {
      id: 'fallback_' + Date.now(),
      name,
      type: type || 'cold-email',
      status: status || 'draft',
      targetSector: targetSector || '',
      message: message || '',
      emailsSent: 0,
      openRate: 0,
      responseRate: 0,
      createdAt: now,
      updatedAt: now,
    }
    return NextResponse.json(mockCampaign, { status: 201 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 })
    }

    const campaign = await db.campaign.update({
      where: { id },
      data,
    })

    return NextResponse.json(campaign)
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 })
    }

    // Return merged mock (not persisted)
    const existing = SEED_CAMPAIGNS.find((c) => c.id === id)
    const merged = {
      ...(existing || { id, name: '', type: 'cold-email', status: 'draft', targetSector: '', message: '' }),
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return NextResponse.json(merged)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 })
    }

    await db.campaign.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (dbError) {
    console.warn('Database unavailable, using fallback data:', dbError)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 })
    }

    // Return success (not persisted)
    return NextResponse.json({ success: true })
  }
}
