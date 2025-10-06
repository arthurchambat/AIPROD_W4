import React from 'react'
import './globals.css'

export const metadata = {
  title: "Éditeur d'images IA",
  description: 'Upload an image, provide a prompt and generate a transformed image using Replicate and Supabase.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <main className="container">
          <h1 className="logo">Éditeur d'images IA</h1>
          {children}
        </main>
      </body>
    </html>
  )
}
