import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { type, summary, outcome, date } = body

    if (!type || !summary) {
      return NextResponse.json(
        { error: 'Type and summary are required' },
        { status: 400 }
      )
    }

    const activity = await db.activity.create({
      data: {
        leadId: id,
        type,
        summary,
        outcome: outcome || '',
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}
