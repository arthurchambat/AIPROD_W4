# Guide de Configuration Supabase Auth

## 📝 Étapes dans Supabase Dashboard

### 1. Activer l'authentification par email

1. Aller dans **Authentication** → **Providers**
2. Trouver **Email** dans la liste
3. S'assurer qu'il est **activé** (toggle à droite)

### 2. Configuration Email (Développement)

Pour le développement local, désactivez la confirmation d'email :

1. Aller dans **Authentication** → **Email Templates**
2. Cliquer sur **Settings** (roue crantée en haut)
3. Décocher **"Enable email confirmations"**

Cela permet aux utilisateurs de se connecter immédiatement après l'inscription.

### 3. Configuration Email (Production)

Pour la production, configurez un serveur SMTP :

1. Aller dans **Settings** → **Authentication**
2. Faire défiler jusqu'à **SMTP Settings**
3. Activer **Enable Custom SMTP**
4. Remplir les informations de votre serveur SMTP

Services recommandés :
- **SendGrid** (gratuit jusqu'à 100 emails/jour)
- **Mailgun** (gratuit jusqu'à 5000 emails/mois)
- **AWS SES** (très économique)

### 4. Configuration des URLs (Production)

Quand vous déployez sur Vercel/autre :

1. Aller dans **Authentication** → **URL Configuration**
2. **Site URL** : Mettre l'URL de votre application (ex: https://votre-app.vercel.app)
3. **Redirect URLs** : Ajouter :
   - `https://votre-app.vercel.app/**`
   - `http://localhost:3000/**` (pour le dev)

### 5. Créer la base de données

1. Aller dans **SQL Editor**
2. Cliquer sur **New query**
3. Copier-coller le contenu de `supabase-setup.sql`
4. Cliquer sur **Run** (ou Ctrl/Cmd + Enter)

Cela créera :
- La table `projects` avec le champ `user_id`
- Les policies RLS pour la sécurité
- Les index pour les performances

### 6. Créer les buckets de stockage

1. Aller dans **Storage**
2. Cliquer sur **New bucket**
3. Créer `input-images` :
   - Name: `input-images`
   - **Public bucket**: ✅ Coché
4. Créer `output-images` :
   - Name: `output-images`
   - **Public bucket**: ✅ Coché

### 7. Récupérer vos clés API

1. Aller dans **Settings** → **API**
2. Copier :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Secret !

## 🧪 Tester l'authentification

### En local

1. Démarrer l'app : `npm run dev`
2. Aller sur http://localhost:3000
3. Cliquer sur "Commencer gratuitement"
4. Créer un compte avec :
   - Email: `test@example.com`
   - Password: `password123` (min 6 caractères)
5. Vous devriez être redirigé vers `/dashboard`

### Vérifier dans Supabase

1. Aller dans **Authentication** → **Users**
2. Vous devriez voir votre utilisateur
3. Aller dans **Table Editor** → **projects**
4. Après génération d'image, vous verrez les projets avec le `user_id`

## 🔒 Sécurité RLS

Les Row Level Security policies garantissent que :

✅ Chaque utilisateur voit uniquement ses projets
✅ Impossible d'accéder aux projets d'un autre utilisateur
✅ Impossible de modifier/supprimer les projets d'autrui

Pour tester :

1. Créer 2 comptes différents
2. Générer des images avec chaque compte
3. Vérifier que chaque dashboard affiche uniquement ses propres projets

## 🐛 Problèmes courants

### "Email not confirmed"
- Désactiver "Enable email confirmations" dans Auth Settings

### "Invalid login credentials"
- Vérifier que l'email et le mot de passe sont corrects
- Le mot de passe doit faire au moins 6 caractères

### "User already registered"
- Soit se connecter avec cet email
- Soit supprimer l'utilisateur dans Auth → Users

### "Unauthorized" dans l'API
- Vérifier que les RLS policies sont créées
- Vérifier que `user_id` est bien rempli dans la table

### Images non visibles
- Vérifier que les buckets sont **publics**
- Vérifier les URLs dans la table projects

## 📚 Ressources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
