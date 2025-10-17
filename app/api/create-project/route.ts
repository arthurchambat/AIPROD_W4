import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Import dynamique pour éviter l'évaluation au build
    const { createClient } = await import('@supabase/supabase-js')
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }
    
    // Créer le client Supabase avec le token utilisateur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const prompt = formData.get('prompt') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'Fichier image requis' }, { status: 400 })
    }

    // Upload l'image d'input vers Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Sanitize filename
    const sanitized = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()

    const fileName = `input-${Date.now()}-${sanitized}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('input-images')
      .upload(fileName, buffer, { contentType: file.type })

    if (uploadError) {
      console.error('Erreur upload:', uploadError)
      return NextResponse.json({ error: 'Erreur lors de l\'upload de l\'image' }, { status: 500 })
    }

    const publicURL = supabase.storage
      .from('input-images')
      .getPublicUrl(uploadData.path).data.publicUrl

    // Créer le projet avec status='pending' et payment_status='pending'
    const { data: project, error: insertError } = await supabase
      .from('projects')
      .insert([
        {
          input_image_url: publicURL,
          output_image_url: null,
          prompt,
          status: 'pending',
          payment_status: 'pending',
          payment_amount: 0.99, // Prix fixé côté serveur
          user_id: user.id
        }
      ])
      .select()
      .single()

    if (insertError) {
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
