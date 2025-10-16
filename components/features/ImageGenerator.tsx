'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ImageGeneratorProps {
  onSuccess?: () => void
}

export default function ImageGenerator({ onSuccess }: ImageGeneratorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('Make the sheets in the style of the logo. Make the scene natural.')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate image')
      }

      // Reset form
      setFile(null)
      setPrompt('Make the sheets in the style of the logo. Make the scene natural.')
      
      // Call success callback
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to generate image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="lg:sticky lg:top-24 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⚡</span> Nouvelle génération
        </CardTitle>
        <CardDescription>
          Uploadez une image et décrivez la transformation désirée
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            {file && (
              <p className="text-sm text-purple-400">
                ✓ {file.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Transformation Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe how you want to transform your image..."
            />
          </div>

          <Button 
            type="submit"
            className="w-full" 
            disabled={loading}
            size="lg"
          >
            {loading ? '⏳ Generating...' : '✨ Generate Image'}
          </Button>

          {error && (
            <div className="p-3 rounded-md bg-destructive/15 border border-destructive/50 text-destructive text-sm">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
