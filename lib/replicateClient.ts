const REPLICATE_API = 'https://api.replicate.com/v1'
const token = process.env.REPLICATE_API_TOKEN || ''
const mockMode = process.env.REPLICATE_MOCK === 'true'

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function runReplicate(modelIdentifier: string, input: any) {
  // Mock mode for testing without credits
  if (mockMode) {
    console.log('[MOCK MODE] Skipping Replicate API call')
    await sleep(2000) // Simulate processing time
    // Return a placeholder image URL
    return ['https://picsum.photos/800/600?random=' + Date.now()]
  }

  if (!token) throw new Error('REPLICATE_API_TOKEN not set')
  if (!modelIdentifier) throw new Error('REPLICATE_MODEL not set')

  // If it's a model name (owner/model-name), get latest version first
  let versionId = modelIdentifier
  
  if (modelIdentifier.includes('/') && modelIdentifier.length < 100) {
    // It's a model name, fetch the latest version
    const modelRes = await fetch(`${REPLICATE_API}/models/${modelIdentifier}`, {
      headers: { Authorization: `Token ${token}` }
    })
    if (!modelRes.ok) throw new Error(`Failed to fetch model: ${await modelRes.text()}`)
    const modelData = await modelRes.json()
    versionId = modelData.latest_version?.id
    if (!versionId) throw new Error('No version found for model')
  }

  const res = await fetch(`${REPLICATE_API}/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify({ version: versionId, input })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Replicate create prediction failed: ${text}`)
  }

  const data = await res.json()
  const id = data.id

  // Poll until succeeded or failed
  for (let i = 0; i < 60; i++) {
    const poll = await fetch(`${REPLICATE_API}/predictions/${id}`, {
      headers: { Authorization: `Token ${token}` }
    })
    if (!poll.ok) throw new Error(`Replicate poll failed: ${await poll.text()}`)
    const pd = await poll.json()
    if (pd.status === 'succeeded') return pd.output
    if (pd.status === 'failed') throw new Error('Replicate prediction failed: ' + (pd.error || JSON.stringify(pd)))
    // backoff
    await sleep(1000 + i * 500)
  }

  throw new Error('Replicate prediction timeout')
}

export default runReplicate
