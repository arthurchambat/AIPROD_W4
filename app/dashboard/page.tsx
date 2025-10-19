'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import ImageGenerator from '@/components/features/ImageGenerator'
import ProjectsGallery from '@/components/features/ProjectsGallery'

interface Project {
  id: string
  created_at: string
  input_image_url: string
  output_image_url: string | null
  prompt: string
  status: string
  payment_status: string
  payment_amount: number
  stripe_checkout_session_id: string | null
}

export default function DashboardPage() {
  const { user, session, loading: authLoading } = useAuth()
  const router = useRouter()
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

  // Auto-refresh toutes les 3 secondes s'il y a des projets en cours
  useEffect(() => {
    if (!user) return
    
    const hasProcessingProjects = projects.some(
      p => p.status === 'processing' || p.status === 'pending'
    )
    
    if (!hasProcessingProjects) return
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh des projets en cours...')
      fetchProjects()
    }, 3000) // 3 secondes
    
    return () => clearInterval(interval)
  }, [projects, user])

  // Refresh au retour de Stripe (détection du query param)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('session_id') || urlParams.has('canceled')) {
        console.log('🔄 Retour de Stripe détecté, refresh...')
        fetchProjects()
        // Nettoyer l'URL
        window.history.replaceState({}, '', '/dashboard')
      }
    }
  }, [])

  const fetchProjects = async () => {
    try {
      const token = session?.access_token
      
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

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return
    
    try {
      const token = session?.access_token
      
      // Suppression optimiste : retirer immédiatement de l'UI
      setProjects(prev => prev.filter(p => p.id !== id))
      
      const res = await fetch(`/api/projects/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (!res.ok) {
        // Si échec, recharger pour restaurer l'état correct
        await fetchProjects()
        throw new Error('Failed to delete')
      }
      
      // Recharger pour être sûr
      await fetchProjects()
    } catch (err: any) {
      alert('Erreur lors de la suppression')
      // Recharger en cas d'erreur
      await fetchProjects()
    }
  }

  const handleGenerate = async (projectId: string) => {
    try {
      const token = session?.access_token
      
      if (!token) {
        throw new Error('Non authentifié')
      }

      // Mettre à jour immédiatement le statut dans l'UI
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status: 'processing' } : p
      ))

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ projectId })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      const data = await res.json()
      console.log('✅ Image générée:', data)
      
      // Rafraîchir immédiatement
      await fetchProjects()
    } catch (err: any) {
      console.error('Erreur génération:', err)
      alert(err.message || 'Erreur lors de la génération')
      // Rafraîchir en cas d'erreur pour restaurer l'état
      await fetchProjects()
    }
  }

  if (authLoading || !user) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Générez et gérez vos transformations d'images
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGenerator onSuccess={fetchProjects} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mes projets</h2>
            <span className="text-sm text-muted-foreground">
              {projects.length} projet{projects.length > 1 ? 's' : ''}
            </span>
          </div>

          <ProjectsGallery 
            projects={projects} 
            loading={loadingProjects} 
            onDelete={handleDelete}
            onGenerate={handleGenerate}
          />
        </div>
      </div>
    </div>
  )
}
