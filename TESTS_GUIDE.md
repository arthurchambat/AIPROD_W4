# 🧪 Guide de Tests - Installation et Utilisation

## 📦 Installation des Dépendances

Pour installer les packages de test nécessaires, exécutez :

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## ✅ Packages Installés

- **vitest** : Framework de test rapide (alternative moderne à Jest)
- **@vitejs/plugin-react** : Plugin pour supporter React dans Vitest
- **@testing-library/react** : Utilitaires pour tester les composants React
- **@testing-library/jest-dom** : Matchers DOM personnalisés
- **@testing-library/user-event** : Simulation d'interactions utilisateur
- **jsdom** : Environnement DOM pour Node.js

## 🚀 Commandes de Test

```bash
# Exécuter les tests une fois
npm run test

# Mode watch (réexécute les tests à chaque changement)
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

## 📁 Structure des Tests

```
Workshop4/
├── components/
│   └── ui/
│       └── __tests__/
│           └── button.test.tsx        # ✅ Exemple créé
├── context/
│   └── __tests__/
│       └── AuthContext.test.tsx       # À créer
├── lib/
│   └── __tests__/
│       ├── utils.test.ts              # À créer
│       └── replicateClient.test.ts    # À créer
├── app/
│   └── api/
│       ├── generate/
│       │   └── __tests__/
│       │       └── route.test.ts      # À créer
│       └── projects/
│           └── __tests__/
│               └── route.test.ts      # À créer
├── vitest.config.ts                   # ✅ Configuration créée
└── vitest.setup.ts                    # ✅ Setup créé
```

## 🎯 Exemple de Test Créé

Un test de base pour le composant `Button` a été créé :

**`components/ui/__tests__/button.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })
})
```

## 📝 Bonnes Pratiques

### 1. Nommage des fichiers de test
- Fichier à tester : `Button.tsx`
- Fichier de test : `Button.test.tsx` ou `Button.spec.tsx`
- Placer dans un dossier `__tests__/` à côté du fichier testé

### 2. Structure d'un test

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    render(<MyComponent onClick={handleClick} />)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### 3. Tests à prioriser

1. **Composants UI critiques** : Button, Input, Card
2. **Logique d'authentification** : AuthContext, signIn, signUp
3. **API routes** : Protection, validation, erreurs
4. **Intégration** : Flux complets (signup → login → generate)

## 🎨 Tests des Composants shadcn/ui

Les composants shadcn/ui sont déjà testés par la librairie, mais testez :
- **Votre utilisation** de ces composants
- **Props personnalisées** que vous passez
- **Comportements spécifiques** à votre app

## 🔧 Configuration

### `vitest.config.ts` (✅ Créé)
- Support React avec plugin Vite
- Environnement jsdom pour DOM
- Alias `@/` pour imports
- Setup automatique avec `vitest.setup.ts`

### `vitest.setup.ts` (✅ Créé)
- Import de `@testing-library/jest-dom`
- Cleanup automatique après chaque test
- Mock des variables d'environnement
- Mock du router Next.js

## 📊 Objectifs de Couverture

| Catégorie | Objectif |
|-----------|----------|
| Statements | > 80% |
| Branches | > 75% |
| Functions | > 80% |
| Lines | > 80% |

## 🐛 Troubleshooting

### Erreur : "Cannot find module '@vitejs/plugin-react'"
```bash
npm install -D @vitejs/plugin-react
```

### Erreur : "ReferenceError: document is not defined"
Vérifiez que `environment: 'jsdom'` est dans `vitest.config.ts`

### Erreur : "toBeInTheDocument is not a function"
Vérifiez que `@testing-library/jest-dom` est importé dans `vitest.setup.ts`

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🚦 Prochaines Étapes

1. **Installer les packages** (commande ci-dessus)
2. **Exécuter le test d'exemple** : `npm run test`
3. **Créer plus de tests** en suivant TESTING.md
4. **Viser 80% de couverture** progressive

---

**Note** : Les fichiers de configuration sont prêts. Il suffit d'installer les packages et commencer à tester ! 🎉
