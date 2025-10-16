# 📌 Version Pinning Documentation

## Pourquoi pinner les versions ?

Les versions "floating" avec `^` ou `~` peuvent causer des problèmes :
- **Builds non reproductibles** : `^14.2.0` peut installer `14.2.33` sur une machine et `14.2.50` sur une autre
- **Bugs surprises** : Une dépendance peut introduire un bug dans une version mineure
- **CI/CD instable** : Les builds peuvent échouer aléatoirement si une dépendance change

## ✅ Versions pinnées (16 oct 2025)

### Production Dependencies
```json
{
  "@radix-ui/react-label": "2.1.7",
  "@radix-ui/react-slot": "1.2.3",
  "@supabase/auth-helpers-nextjs": "0.10.0",
  "@supabase/supabase-js": "2.74.0",
  "next": "14.2.33",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "replicate": "1.3.0"
}
```

### Development Dependencies
```json
{
  "@testing-library/jest-dom": "6.9.1",
  "@testing-library/react": "16.3.0",
  "@testing-library/user-event": "14.6.1",
  "@types/node": "20.19.19",
  "@types/react": "18.3.26",
  "@vitejs/plugin-react": "5.0.4",
  "autoprefixer": "10.4.21",
  "class-variance-authority": "0.7.1",
  "clsx": "2.1.1",
  "eslint": "8.57.1",
  "eslint-config-next": "14.2.33",
  "jsdom": "27.0.0",
  "lucide-react": "0.546.0",
  "postcss": "8.5.6",
  "tailwind-merge": "3.3.1",
  "tailwindcss": "3.4.18",
  "tailwindcss-animate": "1.0.7",
  "typescript": "5.9.3",
  "vitest": "3.2.4"
}
```

## 🔄 Comment mettre à jour les dépendances

### 1. Vérifier les mises à jour disponibles
```bash
npm outdated
```

### 2. Mettre à jour une dépendance spécifique
```bash
# Exemple : mettre à jour Next.js
npm install next@14.3.0 --save-exact
```

### 3. Tester après chaque mise à jour
```bash
npm run build
npm run test
```

### 4. Commit avec message explicite
```bash
git add package.json package-lock.json
git commit -m "chore(deps): upgrade next 14.2.33 -> 14.3.0"
```

## 📋 Stratégie de mise à jour

### Mises à jour recommandées
- **Security patches** : Appliquer immédiatement
- **Minor versions** : Tester dans une branche dédiée
- **Major versions** : Planifier avec tests complets

### Dépendances critiques à surveiller
- `next` : Framework principal
- `@supabase/supabase-js` : Backend/Auth
- `replicate` : Génération d'images
- `react` / `react-dom` : Cœur UI

## ⚠️ Risques des versions floating

### Avant (avec ^)
```json
"next": "^14.2.0"
```
- Peut installer 14.2.0, 14.2.33, 14.2.50, etc.
- Comportement différent selon la date d'installation
- CI peut casser si une nouvelle version sort

### Après (version exacte)
```json
"next": "14.2.33"
```
- Toujours la même version
- Builds reproductibles
- Contrôle total sur les mises à jour

## 🔍 Vérification

### Build reproductible
```bash
# Sur n'importe quelle machine :
rm -rf node_modules package-lock.json
npm install
npm run build
# ✅ Résultat identique garanti
```

### Lockfile important
`package-lock.json` garantit que toutes les dépendances transitives sont aussi fixées.
**Toujours commiter package-lock.json !**

## 📚 Ressources

- [npm semver docs](https://docs.npmjs.com/about-semantic-versioning)
- [Dependabot](https://github.com/dependabot) pour automatiser les mises à jour
- [Renovate Bot](https://www.mend.io/renovate/) alternative à Dependabot

## 🎯 Résultat

✅ **Builds reproductibles à 100%**  
✅ **Contrôle total sur les mises à jour**  
✅ **Pas de surprises en production**  
✅ **CI/CD stable et prévisible**
