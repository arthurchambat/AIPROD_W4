# 🎨 AI Image Generation Platform

> Une plateforme moderne de génération d'images par IA avec authentification complète et gestion de projets

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Storage-green)](https://supabase.com/)
[![Replicate](https://img.shields.io/badge/Replicate-AI%20Models-purple)](https://replicate.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-black)](https://ui.shadcn.com/)

## ✨ Fonctionnalités

### 🔐 Authentification Complète
- **Google OAuth** connexion rapide en un clic 🆕
- **Email/Password** avec Supabase Auth
- **Gestion de session** avec tokens JWT
- **Pages protégées** (dashboard, API routes)
- **AuthContext** React pour gestion globale de l'état
- **UI moderne** avec formulaires de login/signup

### 🎨 Génération d'Images IA
- **Intégration Replicate** avec SDK officiel
- **Modèles personnalisables** (google/nano-banana par défaut)
- **Upload d'images** via Supabase Storage
- **Prompts personnalisés** pour contrôler la génération
- **Mode mock** pour développement sans coûts

### 📊 Gestion de Projets
- **Dashboard personnel** avec tous vos projets
- **Filtrage par utilisateur** avec Row Level Security (RLS)
- **Stockage cloud** dans Supabase
- **Suppression sécurisée** avec vérification de propriété
- **Galerie d'images** générées

### 🎨 Design
- **Interface Palantir-inspired** sombre et moderne
- **shadcn/ui components** pour une UI professionnelle
- **Tailwind CSS** pour styling responsive
- **Animations fluides** et effets visuels
- **Mobile-friendly** responsive design

## 🏗️ Architecture

```
Workshop4/
├── app/
│   ├── api/
│   │   ├── generate/           # Génération d'images IA
│   │   └── projects/           # CRUD des projets
│   │       └── [id]/          # Suppression par ID
│   ├── dashboard/             # Page principale (protégée)
│   ├── login/                 # Page de connexion
│   ├── signup/                # Page d'inscription
│   ├── layout.tsx             # Layout global
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── AuthForm.tsx           # Formulaire auth réutilisable
│   └── Header.tsx             # Navigation avec état auth
├── context/
│   └── AuthContext.tsx        # Context React pour auth
├── lib/
│   ├── replicateClient.ts     # Client Replicate (SDK officiel)
│   ├── supabaseClient.ts      # Client Supabase (browser)
│   ├── supabaseServer.ts      # Client Supabase (server)
│   └── utils.ts               # Utilitaires (cn, etc.)
└── middleware.ts              # Protection des routes (Next.js)
```

## � Installation

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Compte Replicate (optionnel, mode mock disponible)

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd Workshop4
npm install
```

## �📋 Configuration Supabase

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

### 5. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🛠️ Technologies

| Technologie | Usage | Version |
|------------|-------|---------|
| **Next.js** | Framework React full-stack | 14.2 |
| **TypeScript** | Typage statique | 5.0 |
| **Supabase** | Auth + Database + Storage | 2.45 |
| **Replicate** | API génération d'images (SDK officiel) | latest |
| **Tailwind CSS** | Styling utility-first | 3.4 |
| **shadcn/ui** | Composants UI React | latest |
| **Radix UI** | Primitives UI accessibles | latest |

## 📝 Scripts disponibles

```bash
npm run dev      # Développement (localhost:3000)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code
```

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

### Authentification
- **Tokens JWT** stockés dans localStorage
- **Authorization headers** pour toutes les requêtes API
- **Validation côté serveur** avec `supabase.auth.getUser(token)`

### Base de données
- **Row Level Security (RLS)** activé sur la table `projects`
- **Policies strictes** : chaque utilisateur ne voit que ses projets
- **Cascade delete** : suppression des projets si l'utilisateur est supprimé

### API Routes
- **Protection middleware** (optionnel)
- **Vérification du token** dans chaque route
- **Validation de propriété** avant suppression

⚠️ **Important** : Ne committez JAMAIS le fichier `.env.local`. Utilisez les variables d'environnement sur votre plateforme de déploiement.

## 📈 Améliorations futures

- [ ] Tests unitaires et d'intégration (Jest/Vitest + React Testing Library)
- [ ] Gestion d'erreurs avancée avec toast notifications
- [ ] Loading states avec skeletons UI
- [ ] Pagination de la galerie de projets
- [ ] Filtres et recherche dans les projets
- [ ] Historique des générations
- [ ] Partage de projets entre utilisateurs
- [ ] Mode clair/sombre
- [ ] Internationalisation (i18n)
- [ ] Analytics et monitoring

## � Documentation

- **[QUICKSTART_GOOGLE_OAUTH.md](./QUICKSTART_GOOGLE_OAUTH.md)** - Configuration rapide Google OAuth (8 min)
- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)** - Guide complet OAuth avec troubleshooting
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Structure des composants et patterns
- **[DEPENDENCY_PINNING.md](./DEPENDENCY_PINNING.md)** - Gestion des versions
- **[TESTING.md](./TESTING.md)** - Plan de test et stratégies
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des modifications

## �👨‍💻 Développement

### Structure du code

- **Components** : Composants React réutilisables avec shadcn/ui
- **Context** : State management global (AuthContext)
- **API Routes** : Endpoints backend Next.js protégés
- **Lib** : Utilitaires et clients externes (Supabase, Replicate)

### Bonnes pratiques appliquées

- ✅ TypeScript strict mode activé
- ✅ ESLint configuré pour Next.js
- ✅ Composants fonctionnels avec hooks React
- ✅ Séparation client/server (Supabase clients distincts)
- ✅ RLS pour la sécurité des données
- ✅ SDK Replicate officiel au lieu de fetch manuel
- ✅ shadcn/ui pour une UI cohérente et accessible
- ✅ Google OAuth intégré pour connexion rapide

## 📄 License

MIT

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework full-stack
- [Supabase](https://supabase.com/) pour le backend complet
- [Replicate](https://replicate.com/) pour l'API IA
- [shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Palantir](https://www.palantir.com/) pour l'inspiration design

---

**Fait avec ❤️ et IA**
