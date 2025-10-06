'use client'

import React, { useState } from 'react'

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('Make the sheets in the style of the logo. Make the scene natural.')
  const [loading, setLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!file) return setError('Veuillez choisir une image à uploader')
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('prompt', prompt)

    try {
      const res = await fetch('/api/generate', { method: 'POST', body: form })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Server error (${res.status}): ${text}`)
      }
      const data = await res.json()
      setResultUrl(data.output_image_url)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit} className="form">
        <label className="label">Choisir une image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)}
        />

        <label className="label">Prompt</label>
        <textarea value={prompt} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)} rows={4} />

        <button className="primary" type="submit" disabled={loading}>
          Générer
        </button>
      </form>

      <div className="output">
        {loading && <p>Génération en cours... Cela peut prendre quelques secondes.</p>}
        {error && <p className="error">{error}</p>}
        {resultUrl && (
          <div>
            <h3>Image générée</h3>
            <img src={resultUrl} alt="Generated" className="result" />
          </div>
        )}
      </div>
    </div>
  )
}
