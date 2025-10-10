'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="container">
      <div className="landing-hero">
        <h1 className="landing-title">
          <span className="gradient-text">Transform Your Images</span>
          <br />
          with AI Magic
        </h1>
        <p className="landing-subtitle">
          Utilisez l'intelligence artificielle de pointe pour transformer vos images.
          <br />
          Créez des visuels uniques en quelques secondes.
        </p>

        {user ? (
          <Link href="/dashboard" className="cta-button">
            🚀 Accéder au Dashboard
          </Link>
        ) : (
          <Link href="/signup" className="cta-button">
            ✨ Commencer gratuitement
          </Link>
        )}
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Transformations créatives</h3>
          <p>Appliquez des styles uniques à vos images avec des prompts personnalisés</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Génération rapide</h3>
          <p>Résultats en quelques secondes grâce à nos modèles IA optimisés</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💾</div>
          <h3>Stockage sécurisé</h3>
          <p>Toutes vos créations sont sauvegardées et accessibles à tout moment</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Données privées</h3>
          <p>Vos projets restent privés et ne sont visibles que par vous</p>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">Prêt à créer ?</h2>
        <p className="cta-text">
          Rejoignez des milliers de créateurs qui utilisent notre plateforme
        </p>
        {user ? (
          <Link href="/dashboard" className="cta-button secondary">
            Continuer vers Dashboard →
          </Link>
        ) : (
          <Link href="/signup" className="cta-button secondary">
            Créer un compte gratuitement →
          </Link>
        )}
      </div>
    </div>
  )
}
