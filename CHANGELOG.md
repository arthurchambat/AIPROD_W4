# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [Unreleased] - 2025-10-16

### Ajouté ✨

- **Google OAuth** : Authentification rapide via compte Google
  - Bouton "Continuer avec Google" dans AuthForm
  - Logo officiel Google intégré
  - Redirection automatique vers `/dashboard` après connexion
  - Documentation complète dans `GOOGLE_OAUTH_SETUP.md`
  - Compatible avec l'authentification email/password existante

- **Versions pinnées** : Toutes les dépendances utilisent maintenant des versions exactes (sans `^` ou `~`)
  - Builds 100% reproductibles
  - Contrôle total sur les mises à jour
  - CI/CD stable et prévisible
  - Documentation complète dans `DEPENDENCY_PINNING.md`

- **SDK Replicate officiel** : Remplacement de l'implémentation fetch manuelle par le package npm `replicate`
  - Meilleure gestion des erreurs
  - Code plus maintenable
  - Polling automatique intégré
  
- **shadcn/ui** : Intégration complète des composants UI
  - Button component avec variants (default, destructive, outline, etc.)
  - Input et Textarea components
  - Label component avec Radix UI
  - Card components (Card, CardHeader, CardTitle, etc.)
  - Configuration Tailwind CSS complète avec CSS variables
  - Utilitaire `cn()` pour merge de classes
  
- **Documentation complète**
  - README étendu avec architecture, installation détaillée
  - Badges pour technologies utilisées
  - Section sécurité détaillée
  - Roadmap des améliorations futures
  - `TESTING.md` : Plan de test complet avec priorités
  - `components.json` : Configuration shadcn/ui
  
- **Tailwind CSS** : Configuration moderne
  - Support des design tokens shadcn/ui
  - Variables CSS personnalisées (HSL)
  - Plugin `tailwindcss-animate`
  - PostCSS configuré

### Amélioré 🚀

- **TypeScript** : Types stricts pour tous les composants
- **Structure du projet** : Organisation claire avec `/components/ui`
- **DX (Developer Experience)** : Setup plus simple avec SDK officiel

### Dépendances ajoutées 📦

```json
{
  "replicate": "^latest",
  "tailwindcss": "^3.4",
  "tailwindcss-animate": "^latest",
  "class-variance-authority": "^latest",
  "clsx": "^latest",
  "tailwind-merge": "^latest",
  "lucide-react": "^latest",
  "@radix-ui/react-slot": "^latest",
  "@radix-ui/react-label": "^latest"
}
```

## [1.0.0] - 2025-10-10

### Fonctionnalités initiales

- ✅ Authentification email/password avec Supabase
- ✅ AuthContext React pour gestion globale
- ✅ Dashboard protégé avec middleware
- ✅ Génération d'images via Replicate API
- ✅ Upload et stockage dans Supabase Storage
- ✅ Row Level Security (RLS) sur les projets
- ✅ CRUD complet des projets
- ✅ Design Palantir-inspired
- ✅ Landing page avec CTA

### Architecture

```
- Next.js 14.2 avec App Router
- TypeScript 5.0 (strict mode)
- Supabase (Auth + Database + Storage)
- Replicate API (génération IA)
- CSS custom avec variables
```

### Sécurité

- Authorization headers avec JWT tokens
- RLS policies sur table projects
- Validation côté serveur des tokens
- Protection des API routes

---

## Notes de version

### Breaking Changes

Aucun breaking change pour l'instant (v1.0.0 → v1.1.0).

### Migration Guide

Si vous utilisez une version antérieure avec l'ancien client Replicate custom :

1. Installer le nouveau package :
   ```bash
   npm install replicate
   ```

2. Le code de `lib/replicateClient.ts` a été simplifié, mais l'API reste la même :
   ```typescript
   // ✅ Toujours la même signature
   await runReplicate(modelIdentifier, input)
   ```

3. Aucune modification nécessaire dans vos composants !

### Roadmap

#### v1.2.0 (À venir)
- [ ] Tests unitaires avec Vitest
- [ ] Toast notifications pour erreurs
- [ ] Loading skeletons
- [ ] Mode sombre/clair

#### v1.3.0 (Futur)
- [ ] Pagination de la galerie
- [ ] Filtres et recherche
- [ ] Partage de projets
- [ ] Analytics

#### v2.0.0 (Vision long terme)
- [ ] Multi-modèles IA (Stable Diffusion, DALL-E, etc.)
- [ ] Éditeur d'images intégré
- [ ] Collaboration en temps réel
- [ ] Système de crédits/abonnement

---

**Mainteneurs** : [@arthurchambat](https://github.com/arthurchambat)

**License** : MIT
