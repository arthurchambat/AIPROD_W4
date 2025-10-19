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
    
    // Nouvelle méthode : utiliser predictions.create puis wait
    const prediction = await replicate.predictions.create({
      version: modelIdentifier.split(':')[1], // Extraire le hash de version
      input: input
    })
    
    console.log('🔵 [REPLICATE] Prediction created:', prediction.id)
    console.log('🔵 [REPLICATE] Status:', prediction.status)
    
    // Attendre que la prédiction soit complète
    const finalPrediction = await replicate.wait(prediction)
    
    console.log('🔵 [REPLICATE] Final status:', finalPrediction.status)
    console.log('🔵 [REPLICATE] Output type:', typeof finalPrediction.output)
    console.log('🔵 [REPLICATE] Output:', JSON.stringify(finalPrediction.output))
    
    return finalPrediction.output
  } catch (error: any) {
    console.error('❌ [REPLICATE] API error:', error)
    throw new Error(`Replicate prediction failed: ${error.message || JSON.stringify(error)}`)
  }
}

export default runReplicate
