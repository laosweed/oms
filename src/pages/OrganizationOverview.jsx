import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  ArrowLeft,
  Building2,
  Users,
  Users2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  FolderOpen,
  User,
  Edit,
  Plus,
  Trash2,
  Info,
  Eye,
  X,
  FileText,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

const OrganizationOverview = () => {
  const { id } = useParams() // This will be the organization code
  const { user } = useAuth() // Get current user for authorization
  const navigate = useNavigate()
  const api = useApi()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usersLoading, setUsersLoading] = useState(false)
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [showAddTeamModal, setShowAddTeamModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    leader: ''
  })
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    role: 'Member',
    teamId: '',
    positionId: ''
  })

  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [documentFormData, setDocumentFormData] = useState({
    title: '',
    description: '',
    category: '',
    author: '',
    version: '1.0',
    status: 'Active'
  })

  // Approval requests data
  const [approvalRequests, setApprovalRequests] = useState([])
  const [approvalRequestsLoading, setApprovalRequestsLoading] = useState(false)
  
  // Position selection modal for approval
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [pendingApproval, setPendingApproval] = useState(null)
  const [positions, setPositions] = useState([])
  const [positionsLoading, setPositionsLoading] = useState(false)

  // Fetch organization data from API
  useEffect(() => {
    fetchOrganization()
  }, [id])

  // Fetch users when Users tab is selected
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab, id])

  // Fetch teams when Teams tab is selected
  useEffect(() => {
    if (activeTab === 'teams') {
      fetchTeams()
    }
  }, [activeTab, id])

  // Fetch approval requests when Approvals tab is selected
  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchApprovalRequests()
    }
  }, [activeTab, id])

  // Fetch positions when position modal is opened
  useEffect(() => {
    if (showPositionModal && pendingApproval) {
      fetchPositions()
    }
  }, [showPositionModal, pendingApproval])

  const fetchOrganization = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/organizations/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        // Handle the nested API response structure
        const orgData = data.result?.data?.organization || data.result?.data
        if (orgData) {
          setOrganization(orgData)
        } else {
          setError('Organization not found')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch organization')
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/users/${id}/org`)
      
      if (response.ok) {
        const data = await response.json()
        const usersData = data.result?.data?.users || data.result?.data || []
        setOrganization(prev => ({
          ...prev,
          users: usersData
        }))
      } else {
        console.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true)
      setError(null)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/teams/${id}/org`)
      
      if (response.ok) {
        const data = await response.json()
        const teamsData = data.result?.data?.teams || data.result?.data || []
        setOrganization(prev => ({
          ...prev,
          teams: teamsData
        }))
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch teams:', errorData.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setTeamsLoading(false)
    }
  }

  const fetchApprovalRequests = async () => {
    try {
      setApprovalRequestsLoading(true)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/organizations/user/${id}/joinRequest`)
      
      if (response.ok) {
        const data = await response.json()
        const joinRequestsData = data.result?.data?.joinRequests || data.result?.data || []
        setApprovalRequests(joinRequestsData)
      } else {
        console.error('Failed to fetch approval requests')
      }
    } catch (error) {
      console.error('Error fetching approval requests:', error)
    } finally {
      setApprovalRequestsLoading(false)
    }
  }

  const fetchPositions = async () => {
    try {
      setPositionsLoading(true)
      
      // Get team ID from the pending approval request
      const teamId = pendingApproval?.requestData?.user?.team?.id || pendingApproval?.requestData?.teamId
      
      console.log(pendingApproval);

      console.log('Fetching positions for team ID:', teamId)
      console.log('Pending approval data:', pendingApproval?.requestData)
      
   
      
      const response = await api.get(`http://10.0.100.19:9904/api/v1/positions/${teamId}/team`)
      
      if (response.ok) {
        const data = await response.json()
        const positionsData = data.result?.data?.positions || data.result?.data || []
        setPositions(positionsData)
      } else {
        console.error('Failed to fetch positions')
        setPositions([])
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
      setPositions([])
    } finally {
      setPositionsLoading(false)
    }
  }

  const handleAddTeam = (e) => {
    e.preventDefault()
    const newTeam = {
      id: Date.now(),
      ...teamFormData,
      members: []
    }
    
    setOrganization(prev => ({
      ...prev,
      teams: [...(prev.teams || []), newTeam]
    }))
    
    setShowAddTeamModal(false)
    setTeamFormData({
      name: '',
      description: '',
      leader: ''
    })
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    const newUser = {
      id: Date.now(),
      ...userFormData,
      name: `${userFormData.firstName} ${userFormData.lastName}`
    }
    
    setOrganization(prev => ({
      ...prev,
      users: [...(prev.users || []), newUser]
    }))
    
    setShowAddUserModal(false)
    setUserFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dob: '',
      role: 'Member',
      teamId: '',
      positionId: ''
    })
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setUserFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      gender: user.gender || 'Male',
      dob: user.dob ? user.dob.split('T')[0] : '',
      role: user.role || 'Member',
      teamId: user.teamId || '',
      positionId: user.positionId || ''
    })
    setShowEditUserModal(true)
    // Fetch teams when opening edit modal
    fetchTeams()
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const updateData = {
        gender: userFormData.gender,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        dob: userFormData.dob ? `${userFormData.dob}T00:00:00Z` : null,
        role: userFormData.role,
        teamId: userFormData.teamId || null,
        positionId: userFormData.positionId || null
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/users/${editingUser.id}`, updateData)
      
      if (response.ok) {
        // Refresh users data
        await fetchUsers()
        setShowEditUserModal(false)
        setEditingUser(null)
        setUserFormData({
          firstName: '',
          lastName: '',
          gender: 'Male',
          dob: '',
          role: 'Member',
          teamId: '',
          positionId: ''
        })
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
    )
    
    if (!confirmed) return
    
    try {
      const response = await api.delete(`http://10.0.100.19:9904/api/v1/users/${userId}`)
      
      if (response.ok) {
        // Refresh users data after successful deletion
        await fetchUsers()
        alert(`User "${userName}" has been successfully deleted.`)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleApproval = async (requestId, status, userName, requestData) => {
    if (status === 'Approved') {
      // Check if user has a team but no position assigned
      const hasTeam = requestData.user?.team?.id
      const hasPosition = requestData.user?.position?.id
      
      if (hasTeam && !hasPosition) {
        // For approval with team but no position, show position selection modal
        setPendingApproval({ requestId, status, userName, requestData })
        setShowPositionModal(true)
        return
      } else {
        // For approval with existing team and position, proceed directly
        const confirmed = window.confirm(
          `Are you sure you want to approve the join request from "${userName}"?`
        )
        
        if (!confirmed) return
        
        await submitApproval(requestId, status, requestData)
        return
      }
    }
    
    // For rejection, proceed directly
    const confirmed = window.confirm(
      `Are you sure you want to reject the join request from "${userName}"?`
    )
    
    if (!confirmed) return
    
    await submitApproval(requestId, status, requestData)
  }

  const submitApproval = async (requestId, status, requestData, selectedPositionId = null) => {
    try {
      let response
      
      if (status === 'Approved') {
        // For approval, use the specific endpoint with user, position, and team IDs
        const requestBody = {
          userId: requestData.user?.id || requestData.userId,
          positionId: selectedPositionId || requestData.user?.position?.id || requestData.positionId,
          teamId: requestData.user?.team?.id || requestData.teamId
        }
        
        // Validate that all required IDs are present
        if (!requestBody.userId || !requestBody.positionId || !requestBody.teamId) {
          alert('Missing required data for approval. Please ensure user, position, and team information is available.')
          console.error('Missing IDs for approval:', requestBody)
          return
        }
        
        // Log the request body for debugging
        console.log('Approval Request Body:', JSON.stringify(requestBody, null, 2))
        
        response = await api.put(`http://10.0.100.19:9904/api/v1/organizations/approved/${id}`, requestBody)
      } else {
        // For rejection, use the new endpoint with user ID
        const userId = requestData.user?.id || requestData.userId
        
        if (!userId) {
          alert('Missing user ID for rejection.')
          console.error('Missing user ID for rejection:', requestData)
          return
        }
        
        // Log the rejection request for debugging
        console.log('Rejection Request - User ID:', userId)
        
        response = await api.put(`http://10.0.100.19:9904/api/v1/organizations/reject/${id}/user/${userId}`)
      }
      
      if (response.ok) {
        // Refresh the approval requests list
        await fetchApprovalRequests()
        alert(`Request has been ${status.toLowerCase()} successfully.`)
        
        // Close position modal if it was open
        if (showPositionModal) {
          setShowPositionModal(false)
          setSelectedPosition('')
          setPendingApproval(null)
        }
      } else {
        const errorData = await response.json()
        alert(errorData.message || `Failed to ${status.toLowerCase()} request`)
      }
    } catch (error) {
      console.error('Error updating approval status:', error)
      alert('Network error. Please try again.')
    }
  }

  const handlePositionSubmit = async () => {
    if (!selectedPosition) {
      alert('Please select a position before approving.')
      return
    }
    
    if (!pendingApproval) return
    
    await submitApproval(
      pendingApproval.requestId, 
      pendingApproval.status, 
      pendingApproval.requestData, 
      selectedPosition
    )
  }

  const handleAddDocument = (e) => {
    e.preventDefault()
    const newDocument = {
      id: Date.now(),
      ...documentFormData,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '1.0 MB',
      downloads: 0
    }
    
    setOrganization(prev => ({
      ...prev,
      documents: [...(prev.documents || []), newDocument]
    }))
    
    setShowAddDocumentModal(false)
    setDocumentFormData({
      title: '',
      description: '',
      category: '',
      author: '',
      version: '1.0',
      status: 'Active'
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

  const departments = ['IT', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Engineering']
  const roles = ['Admin', 'Manager', 'Employee', 'Guest']
  const documentCategories = ['HR', 'Technical', 'Business', 'Marketing', 'Finance', 'Design', 'Sales', 'Legal']

  const tabs = [
    { id: 'details', name: 'Organization Details', icon: Info },
    { id: 'teams', name: 'Teams', icon: Users2 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'approvals', name: 'Approvals', icon: Eye }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Organization not found</p>
        </div>
      </div>
    )
  }

  // Initialize empty arrays for teams, users, and documents if they don't exist in API response
  const teams = organization.teams || []
  const users = organization.users || []
  const documents = organization.documents || []

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/organizations')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
              <p className="text-gray-600 mt-1">Code: {organization.code} • Created {new Date(organization.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
                     <div className="flex space-x-3">
             <button
               onClick={() => setShowAddTeamModal(true)}
               className="btn-primary flex items-center"
             >
               <Plus className="h-4 w-4 mr-2" />
               Add Team
             </button>
             <button
               onClick={() => setShowAddUserModal(true)}
               className="btn-secondary flex items-center"
             >
               <User className="h-4 w-4 mr-2" />
               Add User
             </button>
             <button
               onClick={() => setShowAddDocumentModal(true)}
               className="btn-secondary flex items-center"
             >
               <Upload className="h-4 w-4 mr-2" />
               Add Document
             </button>
           </div>
        </div>
      </div>

      {/* Organization Stats */}


      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="card">
        {/* Organization Details Tab */}
        {activeTab === 'details' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Organization Details</h2>
             
             {/* Organization Overview Card */}
             <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-8">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                   <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                     <Building2 className="h-8 w-8 text-primary-600" />
                   </div>
               <div>
                     <h3 className="text-2xl font-bold text-gray-900">{organization.name}</h3>
                     <p className="text-primary-600 font-medium">#{organization.code}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                     organization.isEnabled 
                       ? 'bg-green-100 text-green-800 border border-green-200' 
                       : 'bg-red-100 text-red-800 border border-red-200'
                   }`}>
                     {organization.isEnabled ? '🟢 Active' : '🔴 Inactive'}
                   </span>
                 </div>
               </div>
               
               {organization.description && (
                 <div className="bg-white/60 rounded-lg p-4 mb-4">
                   <p className="text-gray-700 italic">"{organization.description}"</p>
                 </div>
               )}
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                 <div className="flex items-center text-gray-600">
                   <Calendar className="h-4 w-4 mr-2" />
                   <span>Created {new Date(organization.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center text-gray-600">
                   <Users className="h-4 w-4 mr-2" />
                   <span>{users.length} Members</span>
                 </div>
                 <div className="flex items-center text-gray-600">
                   <Users2 className="h-4 w-4 mr-2" />
                   <span>{teams.length} Teams</span>
                 </div>
               </div>
             </div>

             {/* Contact Information */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white border border-gray-200 rounded-xl p-6">
                 <div className="flex items-center mb-4">
                   <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                     <Mail className="h-5 w-5 text-blue-600" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                     <Mail className="h-5 w-5 text-gray-400 mr-3" />
                     <div>
                       <p className="text-sm text-gray-500">Email Address</p>
                       <p className="font-medium text-gray-900">{organization.email}</p>
                   </div>
                   </div>
                   
                   <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                     <Phone className="h-5 w-5 text-gray-400 mr-3" />
                     <div>
                       <p className="text-sm text-gray-500">Phone Number</p>
                       <p className="font-medium text-gray-900">{organization.phone}</p>
                   </div>
                   </div>
                   
                   <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                     <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                     <div>
                       <p className="text-sm text-gray-500">Address</p>
                       <p className="font-medium text-gray-900">{organization.address}</p>
                 </div>
               </div>
               
                   {organization.websiteURL && (
                     <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                       <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                       </svg>
               <div>
                         <p className="text-sm text-gray-500">Website</p>
                         <a href={organization.websiteURL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700">
                           {organization.websiteURL}
                         </a>
                       </div>
                     </div>
                   )}
                 </div>
               </div>

               {/* Organization Stats */}
               <div className="bg-white border border-gray-200 rounded-xl p-6">
                 <div className="flex items-center mb-4">
                   <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                     <TrendingUp className="h-5 w-5 text-green-600" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900">Organization Stats</h3>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                     <div className="flex items-center">
                       <Users className="h-6 w-6 text-blue-600 mr-3" />
                       <div>
                         <p className="text-sm text-blue-600 font-medium">Total Users</p>
                         <p className="text-xs text-blue-500">Active members</p>
                   </div>
                   </div>
                     <span className="text-2xl font-bold text-blue-700">{users.length}</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                     <div className="flex items-center">
                       <Users2 className="h-6 w-6 text-green-600 mr-3" />
                       <div>
                         <p className="text-sm text-green-600 font-medium">Teams</p>
                         <p className="text-xs text-green-500">Active teams</p>
                   </div>
                 </div>
                     <span className="text-2xl font-bold text-green-700">{teams.length}</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                     <div className="flex items-center">
                       <FileText className="h-6 w-6 text-purple-600 mr-3" />
                       <div>
                         <p className="text-sm text-purple-600 font-medium">Documents</p>
                         <p className="text-xs text-purple-500">Shared files</p>
                       </div>
                     </div>
                     <span className="text-2xl font-bold text-purple-700">{documents.length}</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                     <div className="flex items-center">
                       <Building2 className="h-6 w-6 text-orange-600 mr-3" />
                       <div>
                         <p className="text-sm text-orange-600 font-medium">Departments</p>
                         <p className="text-xs text-orange-500">Unique departments</p>
                       </div>
                     </div>
                     <span className="text-2xl font-bold text-orange-700">{new Set(users.map(u => u.department)).size}</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Quick Actions */}
             <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                   onClick={() => setShowAddUserModal(true)}
                   className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                 >
                   <User className="h-6 w-6 text-blue-600 mr-3" />
                   <div className="text-left">
                     <p className="font-medium text-blue-900">Add User</p>
                     <p className="text-sm text-blue-600">Invite new member</p>
                   </div>
                 </button>
                 
                 <button 
                   onClick={() => setShowAddTeamModal(true)}
                   className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                 >
                   <Users2 className="h-6 w-6 text-green-600 mr-3" />
                   <div className="text-left">
                     <p className="font-medium text-green-900">Create Team</p>
                     <p className="text-sm text-green-600">Organize members</p>
                   </div>
                 </button>
                 
                 <button 
                   onClick={() => setShowAddDocumentModal(true)}
                   className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                 >
                   <Upload className="h-6 w-6 text-purple-600 mr-3" />
                   <div className="text-left">
                     <p className="font-medium text-purple-900">Upload Document</p>
                     <p className="text-sm text-purple-600">Share files</p>
                   </div>
                 </button>
               </div>
             </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div>
            {/* Header with Stats */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Organization Teams</h2>
                  <p className="text-gray-600 mt-1">Manage and view all teams in {organization.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchTeams}
                    disabled={teamsLoading}
                    className="btn-secondary flex items-center"
                    title="Refresh teams"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
              <button
                onClick={() => setShowAddTeamModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                    Create Team
              </button>
            </div>
              </div>

              {/* Team Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{teams.length}</p>
                      <p className="text-blue-600 font-medium">Total Teams</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                      <Users2 className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-700">{teams.filter(t => t.isEnabled !== false).length}</p>
                      <p className="text-green-600 font-medium">Active Teams</p>
                    </div>
                    <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-700">
                        {teams.reduce((total, team) => total + (team.members?.length || team.memberCount || 0), 0)}
                      </p>
                      <p className="text-purple-600 font-medium">Total Members</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-700">
                        {Math.round(teams.reduce((total, team) => total + (team.members?.length || team.memberCount || 0), 0) / (teams.length || 1))}
                      </p>
                      <p className="text-orange-600 font-medium">Avg Team Size</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {teamsLoading && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text="Loading teams..." />
              </div>
            )}

            {/* Teams Grid - Modern Card Design */}
            {!teamsLoading && teams.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                        <div className="h-12 w-12 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-4">
                          <FolderOpen className="h-6 w-6 text-primary-600" />
                        </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{team.description || 'No description'}</p>
                      </div>
                    </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        team.isEnabled !== false 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {team.isEnabled !== false ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                  </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-blue-700">{team.members?.length || team.memberCount || 0}</p>
                            <p className="text-blue-600 text-sm">Members</p>
                    </div>
                          <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-green-700">
                              {team.createdAt ? new Date(team.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                            </p>
                            <p className="text-green-600 text-sm">Created</p>
                          </div>
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* Team Leader */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Team Leader</p>
                          <p className="font-medium text-gray-900">{team.leader || team.leaderName || 'No leader assigned'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Team Members Preview */}
                                     <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">Team Members</h4>
                        {team.members && team.members.length > 3 && (
                          <span className="text-xs text-gray-500">+{team.members.length - 3} more</span>
                        )}
                      </div>
                      
                      {team.members && team.members.length > 0 ? (
                                           <div className="space-y-2">
                          {team.members.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                                  <User className="h-3 w-3 text-primary-600" />
                            </div>
                                <span className="text-sm text-gray-700">
                                  {member.name || `${member.firstName} ${member.lastName}` || 'Unknown Member'}
                                </span>
                              </div>
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>
                        ))}
                          {team.members.length > 3 && (
                            <div className="text-center">
                              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                View all {team.members.length} members
                              </button>
                      </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm">No members assigned yet</p>
                        </div>
                      )}
                    </div>

                    {/* Team Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                          Join Team
                        </button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
            )}

            {/* Enhanced Empty State */}
            {!teamsLoading && teams.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                  <Users2 className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No teams found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                  This organization doesn't have any teams yet. Create the first team to organize your members and improve collaboration.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowAddTeamModal(true)}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Team
                  </button>
                  <button
                    onClick={fetchTeams}
                    className="btn-secondary flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
             {/* Header with Stats */}
             <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Organization Users</h2>
                   <p className="text-gray-600 mt-1">Manage and view all members in {organization.name}</p>
                 </div>
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={fetchUsers}
                     disabled={usersLoading}
                     className="btn-secondary flex items-center"
                     title="Refresh users"
                   >
                     <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     Refresh
                   </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
               </div>

               {/* User Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-blue-700">{users.length}</p>
                       <p className="text-blue-600 font-medium">Total Users</p>
                     </div>
                     <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                       <Users className="h-6 w-6 text-blue-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-green-700">{users.filter(u => u.isEnabled).length}</p>
                       <p className="text-green-600 font-medium">Active Users</p>
                     </div>
                     <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                       <User className="h-6 w-6 text-green-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-purple-700">{new Set(users.map(u => u.role)).size}</p>
                       <p className="text-purple-600 font-medium">Unique Roles</p>
                     </div>
                     <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                       <svg className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-orange-700">{new Set(users.map(u => u.positionTitle).filter(Boolean)).size}</p>
                       <p className="text-orange-600 font-medium">Positions</p>
                     </div>
                     <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                       <Building2 className="h-6 w-6 text-orange-700" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Loading State */}
             {usersLoading && (
               <div className="flex items-center justify-center py-12">
                 <LoadingSpinner size="lg" text="Loading users..." />
               </div>
             )}

             {/* Users Grid View */}
             {!usersLoading && users.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {users.map((user) => (
                   <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                     {/* User Header */}
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                         <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                           {user.avatarURL ? (
                             <img src={user.avatarURL} alt={user.firstName} className="h-12 w-12 rounded-full object-cover" />
                           ) : (
                             <User className="h-6 w-6 text-primary-600" />
                           )}
                          </div>
                          <div>
                           <h3 className="text-lg font-semibold text-gray-900">
                             {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'Unknown User'}
                           </h3>
                           <p className="text-sm text-gray-500">{user.identified || user.email}</p>
                          </div>
                        </div>
                                               <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}` || user.name || 'Unknown User')}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                     </div>

                     {/* User Details */}
                     <div className="space-y-3 mb-4">
                       <div className="flex items-center text-sm">
                         <Mail className="h-4 w-4 text-gray-400 mr-2" />
                         <span className="text-gray-700">{user.email || 'No email'}</span>
                       </div>
                       
                       <div className="flex items-center text-sm">
                         <Phone className="h-4 w-4 text-gray-400 mr-2" />
                         <span className="text-gray-700">{user.identified || 'No phone'}</span>
                       </div>
                       
                       <div className="flex items-center text-sm">
                         <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                         <span className="text-gray-700">{user.positionTitle || user.teamName || 'No position'}</span>
                       </div>
                     </div>

                     {/* User Status and Role */}
                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                       <div className="flex space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                           user.isEnabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                           {user.isEnabled ? 'Active' : 'Inactive'}
                        </span>
                        </div>
                       <div className="text-xs text-gray-500">
                         {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                       </div>
                     </div>
                   </div>
                 ))}
            </div>
             )}

             {/* Empty State */}
             {!usersLoading && users.length === 0 && (
               <div className="text-center py-16">
                 <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                   <Users className="h-12 w-12 text-gray-400" />
                 </div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                 <p className="text-gray-500 mb-6 max-w-md mx-auto">
                   This organization doesn't have any users yet. Start by adding the first member to your team.
                 </p>
                 <button
                   onClick={() => setShowAddUserModal(true)}
                   className="btn-primary flex items-center mx-auto"
                 >
                   <Plus className="h-4 w-4 mr-2" />
                   Add First User
                 </button>
               </div>
             )}
          </div>
                 )}

         {/* Documents Tab */}
         {activeTab === 'documents' && (
           <div>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold">Documents</h2>
               <button
                 onClick={() => setShowAddDocumentModal(true)}
                 className="btn-primary flex items-center"
               >
                 <Upload className="h-4 w-4 mr-2" />
                 Add Document
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {documents.map((document) => (
                 <div key={document.id} className="border border-gray-200 rounded-lg p-6">
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center">
                       <FileText className="h-8 w-8 text-primary-600 mr-3" />
                       <div className="flex-1">
                         <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                         <p className="text-sm text-gray-500">{document.description}</p>
                       </div>
                     </div>
                   </div>
                   
                   <div className="space-y-3 mb-4">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Category:</span>
                       <span className="font-medium">{document.category}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Author:</span>
                       <span className="font-medium">{document.author}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Version:</span>
                       <span className="font-medium">{document.version}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">File Size:</span>
                       <span className="font-medium">{document.fileSize}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Downloads:</span>
                       <span className="font-medium">{document.downloads}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Upload Date:</span>
                       <span className="font-medium">{new Date(document.uploadDate).toLocaleDateString()}</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                       document.status === 'Active' 
                         ? 'bg-green-100 text-green-800' 
                         : 'bg-red-100 text-red-800'
                     }`}>
                       {document.status}
                     </span>
                     <div className="flex space-x-2">
                       <button className="text-blue-600 hover:text-blue-900">
                         <Download className="h-4 w-4" />
                       </button>
                       <button className="text-blue-600 hover:text-blue-900">
                         <Edit className="h-4 w-4" />
                       </button>
                       <button className="text-red-600 hover:text-red-900">
                         <Trash2 className="h-4 w-4" />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
             {(documents.length === 0) && (
               <div className="text-center py-12">
                 <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                 <p className="text-gray-500">No documents found.</p>
                 <p className="text-sm text-gray-400 mt-2">Upload documents to get started.</p>
                        </div>
       )}

       {/* Add Document Modal */}
       {showAddDocumentModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-2xl w-full p-6">
             <h2 className="text-xl font-semibold mb-4">Add Document to {organization.name}</h2>
             <form onSubmit={handleAddDocument} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                 <input
                   type="text"
                   value={documentFormData.title}
                   onChange={(e) => setDocumentFormData({...documentFormData, title: e.target.value})}
                   className="input-field"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea
                   value={documentFormData.description}
                   onChange={(e) => setDocumentFormData({...documentFormData, description: e.target.value})}
                   className="input-field"
                   rows="3"
                   required
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                   <select
                     value={documentFormData.category}
                     onChange={(e) => setDocumentFormData({...documentFormData, category: e.target.value})}
                     className="input-field"
                     required
                   >
                     <option value="">Select Category</option>
                     {documentCategories.map(category => (
                       <option key={category} value={category}>{category}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                   <select
                     value={documentFormData.author}
                     onChange={(e) => setDocumentFormData({...documentFormData, author: e.target.value})}
                     className="input-field"
                     required
                   >
                     <option value="">Select Author</option>
                  {users.filter(u => u.status === 'Active').map(user => (
                       <option key={user.id} value={user.name}>
                         {user.name} ({user.role})
                       </option>
                     ))}
                   </select>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                   <input
                     type="text"
                     value={documentFormData.version}
                     onChange={(e) => setDocumentFormData({...documentFormData, version: e.target.value})}
                     className="input-field"
                     placeholder="1.0"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select
                     value={documentFormData.status}
                     onChange={(e) => setDocumentFormData({...documentFormData, status: e.target.value})}
                     className="input-field"
                   >
                     <option value="Active">Active</option>
                     <option value="Draft">Draft</option>
                     <option value="Archived">Archived</option>
                   </select>
                 </div>
               </div>
               <div className="flex space-x-3 pt-4">
                 <button type="submit" className="btn-primary flex-1">Add Document</button>
                 <button
                   type="button"
                   onClick={() => setShowAddDocumentModal(false)}
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
         )}

         {/* Approvals Tab */}
         {activeTab === 'approvals' && (
           <div>
             {/* Header with Stats */}
             <div className="mb-8">
             <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Team Join Requests</h2>
                   <p className="text-gray-600 mt-1">Manage team membership requests for {organization.name}</p>
                 </div>
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={fetchApprovalRequests}
                     disabled={approvalRequestsLoading}
                     className="btn-secondary flex items-center"
                     title="Refresh requests"
                   >
                     <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     Refresh
                   </button>
               </div>
             </div>
             
               {/* Request Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-blue-700">{approvalRequests.length}</p>
                       <p className="text-blue-600 font-medium">Total Requests</p>
                     </div>
                     <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                       <Eye className="h-6 w-6 text-blue-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-yellow-700">{approvalRequests.filter(r => r.status === 'Pending').length}</p>
                       <p className="text-yellow-600 font-medium">Pending</p>
                     </div>
                     <div className="h-12 w-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                       <Clock className="h-6 w-6 text-yellow-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-green-700">{approvalRequests.filter(r => r.status === 'Approved').length}</p>
                       <p className="text-green-600 font-medium">Approved</p>
                     </div>
                     <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                       <CheckCircle className="h-6 w-6 text-green-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-red-700">{approvalRequests.filter(r => r.status === 'Rejected').length}</p>
                       <p className="text-red-600 font-medium">Rejected</p>
                     </div>
                     <div className="h-12 w-12 bg-red-200 rounded-lg flex items-center justify-center">
                       <XCircle className="h-6 w-6 text-red-700" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Loading State */}
             {approvalRequestsLoading && (
               <div className="flex items-center justify-center py-12">
                 <LoadingSpinner size="lg" text="Loading approval requests..." />
               </div>
             )}

             {/* Requests List */}
             {!approvalRequestsLoading && approvalRequests.length > 0 && (
               <div className="space-y-6">
               {approvalRequests.map((request) => (
                   <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                     {/* Request Header */}
                     <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center">
                         <div className="h-12 w-12 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-4">
                           <User className="h-6 w-6 text-primary-600" />
                         </div>
                       <div>
                           <h3 className="text-lg font-semibold text-gray-900">
                             {request.user?.firstName || request.firstName} {request.user?.lastName || request.lastName}
                           </h3>
                           <p className="text-sm text-gray-500">{request.user?.identified || request.identified}</p>
                           <p className="text-sm text-gray-500">
                             {request.user?.position?.name || request.position?.name || 'No position'} • {request.user?.role || request.role}
                           </p>
                           {request.user?.team?.name && (
                             <p className="text-sm text-blue-600 font-medium">
                               Team: {request.user.team.name}
                             </p>
                           )}
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                         <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                         request.status === 'Pending' 
                             ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                           : request.status === 'Approved'
                             ? 'bg-green-100 text-green-800 border border-green-200'
                             : 'bg-red-100 text-red-800 border border-red-200'
                       }`}>
                           {request.status === 'Pending' ? '⏳ Pending' : 
                            request.status === 'Approved' ? '✅ Approved' : '❌ Rejected'}
                       </span>
                     </div>
                   </div>
                   
                     {/* Request Details */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                       <div className="bg-blue-50 rounded-lg p-4">
                         <div className="flex items-center justify-between">
                     <div>
                             <p className="text-sm text-blue-600 font-medium">Join Date</p>
                             <p className="text-lg font-bold text-blue-700">
                               {request.joinedAt ? new Date(request.joinedAt).toLocaleDateString('en-US', { 
                                 year: 'numeric', 
                                 month: 'short', 
                                 day: 'numeric',
                                 hour: '2-digit',
                                 minute: '2-digit'
                               }) : 'N/A'}
                             </p>
                       </div>
                           <Calendar className="h-5 w-5 text-blue-600" />
                     </div>
                       </div>
                       
                       {request.status !== 'Pending' && (
                         <div className="bg-green-50 rounded-lg p-4">
                           <div className="flex items-center justify-between">
                     <div>
                               <p className="text-sm text-green-600 font-medium">Approved Date</p>
                               <p className="text-lg font-bold text-green-700">
                                 {request.approvedAt && request.approvedAt !== '0001-01-01T00:00:00Z' 
                                   ? new Date(request.approvedAt).toLocaleDateString('en-US', { 
                                       year: 'numeric', 
                                       month: 'short', 
                                       day: 'numeric',
                                       hour: '2-digit',
                                       minute: '2-digit'
                                     })
                                   : 'N/A'}
                               </p>
                     </div>
                             <CheckCircle className="h-5 w-5 text-green-600" />
                           </div>
                         </div>
                       )}
                   </div>
                   
                     {/* Approval Information */}
                     {request.status !== 'Pending' && request.approvedByName && (
                       <div className="bg-gray-50 rounded-lg p-4 mb-6">
                         <div className="flex items-center">
                           <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                             <User className="h-4 w-4 text-primary-600" />
                   </div>
                           <div>
                             <p className="text-sm text-gray-500">Approved by</p>
                             <p className="font-medium text-gray-900">{request.approvedByName}</p>
                           </div>
                         </div>
                       </div>
                     )}
                     
                     {/* Action Buttons */}
                   {request.status === 'Pending' && (
                     <div className="flex space-x-3 pt-4 border-t border-gray-100">
                       <button
                         onClick={() => handleApproval(request.id, 'Approved', `${request.user?.firstName || request.firstName} ${request.user?.lastName || request.lastName}`, request)}
                           className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                       >
                           <CheckCircle className="h-4 w-4 mr-2" />
                           Approve Request
                       </button>
                       <button
                         onClick={() => handleApproval(request.id, 'Rejected', `${request.user?.firstName || request.firstName} ${request.user?.lastName || request.lastName}`, request)}
                           className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                       >
                           <XCircle className="h-4 w-4 mr-2" />
                           Reject Request
                       </button>
                     </div>
                   )}
                   
                   {request.status !== 'Pending' && (
                     <div className="pt-4 border-t border-gray-100">
                         <div className="flex items-center">
                           {request.status === 'Approved' ? (
                             <>
                               <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                               <p className="text-sm text-green-600 font-medium">Request has been approved</p>
                             </>
                           ) : (
                             <>
                               <XCircle className="h-5 w-5 text-red-600 mr-2" />
                               <p className="text-sm text-red-600 font-medium">Request has been rejected</p>
                             </>
                           )}
                         </div>
                     </div>
                   )}
                 </div>
               ))}
                 </div>
               )}
             
             {/* Enhanced Empty State */}
             {!approvalRequestsLoading && approvalRequests.length === 0 && (
               <div className="text-center py-16">
                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                   <Eye className="h-16 w-16 text-gray-400" />
             </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">No approval requests found</h3>
                 <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                   There are currently no team join requests pending approval. New requests will appear here when users request to join teams.
                 </p>
                 <button
                   onClick={fetchApprovalRequests}
                   className="btn-secondary flex items-center mx-auto"
                 >
                   <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Refresh
                 </button>
               </div>
             )}
           </div>
         )}
       </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add Team</h2>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={teamFormData.description}
                  onChange={(e) => setTeamFormData({...teamFormData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Leader</label>
                <select
                  value={teamFormData.leader}
                  onChange={(e) => setTeamFormData({...teamFormData, leader: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select Team Leader</option>
                  {users.filter(u => u.status === 'Active').map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Create Team</button>
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add User to {organization.name}</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                    className="input-field"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={userFormData.department}
                    onChange={(e) => setUserFormData({...userFormData, department: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <select
                    value={userFormData.team}
                    onChange={(e) => setUserFormData({...userFormData, team: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={userFormData.joinDate}
                    onChange={(e) => setUserFormData({...userFormData, joinDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Add User</button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit User: {editingUser.firstName} {editingUser.lastName}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={userFormData.gender}
                    onChange={(e) => setUserFormData({...userFormData, gender: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={userFormData.dob}
                    onChange={(e) => setUserFormData({...userFormData, dob: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="AdminOrganization">Admin Organization</option>
                    <option value="Approved">Approved</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <select
                    value={userFormData.teamId}
                    onChange={(e) => setUserFormData({...userFormData, teamId: e.target.value})}
                    className="input-field"
                    disabled={teamsLoading}
                  >
                    <option value="">
                      {teamsLoading ? 'Loading teams...' : 'Select Team'}
                    </option>
                    {!teamsLoading && teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position ID</label>
                <input
                  type="text"
                  value={userFormData.positionId}
                  onChange={(e) => setUserFormData({...userFormData, positionId: e.target.value})}
                  className="input-field"
                  placeholder="Enter position ID"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Update User</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false)
                    setEditingUser(null)
                    setUserFormData({
                      firstName: '',
                      lastName: '',
                      gender: 'Male',
                      dob: '',
                      role: 'Member',
                      teamId: '',
                      positionId: ''
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

      {/* Position Selection Modal for Approval */}
      {showPositionModal && pendingApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Select Position for Approval</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Approving join request for: <strong>{pendingApproval.userName}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Please select a position for this user before approving their request.
              </p>
              {pendingApproval.requestData?.user?.team?.name && (
                <p className="text-sm text-blue-600 font-medium">
                  Team: {pendingApproval.requestData.user.team.name}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              {positionsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="sm" text="Loading positions..." />
                </div>
              ) : (
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select a position</option>
                  {positions.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handlePositionSubmit}
                disabled={!selectedPosition || positionsLoading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve Request
              </button>
              <button
                onClick={() => {
                  setShowPositionModal(false)
                  setSelectedPosition('')
                  setPendingApproval(null)
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationOverview 