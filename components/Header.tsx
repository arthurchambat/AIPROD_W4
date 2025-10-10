'use client'

import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="header">
      <nav className="header-nav">
        <Link href="/" className="header-logo">
          AI Image Editor
        </Link>

        <div className="header-links">
          {loading ? (
            <div className="loading-spinner" style={{ width: '24px', height: '24px' }}></div>
          ) : user ? (
            <div className="header-user">
              <Link href="/dashboard" className="header-link">
                Dashboard
              </Link>
              <span className="header-email">{user.email}</span>
              <button onClick={handleSignOut} className="btn-secondary">
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="header-link">
                Connexion
              </Link>
              <Link href="/signup" className="btn-secondary">
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
