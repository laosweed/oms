import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Eye,
  User,
  Users2,
  FolderOpen
} from 'lucide-react'

const OrganizationManagement = () => {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Tech City, TC 12345',
      industry: 'Technology',
      employees: 150,
      founded: '2018',
      status: 'Active',
      teams: [
        {
          id: 1,
          name: 'Development Team',
          description: 'Software development and engineering',
          leader: 'John Doe',
          members: [
            { id: 1, name: 'John Doe', role: 'Admin', department: 'IT', status: 'Active' },
            { id: 7, name: 'David Kim', role: 'Employee', department: 'IT', status: 'Active' },
            { id: 8, name: 'Sarah Chen', role: 'Employee', department: 'IT', status: 'Active' }
          ]
        },
        {
          id: 2,
          name: 'HR Team',
          description: 'Human resources and recruitment',
          leader: 'Emily Brown',
          members: [
            { id: 4, name: 'Emily Brown', role: 'Manager', department: 'HR', status: 'Inactive' },
            { id: 9, name: 'Lisa Wang', role: 'Employee', department: 'HR', status: 'Active' }
          ]
        }
      ],
      users: [
        { id: 1, name: 'John Doe', role: 'Admin', department: 'IT', status: 'Active', team: 'Development Team' },
        { id: 4, name: 'Emily Brown', role: 'Manager', department: 'HR', status: 'Inactive', team: 'HR Team' },
        { id: 7, name: 'David Kim', role: 'Employee', department: 'IT', status: 'Active', team: 'Development Team' },
        { id: 8, name: 'Sarah Chen', role: 'Employee', department: 'IT', status: 'Active', team: 'Development Team' },
        { id: 9, name: 'Lisa Wang', role: 'Employee', department: 'HR', status: 'Active', team: 'HR Team' }
      ]
    },
    {
      id: 2,
      name: 'Global Innovations Ltd',
      email: 'info@globalinnovations.com',
      phone: '+1 (555) 987-6543',
      address: '456 Innovation St, Business District, BD 67890',
      industry: 'Consulting',
      employees: 75,
      founded: '2020',
      status: 'Active',
      teams: [
        {
          id: 3,
          name: 'Marketing Team',
          description: 'Digital marketing and brand management',
          leader: 'Sarah Wilson',
          members: [
            { id: 2, name: 'Sarah Wilson', role: 'Manager', department: 'Marketing', status: 'Active' },
            { id: 10, name: 'Mike Rodriguez', role: 'Employee', department: 'Marketing', status: 'Active' }
          ]
        },
        {
          id: 4,
          name: 'Finance Team',
          description: 'Financial planning and accounting',
          leader: 'Alex Chen',
          members: [
            { id: 5, name: 'Alex Chen', role: 'Employee', department: 'Finance', status: 'Active' },
            { id: 11, name: 'Jennifer Lee', role: 'Employee', department: 'Finance', status: 'Active' }
          ]
        }
      ],
      users: [
        { id: 2, name: 'Sarah Wilson', role: 'Manager', department: 'Marketing', status: 'Active', team: 'Marketing Team' },
        { id: 5, name: 'Alex Chen', role: 'Employee', department: 'Finance', status: 'Active', team: 'Finance Team' },
        { id: 10, name: 'Mike Rodriguez', role: 'Employee', department: 'Marketing', status: 'Active', team: 'Marketing Team' },
        { id: 11, name: 'Jennifer Lee', role: 'Employee', department: 'Finance', status: 'Active', team: 'Finance Team' }
      ]
    },
    {
      id: 3,
      name: 'Creative Studios',
      email: 'hello@creativestudios.com',
      phone: '+1 (555) 456-7890',
      address: '789 Creative Blvd, Design Town, DT 11111',
      industry: 'Design',
      employees: 25,
      founded: '2019',
      status: 'Active',
      teams: [
        {
          id: 5,
          name: 'Design Team',
          description: 'UI/UX design and creative work',
          leader: 'Lisa Park',
          members: [
            { id: 6, name: 'Lisa Park', role: 'Employee', department: 'Design', status: 'Active' },
            { id: 12, name: 'Tom Wilson', role: 'Employee', department: 'Design', status: 'Active' }
          ]
        },
        {
          id: 6,
          name: 'Sales Team',
          description: 'Client acquisition and sales',
          leader: 'Mike Johnson',
          members: [
            { id: 3, name: 'Mike Johnson', role: 'Employee', department: 'Sales', status: 'Active' },
            { id: 13, name: 'Emma Davis', role: 'Employee', department: 'Sales', status: 'Active' }
          ]
        }
      ],
      users: [
        { id: 3, name: 'Mike Johnson', role: 'Employee', department: 'Sales', status: 'Active', team: 'Sales Team' },
        { id: 6, name: 'Lisa Park', role: 'Employee', department: 'Design', status: 'Active', team: 'Design Team' },
        { id: 12, name: 'Tom Wilson', role: 'Employee', department: 'Design', status: 'Active', team: 'Design Team' },
        { id: 13, name: 'Emma Davis', role: 'Employee', department: 'Sales', status: 'Active', team: 'Sales Team' }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState(null)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showTeamsModal, setShowTeamsModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    employees: '',
    founded: '',
    status: 'Active'
  })
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    leader: ''
  })

  const industries = ['Technology', 'Consulting', 'Design', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail']

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingOrg) {
      setOrganizations(orgs => orgs.map(org => 
        org.id === editingOrg.id ? { ...formData, id: org.id, users: org.users, teams: org.teams } : org
      ))
    } else {
      setOrganizations(orgs => [...orgs, { ...formData, id: Date.now(), users: [], teams: [] }])
    }
    setShowModal(false)
    setEditingOrg(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      employees: '',
      founded: '',
      status: 'Active'
    })
  }

  const handleTeamSubmit = (e) => {
    e.preventDefault()
    if (selectedOrg) {
      const newTeam = {
        id: Date.now(),
        ...teamFormData,
        members: []
      }
      
      setOrganizations(orgs => orgs.map(org => 
        org.id === selectedOrg.id 
          ? { ...org, teams: [...org.teams, newTeam] }
          : org
      ))
      
      setShowTeamModal(false)
      setTeamFormData({
        name: '',
        description: '',
        leader: ''
      })
    }
  }

  const handleEdit = (org) => {
    setEditingOrg(org)
    setFormData(org)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(orgs => orgs.filter(org => org.id !== id))
    }
  }

  const handleViewUsers = (org) => {
    setSelectedOrg(org)
    setShowUsersModal(true)
  }

  const handleViewTeams = (org) => {
    setSelectedOrg(org)
    setShowTeamsModal(true)
  }

  const handleAddTeam = (org) => {
    setSelectedOrg(org)
    setShowTeamModal(true)
  }

  const handleOrgOverview = (org) => {
    navigate(`/organizations/${org.id}`)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTeamInputChange = (e) => {
    setTeamFormData({
      ...teamFormData,
      [e.target.name]: e.target.value
    })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
      case 'Manager':
        return 'bg-blue-100 text-blue-800'
      case 'Employee':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
        <p className="text-gray-600 mt-2">Manage your organization information, teams, and associated users</p>
      </div>

      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search organizations..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      {/* Organizations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div key={org.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h3 
                      className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => handleOrgOverview(org)}
                    >
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-500">{org.industry}</p>
                  </div>
                </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewTeams(org)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="View Teams"
                >
                  <Users2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewUsers(org)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View Users"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(org)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Organization"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(org.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Organization"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {org.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {org.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {org.address}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {org.employees} employees
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Founded {org.founded}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users2 className="h-4 w-4 mr-2" />
                  {org.teams.length} teams
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {org.users.length} users
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  org.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {org.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Organization Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingOrg ? 'Edit Organization' : 'Add Organization'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employees
                  </label>
                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded
                  </label>
                  <input
                    type="number"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingOrg ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingOrg(null)
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      industry: '',
                      employees: '',
                      founded: '',
                      status: 'Active'
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

      {/* View Users Modal */}
      {showUsersModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Users in {selectedOrg.name}
              </h2>
              <button
                onClick={() => setShowUsersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {selectedOrg.users.length > 0 ? (
              <div className="space-y-3">
                {selectedOrg.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.department} • {user.team || 'No Team'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users assigned to this organization yet.</p>
                <p className="text-sm text-gray-400 mt-2">Add users through the User Management module.</p>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowUsersModal(false)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teams Modal */}
      {showTeamsModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Teams in {selectedOrg.name}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddTeam(selectedOrg)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team
                </button>
                <button
                  onClick={() => setShowTeamsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {selectedOrg.teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOrg.teams.map((team) => (
                  <div key={team.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <FolderOpen className="h-6 w-6 text-primary-600 mr-2" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-500">{team.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Leader:</span>
                        <span className="font-medium">{team.leader}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Members:</span>
                        <span className="font-medium">{team.members.length}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <User className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{member.name}</span>
                          </div>
                          <span className={`inline-flex px-1 py-0.5 text-xs font-medium rounded ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No teams created yet.</p>
                <p className="text-sm text-gray-400 mt-2">Create teams to organize your users.</p>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTeamsModal(false)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {showTeamModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              Add Team to {selectedOrg.name}
            </h2>
            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={teamFormData.name}
                  onChange={handleTeamInputChange}
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
                  value={teamFormData.description}
                  onChange={handleTeamInputChange}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Leader
                </label>
                <select
                  name="leader"
                  value={teamFormData.leader}
                  onChange={handleTeamInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Team Leader</option>
                  {selectedOrg.users.filter(u => u.status === 'Active').map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Team
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTeamModal(false)
                    setTeamFormData({
                      name: '',
                      description: '',
                      leader: ''
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

export default OrganizationManagement 