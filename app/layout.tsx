import React from 'react'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import Header from '../components/Header'

export const metadata = {
  title: "Éditeur d'images IA",
  description: 'Upload an image, provide a prompt and generate a transformed image using Replicate and Supabase.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
