# ⚡ Guide Rapide - Configuration Google OAuth

## 🎯 Pour utiliser Google OAuth dans votre application

### Étape 1 : Google Cloud Console (5 min)

1. **Créer un projet** sur [console.cloud.google.com](https://console.cloud.google.com)
2. **Activer Google+ API** (APIs & Services → Library → Google+ API)
3. **Créer OAuth Client ID** :
   - APIs & Services → Credentials → Create Credentials
   - Type : Web Application
   - Name : "Supabase Auth"

4. **Configurer les URIs** :
   
   **JavaScript origins:**
   ```
   https://[votre-projet].supabase.co
   http://localhost:3000
   ```
   
   **Redirect URIs:**
   ```
   https://[votre-projet].supabase.co/auth/v1/callback
   ```

5. **Copier les credentials** :
   - Client ID : `123456...apps.googleusercontent.com`
   - Client Secret : `GOCSPX-...`

### Étape 2 : Supabase Dashboard (2 min)

1. Aller dans **Authentication → Providers**
2. Activer **Google**
3. Coller le **Client ID**
4. Coller le **Client Secret**
5. **Save**

### Étape 3 : Tester (1 min)

1. Lancer l'app : `npm run dev`
2. Aller sur `http://localhost:3000/login`
3. Cliquer sur **"Continuer avec Google"**
4. Se connecter avec un compte Google
5. Vérifier la redirection vers `/dashboard`

## ✅ C'est tout !

Le bouton Google OAuth est maintenant fonctionnel. 

## 🐛 Dépannage rapide

**Erreur "Invalid OAuth client"**
→ Vérifier que les credentials sont bien copiés dans Supabase

**Erreur "Redirect URI mismatch"**
→ Vérifier que l'URI est exactement `https://[projet].supabase.co/auth/v1/callback`

**Le bouton ne fait rien**
→ Ouvrir la console DevTools pour voir les erreurs JavaScript

**User redirigé mais pas connecté**
→ Vérifier que la session Supabase est bien créée (voir onglet Application → Cookies)

## 📚 Documentation complète

Pour plus de détails, voir `GOOGLE_OAUTH_SETUP.md`
