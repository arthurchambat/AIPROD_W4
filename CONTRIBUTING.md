# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet ! Voici comment vous pouvez aider.

## 🎯 Types de Contributions

- 🐛 **Bug Reports** : Signalez des bugs via les issues
- ✨ **Nouvelles fonctionnalités** : Proposez des améliorations
- 📝 **Documentation** : Améliorez la doc ou ajoutez des exemples
- 🧪 **Tests** : Ajoutez des tests pour améliorer la couverture
- 🎨 **UI/UX** : Améliorez le design et l'expérience utilisateur

## 🚀 Workflow de Contribution

### 1. Fork le projet

```bash
# Cloner votre fork
git clone https://github.com/votre-username/AIPROD_W4.git
cd AIPROD_W4
```

### 2. Créer une branche

```bash
# Feature
git checkout -b feature/ma-nouvelle-fonctionnalite

# Bugfix
git checkout -b fix/correction-bug

# Documentation
git checkout -b docs/amelioration-readme
```

### 3. Configurer l'environnement

```bash
npm install

# Copier .env.example vers .env.local
cp .env.example .env.local

# Configurer vos variables d'environnement
# Voir README.md pour les détails
```

### 4. Faire vos modifications

- Suivez le style de code existant
- Ajoutez des tests si applicable
- Mettez à jour la documentation si nécessaire
- Testez localement avant de commit

### 5. Commit avec des messages clairs

Utilisez les [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Exemples
git commit -m "feat: ajoute pagination à la galerie"
git commit -m "fix: corrige l'erreur 401 sur /api/generate"
git commit -m "docs: améliore le README avec exemples"
git commit -m "test: ajoute tests pour AuthContext"
git commit -m "style: améliore le design du dashboard"
git commit -m "refactor: simplifie le client Replicate"
```

Format : `<type>: <description>`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Style/UI (pas de changement de code)
- `refactor`: Refactoring (pas de nouvelle feature)
- `test`: Ajout de tests
- `chore`: Tâches de maintenance

### 6. Push et Pull Request

```bash
git push origin ma-branche

# Créer une Pull Request sur GitHub
# Remplir le template avec description détaillée
```

## 📋 Checklist PR

Avant de soumettre votre PR, vérifiez :

- [ ] Le code build sans erreurs (`npm run build`)
- [ ] Le linter passe (`npm run lint`)
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Les commits suivent le format conventionnel
- [ ] Pas de `.env.local` ou clés sensibles committées
- [ ] Les nouveaux fichiers ont une description claire

## 🎨 Standards de Code

### TypeScript

```typescript
// ✅ Bon
interface User {
  id: string
  email: string
}

const getUser = async (id: string): Promise<User> => {
  // ...
}

// ❌ Mauvais
const getUser = async (id: any) => {
  // Pas de typage
}
```

### React Components

```tsx
// ✅ Bon - Composant fonctionnel avec types
import { FC } from 'react'

interface Props {
  title: string
  onClick: () => void
}

export const MyComponent: FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>
}

// ❌ Mauvais - Pas de types
export const MyComponent = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>
}
```

### shadcn/ui Components

```tsx
// ✅ Utiliser les composants shadcn
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

<Button variant="default">Click me</Button>
<Input type="email" placeholder="Email" />

// ❌ Éviter le HTML brut
<button className="...">Click me</button>
<input type="email" />
```

### Naming Conventions

```typescript
// Components: PascalCase
AuthForm.tsx
DashboardHeader.tsx

// Hooks: camelCase avec préfixe 'use'
useAuth.ts
useProjects.ts

// Utils: camelCase
formatDate.ts
uploadImage.ts

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024
const API_ENDPOINT = '/api/generate'
```

## 🧪 Tests

Si vous ajoutez une nouvelle fonctionnalité, incluez des tests :

```typescript
// exemple: __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

Lancer les tests :
```bash
npm run test        # Une fois
npm run test:watch  # Mode watch
npm run test:coverage # Avec couverture
```

## 📝 Documentation

### README

Si vous ajoutez une fonctionnalité importante :
1. Mettez à jour la section **Fonctionnalités**
2. Ajoutez à la section **Utilisation** si nécessaire
3. Documentez les nouvelles variables d'environnement

### Code Comments

```typescript
// ✅ Bon - Commentaire utile
// Retry the request up to 3 times with exponential backoff
const result = await retryRequest(fn, { maxRetries: 3 })

// ❌ Mauvais - Commentaire évident
// Set x to 5
const x = 5
```

## 🐛 Signaler des Bugs

Utilisez le template d'issue GitHub avec :

- **Description** : Que s'est-il passé ?
- **Étapes pour reproduire** : Comment recréer le bug ?
- **Comportement attendu** : Que devrait-il se passer ?
- **Screenshots** : Si applicable
- **Environnement** : OS, Node version, browser

## 💡 Proposer des Fonctionnalités

Avant de coder une grosse feature :

1. **Ouvrir une issue** pour discuter
2. Attendre feedback des mainteneurs
3. Une fois validée, créer la PR

Cela évite de perdre du temps sur des features qui ne seront pas acceptées.

## 🌟 Premiers Contributions

Débutant en open-source ? Cherchez les issues avec les labels :

- `good first issue` : Idéal pour débuter
- `help wanted` : Besoin d'aide sur cette tâche
- `documentation` : Amélioration de docs

## 🤝 Code de Conduite

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Focusez sur ce qui est meilleur pour le projet
- Montrez de l'empathie envers les autres contributeurs

## ❓ Questions

Des questions ? N'hésitez pas à :

- Ouvrir une issue de type "Question"
- Contacter les mainteneurs
- Consulter le README et la documentation

## 🎉 Merci !

Chaque contribution compte, qu'elle soit petite ou grande. Merci de faire partie de ce projet ! 🙌

---

**Mainteneurs** : [@arthurchambat](https://github.com/arthurchambat)
