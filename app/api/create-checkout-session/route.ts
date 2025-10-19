import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICE_PER_GENERATION } from '@/lib/stripe'
import { supabaseAuth, supabaseQuery } from '@/lib/supabase-fetch'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Vérifier l'authentification avec Supabase via fetch
    const { data: user, error: authError } = await supabaseAuth(token)
    
    if (authError || !user) {
      console.error('Auth error in create-checkout-session:', authError)
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les données du corps de la requête
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID manquant' }, { status: 400 })
    }

    // Vérifier que le projet appartient à l'utilisateur
    const { data: projects, error: projectError } = await supabaseQuery(
      'projects',
      'select',
      undefined,
      { id: `eq.${projectId}`, user_id: `eq.${user.id}` },
      token
    )

    const project = Array.isArray(projects) ? projects[0] : projects

    console.log('Checkout-session project lookup:', { 
      projectId, 
      userId: user.id, 
      found: !!project,
      projectError: projectError?.message 
    })

    if (projectError || !project) {
      console.error('Project not found:', { projectId, userId: user.id, projectError })
      return NextResponse.json({ error: 'Projet non trouvé ou accès refusé' }, { status: 404 })
    }

    // Vérifier que le projet n'a pas déjà été payé
    if (project.payment_status === 'paid') {
      return NextResponse.json({ error: 'Ce projet a déjà été payé' }, { status: 400 })
    }

    // Créer une Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Génération d\'image IA',
              description: 'Transformation d\'image avec intelligence artificielle',
              images: ['https://pqsvqwnfzpshctzkguuu.supabase.co/storage/v1/object/public/images/ai-generation-icon.png'],
            },
            unit_amount: PRICE_PER_GENERATION, // Montant en centimes (0.99 EUR)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
      metadata: {
        project_id: projectId,
        user_id: user.id,
      },
      client_reference_id: user.id,
    })

    // Mettre à jour le projet avec le stripe_checkout_session_id
    const updateData = {
      stripe_checkout_session_id: session.id,
      payment_amount: PRICE_PER_GENERATION / 100, // Stocker en euros
    }
    
    const { error: updateError } = await supabaseQuery(
      'projects',
      'update',
      updateData,
      { id: `eq.${projectId}`, user_id: `eq.${user.id}` },
      token
    )

    if (updateError) {
      console.error('Erreur lors de la mise à jour du projet:', updateError)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Erreur lors de la création de la session Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}
