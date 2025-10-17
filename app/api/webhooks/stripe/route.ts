import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// IMPORTANT : Désactiver le body parsing par Next.js pour les webhooks Stripe
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('❌ Signature Stripe manquante')
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // ⚠️ SÉCURITÉ CRITIQUE : Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`❌ Erreur de vérification webhook: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Import dynamique pour éviter l'évaluation au build
  const { createClient } = await import('@supabase/supabase-js')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  // Créer un client Supabase avec service role (bypass RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Traiter l'événement
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('✅ Paiement complété:', {
          sessionId: session.id,
          projectId: session.metadata?.project_id,
          userId: session.metadata?.user_id,
          amount: session.amount_total,
        })

        // Récupérer le project_id depuis les métadonnées
        const projectId = session.metadata?.project_id

        if (!projectId) {
          console.error('❌ project_id manquant dans les métadonnées')
          return NextResponse.json({ error: 'project_id manquant' }, { status: 400 })
        }

        // Mettre à jour le projet dans Supabase
        const { data, error } = await supabase
          .from('projects')
          .update({
            payment_status: 'paid',
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', projectId)
          .select()

        if (error) {
          console.error('❌ Erreur lors de la mise à jour du projet:', error)
          return NextResponse.json({ error: 'Erreur mise à jour projet' }, { status: 500 })
        }

        console.log('✅ Projet mis à jour avec succès:', data)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const projectId = session.metadata?.project_id

        console.log('⏰ Session expirée:', { sessionId: session.id, projectId })

        if (projectId) {
          // Optionnel : mettre à jour le statut en 'expired' ou 'cancelled'
          await supabase
            .from('projects')
            .update({ payment_status: 'cancelled' })
            .eq('id', projectId)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Paiement échoué:', paymentIntent.id)
        // Vous pouvez notifier l'utilisateur ou mettre à jour le projet
        break
      }

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erreur lors du traitement du webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne' },
      { status: 500 }
    )
  }
}
