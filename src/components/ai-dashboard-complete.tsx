import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { 
  Brain, 
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Moon,
  Sun,
  ArrowLeft,
  Users,
  Calendar,
  Edit3,
  Trash2,
  X,
  Save,
  FolderPlus,
  FileText,
  ChevronRight,
  Database,
  Download,
  Upload
} from 'lucide-react';

// Generador de ID único
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Colores e iconos para proyectos
const getProjectColor = (index: number) => {
  const colors = [
    'from-purple-500 to-blue-500',
    'from-green-500 to-teal-500', 
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500'
  ];
  return colors[index % colors.length];
};

const getProjectIcon = (index: number) => {
  const icons = ['🚀', '💡', '🎯', '⚡', '🔥', '💎'];
  return icons[index % icons.length];
};

// Hook de tema
const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  return { theme, toggle };
};

// Componente Button simple
const Button = ({ children, variant = "primary", onClick, disabled = false, className = "" }: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "border border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Componente Card simple
const Card = ({ children, onClick, className = "" }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <div 
    onClick={onClick}
    className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg ${onClick ? 'cursor-pointer hover:bg-gray-750 hover:border-purple-500 transition-all' : ''} ${className}`}
  >
    {children}
  </div>
);

// Componente Badge
const Badge = ({ children, color = "gray" }: {
  children: React.ReactNode;
  color?: "gray" | "green" | "blue" | "yellow" | "red" | "purple";
}) => {
  const colors = {
    gray: "bg-gray-600 text-gray-200",
    green: "bg-green-600 text-green-200",
    blue: "bg-blue-600 text-blue-200",
    yellow: "bg-yellow-600 text-yellow-200",
    red: "bg-red-600 text-red-200",
    purple: "bg-purple-600 text-purple-200"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

// Componente Progress
const Progress = ({ value = 0 }: { value?: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2">
    <div 
      className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

// Modal SIMPLE para crear/editar
const SimpleModal = ({ isOpen, onClose, title, children, onSave, saveDisabled = false }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saveDisabled?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Contenido scrolleable */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{
            maxHeight: '60vh',
            scrollbarWidth: 'auto',
            scrollbarColor: '#8b5cf6 #374151'
          }}
        >
          <style>{`
            .modal-content::-webkit-scrollbar {
              width: 14px;
            }
            .modal-content::-webkit-scrollbar-track {
              background: #374151;
              border-radius: 7px;
            }
            .modal-content::-webkit-scrollbar-thumb {
              background: #8b5cf6;
              border-radius: 7px;
            }
            .modal-content::-webkit-scrollbar-thumb:hover {
              background: #a78bfa;
            }
          `}</style>
          <div className="modal-content" style={{ height: '100%', overflowY: 'auto' }}>
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-gray-700">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button variant="primary" onClick={onSave} disabled={saveDisabled} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Formulario de proyecto
const ProjectForm = ({ project, onSave, type = 'main' }: {
  project?: any;
  onSave: (data: any) => void;
  type?: 'main' | 'sub';
}) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    step: 1,
    estado: 'Por hacer',
    progreso: 0,
    responsable: '',
    prioridad: 'Media',
    tecnologia: '',
    fecha_inicio: '',
    fecha_fin: '',
    observaciones: ''
  });

  useEffect(() => {
    if (project) {
      setForm(project);
    }
  }, [project]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="space-y-4">
      {type === 'main' ? (
        // Proyecto principal
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Proyecto *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
              placeholder="Ej: Sistema CRM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500 h-24 resize-none"
              placeholder="Describe el proyecto"
            />
          </div>
        </>
      ) : (
        // Sub-proyecto con MUCHOS campos para forzar scroll
        <>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3 text-center">
            <p className="text-purple-300 text-sm">🔽 Haz scroll abajo para ver todos los campos 🔽</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Sub-Proyecto *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
              placeholder="Ej: Diseño de Base de Datos"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Columna (Step) *</label>
            <select
              value={form.step}
              onChange={(e) => handleChange('step', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
            >
              <option value={1}>📋 Columna 1 - Por hacer</option>
              <option value={2}>🔄 Columna 2 - En proceso</option>
              <option value={3}>✅ Columna 3 - Completado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado *</label>
            <select
              value={form.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
            >
              <option value="Por hacer">Por hacer</option>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Progreso (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.progreso}
              onChange={(e) => handleChange('progreso', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prioridad</label>
            <select
              value={form.prioridad}
              onChange={(e) => handleChange('prioridad', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
            >
              <option value="Alta">🔴 Alta</option>
              <option value="Media">🟡 Media</option>
              <option value="Baja">🟢 Baja</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Responsable</label>
            <input
              type="text"
              value={form.responsable}
              onChange={(e) => handleChange('responsable', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
              placeholder="Persona a cargo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tecnología</label>
            <input
              type="text"
              value={form.tecnologia}
              onChange={(e) => handleChange('tecnologia', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
              placeholder="React, Python, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={form.fecha_inicio}
              onChange={(e) => handleChange('fecha_inicio', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={form.fecha_fin}
              onChange={(e) => handleChange('fecha_fin', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observaciones</label>
            <textarea
              value={form.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500 h-24 resize-none"
              placeholder="Notas adicionales..."
            />
          </div>
          
          {/* Campos extra para forzar scroll */}
          <div className="bg-gray-900/50 p-4 rounded border border-gray-600">
            <h4 className="text-white font-medium mb-3">📋 Información Extra</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estimación Horas</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
                  placeholder="40"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dependencias</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500"
                  placeholder="Otros sub-proyectos necesarios"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notas del Equipo</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500 h-20 resize-none"
                  placeholder="Comentarios del equipo..."
                />
              </div>
            </div>
          </div>
          
          <div className="text-center py-4 text-green-400 font-medium">
            ✅ ¡Has llegado al final! El scroll está funcionando correctamente.
          </div>
        </>
      )}
      
      <Button 
        variant="primary" 
        onClick={handleSave}
        disabled={!form.nombre.trim()}
        className="w-full mt-6"
      >
        <Save className="h-4 w-4 mr-2" />
        {project ? 'Actualizar' : 'Crear'}
      </Button>
    </div>
  );
};

// Vista de lista de proyectos
const ProjectsList = ({ projects, onProjectClick, onCreateProject, onEditProject, onDeleteProject, onShowBackup }: {
  projects: any[];
  onProjectClick: (project: any) => void;
  onCreateProject: () => void;
  onEditProject: (project: any) => void;
  onDeleteProject: (id: string) => void;
  onShowBackup: () => void;
}) => {
  const { theme, toggle } = useTheme();

  const handleDelete = (projectId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto y todos sus sub-proyectos?')) {
      onDeleteProject(projectId);
    }
  };

  const handleEdit = (project: any) => {
    onEditProject(project);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white">
      <style>{`
        body { background-color: #111827; color: white; }
        .dark { color-scheme: dark; }
      `}</style>
      
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Dashboard de Proyectos</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={onCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
            
            <Button variant="ghost" onClick={onShowBackup}>
              <Database className="h-4 w-4 mr-2" />
              Respaldos
            </Button>
            
            <button onClick={toggle} className="p-2 text-gray-400 hover:text-white rounded">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <Card className="text-center p-12">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-4">¡Crea tu primer proyecto!</h2>
            <p className="text-gray-400 mb-6">Organiza tus tareas en proyectos y sub-proyectos</p>
            <Button variant="primary" onClick={onCreateProject}>
              <FolderPlus className="h-5 w-5 mr-2" />
              Crear Proyecto
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Mis Proyectos ({projects.length})</h2>
              <p className="text-gray-400">Haz clic para ver sub-proyectos</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 group relative">
                  {/* Botones de acción en la esquina superior derecha */}
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-400 hover:text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                      title="Editar proyecto"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded hover:bg-red-500/20 transition-colors"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Contenido principal clickeable */}
                  <div onClick={() => onProjectClick(project)} className="cursor-pointer">
                    <div className="flex items-center gap-3 mb-4 pr-20">
                      <div className={`text-2xl p-2 bg-gradient-to-r ${project.color} rounded`}>
                        {project.icono}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{project.nombre}</h3>
                        <p className="text-sm text-gray-400">{new Date(project.fecha_creacion).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{project.descripcion}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Ver sub-proyectos</span>
                      <ChevronRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Vista de detalle del proyecto
const ProjectDetail = ({ project, subProjects, onBack, onCreateSub, onEditSub, onDeleteSub }: {
  project: any;
  subProjects: any[];
  onBack: () => void;
  onCreateSub: () => void;
  onEditSub: (sub: any) => void;
  onDeleteSub: (id: string) => void;
}) => {
  const { theme, toggle } = useTheme();
  
  const subsByStep = {
    1: subProjects.filter(s => s.step === 1),
    2: subProjects.filter(s => s.step === 2),
    3: subProjects.filter(s => s.step === 3)
  };

  const stats = {
    total: subProjects.length,
    completed: subProjects.filter(s => s.estado === 'Completado').length,
    avg: subProjects.length ? Math.round(subProjects.reduce((acc, s) => acc + s.progreso, 0) / subProjects.length) : 0
  };

  const handleDeleteSub = (subId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este sub-proyecto?')) {
      onDeleteSub(subId);
    }
  };

  const handleEditSub = (sub: any) => {
    onEditSub(sub);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white">
      <style>{`
        body { background-color: #111827; color: white; }
      `}</style>
      
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            
            <div className="flex items-center gap-3">
              <div className={`text-2xl p-2 bg-gradient-to-r ${project.color} rounded`}>
                {project.icono}
              </div>
              <div>
                <h1 className="text-xl font-bold">{project.nombre}</h1>
                <p className="text-gray-400 text-sm">{project.descripcion}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={onCreateSub}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Sub-Proyecto
            </Button>
            
            <button onClick={toggle} className="p-2 text-gray-400 hover:text-white rounded">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-gray-400 text-sm">Completados</div>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{subsByStep[2].length}</div>
            <div className="text-gray-400 text-sm">En Proceso</div>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.avg}%</div>
            <div className="text-gray-400 text-sm">Progreso</div>
          </Card>
        </div>

        {/* Columnas de sub-proyectos */}
        {subProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(step => (
              <div key={step}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-500' : step === 2 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <h3 className="text-lg font-bold">
                    {step === 1 ? '📋 Por hacer' : step === 2 ? '🔄 En proceso' : '✅ Completado'}
                  </h3>
                  <Badge color={step === 1 ? 'blue' : step === 2 ? 'yellow' : 'green'}>
                    {subsByStep[step].length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {subsByStep[step].map(sub => (
                    <Card key={sub.id} className="p-4 group relative">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-white flex-1 pr-2">{sub.nombre}</h4>
                        
                        {/* Botones de acción para sub-proyectos */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => handleEditSub(sub)}
                            className="p-2 text-gray-400 hover:text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                            title="Editar sub-proyecto"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="p-2 text-gray-400 hover:text-red-400 rounded hover:bg-red-500/20 transition-colors"
                            title="Eliminar sub-proyecto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Badge color={sub.estado === 'Completado' ? 'green' : sub.estado === 'En progreso' ? 'blue' : 'yellow'}>
                            {sub.estado}
                          </Badge>
                          {sub.prioridad && (
                            <Badge color={sub.prioridad === 'Alta' ? 'red' : sub.prioridad === 'Media' ? 'yellow' : 'green'}>
                              {sub.prioridad}
                            </Badge>
                          )}
                        </div>
                        
                        {sub.progreso > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Progreso</span>
                              <span className="text-white">{sub.progreso}%</span>
                            </div>
                            <Progress value={sub.progreso} />
                          </div>
                        )}
                        
                        {sub.responsable && (
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Users className="h-3 w-3" />
                            {sub.responsable}
                          </div>
                        )}
                        
                        {sub.fecha_fin && (
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(sub.fecha_fin).toLocaleDateString()}
                          </div>
                        )}
                        
                        {sub.observaciones && (
                          <p className="text-gray-400 text-sm bg-gray-900/50 p-2 rounded">
                            {sub.observaciones}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                  
                  {subsByStep[step].length === 0 && (
                    <div className="border-2 border-dashed border-gray-600 rounded p-6 text-center text-gray-400">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Sin sub-proyectos</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center p-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-4">¡Agrega tu primer sub-proyecto!</h3>
            <p className="text-gray-400 mb-6">Organiza las tareas en las 3 columnas</p>
            <Button variant="primary" onClick={onCreateSub}>
              <Plus className="h-5 w-5 mr-2" />
              Crear Sub-Proyecto
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

// Modal de respaldos
const BackupModal = ({ isOpen, onClose, exportData, importData }: {
  isOpen: boolean;
  onClose: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
}) => {
  const [status, setStatus] = useState('');

  const handleExport = () => {
    exportData();
    setStatus('✅ Datos exportados correctamente');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await importData(file);
      setStatus('✅ Datos importados correctamente');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <SimpleModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Gestión de Respaldos"
      onSave={onClose}
      saveDisabled={false}
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-white font-medium mb-3">Exportar Datos</h4>
          <Button variant="secondary" onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Descargar Respaldo
          </Button>
          <p className="text-xs text-gray-400 mt-2">Guarda todos tus proyectos en un archivo</p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Importar Datos</h4>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-input"
          />
          <label htmlFor="import-input">
            <div className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-center cursor-pointer transition-colors">
              <Upload className="h-4 w-4 mr-2 inline" />
              Cargar Respaldo
            </div>
          </label>
          <p className="text-xs text-gray-400 mt-2">Restaura proyectos desde archivo</p>
        </div>

        {status && (
          <div className="bg-gray-900 border border-gray-600 rounded p-3">
            <p className="text-sm text-white">{status}</p>
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

// Componente principal
export default function App() {
  const {
    projects,
    subProjects,
    loading,
    error,
    createProject: createProjectDB,
    updateProject: updateProjectDB,
    deleteProject: deleteProjectDB,
    createSubProject: createSubProjectDB,
    updateSubProject: updateSubProjectDB,
    deleteSubProject: deleteSubProjectDB,
    exportData,
    importData
  } = useProjects();
  
  const [view, setView] = useState('list');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingSub, setEditingSub] = useState<any>(null);

  // Proyectos principales
  const createProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const editProject = (project: any) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const saveProject = async (formData: any) => {
    if (editingProject) {
      await updateProjectDB(editingProject.id, formData);
    } else {
      const newProject = {
        id: generateId(),
        ...formData,
        color: getProjectColor(projects.length),
        icono: getProjectIcon(projects.length),
        fecha_creacion: new Date().toISOString()
      };
      await createProjectDB(newProject);
    }
    setShowProjectModal(false);
  };

  const deleteProject = async (projectId: string) => {
    await deleteProjectDB(projectId);
    
    if (selectedProject?.id === projectId) {
      setView('list');
      setSelectedProject(null);
    }
  };

  // Sub-proyectos
  const createSub = () => {
    setEditingSub(null);
    setShowSubModal(true);
  };

  const editSub = (sub: any) => {
    setEditingSub(sub);
    setShowSubModal(true);
  };

  const saveSub = async (formData: any) => {
    if (editingSub) {
      await updateSubProjectDB(editingSub.id, formData);
    } else {
      const newSub = {
        id: generateId(),
        ...formData,
        proyecto_id: selectedProject.id,
        fecha_creacion: new Date().toISOString()
      };
      await createSubProjectDB(newSub);
    }
    setShowSubModal(false);
  };

  const deleteSub = async (subId: string) => {
    await deleteSubProjectDB(subId);
  };

  // Navegación
  const openProject = (project: any) => {
    setSelectedProject(project);
    setView('detail');
  };

  const goBack = () => {
    setView('list');
    setSelectedProject(null);
  };

  const currentSubs = selectedProject 
    ? subProjects.filter(s => s.proyecto_id === selectedProject.id)
    : [];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error de conexión</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Verifica tu conexión a Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === 'list' ? (
        <ProjectsList
          projects={projects}
          onProjectClick={openProject}
          onCreateProject={createProject}
          onEditProject={editProject}
          onDeleteProject={deleteProject}
          onShowBackup={() => setShowBackupModal(true)}
        />
      ) : (
        <ProjectDetail
          project={selectedProject}
          subProjects={currentSubs}
          onBack={goBack}
          onCreateSub={createSub}
          onEditSub={editSub}
          onDeleteSub={deleteSub}
        />
      )}

      {/* Modales */}
      <SimpleModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title={editingProject ? "Editar Proyecto" : "Crear Proyecto"}
        onSave={() => {}}
      >
        <ProjectForm
          project={editingProject}
          onSave={saveProject}
          type="main"
        />
      </SimpleModal>

      <SimpleModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        title={editingSub ? "Editar Sub-Proyecto" : "Crear Sub-Proyecto"}
        onSave={() => {}}
      >
        <ProjectForm
          project={editingSub}
          onSave={saveSub}
          type="sub"
        />
      </SimpleModal>

      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        exportData={exportData}
        importData={importData}
      />
    </>
  );
}