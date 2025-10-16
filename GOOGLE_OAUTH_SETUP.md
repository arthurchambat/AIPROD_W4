# 🔐 Configuration Google OAuth avec Supabase

## Vue d'ensemble

L'authentification Google OAuth a été ajoutée au composant `AuthForm` pour permettre une connexion rapide et sécurisée via Google.

## ✅ Implémentation

### Code ajouté dans `components/features/AuthForm.tsx`

```tsx
const handleGoogleSignIn = async () => {
  try {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) throw error
  } catch (err: any) {
    setError(err.message || 'Erreur lors de la connexion Google')
    setLoading(false)
  }
}
```

### UI ajoutée

- **Bouton Google** avec logo officiel et design cohérent
- **Séparateur visuel** entre OAuth et formulaire email/password
- **Messages de statut** (loading, erreurs)

## 🔧 Configuration requise dans Supabase

### 1. Activer Google Provider

Dans le dashboard Supabase :
1. Aller dans **Authentication → Providers**
2. Activer **Google**
3. Configurer les credentials OAuth

### 2. Créer une application Google Cloud

#### a. Console Google Cloud
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer **Google+ API**

#### b. Créer les credentials OAuth 2.0
1. Aller dans **APIs & Services → Credentials**
2. Cliquer sur **Create Credentials → OAuth client ID**
3. Type d'application : **Web application**
4. Nom : `Supabase Auth - [Votre App]`

#### c. Configurer les URIs autorisés

**Authorized JavaScript origins:**
```
https://[your-project-ref].supabase.co
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://[your-project-ref].supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

> ⚠️ Remplacer `[your-project-ref]` par votre référence de projet Supabase

#### d. Récupérer les credentials
- **Client ID** : `123456789-abc...xyz.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-...`

### 3. Configurer dans Supabase

Retourner dans **Supabase → Authentication → Providers → Google** :
1. Activer le provider
2. Coller le **Client ID**
3. Coller le **Client Secret**
4. Sauvegarder

### 4. Configuration de la base de données (optionnel)

Pour stocker les métadonnées utilisateur Google :

```sql
-- La table auth.users contient déjà les infos OAuth
-- Exemple de requête pour récupérer les données Google :
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  raw_user_meta_data->>'provider' as provider
FROM auth.users
WHERE raw_user_meta_data->>'provider' = 'google';
```

## 🚀 Fonctionnement

### Flux d'authentification

1. **User clique** sur "Continuer avec Google"
2. **Redirection** vers la page de connexion Google
3. **User autorise** l'accès à l'application
4. **Google redirige** vers Supabase avec un code
5. **Supabase échange** le code contre un token
6. **User redirigé** vers `/dashboard`
7. **Session créée** automatiquement

### Sécurité

✅ **Token sécurisé** : JWT signé par Supabase  
✅ **Pas de password** : Pas besoin de gérer les mots de passe  
✅ **Refresh automatique** : Les tokens sont renouvelés automatiquement  
✅ **RLS compatible** : Fonctionne avec les politiques Row Level Security

## 🧪 Test

### En développement (localhost)

1. Démarrer le serveur : `npm run dev`
2. Aller sur `/login` ou `/signup`
3. Cliquer sur "Continuer avec Google"
4. Se connecter avec un compte Google de test
5. Vérifier la redirection vers `/dashboard`

### En production

1. Ajouter le domaine de production dans Google Cloud Console
2. Ajouter l'URL de callback : `https://yourdomain.com/auth/callback`
3. Mettre à jour la redirect URI dans Supabase
4. Tester le flow complet

## 📊 Métadonnées stockées

Lors de la connexion Google, Supabase stocke automatiquement :

```json
{
  "iss": "https://accounts.google.com",
  "sub": "123456789",
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "given_name": "John",
  "family_name": "Doe",
  "locale": "fr",
  "provider": "google",
  "provider_id": "123456789"
}
```

## 🔍 Debugging

### Erreur : "Invalid redirect URI"
- Vérifier que l'URI est exactement `https://[project-ref].supabase.co/auth/v1/callback`
- Vérifier les URIs dans Google Cloud Console

### Erreur : "OAuth client not found"
- Vérifier que le Client ID est correct dans Supabase
- Vérifier que l'application Google Cloud est bien créée

### Erreur : "Access blocked"
- L'app Google Cloud doit être en mode "Production" ou ajouter des test users

### User redirigé mais pas connecté
- Vérifier que `redirectTo` est correct
- Vérifier que le middleware Next.js gère la route `/auth/callback`

## 🎨 Personnalisation

### Changer le texte du bouton

```tsx
<Button ...>
  {loading ? 'Connexion...' : 'Se connecter avec Google'}
</Button>
```

### Ajouter d'autres providers OAuth

```tsx
// GitHub
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: { redirectTo: `${window.location.origin}/dashboard` }
})

// Facebook
await supabase.auth.signInWithOAuth({
  provider: 'facebook',
  options: { redirectTo: `${window.location.origin}/dashboard` }
})
```

## 📚 Ressources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Auth Patterns](https://nextjs.org/docs/authentication)

## ⚠️ Important

- **Ne jamais commiter** les Client ID/Secret dans le code
- **Utiliser .env.local** pour les variables sensibles (si nécessaire)
- **Tester en mode incognito** pour éviter les problèmes de cache
- **Limiter les scopes** aux données strictement nécessaires

## 🎯 Prochaines étapes

1. ✅ Bouton Google ajouté
2. ⏳ Configurer Google Cloud Console
3. ⏳ Activer provider dans Supabase
4. ⏳ Tester le flow complet
5. ⏳ Ajouter d'autres providers (GitHub, Facebook) si besoin
