# AI Image Editor - Next.js + Supabase + Replicate

Application de transformation d'images par IA avec authentification, stockage cloud et génération via Replicate.

## 🚀 Fonctionnalités

- ✨ **Génération d'images par IA** via Replicate (modèle google/nano-banana)
- 🔐 **Authentification email/mot de passe** via Supabase Auth
- 💾 **Stockage sécurisé** des images sur Supabase Storage
- 🎨 **Dashboard personnel** pour gérer vos projets
- 🔒 **Protection des routes** avec middleware
- 📱 **Design responsive** inspiré de Palantir

## 📋 Configuration Supabase

### 1. Créer les buckets de stockage
Dans Supabase Dashboard → Storage :
- Créer un bucket `input-images` (public)
- Créer un bucket `output-images` (public)

### 2. Créer la table projects
Dans Supabase Dashboard → SQL Editor, exécuter :

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT NOT NULL,
  output_image_url TEXT NOT NULL,
  prompt TEXT,
  status TEXT DEFAULT 'completed',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Activer l'authentification email
Dans Supabase Dashboard → Authentication → Providers :
- Activer **Email** provider
- **Désactiver** "Confirm email" pour le développement (ou configurer un serveur SMTP)

### 4. Variables d'environnement

Créez `.env.local` à la racine :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Replicate
REPLICATE_API_TOKEN=votre_token_replicate
REPLICATE_MODEL=google/nano-banana
REPLICATE_MOCK=false
```

## 🛠️ Installation locale

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

### 1. Créer un compte
- Aller sur `/signup`
- Entrer votre email et mot de passe
- Se connecter sur `/login`

### 2. Générer une image
- Aller sur `/dashboard`
- Uploader une image
- Entrer un prompt de transformation
- Cliquer sur "Generate Image"

### 3. Gérer vos projets
- Voir tous vos projets dans la galerie
- Supprimer un projet avec le bouton 🗑️

## 🚀 Déploiement sur Vercel

1. Push le code sur GitHub
2. Importer sur Vercel
3. Ajouter les variables d'environnement (sans guillemets)
4. Déployer

**Important** : Dans Supabase Dashboard → Authentication → URL Configuration :
- Ajouter votre URL Vercel dans "Site URL"
- Ajouter `https://votre-app.vercel.app/**` dans "Redirect URLs"

## 🐛 Troubleshooting

### Erreur "Unauthorized"
- Vérifier que l'utilisateur est connecté
- Vérifier les RLS policies dans Supabase

### Images non générées
- Vérifier `REPLICATE_API_TOKEN`
- Vérifier les crédits Replicate
- Activer `REPLICATE_MOCK=true` pour tester

### Email non reçu
- Désactiver "Confirm email" dans Supabase Auth
- Ou configurer un serveur SMTP

## 🔒 Sécurité

- **RLS (Row Level Security)** : Seuls les propriétaires peuvent voir/modifier leurs projets
- **Middleware** : Routes `/dashboard` et `/api/*` protégées
- **Service Role** : Utilisé côté serveur uniquement pour bypasser RLS

⚠️ Ne committez JAMAIS le fichier `.env.local` contenant vos vraies clés. Utilisez les variables d'environnement de Vercel pour la production.
