import { NextRequest, NextResponse } from 'next/server'
import { supabaseAuth, supabaseQuery } from '@/lib/supabase-fetch'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via Authorization header
    const authHeader = request.headers.get('Authorization')
    
    console.log('Create-project auth header:', authHeader ? 'present' : 'missing')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid auth header')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    console.log('Token length:', token?.length)
    
    // Vérifier l'authentification avec Supabase via fetch
    const { data: user, error: authError } = await supabaseAuth(token)
    
    console.log('Auth result:', { hasUser: !!user, error: authError?.message })
    
    if (authError || !user) {
      console.error('Auth error in create-project:', authError)
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const prompt = formData.get('prompt') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'Fichier image requis' }, { status: 400 })
    }

    // Upload l'image d'input vers Supabase Storage via REST API
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Sanitize filename
    const sanitized = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()

    const fileName = `input-${Date.now()}-${sanitized}`
    
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/input-images/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Content-Type': file.type
        },
        body: buffer
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Erreur upload:', errorText)
      return NextResponse.json({ error: 'Erreur lors de l\'upload de l\'image' }, { status: 500 })
    }

    const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/input-images/${fileName}`

    // Import du helper pour les requêtes
    const { supabaseQuery } = await import('@/lib/supabase-fetch')

    // Créer le projet avec status='pending' et payment_status='pending'
    const { data: projects, error: insertError } = await supabaseQuery(
      'projects',
      'insert',
      {
        input_image_url: publicURL,
        output_image_url: null,
        prompt,
        status: 'pending',
        payment_status: 'pending',
        payment_amount: 0.99, // Prix fixé côté serveur
        user_id: user.id
      },
      {},
      token
    )

    const project = projects?.[0]

    if (insertError || !project) {
      console.error('Erreur insert:', insertError)
      return NextResponse.json({ error: 'Erreur lors de la création du projet' }, { status: 500 })
    }

    return NextResponse.json({
      projectId: project.id,
      message: 'Projet créé, en attente de paiement'
    })
  } catch (error: any) {
    console.error('Erreur dans create-project:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne' },
      { status: 500 }
    )
  }
}
