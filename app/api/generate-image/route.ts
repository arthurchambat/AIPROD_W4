import { NextRequest, NextResponse } from 'next/server'
import runReplicate from '@/lib/replicateClient'
import { supabaseAuth } from '@/lib/supabase-fetch'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Vérifier l'authentification via REST API
    const { data: user, error: authError } = await supabaseAuth(token)
    
    console.log('Auth debug:', { user, authError, hasUser: !!user })
    
    if (authError || !user) {
      console.error('Auth failed:', authError)
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID manquant' }, { status: 400 })
    }

    // Import du helper pour les requêtes
    const { supabaseQuery, supabaseServiceQuery } = await import('@/lib/supabase-fetch')

    // Récupérer le projet et vérifier qu'il appartient à l'utilisateur
    const { data: projects, error: projectError } = await supabaseQuery(
      'projects',
      'select',
      {},
      { id: `eq.${projectId}`, user_id: `eq.${(user as any).id}` },
      token
    )

    const project = projects?.[0]

    if (projectError || !project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    // ⚠️ SÉCURITÉ CRITIQUE : Vérifier que le paiement a été effectué
    if (project.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Paiement requis avant de générer l\'image' },
        { status: 402 } // 402 Payment Required
      )
    }

    // Vérifier que l'image n'a pas déjà été générée
    if (project.status === 'completed' || project.output_image_url) {
      return NextResponse.json(
        { error: 'Ce projet a déjà été généré', output_image_url: project.output_image_url },
        { status: 400 }
      )
    }

    // Mettre à jour le statut en 'processing'
    await supabaseServiceQuery(
      'projects',
      'update',
      { status: 'processing' },
      { id: `eq.${projectId}` }
    )

    console.log('🎨 Début de la génération pour projet:', projectId)

    // Préparer l'input pour Replicate
    const input = {
      prompt: project.prompt,
      image_input: [project.input_image_url]
    }

    console.log('Calling Replicate with:', JSON.stringify(input, null, 2))

    // Appeler Replicate
    const modelName = process.env.REPLICATE_MODEL || 'google/nano-banana'
    const output = await runReplicate(modelName, input)

    // Extraire l'URL de l'image générée
    let generatedUrl: string | null = null
    if (typeof output === 'string') {
      generatedUrl = output
    } else if (Array.isArray(output) && output.length > 0) {
      generatedUrl = output[0] as string
    } else if (output && typeof output === 'object' && 0 in output) {
      generatedUrl = (output as any)[0]
    }

    if (!generatedUrl) {
      throw new Error('Aucune URL d\'image générée par Replicate')
    }

    console.log('✅ Image générée:', generatedUrl)

    // Télécharger l'image générée
    const res = await fetch(generatedUrl)
    const blob = await res.arrayBuffer()
    const outBuffer = Buffer.from(blob)

    // Upload vers Supabase Storage via REST API
    const outName = `output-${Date.now()}.png`
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/output-images/${outName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          'Content-Type': 'image/png'
        },
        body: outBuffer
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Erreur upload output:', errorText)
      throw new Error(`Upload failed: ${errorText}`)
    }

    const outPublic = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/output-images/${outName}`

    // Mettre à jour le projet avec l'image générée
    const { data: updatedProjects, error: updateError } = await supabaseServiceQuery(
      'projects',
      'update',
      {
        output_image_url: outPublic,
        status: 'completed'
      },
      { id: `eq.${projectId}` }
    )

    if (updateError) {
      console.error('Erreur mise à jour projet:', updateError)
      throw updateError
    }

    const updatedProject = updatedProjects?.[0]

    console.log('✅ Projet complété:', projectId)

    return NextResponse.json({
      success: true,
      output_image_url: outPublic,
      project: updatedProject
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la génération:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}
