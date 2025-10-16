# Tests à implémenter

## Configuration

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Ajouter dans `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage"
}
```

## Tests prioritaires

### 1. AuthContext Tests (`context/__tests__/AuthContext.test.tsx`)

- [ ] Should provide user and session when authenticated
- [ ] Should provide null user when not authenticated
- [ ] Should handle signIn successfully
- [ ] Should handle signIn errors
- [ ] Should handle signUp successfully
- [ ] Should handle signUp errors
- [ ] Should handle signOut successfully
- [ ] Should update user state on auth state change

### 2. API Route Tests

#### Generate Route (`app/api/generate/__tests__/route.test.ts`)

- [ ] Should return 401 if no Authorization header
- [ ] Should return 401 if invalid token
- [ ] Should return 400 if no image file
- [ ] Should return 400 if no prompt
- [ ] Should generate image successfully with valid inputs
- [ ] Should upload images to Supabase Storage
- [ ] Should create project in database
- [ ] Should handle Replicate API errors

#### Projects Route (`app/api/projects/__tests__/route.test.ts`)

- [ ] GET: Should return 401 if no Authorization header
- [ ] GET: Should return only user's projects
- [ ] GET: Should not return other users' projects
- [ ] GET: Should return empty array if no projects

#### Projects Delete Route (`app/api/projects/[id]/__tests__/route.test.ts`)

- [ ] DELETE: Should return 401 if no Authorization header
- [ ] DELETE: Should return 404 if project not found
- [ ] DELETE: Should return 403 if not project owner
- [ ] DELETE: Should delete project successfully if owner
- [ ] DELETE: Should delete images from storage

### 3. Component Tests

#### AuthForm (`components/__tests__/AuthForm.test.tsx`)

- [ ] Should render login tab by default
- [ ] Should switch to signup tab on click
- [ ] Should call signIn on login form submit
- [ ] Should call signUp on signup form submit
- [ ] Should display error message on auth failure
- [ ] Should redirect to dashboard on successful login
- [ ] Should show email confirmation message after signup

#### Header (`components/__tests__/Header.test.tsx`)

- [ ] Should show login/signup links when not authenticated
- [ ] Should show user email when authenticated
- [ ] Should show logout button when authenticated
- [ ] Should call signOut on logout button click
- [ ] Should redirect to login after logout

#### UI Components (`components/ui/__tests__/`)

- [ ] Button: Should render with correct variants
- [ ] Button: Should handle click events
- [ ] Button: Should be disabled when disabled prop is true
- [ ] Input: Should handle onChange events
- [ ] Textarea: Should handle onChange events
- [ ] Card: Should render children correctly

### 4. Integration Tests

#### Authentication Flow (`__tests__/integration/auth.test.tsx`)

- [ ] Should complete full signup flow
- [ ] Should complete full login flow
- [ ] Should protect dashboard route when not authenticated
- [ ] Should allow access to dashboard when authenticated
- [ ] Should handle logout and redirect

#### Image Generation Flow (`__tests__/integration/generation.test.tsx`)

- [ ] Should upload image and generate with prompt
- [ ] Should display generated image in gallery
- [ ] Should handle generation errors gracefully
- [ ] Should work in mock mode

#### Project Management Flow (`__tests__/integration/projects.test.tsx`)

- [ ] Should fetch and display user's projects
- [ ] Should delete project successfully
- [ ] Should update gallery after deletion
- [ ] Should handle RLS policies correctly

### 5. Utility Tests

#### Replicate Client (`lib/__tests__/replicateClient.test.ts`)

- [ ] Should throw error if REPLICATE_API_TOKEN not set
- [ ] Should throw error if REPLICATE_MODEL not set
- [ ] Should call Replicate API with correct params
- [ ] Should return placeholder image in mock mode
- [ ] Should handle API errors gracefully

#### Utils (`lib/__tests__/utils.test.ts`)

- [ ] cn: Should merge className strings correctly
- [ ] cn: Should handle conditional classes
- [ ] cn: Should override Tailwind classes properly

## Setup Test Files

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.REPLICATE_API_TOKEN = 'test-replicate-token'
  process.env.REPLICATE_MODEL = 'google/nano-banana'
  process.env.REPLICATE_MOCK = 'true'
})
```

## Mock Factories

### Supabase Mock (`__mocks__/supabase.ts`)

```typescript
export const createMockSupabaseClient = () => ({
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    })),
  },
})
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Priority Order

1. ✅ AuthContext (core authentication)
2. ✅ API Routes (security critical)
3. ✅ Integration tests (full user flows)
4. ✅ Component tests (UI behavior)
5. ✅ Utility tests (helper functions)
