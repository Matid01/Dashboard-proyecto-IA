/*
  # Create projects and sub-projects tables

  1. New Tables
    - `projects`
      - `id` (text, primary key)
      - `nombre` (text, not null)
      - `descripcion` (text, not null)
      - `color` (text, not null)
      - `icono` (text, not null)
      - `fecha_creacion` (text, not null)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    
    - `sub_projects`
      - `id` (text, primary key)
      - `proyecto_id` (text, foreign key to projects.id)
      - `nombre` (text, not null)
      - `step` (integer, not null, default 1)
      - `estado` (text, not null, default 'Por hacer')
      - `progreso` (integer, not null, default 0)
      - `responsable` (text)
      - `prioridad` (text, default 'Media')
      - `tecnologia` (text)
      - `fecha_inicio` (text)
      - `fecha_fin` (text)
      - `observaciones` (text)
      - `fecha_creacion` (text, not null)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since no authentication is implemented)
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text NOT NULL,
  color text NOT NULL,
  icono text NOT NULL,
  fecha_creacion text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sub_projects table
CREATE TABLE IF NOT EXISTS sub_projects (
  id text PRIMARY KEY,
  proyecto_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  step integer NOT NULL DEFAULT 1,
  estado text NOT NULL DEFAULT 'Por hacer',
  progreso integer NOT NULL DEFAULT 0,
  responsable text,
  prioridad text DEFAULT 'Media',
  tecnologia text,
  fecha_inicio text,
  fecha_fin text,
  observaciones text,
  fecha_creacion text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public access to projects"
  ON projects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to sub_projects"
  ON sub_projects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sub_projects_proyecto_id ON sub_projects(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_sub_projects_step ON sub_projects(step);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_sub_projects_created_at ON sub_projects(created_at);