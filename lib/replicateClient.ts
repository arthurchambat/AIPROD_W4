import Replicate from 'replicate'

const mockMode = process.env.REPLICATE_MOCK === 'true'

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

export async function runReplicate(modelIdentifier: string, input: any) {
  // Mock mode for testing without credits
  if (mockMode) {
    console.log('[MOCK MODE] Skipping Replicate API call')
    await sleep(2000) // Simulate processing time
    // Return a placeholder image URL
    return ['https://picsum.photos/800/600?random=' + Date.now()]
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN not set')
  }
  
  if (!modelIdentifier) {
    throw new Error('REPLICATE_MODEL not set')
  }

  try {
    console.log('🔵 [REPLICATE] Starting prediction with model:', modelIdentifier)
    console.log('🔵 [REPLICATE] Input:', JSON.stringify(input, null, 2))
    
    // Utiliser replicate.run - supporte owner/name ou owner/name:version
    let output = await replicate.run(
      modelIdentifier as any,
      { input }
    )
    
    console.log('🔵 [REPLICATE] Raw output type:', typeof output)
    console.log('🔵 [REPLICATE] Is Array?:', Array.isArray(output))
    
    // Si c'est un itérable async, le collecter
    if (output && typeof output === 'object' && (Symbol.asyncIterator in output || Symbol.iterator in output)) {
      console.log('🔵 [REPLICATE] Output is iterable, collecting all chunks...')
      const chunks: any[] = []
      
      try {
        // Essayer async iterator d'abord
        if (Symbol.asyncIterator in output) {
          for await (const chunk of output as any) {
            console.log('🔵 [REPLICATE] Received chunk:', typeof chunk, chunk)
            chunks.push(chunk)
          }
        } else if (Symbol.iterator in output) {
          for (const chunk of output as any) {
            console.log('🔵 [REPLICATE] Received chunk:', typeof chunk, chunk)
            chunks.push(chunk)
          }
        }
      } catch (e) {
        console.error('🔵 [REPLICATE] Error iterating:', e)
      }
      
      console.log('🔵 [REPLICATE] Total chunks collected:', chunks.length)
      console.log('🔵 [REPLICATE] Chunks:', JSON.stringify(chunks))
      
      // Si on a collecté des chunks, les retourner
      if (chunks.length > 0) {
        output = chunks
      }
    }
    
    console.log('🔵 [REPLICATE] Final output type:', typeof output)
    console.log('🔵 [REPLICATE] Final output:', JSON.stringify(output))
    
    return output
  } catch (error: any) {
    console.error('❌ [REPLICATE] API error:', error)
    console.error('❌ [REPLICATE] Error stack:', error.stack)
    throw new Error(`Replicate prediction failed: ${error.message || JSON.stringify(error)}`)
  }
}

export default runReplicate
