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
    <>
      <p className="subtitle">
        Transform your images with AI-powered editing. Upload, prompt, generate.
      </p>
      
      <div className="panel">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-title">
            <span>⚡</span> Input Configuration
          </div>
          
          <label className="label">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          {file && (
            <p style={{ fontSize: '0.875rem', color: 'var(--accent-light)', marginTop: '0.5rem' }}>
              ✓ {file.name}
            </p>
          )}

          <label className="label">Transformation Prompt</label>
          <textarea 
            value={prompt} 
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)} 
            rows={5}
            placeholder="Describe how you want to transform your image..."
          />

          <button className="primary" type="submit" disabled={loading}>
            {loading ? '⏳ Generating...' : '✨ Generate Image'}
          </button>
        </form>

        <div className="output">
          {!loading && !resultUrl && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">🎨</div>
              <p><strong>Your generated image will appear here</strong></p>
              <p>Upload an image and enter a prompt to get started</p>
            </div>
          )}
          
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p><strong>AI is generating your image...</strong></p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                This may take 30-60 seconds
              </p>
            </div>
          )}
          
          {error && (
            <div className="error">
              <strong>❌ Error</strong>
              <p style={{ marginTop: '0.5rem' }}>{error}</p>
            </div>
          )}
          
          {resultUrl && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div className="success-badge">
                ✓ Generation Complete
              </div>
              <div className="output-title">Generated Result</div>
              <img src={resultUrl} alt="Generated" className="result" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
