# Next.js IA Image Editor

Projet Next.js + TypeScript minimal pour uploader une image, la transformer via Replicate, stocker les images sur Supabase Storage et garder une trace dans la table `projects`.

Variables d'environnement (créez `.env.local` à la racine) :

- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anon key
- SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (si besoin côté serveur)
- REPLICATE_API_TOKEN - Jeton API Replicate
- REPLICATE_MODEL - Identifiant du modèle Replicate (ex: google/nano-banana)

Supabase configuration requise:
- Buckets: `input-images`, `output-images` (public)
- Table: `projects` with columns (id UUID, created_at TIMESTAMP, input_image_url TEXT, output_image_url TEXT, prompt TEXT, status TEXT)

Installation:

1. npm install
2. npm run dev

Note: Ce projet est une base. Avant de déployer, vérifiez les règles de sécurité des buckets et ne laissez pas les clefs publiques en clair.
