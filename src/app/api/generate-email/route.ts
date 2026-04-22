import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      leadName,
      sector,
      tier,
      rating,
      notes,
      location,
      area,
      services,
      recommendedPackage,
      estimatedValue,
      phone,
      onlinePresence,
      emailType = 'cold',
      tone = 'professional',
    } = body

    const zai = await ZAI.create()

    const emailTypeConfig: Record<string, string> = {
      cold: '',
      whatsapp:
        'WHATSAPP FORMAT: Short, conversational, 3-5 sentences max. Include a demo link mention. No subject line needed. Start with a friendly greeting.',
      linkedin:
        'LINKEDIN FORMAT: Professional but not stiff, 4-6 sentences. Ask for a brief chat. Connection request style. Keep it under 300 characters if possible.',
      followup:
        'FOLLOW-UP FORMAT: Reference previous touch. Add NEW angle or proof that was not mentioned before. One clear ask. Do NOT say "just checking in".',
      breakup:
        'BREAKUP FORMAT: Professional closing email. Leave door open. Respectful. Acknowledge their busy schedule. Make it easy for them to say "not now" so they feel no guilt.',
    }

    const toneConfig: Record<string, string> = {
      professional:
        'Tone: Professional but warm. Use proper grammar. Confident but respectful. Peer-to-peer.',
      casual:
        'Tone: Casual and friendly. Conversational. Use contractions. Like a WhatsApp message from a colleague.',
      direct:
        'Tone: Direct and concise. No fluff. Get straight to the point. Respect their time. Executive-to-executive.',
      friendly:
        'Tone: Friendly and warm. Enthusiastic but not overbearing. Build rapport. Show genuine interest.',
    }

    const systemPrompt = `You are a cold email copywriter for Carter Digitals (Pty) Ltd, a boutique web studio in Pretoria, South Africa.
Carter Digitals is B-BBEE Level 1 (100% Black-Owned, 100% Youth-Owned, 135% Procurement Recognition).
They build high-performance websites for SMEs in Gauteng using Next.js.

COLD EMAIL FRAMEWORKS (choose the best fit):
1. Observation → Problem → Proof → Ask
2. Question → Value → Ask
3. Trigger → Insight → Ask

RULES:
- Write like a peer, not a vendor
- Every sentence must earn its place — ruthlessly short
- Lead with their world, not theirs ("you/your" > "I/we")
- One ask, low friction — interest-based CTAs beat meeting requests
- Subject lines: 2-4 words, lowercase, internal-looking
- NEVER use: "I hope this email finds you well," jargon, feature dumps
- Personalize based on the specific lead's context
- Reference specific details about their business, sector, and location
${emailTypeConfig[emailType] || ''}
${toneConfig[tone] || toneConfig.professional}

OUTPUT FORMAT:
For cold email, followup, and breakup: Return a JSON object with "subject" and "body" keys.
For whatsapp: Return a JSON object with "subject" set to "WhatsApp Message" and "body" as the message text.
For linkedin: Return a JSON object with "subject" set to "LinkedIn DM" and "body" as the message text.`

    const userPrompt = `Generate a ${emailType} for ${leadName}.
Sector: ${sector}
Tier: ${tier}
Rating: ${rating}/5.0
Location: ${location}${area ? `, ${area}` : ''}
Services: ${services}
Notes: ${notes}
Recommended Package: ${recommendedPackage}${estimatedValue > 0 ? ` (${new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(estimatedValue)})` : ' (custom pricing)'}
Online Presence: ${onlinePresence}
Phone: ${phone}

Generate a personalized, compelling ${emailType}. Return ONLY valid JSON with "subject" and "body" keys.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const rawContent = completion.choices[0]?.message?.content || ''

    // Try to parse JSON from the response
    let subject = ''
    let emailBody = rawContent

    try {
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        subject = parsed.subject || ''
        emailBody = parsed.body || rawContent
      }
    } catch {
      // If JSON parsing fails, use raw content as body
    }

    return NextResponse.json({ subject, body: emailBody })
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please try again.' },
      { status: 500 }
    )
  }
}
