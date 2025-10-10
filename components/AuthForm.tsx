'use client'

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode: initialMode }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!email || !password) {
      setError('Email et mot de passe requis')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          // Messages d'erreur plus clairs
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Email non confirmé. Veuillez vérifier votre boîte mail.')
          }
          throw error
        }
        setSuccess('Connexion réussie !')
        setTimeout(() => router.push('/dashboard'), 500)
      } else {
        const { data, error } = await signUp(email, password)
        if (error) throw error
        
        // Vérifier si l'email doit être confirmé
        if (data.session) {
          // Pas de confirmation requise, connexion immédiate
          setSuccess('Compte créé ! Redirection...')
          setTimeout(() => router.push('/dashboard'), 1000)
        } else {
          // Confirmation requise
          setSuccess('✉️ Compte créé ! Vérifiez votre email pour confirmer votre compte.')
          // Basculer vers le mode login après 3 secondes
          setTimeout(() => {
            setMode('login')
            setSuccess('Email envoyé ! Après confirmation, connectez-vous ici.')
          }, 3000)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-tabs">
        <button
          className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          Connexion
        </button>
        <button
          className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => setMode('signup')}
        >
          Inscription
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="vous@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success-badge">{success}</div>}

        <button type="submit" className="primary" disabled={loading}>
          {loading ? '⏳ Chargement...' : mode === 'login' ? '🔐 Se connecter' : '✨ Créer un compte'}
        </button>
      </form>
    </div>
  )
}
