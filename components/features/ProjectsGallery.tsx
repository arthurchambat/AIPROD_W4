'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

interface ProjectsGalleryProps {
  projects: Project[]
  loading: boolean
  onDelete: (id: string) => void
  onGenerate?: (projectId: string) => void
}

export default function ProjectsGallery({ projects, loading, onDelete, onGenerate }: ProjectsGalleryProps) {
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set())

  const handleGenerate = async (projectId: string) => {
    setGeneratingIds(prev => new Set(prev).add(projectId))
    if (onGenerate) {
      await onGenerate(projectId)
    }
    setGeneratingIds(prev => {
      const next = new Set(prev)
      next.delete(projectId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">Aucun projet pour le moment</p>
          <p className="text-sm text-muted-foreground">
            Commencez par uploader une image et payer 0,99€ !
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => {
        const isPaid = project.payment_status === 'paid'
        const isPending = project.payment_status === 'pending'
        const isProcessing = project.status === 'processing'
        const isCompleted = project.status === 'completed' && project.output_image_url
        const needsGeneration = isPaid && !isCompleted && !isProcessing

        return (
          <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              {isCompleted ? (
                <img 
                  src={project.output_image_url!} 
                  alt="Generated" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={project.input_image_url} 
                    alt="Input" 
                    className="object-cover w-full h-full opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    {isPending && (
                      <div className="text-center">
                        <p className="text-yellow-400 font-semibold mb-2">⏳ En attente de paiement</p>
                        <p className="text-xs text-gray-300">0,99€</p>
                      </div>
                    )}
                    {isProcessing && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-2"></div>
                        <p className="text-purple-400 font-semibold">🎨 Génération en cours...</p>
                      </div>
                    )}
                    {needsGeneration && (
                      <div className="text-center">
                        <p className="text-green-400 font-semibold mb-2">✅ Payé</p>
                        <p className="text-xs text-gray-300">Prêt à générer</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm line-clamp-2">{project.prompt}</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </p>
                <div className="flex gap-2">
                  {needsGeneration && (
                    <Button 
                      onClick={() => handleGenerate(project.id)} 
                      variant="default" 
                      size="sm"
                      disabled={generatingIds.has(project.id)}
                    >
                      {generatingIds.has(project.id) ? '⏳ Génération...' : '🎨 Générer'}
                    </Button>
                  )}
                  <Button 
                    onClick={() => onDelete(project.id)} 
                    variant="destructive" 
                    size="sm"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
              
              {/* Badge de statut */}
              <div className="flex gap-2">
                {isPaid && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    ✓ Payé
                  </span>
                )}
                {isPending && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    ⏳ Paiement en attente
                  </span>
                )}
                {isProcessing && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    🎨 Génération...
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    ✅ Complété
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
