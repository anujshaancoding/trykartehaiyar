import { NextResponse } from 'next/server'
import { getProjectBySlug } from '@/data/projects'

export async function POST(request) {
  try {
    const { projectId, amount } = await request.json()

    // Validate project exists
    const project = getProjectBySlug(projectId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Validate amount matches (prevent tampering)
    if (amount !== project.priceInr) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Contact admin.' },
        { status: 500 }
      )
    }

    // Create Razorpay order via REST API (no SDK needed)
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${keyId}:${keySecret}`),
      },
      body: JSON.stringify({
        amount: project.priceInr * 100, // Convert to paise
        currency: 'INR',
        receipt: `proj_${projectId}_${Date.now()}`,
        notes: {
          projectId: projectId,
          projectTitle: project.title,
        },
      }),
    })

    if (!orderRes.ok) {
      const errorData = await orderRes.json()
      console.error('Razorpay order creation failed:', errorData)
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    const order = await orderRes.json()

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    })
  } catch (err) {
    console.error('Order API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
