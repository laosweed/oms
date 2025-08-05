import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
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
  FolderOpen,
  AlertCircle
} from 'lucide-react'

const OrganizationManagement = () => {
  const navigate = useNavigate()
  const api = useApi()
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    description: '',
    email: '',
    phone: '',
    address: '',
    websiteURL: '',
    isEnabled: true
  })
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    leader: ''
  })



  // Fetch organizations from API
  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('http://10.0.100.19:9904/api/v1/organizations')
      
      if (response.ok) {
        const data = await response.json()
        // Handle the nested API response structure
        const orgs = data.result?.data?.organizations || []
        setOrganizations(orgs)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch organizations')
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingOrg) {
        // Update organization
        const response = await api.put(`http://10.0.100.19:9904/api/v1/organizations/${editingOrg.id}`, formData)
        if (response.ok) {
          await fetchOrganizations() // Refresh the list
          setShowModal(false)
          setEditingOrg(null)
          setFormData({
            name: '',
            description: '',
            email: '',
            phone: '',
            address: '',
            websiteURL: '',
            isEnabled: true
          })
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Failed to update organization')
        }
      } else {
        // Create new organization
        const response = await api.post('http://10.0.100.19:9904/api/v1/organizations', formData)
        if (response.ok) {
          await fetchOrganizations() // Refresh the list
          setShowModal(false)
          setFormData({
            name: '',
            description: '',
            email: '',
            phone: '',
            address: '',
            websiteURL: '',
            isEnabled: true
          })
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Failed to create organization')
        }
      }
    } catch (error) {
      console.error('Error saving organization:', error)
      alert('Network error. Please try again.')
    }
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        const response = await api.delete(`http://10.0.100.19:9904/api/v1/organizations/${id}`)
        if (response.ok) {
          await fetchOrganizations() // Refresh the list
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Failed to delete organization')
        }
      } catch (error) {
        console.error('Error deleting organization:', error)
        alert('Network error. Please try again.')
      }
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
    navigate(`/organizations/${org.code}`)
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchOrganizations}
                className="text-sm text-red-600 hover:text-red-500 mt-2 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex space-x-2">
          <button
            onClick={fetchOrganizations}
            disabled={loading}
            className="btn-secondary flex items-center"
            title="Refresh organizations"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading organizations..." />
        </div>
      )}

      {/* Organizations Grid */}
      {!loading && (
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
                   <Calendar className="h-4 w-4 mr-2" />
                   Created {new Date(org.createdAt).toLocaleDateString()}
                 </div>
                 <div className="flex items-center text-gray-600">
                   <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                   </svg>
                   {org.websiteURL || 'No website'}
                 </div>
               </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users2 className="h-4 w-4 mr-2" />
                  {org.teams?.length || 0} teams
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {org.users?.length || 0} users
                </div>
              </div>
                             <div className="flex items-center justify-between">
                 <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                   org.isEnabled 
                     ? 'bg-green-100 text-green-800' 
                     : 'bg-red-100 text-red-800'
                 }`}>
                   {org.isEnabled ? 'Active' : 'Inactive'}
                 </span>
                 <span className="text-xs text-gray-500">
                   Code: {org.code}
                 </span>
               </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrganizations.length === 0 && !error && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No organizations match your search criteria.' : 'Get started by creating your first organization.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </button>
          )}
        </div>
      )}

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
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  placeholder="Enter organization description"
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
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteURL"
                  value={formData.websiteURL}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="isEnabled"
                  value={formData.isEnabled.toString()}
                  onChange={(e) => setFormData({...formData, isEnabled: e.target.value === 'true'})}
                  className="input-field"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
                      description: '',
                      email: '',
                      phone: '',
                      address: '',
                      websiteURL: '',
                      isEnabled: true
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
            
            {selectedOrg.users?.length > 0 ? (
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
            
            {selectedOrg.teams?.length > 0 ? (
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
                        <span className="font-medium">{team.members?.length || 0}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {team.members?.map((member) => (
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