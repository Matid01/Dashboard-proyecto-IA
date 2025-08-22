import { useState, useEffect } from 'react'
import { supabase, type Project, type SubProject } from '../lib/supabase'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [subProjects, setSubProjects] = useState<SubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      // Load sub-projects
      const { data: subProjectsData, error: subProjectsError } = await supabase
        .from('sub_projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (subProjectsError) throw subProjectsError

      setProjects(projectsData || [])
      setSubProjects(subProjectsData || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Error loading data')
    } finally {
      setLoading(false)
    }
  }

  // Create project
  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single()

      if (error) throw error

      setProjects(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Error creating project')
      throw err
    }
  }

  // Update project
  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setProjects(prev => prev.map(p => p.id === id ? data : p))
      return data
    } catch (err) {
      console.error('Error updating project:', err)
      setError(err instanceof Error ? err.message : 'Error updating project')
      throw err
    }
  }

  // Delete project
  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProjects(prev => prev.filter(p => p.id !== id))
      setSubProjects(prev => prev.filter(s => s.proyecto_id !== id))
    } catch (err) {
      console.error('Error deleting project:', err)
      setError(err instanceof Error ? err.message : 'Error deleting project')
      throw err
    }
  }

  // Create sub-project
  const createSubProject = async (subProjectData: Omit<SubProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sub_projects')
        .insert([subProjectData])
        .select()
        .single()

      if (error) throw error

      setSubProjects(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating sub-project:', err)
      setError(err instanceof Error ? err.message : 'Error creating sub-project')
      throw err
    }
  }

  // Update sub-project
  const updateSubProject = async (id: string, updates: Partial<SubProject>) => {
    try {
      const { data, error } = await supabase
        .from('sub_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setSubProjects(prev => prev.map(s => s.id === id ? data : s))
      return data
    } catch (err) {
      console.error('Error updating sub-project:', err)
      setError(err instanceof Error ? err.message : 'Error updating sub-project')
      throw err
    }
  }

  // Delete sub-project
  const deleteSubProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sub_projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSubProjects(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting sub-project:', err)
      setError(err instanceof Error ? err.message : 'Error deleting sub-project')
      throw err
    }
  }

  // Export data
  const exportData = () => {
    const data = {
      projects,
      subProjects,
      exported: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proyectos-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import data
  const importData = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.projects && data.subProjects) {
            // Clear existing data and insert new data
            await supabase.from('sub_projects').delete().neq('id', '')
            await supabase.from('projects').delete().neq('id', '')
            
            // Insert projects
            if (data.projects.length > 0) {
              const { error: projectsError } = await supabase
                .from('projects')
                .insert(data.projects)
              if (projectsError) throw projectsError
            }
            
            // Insert sub-projects
            if (data.subProjects.length > 0) {
              const { error: subProjectsError } = await supabase
                .from('sub_projects')
                .insert(data.subProjects)
              if (subProjectsError) throw subProjectsError
            }
            
            await loadData()
            resolve()
          } else {
            reject(new Error('Archivo inválido'))
          }
        } catch (err) {
          reject(new Error('Error al leer archivo'))
        }
      }
      reader.readAsText(file)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    projects,
    subProjects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    createSubProject,
    updateSubProject,
    deleteSubProject,
    exportData,
    importData,
    refreshData: loadData
  }
}