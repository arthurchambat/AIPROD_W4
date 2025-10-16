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
    // Use the official Replicate SDK - it handles polling automatically
    const output = await replicate.run(
      modelIdentifier as `${string}/${string}:${string}`,
      { input }
    )

    return output
  } catch (error: any) {
    console.error('Replicate API error:', error)
    throw new Error(`Replicate prediction failed: ${error.message || JSON.stringify(error)}`)
  }
}

export default runReplicate
