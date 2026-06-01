import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

const PLANS = {
  monthly: {
    price_data: {
      currency: 'nzd',
      unit_amount: 1999,
      recurring: { interval: 'month' as const },
      product_data: { name: 'DealFind NZ — Monthly Membership' },
    },
  },
  annual: {
    price_data: {
      currency: 'nzd',
      unit_amount: 17900,
      recurring: { interval: 'year' as const },
      product_data: { name: 'DealFind NZ — Annual Membership' },
    },
  },
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { plan = 'monthly' } = await req.json()
  const planConfig = PLANS[plan as keyof typeof PLANS] ?? PLANS.monthly

  const origin = req.headers.get('origin') || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price_data: planConfig.price_data, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { user_id: user.id, plan },
      },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/membership`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
