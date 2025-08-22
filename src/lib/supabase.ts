import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Project {
  id: string
  nombre: string
  descripcion: string
  color: string
  icono: string
  fecha_creacion: string
  created_at?: string
  updated_at?: string
}

export interface SubProject {
  id: string
  proyecto_id: string
  nombre: string
  step: number
  estado: string
  progreso: number
  responsable?: string
  prioridad?: string
  tecnologia?: string
  fecha_inicio?: string
  fecha_fin?: string
  observaciones?: string
  fecha_creacion: string
  created_at?: string
  updated_at?: string
}