'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Project {
  id: string
  created_at: string
  input_image_url: string
  output_image_url: string
  prompt: string
  status: string
}

interface ProjectsGalleryProps {
  projects: Project[]
  loading: boolean
  onDelete: (id: string) => void
}

export default function ProjectsGallery({ projects, loading, onDelete }: ProjectsGalleryProps) {
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
            Commencez par uploader une image !
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={project.output_image_url} 
              alt="Generated" 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
          </div>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm line-clamp-2">{project.prompt}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {new Date(project.created_at).toLocaleDateString('fr-FR')}
              </p>
              <Button 
                onClick={() => onDelete(project.id)} 
                variant="destructive" 
                size="sm"
              >
                🗑️ Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
