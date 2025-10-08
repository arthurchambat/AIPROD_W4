# AIPROD W4 - Image Generation

Projet Next.js + TypeScript pour uploader une image, la transformer via Replicate AI, stocker les images sur Supabase Storage et garder une trace dans la table `projects`.

**Mode Mock disponible** pour tester sans consommer de crédits Replicate.

Variables d'environnement (créez `.env.local` à la racine) :

- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anon key
- SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (si besoin côté serveur)
- REPLICATE_API_TOKEN - Jeton API Replicate
- REPLICATE_MODEL - Identifiant du modèle Replicate (ex: google/nano-banana)

Supabase configuration requise:
- Buckets: `input-images`, `output-images` (public)
- Table: `projects` with columns (id UUID, created_at TIMESTAMP, input_image_url TEXT, output_image_url TEXT, prompt TEXT, status TEXT)

## Installation locale

```bash
npm install
npm run dev
```

## Déploiement sur Vercel

### 1. Configurez les variables d'environnement

Dans les paramètres de votre projet Vercel, ajoutez toutes les variables suivantes :

**Obligatoires :**
- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé publique anon de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clé service role (bypass RLS)
- `REPLICATE_API_TOKEN` - Token API Replicate

**Optionnelles :**
- `REPLICATE_MODEL` - Nom du modèle (ex: "stability-ai/stable-diffusion-3")
- `REPLICATE_MOCK` - Mettre "true" pour tester sans crédits Replicate

### 2. Déployez

```bash
git push
```

Vercel déploiera automatiquement.

## Note de sécurité

⚠️ Ne committez JAMAIS le fichier `.env.local` contenant vos vraies clés. Utilisez les variables d'environnement de Vercel pour la production.
