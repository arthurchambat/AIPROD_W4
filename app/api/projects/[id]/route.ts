import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseServer } from '../../../../lib/supabaseServer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const dynamic = 'force-dynamic'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const projectId = params.id

    // Fetch project to verify ownership and get image URLs
    const { data: project, error: fetchError } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete images from storage via REST API
    const inputFilename = project.input_image_url?.split('/').pop()
    const outputFilename = project.output_image_url?.split('/').pop()

    if (inputFilename) {
      await fetch(`${supabaseUrl}/storage/v1/object/input-images/${inputFilename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      })
    }
    if (outputFilename) {
      await fetch(`${supabaseUrl}/storage/v1/object/output-images/${outputFilename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      })
    }

    // Delete project from database
    const { error: deleteError } = await supabaseServer
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error in DELETE /api/projects/[id]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
