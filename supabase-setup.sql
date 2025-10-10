-- ===================================
-- Configuration complète Supabase
-- ===================================

-- 1. Créer la table projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT NOT NULL,
  output_image_url TEXT NOT NULL,
  prompt TEXT,
  status TEXT DEFAULT 'completed',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Activer Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- 4. Créer les policies pour l'authentification

-- Policy: Les utilisateurs peuvent voir uniquement leurs projets
CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent créer leurs propres projets
CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent supprimer uniquement leurs projets
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- ===================================
-- Vérification de la configuration
-- ===================================

-- Afficher toutes les policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'projects';

-- Afficher la structure de la table
\d projects;
