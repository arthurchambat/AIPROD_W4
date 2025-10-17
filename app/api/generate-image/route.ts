import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import runReplicate from '@/lib/replicateClient'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Utiliser le client Supabase avec le token utilisateur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
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

    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID manquant' }, { status: 400 })
    }

    // Récupérer le projet et vérifier qu'il appartient à l'utilisateur
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

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
    await supabase
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId)

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

    // Upload vers Supabase Storage
    const outName = `output-${Date.now()}.png`
    const { data: upOut, error: outErr } = await supabase.storage
      .from('output-images')
      .upload(outName, outBuffer, { contentType: 'image/png' })

    if (outErr) {
      console.error('Erreur upload output:', outErr)
      throw outErr
    }

    const outPublic = supabase.storage
      .from('output-images')
      .getPublicUrl(upOut.path).data.publicUrl

    // Mettre à jour le projet avec l'image générée
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        output_image_url: outPublic,
        status: 'completed'
      })
      .eq('id', projectId)
      .select()
      .single()

    if (updateError) {
      console.error('Erreur mise à jour projet:', updateError)
      throw updateError
    }

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
