import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Building2,
  Filter
} from 'lucide-react'

const ProjectManagement = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      organization: 'TechCorp Solutions',
      manager: 'John Doe',
      team: ['Sarah Wilson', 'Mike Johnson', 'Emily Brown'],
      status: 'In Progress',
      priority: 'High',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      progress: 65,
      budget: 50000,
      spent: 32500,
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'iOS and Android app for customer engagement',
      organization: 'Global Innovations Ltd',
      manager: 'Sarah Wilson',
      team: ['Alex Chen', 'Lisa Park', 'David Kim'],
      status: 'Planning',
      priority: 'Medium',
      startDate: '2024-02-01',
      endDate: '2024-07-01',
      progress: 25,
      budget: 75000,
      spent: 18750,
      location: 'Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q2 digital marketing campaign for product launch',
      organization: 'Creative Studios',
      manager: 'Mike Johnson',
      team: ['Emma Davis', 'Tom Wilson'],
      status: 'Completed',
      priority: 'High',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      progress: 100,
      budget: 25000,
      spent: 24500,
      location: 'Chicago, IL'
    },
    {
      id: 4,
      name: 'Data Migration',
      description: 'Legacy system data migration to cloud platform',
      organization: 'TechCorp Solutions',
      manager: 'Emily Brown',
      team: ['Robert Smith', 'Jennifer Lee', 'Michael Chen'],
      status: 'On Hold',
      priority: 'Low',
      startDate: '2024-02-15',
      endDate: '2024-05-15',
      progress: 15,
      budget: 35000,
      spent: 5250,
      location: 'Boston, MA'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organization: '',
    manager: '',
    team: [],
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    budget: '',
    location: ''
  })

  const statuses = ['All', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
  const priorities = ['Low', 'Medium', 'High', 'Critical']
  const organizations = ['TechCorp Solutions', 'Global Innovations Ltd', 'Creative Studios']
  const managers = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Brown']
  const teamMembers = ['Sarah Wilson', 'Mike Johnson', 'Emily Brown', 'Alex Chen', 'Lisa Park', 'David Kim', 'Emma Davis', 'Tom Wilson', 'Robert Smith', 'Jennifer Lee', 'Michael Chen']

  const filteredProjects = projects.filter(project =>
    (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     project.manager.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'All' || project.status === statusFilter)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProject) {
      setProjects(projects => projects.map(project => 
        project.id === editingProject.id ? { ...formData, id: project.id, progress: project.progress, spent: project.spent } : project
      ))
    } else {
      setProjects(projects => [...projects, { ...formData, id: Date.now(), progress: 0, spent: 0 }])
    }
    setShowModal(false)
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      organization: '',
      manager: '',
      team: [],
      status: 'Planning',
      priority: 'Medium',
      startDate: '',
      endDate: '',
      budget: '',
      location: ''
    })
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData(project)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects => projects.filter(project => project.id !== id))
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTeamChange = (member) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.includes(member)
        ? prev.team.filter(m => m !== member)
        : [...prev.team, member]
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'On Hold':
        return 'bg-orange-100 text-orange-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800'
      case 'Medium':
        return 'bg-blue-100 text-blue-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
        <p className="text-gray-600 mt-2">Track and manage your projects, teams, and progress</p>
      </div>

      {/* Header with Search, Filter and Add Button */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.organization}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{project.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {project.manager}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.location}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {project.team.length} members
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Budget Info */}
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-600">
                Budget: ${project.budget.toLocaleString()}
              </div>
              <div className="text-gray-600">
                Spent: ${project.spent.toLocaleString()}
              </div>
            </div>

            {/* Status and Priority */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingProject ? 'Edit Project' : 'Add Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <select
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Organization</option>
                    {organizations.map(org => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Manager
                  </label>
                  <select
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Manager</option>
                    {managers.map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {statuses.filter(s => s !== 'All').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {teamMembers.map(member => (
                    <label key={member} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.team.includes(member)}
                        onChange={() => handleTeamChange(member)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{member}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProject(null)
                    setFormData({
                      name: '',
                      description: '',
                      organization: '',
                      manager: '',
                      team: [],
                      status: 'Planning',
                      priority: 'Medium',
                      startDate: '',
                      endDate: '',
                      budget: '',
                      location: ''
                    })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectManagement 