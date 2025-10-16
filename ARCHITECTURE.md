# 📁 Architecture du Projet - Nouvelle Structure

## 🎯 Objectif

Réorganisation des composants en suivant les best practices :
- **ui/** : Composants UI réutilisables (shadcn/ui)
- **features/** : Composants métier spécifiques
- **layout/** : Composants de mise en page

## 📂 Structure Actuelle

```
Workshop4/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts
│   │   └── projects/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── dashboard/
│   │   └── page.tsx          # ✨ Refactorisé - utilise composants features
│   ├── login/
│   │   └── page.tsx          # ✅ Mis à jour
│   ├── signup/
│   │   └── page.tsx          # ✅ Mis à jour
│   ├── layout.tsx            # ✅ Utilise layout/Header
│   ├── page.tsx              # Landing page
│   └── globals.css
│
├── components/
│   ├── ui/                   # 🎨 shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── __tests__/
│   │       └── button.test.tsx
│   │
│   ├── features/             # 🚀 Composants métier (NOUVEAU)
│   │   ├── AuthForm.tsx      # Formulaire auth (login/signup)
│   │   ├── ImageGenerator.tsx # Formulaire de génération d'images
│   │   └── ProjectsGallery.tsx # Galerie de projets
│   │
│   └── layout/               # 📐 Composants layout (NOUVEAU)
│       └── Header.tsx        # Header avec nav + auth state
│
├── context/
│   └── AuthContext.tsx
│
├── lib/
│   ├── replicateClient.ts
│   ├── supabaseClient.ts
│   ├── supabaseServer.ts
│   └── utils.ts
│
└── middleware.ts
```

## 🆕 Nouveaux Composants Créés

### 1. `components/layout/Header.tsx` ✨
**Avant** : `components/Header.tsx` (HTML brut)
**Après** : Composant moderne avec shadcn/ui

**Améliorations** :
- Sticky header avec backdrop blur
- Buttons shadcn/ui (variant ghost/outline)
- Gradient logo
- Responsive (hide email on mobile)
- Loading state avec spinner animé

```tsx
import Header from '@/components/layout/Header'
```

### 2. `components/features/ImageGenerator.tsx` 🚀
**Extraction depuis** : `app/dashboard/page.tsx`

**Responsabilités** :
- Form upload d'image
- Textarea pour prompt
- Gestion du loading state
- Appel API `/api/generate`
- Callback `onSuccess` pour refresh

**Props** :
```typescript
interface ImageGeneratorProps {
  onSuccess?: () => void  // Callback après génération réussie
}
```

**Usage** :
```tsx
<ImageGenerator onSuccess={fetchProjects} />
```

### 3. `components/features/ProjectsGallery.tsx` 🎨
**Extraction depuis** : `app/dashboard/page.tsx`

**Responsabilités** :
- Affichage grid responsive des projets
- Loading state (spinner)
- Empty state (card avec border dashed)
- Hover effects sur les cartes
- Bouton delete avec confirmation

**Props** :
```typescript
interface ProjectsGalleryProps {
  projects: Project[]
  loading: boolean
  onDelete: (id: string) => void
}
```

**Usage** :
```tsx
<ProjectsGallery 
  projects={projects} 
  loading={loadingProjects} 
  onDelete={handleDelete} 
/>
```

### 4. `components/features/AuthForm.tsx` ✅
**Déplacé depuis** : `components/AuthForm.tsx`

**Amélioration** :
- Imports mis à jour vers `@/components/ui/*`
- Utilise Card, Input, Button, Label
- Design moderne et accessible

## 📊 Comparaison Avant/Après

### Dashboard Page

**Avant** (~250 lignes) :
```tsx
export default function DashboardPage() {
  // State pour file, prompt, loading, error
  // State pour projects
  // Fonctions fetchProjects, handleSubmit, handleDelete
  // JSX avec tout le formulaire inline
  // JSX avec toute la galerie inline
  return ( /* 200+ lignes de JSX */ )
}
```

**Après** (~120 lignes) :
```tsx
export default function DashboardPage() {
  // State simplifié (just projects)
  // Fonctions fetchProjects, handleDelete
  return (
    <div className="grid lg:grid-cols-2">
      <ImageGenerator onSuccess={fetchProjects} />
      <ProjectsGallery projects={projects} onDelete={handleDelete} />
    </div>
  )
}
```

**Bénéfices** :
- ✅ -50% de lignes de code
- ✅ Composants réutilisables
- ✅ Séparation des responsabilités
- ✅ Plus facile à tester
- ✅ Plus maintenable

## 🎯 Avantages de cette Architecture

### 1. Séparation des Préoccupations
- **UI components** : Purement visuels, pas de logique métier
- **Feature components** : Logique métier encapsulée
- **Layout components** : Structure de page réutilisable

### 2. Réutilisabilité
```tsx
// AuthForm peut être utilisé partout
import AuthForm from '@/components/features/AuthForm'

// Dans une modale, une page, un drawer, etc.
<Modal>
  <AuthForm mode="login" />
</Modal>
```

### 3. Testabilité
```tsx
// Tester ImageGenerator indépendamment
describe('ImageGenerator', () => {
  it('calls onSuccess after successful generation', async () => {
    const onSuccess = vi.fn()
    render(<ImageGenerator onSuccess={onSuccess} />)
    // ... simulate file upload and submit
    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })
})
```

### 4. Maintenabilité
- **Modifier Header** : Un seul fichier `layout/Header.tsx`
- **Modifier galerie** : Un seul fichier `features/ProjectsGallery.tsx`
- **Pas de duplication** de code entre pages

### 5. Imports Propres
```tsx
// ✅ Bon - Paths absolus clairs
import { Button } from '@/components/ui/button'
import ImageGenerator from '@/components/features/ImageGenerator'
import Header from '@/components/layout/Header'

// ❌ Avant - Paths relatifs confus
import { Button } from '../../components/ui/button'
import Header from '../../../components/Header'
```

## 📝 Conventions de Nommage

### Fichiers
- **PascalCase** pour composants : `ImageGenerator.tsx`
- **camelCase** pour utils : `replicateClient.ts`
- **kebab-case** pour folders non-composants : `__tests__`

### Composants
- **Default export** pour page components
- **Named exports** pour utility components
- **Props interfaces** nommées `ComponentProps`

```tsx
// ✅ Bon
interface ImageGeneratorProps {
  onSuccess?: () => void
}

export default function ImageGenerator({ onSuccess }: ImageGeneratorProps) {
  // ...
}
```

## 🚀 Prochaines Étapes

### À court terme
1. **Créer Footer** : `components/layout/Footer.tsx`
2. **Créer CreditsBadge** : `components/features/CreditsBadge.tsx`
3. **Tests unitaires** pour nouveaux composants

### À moyen terme
4. **Storybook** pour documenter composants
5. **Page de design system** montrant tous les composants
6. **Composants partagés** (LoadingSpinner, EmptyState, etc.)

## 📚 Ressources

- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [React Component Patterns](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Status** : ✅ Architecture réorganisée et prête pour production
