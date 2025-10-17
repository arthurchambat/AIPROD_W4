import { supabaseServer } from '../../../lib/supabaseServer'
import runReplicate from '../../../lib/replicateClient'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // Get the access token from Authorization header
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('No authorization token provided')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token)
    
    if (authError || !user) {
      console.log('Invalid token:', authError?.message)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const userId = user.id

    // Check if environment variables are configured
    if (!supabaseServer) {
      return new Response('Server configuration error: Supabase credentials missing', { status: 500 })
    }

    const form = await req.formData()
    const file = form.get('file') as unknown as File
    const prompt = (form.get('prompt') as string) || ''

    if (!file || typeof file === 'string') {
      return new Response('No file', { status: 400 })
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer()
    // Buffer might not be available in some runtimes; use globalThis.Buffer
    const BufferCtor = (globalThis as any).Buffer || Buffer
    const buffer = BufferCtor.from(arrayBuffer)

    // Sanitize filename: remove accents, special chars, spaces
    const sanitized = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-zA-Z0-9.-]/g, '_') // replace special chars with _
      .toLowerCase()

    // Upload to Supabase input-images bucket
    const fileName = `input-${Date.now()}-${sanitized}`
    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from('input-images')
      .upload(fileName, buffer, { contentType: file.type })

    if (uploadError) throw uploadError

    const publicURL = supabaseServer.storage.from('input-images').getPublicUrl(uploadData.path).data.publicUrl

    console.log('Uploaded image URL:', publicURL)
    console.log('Prompt:', prompt)

    // Call Replicate with the uploaded image and the prompt
    const input = {
      prompt,
      image_input: [publicURL]
    }

    console.log('Calling Replicate with input:', JSON.stringify(input, null, 2))

    // Use model name (google/nano-banana) instead of version ID
    const modelName = process.env.REPLICATE_MODEL || 'google/nano-banana'
    const output = await runReplicate(modelName, input)

    // output could be string url or array; handle common shapes
    let generatedUrl: string | null = null
    if (typeof output === 'string') {
      generatedUrl = output
    } else if (Array.isArray(output) && output.length > 0) {
      generatedUrl = output[0] as string
    } else if (output && typeof output === 'object' && 0 in output) {
      generatedUrl = (output as any)[0]
    }

    if (!generatedUrl) throw new Error('No generated image URL from Replicate')

    // Download generated image
    const res = await fetch(generatedUrl)
    const blob = await res.arrayBuffer()
    const outBuffer = BufferCtor.from(blob)

    const outName = `output-${Date.now()}.png`
    const { data: upOut, error: outErr } = await supabaseServer.storage
      .from('output-images')
      .upload(outName, outBuffer, { contentType: 'image/png' })

    if (outErr) throw outErr

    const outPublic = supabaseServer.storage.from('output-images').getPublicUrl(upOut.path).data.publicUrl

    // Insert project row with user_id
    const { error: insertErr } = await supabaseServer.from('projects').insert([
      {
        input_image_url: publicURL,
        output_image_url: outPublic,
        prompt,
        status: 'completed',
        user_id: userId
      }
    ])

    if (insertErr) throw insertErr

    return new Response(JSON.stringify({ output_image_url: outPublic }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message || 'Erreur interne', { status: 500 })
  }
}
