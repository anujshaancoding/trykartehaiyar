import { NextResponse } from 'next/server'
import { getProjectBySlug } from '@/data/projects'

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      projectId,
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      )
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Verify signature using Web Crypto API (no external dependency)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const data = `${razorpay_order_id}|${razorpay_payment_id}`
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    )

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Signature verified — payment is authentic
    const project = getProjectBySlug(projectId)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Log to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/purchases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            project_id: projectId,
            razorpay_order_id,
            razorpay_payment_id,
            amount_paise: project.priceInr * 100,
            status: 'paid',
          }),
        })
      } catch (logErr) {
        // Don't fail the purchase if logging fails
        console.error('Failed to log purchase:', logErr)
      }
    }

    // Generate a time-limited download token
    const token = await generateDownloadToken(projectId, razorpay_payment_id)

    return NextResponse.json({
      success: true,
      downloadUrl: `/api/download/${projectId}?token=${token}`,
    })
  } catch (err) {
    console.error('Verify API error:', err)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}

async function generateDownloadToken(projectId, paymentId) {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'fallback-secret'
  const encoder = new TextEncoder()
  const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  const payload = `${projectId}:${paymentId}:${expires}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const hash = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // Encode as base64-safe string: payload.hash
  const token = btoa(`${payload}:${hash}`)
  return token
}
