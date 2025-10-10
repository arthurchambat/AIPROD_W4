'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  created_at: string
  input_image_url: string
  output_image_url: string
  prompt: string
  status: string
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('Make the sheets in the style of the logo. Make the scene natural.')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    try {
      // Get the access token from localStorage (where Supabase stores it)
      const supabaseAuth = localStorage.getItem('sb-pqsvqwnfzpshctzkguuu-auth-token')
      const token = supabaseAuth ? JSON.parse(supabaseAuth).access_token : null
      
      const res = await fetch('/api/projects', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err: any) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!file) return setError('Veuillez choisir une image')
    setLoading(true)

    const form = new FormData()
    form.append('file', file)
    form.append('prompt', prompt)

    try {
      // Get the access token from localStorage
      const supabaseAuth = localStorage.getItem('sb-pqsvqwnfzpshctzkguuu-auth-token')
      const token = supabaseAuth ? JSON.parse(supabaseAuth).access_token : null
      
      const res = await fetch('/api/generate', { 
        method: 'POST', 
        body: form,
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Server error (${res.status}): ${text}`)
      }
      const data = await res.json()
      await fetchProjects() // Refresh projects
      setFile(null)
      setError(null)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return
    
    try {
      // Get auth token from localStorage
      const supabaseAuth = localStorage.getItem('sb-pqsvqwnfzpshctzkguuu-auth-token')
      const token = supabaseAuth ? JSON.parse(supabaseAuth).access_token : null
      
      const res = await fetch(`/api/projects/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchProjects()
    } catch (err: any) {
      alert('Erreur lors de la suppression')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">Dashboard</h1>
      <p className="subtitle">Générez et gérez vos transformations d'images</p>

      <div className="dashboard-layout">
        <section className="upload-section">
          <div className="form">
            <div className="form-title">
              <span>⚡</span> Nouvelle génération
            </div>

            <label className="label">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
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
              rows={4}
              placeholder="Describe how you want to transform your image..."
            />

            <button onClick={handleSubmit} className="primary" disabled={loading}>
              {loading ? '⏳ Generating...' : '✨ Generate Image'}
            </button>

            {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
          </div>
        </section>

        <section className="projects-section">
          <h2 className="section-title">Mes projets</h2>

          {loadingProjects ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="placeholder">
              <p>Aucun projet pour le moment</p>
              <p style={{ fontSize: '0.875rem' }}>Commencez par uploader une image !</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <img src={project.output_image_url} alt="Generated" className="project-image" />
                  <div className="project-info">
                    <p className="project-prompt">{project.prompt}</p>
                    <p className="project-date">{new Date(project.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <button onClick={() => handleDelete(project.id)} className="btn-delete">
                    🗑️ Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
