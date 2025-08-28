import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Swal from 'sweetalert2'
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
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Circle,
  CircleDot,
  Zap,
  Activity,
  Settings,
  Shield,
  Bell,
  Lock,
  Globe,
  Database,
  Palette,
  Key,
  Folder,
  Tag,
  Briefcase,
  ChevronDown,
  ChevronRight,
  QrCode
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
  const [showEditTeamModal, setShowEditTeamModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: ''
  })
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    identified: '',
    gender: 'Male',
    dob: '',
    role: 'Member',
    teamId: '',
    positionId: ''
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
  const [teamsWithMembers, setTeamsWithMembers] = useState(new Set())

  // Settings state
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsFormData, setSettingsFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    websiteURL: '',
    industriesId: '',
    isEnabled: true,
    allowPublicRegistration: false,
    requireEmailVerification: true,
    requireAdminApproval: true,
    maxTeamSize: 50,
    allowDocumentUpload: true,
    allowTeamCreation: true,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    notificationSettings: {
      emailNotifications: true,
      teamJoinRequests: true,
      documentUpdates: true,
      userActivity: false
    }
  })

  // Position Management state
  const [showPositionManagementModal, setShowPositionManagementModal] = useState(false)
  const [showAddPositionModal, setShowAddPositionModal] = useState(false)
  const [showEditPositionModal, setShowEditPositionModal] = useState(false)
  const [editingPosition, setEditingPosition] = useState(null)
  const [allPositions, setAllPositions] = useState([])
  const [allPositionsLoading, setAllPositionsLoading] = useState(false)
  const [positionFormData, setPositionFormData] = useState({
    name: '',
    description: '',
    teamId: ''
  })

  // Document Categories state
  const [docCategories, setDocCategories] = useState([])
  const [documentCategoriesLoading, setDocumentCategoriesLoading] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  })



  // Project Portal state
  const [projectPortals, setProjectPortals] = useState([])
  const [projectPortalsLoading, setProjectPortalsLoading] = useState(false)
  const [showAddProjectPortalModal, setShowAddProjectPortalModal] = useState(false)
  const [showEditProjectPortalModal, setShowEditProjectPortalModal] = useState(false)
  const [editingProjectPortal, setEditingProjectPortal] = useState(null)
  const [projectPortalFormData, setProjectPortalFormData] = useState({
    name: '',
    description: ''
  })

  // Document Level state
  const [documentLevels, setDocumentLevels] = useState([])
  const [documentLevelsLoading, setDocumentLevelsLoading] = useState(false)
  const [showAddDocumentLevelModal, setShowAddDocumentLevelModal] = useState(false)
  const [showEditDocumentLevelModal, setShowEditDocumentLevelModal] = useState(false)
  const [editingDocumentLevel, setEditingDocumentLevel] = useState(null)
  const [documentLevelFormData, setDocumentLevelFormData] = useState({
    name: '',
    description: '',
    parentId: ''
  })
  const [expandedLevels, setExpandedLevels] = useState(new Set())
  const [childLevels, setChildLevels] = useState({})
  const [loadingChildLevels, setLoadingChildLevels] = useState({})

  // Industries state
  const [industries, setIndustries] = useState([])
  const [industriesLoading, setIndustriesLoading] = useState(false)
  
  // QR Code state
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [qrCodeLoading, setQrCodeLoading] = useState(false)

  // Fetch organization data from API
  useEffect(() => {
    fetchOrganization()
    fetchIndustries()
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

  // Fetch document categories when Document Categories tab is selected
  useEffect(() => {
    if (activeTab === 'documentCategories') {
      fetchDocumentCategories()
    }
  }, [activeTab, id])

    



 

       // Fetch project portals when Project Portals tab is selected
  useEffect(() => {
     if (activeTab === 'projectPortals') {
      fetchProjectPortals()
    }
  }, [activeTab, id])

  // Fetch document levels when Document Levels tab is selected
  useEffect(() => {
    if (activeTab === 'documentLevels') {
      fetchDocumentLevels()
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

  const fetchIndustries = async () => {
    try {
      setIndustriesLoading(true)
      const response = await api.get('http://10.0.100.19:9904/api/v1/industries')
      
      if (response.ok) {
        const data = await response.json()
        // Handle the nested API response structure
        const industriesData = data.result?.data?.industries || []
        setIndustries(industriesData)
      } else {
        console.error('Failed to fetch industries')
        setIndustries([])
      }
    } catch (error) {
      console.error('Error fetching industries:', error)
      setIndustries([])
    } finally {
      setIndustriesLoading(false)
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

  const fetchDocumentCategories = async () => {
    try {
      setDocumentCategoriesLoading(true)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/docCategories/${id}/org`)
      
      if (response.ok) {
        const data = await response.json()
        const categoriesData = data.result?.data?.docCategories || data.result?.data || []
        setDocCategories(categoriesData)
      } else {
        console.error('Failed to fetch document categories')
        setDocCategories([])
      }
    } catch (error) {
      console.error('Error fetching document categories:', error)
      setDocCategories([])
    } finally {
      setDocumentCategoriesLoading(false)
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

  const fetchPositionsForTeam = async (teamId) => {
    try {
      setPositionsLoading(true)
      
      const response = await api.get(`http://10.0.100.19:9904/api/v1/positions/${teamId}/team`)
      
      if (response.ok) {
        const data = await response.json()
        const positionsData = data.result?.data?.positions || data.result?.data || []
        setPositions(positionsData)
      } else {
        console.error('Failed to fetch positions for team')
        setPositions([])
      }
    } catch (error) {
      console.error('Error fetching positions for team:', error)
      setPositions([])
    } finally {
      setPositionsLoading(false)
    }
  }

  const fetchTeamMembers = async (teamId) => {
    try {
      setTeamsLoading(true)
      
      const response = await api.get(`http://10.0.100.19:9904/api/v1/teams/${teamId}/members`)
      
      if (response.ok) {
        const data = await response.json()
        const membersData = data.result?.data?.members || data.result?.data || []
        
        // Update the specific team with its members
    setOrganization(prev => ({
      ...prev,
          teams: prev.teams.map(team => 
            team.id === teamId 
              ? { ...team, users: membersData }
              : team
          )
        }))
        
        // Mark this team as having members loaded
        setTeamsWithMembers(prev => new Set([...prev, teamId]))
        
        console.log(`Loaded ${membersData.length} members for team ${teamId}`)
      } else {
        console.error('Failed to fetch team members')
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setTeamsLoading(false)
    }
  }

  const handleAddTeam = async (e) => {
    e.preventDefault()
    
    try {
      const requestBody = {
        name: teamFormData.name,
        description: teamFormData.description
      }
      
      const response = await api.post(`http://10.0.100.19:9904/api/v1/teams/${id}/org`, requestBody)
      
      if (response.ok) {
        // Refresh teams data after successful creation
        await fetchTeams()
    setShowAddTeamModal(false)
    setTeamFormData({
      name: '',
          description: ''
        })
        Swal.fire(
          'Success!',
          `Team "${teamFormData.name}" has been successfully created.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to create team',
          'error'
        )
      }
    } catch (error) {
      console.error('Error creating team:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
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
    
    // Find which team this user belongs to - try multiple approaches
    let userTeamId = ''
    let userPositionId = ''
    
    // First try to get team from user's team property
    if (user.team?.id) {
      userTeamId = user.team.id
      userPositionId = user.position?.id || ''
    } else {
      // Fallback: search in teams array
      const userTeam = teams.find(team => team.users?.some(u => u.id === user.id))
      userTeamId = userTeam?.id || ''
      userPositionId = user.position?.id || ''
    }
    
    // Map API role back to UI role
    const roleMapping = {
      'SuperAdmin': 'SuperAdmin',
      'Organization': 'Organization',
      'Approved': 'Approval', // API sends 'Approved', UI shows 'Approval'
      'Management': 'Management',
      'Member': 'Member'
    }
    
    setUserFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      identified: user.identified || user.email || '',
      gender: user.gender || 'Male',
      dob: user.dob ? user.dob.split('T')[0] : '',
      role: roleMapping[user.role] || user.role || 'Member',
      teamId: userTeamId,
      positionId: userPositionId
    })
    setShowEditUserModal(true)
    
    // Fetch teams when opening edit modal
    fetchTeams()
    
    // Fetch positions for the user's current team if they have one
    if (userTeamId) {
      fetchPositionsForTeam(userTeamId)
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      // Map role names to API expected format
      const roleMapping = {
        'SuperAdmin': 'SuperAdmin',
        'Organization': 'Organization', 
        'Approval': 'Approval', // API now expects 'Approval'
        'Management': 'Management',
        'Member': 'Member'
      }

      const updateData = {
        gender: userFormData.gender,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        identified: userFormData.identified,
        dob: userFormData.dob ? `${userFormData.dob}T00:00:00Z` : null,
        role: roleMapping[userFormData.role] || userFormData.role,
        teamId: userFormData.teamId || null,
        positionId: userFormData.positionId || null
      }

      console.log('Updating user with data:', updateData)
      const response = await api.put(`http://10.0.100.19:9904/api/v1/users/${editingUser.id}`, updateData)
      
      if (response.ok) {
        // Refresh users data
        await fetchUsers()
        setShowEditUserModal(false)
        setEditingUser(null)
    setUserFormData({
      firstName: '',
      lastName: '',
      identified: '',
          gender: 'Male',
          dob: '',
          role: 'Member',
          teamId: '',
          positionId: ''
        })
        Swal.fire(
          'Success!',
          'User has been successfully updated.',
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update user',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating user:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleGenerateQRCode = async () => {
    try {
      setQrCodeLoading(true)
      console.log('Generating QR code for organization:', id)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/organizations/${id}/genQR`)
      console.log('QR code generation response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('QR code generation response:', data)
        
        // Check if the response contains QR code data
        if (data.result?.data?.qrCode) {
          const qrCodeData = data.result.data.qrCode
          setQrCodeData({
            code: qrCodeData,
            organizationName: organization?.name || 'Organization',
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`
          })
          setShowQRModal(true)
        } else {
          Swal.fire(
            'Error!',
            'No QR code data received from API',
            'error'
          )
        }
      } else {
        const errorData = await response.json()
        console.error('QR code generation error:', errorData)
        Swal.fire(
          'Error!',
          errorData.result?.serviceResult?.message || errorData.message || 'Failed to generate QR code',
          'error'
        )
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    } finally {
      setQrCodeLoading(false)
    }
  }

  const handleSetAsAdmin = async (user) => {
    const result = await Swal.fire({
      title: 'Set as Admin?',
      text: `Are you sure you want to set "${user.firstName} ${user.lastName}" as an Organization Admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, set as Admin!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const updateData = {
        gender: user.gender || 'Male',
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob || '1998-05-01T00:00:00Z',
        role: 'Organization', // Set role to Organization
        teamId: user.team?.id || '',
        positionId: user.position?.id || ''
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/users/${user.id}`, updateData)
      
      if (response.ok) {
        await fetchUsers() // Refresh the users list
        Swal.fire(
          'Success!',
          `${user.firstName} ${user.lastName} has been set as Organization Admin.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to set user as admin',
          'error'
        )
      }
    } catch (error) {
      console.error('Error setting user as admin:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const response = await api.delete(`http://10.0.100.19:9904/api/v1/users/${userId}`)
      
      if (response.ok) {
        // Refresh users data after successful deletion
        await fetchUsers()
        Swal.fire(
          'Deleted!',
          `User "${userName}" has been successfully deleted.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to delete user',
          'error'
        )
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleDeleteTeam = async (teamId, teamName, teamDescription) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete team "${teamName}"? This action cannot be undone and will remove all team members.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const requestBody = {
        name: teamName,
        description: teamDescription || ''
      }
      
      const response = await api.delete(`http://10.0.100.19:9904/api/v1/teams/${teamId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (response.ok) {
        // Refresh teams data after successful deletion
        await fetchTeams()
        Swal.fire(
          'Deleted!',
          `Team "${teamName}" has been successfully deleted.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to delete team',
          'error'
        )
      }
    } catch (error) {
      console.error('Error deleting team:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleEditTeam = (team) => {
    setEditingTeam(team)
    setTeamFormData({
      name: team.name || '',
      description: team.description || ''
    })
    setShowEditTeamModal(true)
  }

  const handleUpdateTeam = async (e) => {
    e.preventDefault()
    if (!editingTeam) return

    try {
      const updateData = {
        name: teamFormData.name,
        description: teamFormData.description
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/teams/${editingTeam.id}`, updateData)
      
      if (response.ok) {
        // Refresh teams data
        await fetchTeams()
        setShowEditTeamModal(false)
        setEditingTeam(null)
        setTeamFormData({
          name: '',
          description: ''
        })
        Swal.fire(
          'Success!',
          `Team "${teamFormData.name}" has been successfully updated.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update team',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating team:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
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
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: `Are you sure you want to approve the join request from "${userName}"?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, approve it!'
        })
        
        if (!result.isConfirmed) return
        
        await submitApproval(requestId, status, requestData)
        return
      }
    }
    
    // For rejection, proceed directly
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to reject the join request from "${userName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reject it!'
    })
    
    if (!result.isConfirmed) return
    
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
          Swal.fire(
            'Error!',
            'Missing required data for approval. Please ensure user, position, and team information is available.',
            'error'
          )
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
          Swal.fire(
            'Error!',
            'Missing user ID for rejection.',
            'error'
          )
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
        Swal.fire(
          'Success!',
          `Request has been ${status.toLowerCase()} successfully.`,
          'success'
        )
        
        // Close position modal if it was open
        if (showPositionModal) {
          setShowPositionModal(false)
          setSelectedPosition('')
          setPendingApproval(null)
        }
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || `Failed to ${status.toLowerCase()} request`,
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating approval status:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handlePositionSubmit = async () => {
    if (!selectedPosition) {
      Swal.fire(
        'Error!',
        'Please select a position before approving.',
        'error'
      )
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



  const handleOpenSettings = () => {
    // Populate settings form with current organization data
    setSettingsFormData({
      name: organization.name || '',
      description: organization.description || '',
      email: organization.email || '',
      phone: organization.phone || '',
      address: organization.address || '',
      websiteURL: organization.websiteURL || '',
      industriesId: organization.industriesId || '',
      isEnabled: organization.isEnabled !== false,
      allowPublicRegistration: organization.allowPublicRegistration || false,
      requireEmailVerification: organization.requireEmailVerification !== false,
      requireAdminApproval: organization.requireAdminApproval !== false,
      maxTeamSize: organization.maxTeamSize || 50,
      allowDocumentUpload: organization.allowDocumentUpload !== false,
      allowTeamCreation: organization.allowTeamCreation !== false,
      sessionTimeout: organization.sessionTimeout || 30,
      passwordPolicy: {
        minLength: organization.passwordPolicy?.minLength || 8,
        requireUppercase: organization.passwordPolicy?.requireUppercase !== false,
        requireLowercase: organization.passwordPolicy?.requireLowercase !== false,
        requireNumbers: organization.passwordPolicy?.requireNumbers !== false,
        requireSpecialChars: organization.passwordPolicy?.requireSpecialChars !== false
      },
      notificationSettings: {
        emailNotifications: organization.notificationSettings?.emailNotifications !== false,
        teamJoinRequests: organization.notificationSettings?.teamJoinRequests !== false,
        documentUpdates: organization.notificationSettings?.documentUpdates !== false,
        userActivity: organization.notificationSettings?.userActivity || false
      }
    })
    setShowSettingsModal(true)
  }

  const handleUpdateSettings = async (e) => {
    e.preventDefault()
    
    try {
      const updateData = {
        name: settingsFormData.name,
        description: settingsFormData.description,
        email: settingsFormData.email,
        phone: settingsFormData.phone,
        address: settingsFormData.address,
        websiteURL: settingsFormData.websiteURL,
        industriesId: settingsFormData.industriesId,
        isEnabled: settingsFormData.isEnabled,
        allowPublicRegistration: settingsFormData.allowPublicRegistration,
        requireEmailVerification: settingsFormData.requireEmailVerification,
        requireAdminApproval: settingsFormData.requireAdminApproval,
        maxTeamSize: settingsFormData.maxTeamSize,
        allowDocumentUpload: settingsFormData.allowDocumentUpload,
        allowTeamCreation: settingsFormData.allowTeamCreation,
        sessionTimeout: settingsFormData.sessionTimeout,
        passwordPolicy: settingsFormData.passwordPolicy,
        notificationSettings: settingsFormData.notificationSettings
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/organizations/${id}`, updateData)
      
      if (response.ok) {
        // Refresh organization data
        await fetchOrganization()
        setShowSettingsModal(false)
        Swal.fire(
          'Success!',
          'Organization settings have been successfully updated.',
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update organization settings',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating organization settings:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  // Position Management Functions
  const fetchAllPositions = async () => {
    try {
      setAllPositionsLoading(true)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/positions/${id}/org`)
      
      if (response.ok) {
        const data = await response.json()
        const positionsData = data.result?.data?.positions || data.result?.data || []
        setAllPositions(positionsData)
      } else {
        console.error('Failed to fetch positions')
        setAllPositions([])
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
      setAllPositions([])
    } finally {
      setAllPositionsLoading(false)
    }
  }

  const handleOpenPositionManagement = () => {
    setShowPositionManagementModal(true)
    fetchAllPositions()
    fetchTeams()
  }

  const handleAddPosition = async (e) => {
    e.preventDefault()
    
    try {
      const requestBody = {
        name: positionFormData.name,
        description: positionFormData.description,
        teamId: positionFormData.teamId || null
      }
      
      const response = await api.post(`http://10.0.100.19:9904/api/v1/positions/${id}/org`, requestBody)
      
      if (response.ok) {
        await fetchAllPositions()
        setShowAddPositionModal(false)
        setPositionFormData({
          name: '',
      description: '',
          teamId: ''
        })
        Swal.fire(
          'Success!',
          `Position "${positionFormData.name}" has been successfully created.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to create position',
          'error'
        )
      }
    } catch (error) {
      console.error('Error creating position:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleEditPosition = (position) => {
    setEditingPosition(position)
    setPositionFormData({
      name: position.name || '',
      description: position.description || '',
      teamId: position.team?.id || position.teamId || ''
    })
    setShowEditPositionModal(true)
  }

  const handleUpdatePosition = async (e) => {
    e.preventDefault()
    if (!editingPosition) return

    try {
      const updateData = {
        name: positionFormData.name,
        description: positionFormData.description,
        teamId: positionFormData.teamId || null
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/positions/${editingPosition.id}`, updateData)
      
      if (response.ok) {
        await fetchAllPositions()
        setShowEditPositionModal(false)
        setEditingPosition(null)
        setPositionFormData({
          name: '',
          description: '',
          teamId: ''
        })
        Swal.fire(
          'Success!',
          `Position "${positionFormData.name}" has been successfully updated.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update position',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating position:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleDeletePosition = async (positionId, positionName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete position "${positionName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      // Find the position data to include in the delete request
      const positionToDelete = allPositions.find(pos => pos.id === positionId)
      
      if (!positionToDelete) {
        Swal.fire(
          'Error!',
          'Position not found',
          'error'
        )
        return
      }

      const deleteData = {
        name: positionToDelete.name,
        description: positionToDelete.description,
        teamId: positionToDelete.team?.id || positionToDelete.teamId || null
      }

      const response = await api.delete(`http://10.0.100.19:9904/api/v1/positions/${positionId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteData)
      })
      
      if (response.ok) {
        await fetchAllPositions()
        Swal.fire(
          'Deleted!',
          `Position "${positionName}" has been successfully deleted.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to delete position',
          'error'
        )
      }
    } catch (error) {
      console.error('Error deleting position:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  // Document Categories Functions
  const handleAddCategory = async (e) => {
    e.preventDefault()
    
    try {
      const requestBody = {
        name: categoryFormData.name,
        description: categoryFormData.description
      }
      
      const response = await api.post(`http://10.0.100.19:9904/api/v1/docCategories/${id}/org`, requestBody)
      
      if (response.ok) {
        await fetchDocumentCategories()
        setShowAddCategoryModal(false)
        setCategoryFormData({
          name: '',
          description: ''
        })
        Swal.fire(
          'Success!',
          `Category "${categoryFormData.name}" has been successfully created.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to create category',
          'error'
        )
      }
    } catch (error) {
      console.error('Error creating category:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name || '',
      description: category.description || ''
    })
    setShowEditCategoryModal(true)
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    if (!editingCategory) return

    try {
      const updateData = {
        name: categoryFormData.name,
        description: categoryFormData.description
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/docCategories/${editingCategory.id}`, updateData)
      
      if (response.ok) {
        await fetchDocumentCategories()
        setShowEditCategoryModal(false)
        setEditingCategory(null)
        setCategoryFormData({
          name: '',
          description: ''
        })
        Swal.fire(
          'Success!',
          `Category "${categoryFormData.name}" has been successfully updated.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update category',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating category:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete category "${categoryName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const response = await api.delete(`http://10.0.100.19:9904/api/v1/docCategories/${categoryId}`)
      
      if (response.ok) {
        await fetchDocumentCategories()
        Swal.fire(
          'Deleted!',
          `Category "${categoryName}" has been successfully deleted.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to delete category',
          'error'
        )
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }









  const fetchProjectPortals = async () => {
    try {
      setProjectPortalsLoading(true)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/projectPortals/${id}/org`)
      
      if (response.ok) {
        const data = await response.json()
        const portalsData = data.result?.data?.projectPortals || data.result?.data || []
        setProjectPortals(portalsData)
      } else {
        console.error('Failed to fetch project portals')
        setProjectPortals([])
      }
    } catch (error) {
      console.error('Error fetching project portals:', error)
      setProjectPortals([])
    } finally {
      setProjectPortalsLoading(false)
    }
  }

  const handleAddProjectPortal = async (e) => {
    e.preventDefault()
    
    try {
      const requestBody = {
        name: projectPortalFormData.name,
        description: projectPortalFormData.description
      }
      
      const response = await api.post(`http://10.0.100.19:9904/api/v1/projectPortals/${id}/org`, requestBody)
      
      if (response.ok) {
        await fetchProjectPortals()
                setShowAddProjectPortalModal(false)
        setProjectPortalFormData({
          name: '',
          description: ''
        })
        Swal.fire(
          'Success!',
          `Project Portal "${projectPortalFormData.name}" has been successfully created.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to create project portal',
          'error'
        )
      }
    } catch (error) {
      console.error('Error creating project portal:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleEditProjectPortal = (portal) => {
    setEditingProjectPortal(portal)
    setProjectPortalFormData({
      name: portal.name || '',
      description: portal.description || ''
    })
    setShowEditProjectPortalModal(true)
  }

  const handleUpdateProjectPortal = async (e) => {
    e.preventDefault()
    if (!editingProjectPortal) return

    try {
      const updateData = {
        name: projectPortalFormData.name,
        description: projectPortalFormData.description
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/projectPortals/${editingProjectPortal.id}`, updateData)
      
      if (response.ok) {
        await fetchProjectPortals()
        setShowEditProjectPortalModal(false)
        setEditingProjectPortal(null)
        setProjectPortalFormData({
          name: '',
          description: ''
        })
        Swal.fire(
          'Success!',
          `Project Portal "${projectPortalFormData.name}" has been successfully updated.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update project portal',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating project portal:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleDeleteProjectPortal = async (portalId, portalName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete project portal "${portalName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const response = await api.delete(`http://10.0.100.19:9904/api/v1/projectPortals/${portalId}`)
      
      if (response.ok) {
        await fetchProjectPortals()
        Swal.fire(
          'Deleted!',
          `Project Portal "${portalName}" has been successfully deleted.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to delete project portal',
          'error'
        )
      }
    } catch (error) {
      console.error('Error deleting project portal:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const fetchDocumentLevels = async () => {
    try {
      setDocumentLevelsLoading(true)
      const response = await api.get(`http://10.0.100.19:9904/api/v1/docLevels/${id}/org`)
      
      if (response.ok) {
        const data = await response.json()
        const levelsData = data.result?.data?.docLevels || data.result?.data || []
        setDocumentLevels(levelsData)
      } else {
        console.error('Failed to fetch document levels')
      }
    } catch (error) {
      console.error('Error fetching document levels:', error)
    } finally {
      setDocumentLevelsLoading(false)
    }
  }

  const fetchChildLevels = async (parentId) => {
    try {
      setLoadingChildLevels(prev => ({ ...prev, [parentId]: true }))
      const response = await api.get(`http://10.0.100.19:9904/api/v1/docLevels/${parentId}/parent`)
      
      if (response.ok) {
        const data = await response.json()
        const childData = data.result?.data?.docLevels || data.result?.data || []
        setChildLevels(prev => ({ ...prev, [parentId]: childData }))
      } else {
        console.error('Failed to fetch child levels for parent:', parentId)
        setChildLevels(prev => ({ ...prev, [parentId]: [] }))
      }
    } catch (error) {
      console.error('Error fetching child levels:', error)
      setChildLevels(prev => ({ ...prev, [parentId]: [] }))
    } finally {
      setLoadingChildLevels(prev => ({ ...prev, [parentId]: false }))
    }
  }

  const toggleLevelExpansion = (levelId) => {
    const newExpanded = new Set(expandedLevels)
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId)
    } else {
      newExpanded.add(levelId)
      // Fetch child levels if not already loaded
      if (!childLevels[levelId] && !loadingChildLevels[levelId]) {
        fetchChildLevels(levelId)
      }
    }
    setExpandedLevels(newExpanded)
  }

  const handleAddDocumentLevel = async (e) => {
    e.preventDefault()
    
    try {
      const createData = {
        name: documentLevelFormData.name,
        description: documentLevelFormData.description,
        parentId: documentLevelFormData.parentId || null
      }

      const response = await api.post(`http://10.0.100.19:9904/api/v1/docLevels/${id}/org`, createData)
      
      if (response.ok) {
        await fetchDocumentLevels()
        // Refresh child levels if this was a child level
        if (documentLevelFormData.parentId) {
          await fetchChildLevels(documentLevelFormData.parentId)
        }
        setShowAddDocumentLevelModal(false)
        setDocumentLevelFormData({
          name: '',
          description: '',
          parentId: ''
        })
        Swal.fire(
          'Success!',
          `Document Level "${documentLevelFormData.name}" has been successfully created.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to create document level',
          'error'
        )
      }
    } catch (error) {
      console.error('Error creating document level:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleEditDocumentLevel = (level) => {
    setEditingDocumentLevel(level)
    setDocumentLevelFormData({
      name: level.name || '',
      description: level.description || '',
      parentId: level.parentId || ''
    })
    setShowEditDocumentLevelModal(true)
  }

  const handleAddSubLevel = (parentLevel) => {
    setEditingDocumentLevel(null)
    setDocumentLevelFormData({
      name: '',
      description: '',
      parentId: parentLevel.id
    })
    setShowAddDocumentLevelModal(true)
  }

  const handleUpdateDocumentLevel = async (e) => {
    e.preventDefault()
    if (!editingDocumentLevel) {
      console.error('No editing document level found')
      return
    }

    try {
      const updateData = {
        name: documentLevelFormData.name,
        description: documentLevelFormData.description,
        parentId: documentLevelFormData.parentId || null
      }

      const response = await api.put(`http://10.0.100.19:9904/api/v1/docLevels/${editingDocumentLevel.id}`, updateData)
      
      if (response.ok) {
        await fetchDocumentLevels()
        // Refresh child levels if this was a child level
        if (editingDocumentLevel?.parentId) {
          await fetchChildLevels(editingDocumentLevel.parentId)
        }
        setShowEditDocumentLevelModal(false)
        setEditingDocumentLevel(null)
        setDocumentLevelFormData({
          name: '',
          description: '',
          parentId: ''
        })
        Swal.fire(
          'Success!',
          `Document Level "${documentLevelFormData.name}" has been successfully updated.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to update document level',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating document level:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const handleDeleteDocumentLevel = async (levelId, levelName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete document level "${levelName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const response = await api.delete(`http://10.0.100.19:9904/api/v1/docLevels/${levelId}`)
      
      if (response.ok) {
        await fetchDocumentLevels()
        // Clear any cached child levels for this level
        setChildLevels(prev => {
          const newChildLevels = { ...prev }
          delete newChildLevels[levelId]
          return newChildLevels
        })
        // Remove from expanded levels
        setExpandedLevels(prev => {
          const newExpanded = new Set(prev)
          newExpanded.delete(levelId)
          return newExpanded
        })
        Swal.fire(
          'Deleted!',
          `Document Level "${levelName}" has been successfully deleted.`,
          'success'
        )
      } else {
        const errorData = await response.json()
        Swal.fire(
          'Error!',
          errorData.message || 'Failed to delete document level',
          'error'
        )
      }
    } catch (error) {
      console.error('Error deleting document level:', error)
      Swal.fire(
        'Error!',
        'Network error. Please try again.',
        'error'
      )
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'Organization':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'Approval':
        return 'bg-purple-100 text-purple-800 border border-purple-200'
      case 'Management':
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case 'Member':
        return 'bg-green-100 text-green-800 border border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getTeamStatus = (team) => {
    const memberCount = team.users?.length || team.memberCount || 0
    const approvedCount = team.users?.filter(u => u.statusJoinedOrganization === 'Approved').length || 0
    const pendingCount = team.users?.filter(u => u.statusJoinedOrganization === 'Pending').length || 0
    const rejectedCount = team.users?.filter(u => u.statusJoinedOrganization === 'Rejected').length || 0
    const approverCount = team.users?.filter(u => u.role === 'Approval').length || 0
    const adminCount = team.users?.filter(u => u.role === 'SuperAdmin' || u.role === 'Organization' || u.role === 'Management').length || 0

    if (memberCount === 0) {
      return {
        status: 'empty',
        label: 'Empty',
        icon: Circle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        description: 'No members'
      }
    } else if (approvedCount > 0 && pendingCount === 0 && rejectedCount === 0) {
      return {
        status: 'active',
        label: 'Active',
        icon: CircleDot,
        color: 'bg-green-100 text-green-800 border-green-200',
        description: `${approvedCount} approved`
      }
    } else if (pendingCount > 0) {
      return {
        status: 'pending',
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: `${pendingCount} pending`
      }
    } else if (rejectedCount > 0) {
      return {
        status: 'rejected',
        label: 'Issues',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        description: `${rejectedCount} rejected`
      }
    } else if (adminCount > 0) {
      return {
        status: 'admin',
        label: 'Admin Team',
        icon: Zap,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        description: `${adminCount} admin${adminCount > 1 ? 's' : ''}`
      }
    } else {
      return {
        status: 'mixed',
        label: 'Mixed',
        icon: Activity,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: `${memberCount} members`
      }
    }
  }

  const departments = ['IT', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Engineering']
  const roles = ['SuperAdmin', 'Organization', 'Approval', 'Management', 'Member']
  const documentCategories = ['HR', 'Technical', 'Business', 'Marketing', 'Finance', 'Design', 'Sales', 'Legal']

  const tabs = [
    { id: 'details', name: 'Organization Details', icon: Info },
    { id: 'teams', name: 'Teams', icon: Users2 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'documents', name: 'Documents', icon: FileText },
     { id: 'projectPortals', name: 'Project Portals', icon: Briefcase },
    { id: 'documentLevels', name: 'Document Levels', icon: Folder },
    { id: 'approvals', name: 'Approvals', icon: Eye },
    { id: 'documentCategories', name: 'Document Categories', icon: Tag }
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
               onClick={handleGenerateQRCode}
               className="btn-secondary flex items-center"
               title="Generate QR Code"
               disabled={qrCodeLoading}
             >
               {qrCodeLoading ? (
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               ) : (
                 <QrCode className="h-4 w-4 mr-2" />
               )}
               {qrCodeLoading ? 'Generating...' : 'Generate QR Code'}
             </button>
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
                   <span>{users.filter(u => u.statusJoinedOrganization === 'Approved').length} Approved Members</span>
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
                   
                   {organization.industry && (
                     <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                       <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                       </svg>
                       <div>
                         <p className="text-sm text-gray-500">Industry</p>
                         <p className="font-medium text-gray-900">{organization.industry}</p>
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
                         <p className="text-xs text-blue-500">All members</p>
                   </div>
                   </div>
                     <span className="text-2xl font-bold text-blue-700">{users.length}</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                     <div className="flex items-center">
                       <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                       <div>
                         <p className="text-sm text-green-600 font-medium">Approved Users</p>
                         <p className="text-xs text-green-500">Active members</p>
                   </div>
                 </div>
                     <span className="text-2xl font-bold text-green-700">{users.filter(u => u.statusJoinedOrganization === 'Approved').length}</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                     <div className="flex items-center">
                       <Users2 className="h-6 w-6 text-purple-600 mr-3" />
                       <div>
                         <p className="text-sm text-purple-600 font-medium">Teams</p>
                         <p className="text-xs text-purple-500">Active teams</p>
                   </div>
                 </div>
                     <span className="text-2xl font-bold text-purple-700">{teams.length}</span>
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                   onClick={handleOpenPositionManagement}
                   className="flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                 >
                   <Key className="h-6 w-6 text-indigo-600 mr-3" />
                   <div className="text-left">
                     <p className="font-medium text-indigo-900">Positions</p>
                     <p className="text-sm text-indigo-600">Manage positions</p>
                   </div>
                 </button>

                 <button 
                   onClick={handleOpenSettings}
                   className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                 >
                   <Settings className="h-6 w-6 text-orange-600 mr-3" />
                   <div className="text-left">
                     <p className="font-medium text-orange-900">Settings</p>
                     <p className="text-sm text-orange-600">Configure organization</p>
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



                    {/* Team Members Preview */}
                                     <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">Team Members</h4>
                        {team.users && team.users.length > 3 && (
                          <span className="text-xs text-gray-500">+{team.users.length - 3} more</span>
                        )}
                      </div>
                      
                      {team.users && team.users.length > 0 ? (
                                           <div className="space-y-2">
                          {team.users.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                                  {member.avatarURL ? (
                                    <img src={member.avatarURL} alt={member.firstName} className="h-6 w-6 rounded-full object-cover" />
                                  ) : (
                                    <User className="h-3 w-3 text-primary-600" />
                                  )}
                            </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-700 font-medium">
                                    {member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}
                                  </span>
                                  <span className="text-xs text-gray-500">{member.identified}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                                <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
                                  member.statusJoinedOrganization === 'Approved'
                                    ? 'bg-green-100 text-green-800' 
                                    : member.statusJoinedOrganization === 'Rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {member.statusJoinedOrganization || 'Pending'}
                            </span>
                              </div>
                          </div>
                        ))}
                          {team.users.length > 3 && (
                            <div className="text-center">
                              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                View all {team.users.length} members
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
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Team
                        </button>
                        <button 
                          onClick={() => fetchTeamMembers(team.id)}
                          disabled={teamsWithMembers.has(team.id)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                            teamsWithMembers.has(team.id)
                              ? 'bg-green-50 text-green-700 cursor-not-allowed'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                          }`}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {teamsWithMembers.has(team.id) ? 'Members Loaded' : 'Load Members'}
                        </button>
                        <button 
                          onClick={() => handleDeleteTeam(team.id, team.name, team.description)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Team
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
                       <p className="text-2xl font-bold text-green-700">{users.filter(u => u.statusJoinedOrganization === 'Approved').length}</p>
                       <p className="text-green-600 font-medium">Approved Users</p>
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
                       <p className="text-2xl font-bold text-orange-700">{new Set(users.map(u => u.position?.name).filter(Boolean)).size}</p>
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
                          {user.role !== 'Organization' && (
                            <button 
                              onClick={() => handleSetAsAdmin(user)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Set as Admin"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
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
                         <span className="text-gray-700">{user.identified || 'No contact info'}</span>
                       </div>
                       
                       {user.position && (
                         <div className="flex items-center text-sm">
                           <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                           <span className="text-gray-700">{user.position.name}</span>
                         </div>
                       )}
                       
                       {user.team && (
                         <div className="flex items-center text-sm">
                           <Users2 className="h-4 w-4 text-gray-400 mr-2" />
                           <span className="text-gray-700">{user.team.name}</span>
                         </div>
                       )}
                     </div>

                     {/* User Status and Role */}
                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                       <div className="flex space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                           user.statusJoinedOrganization === 'Approved'
                            ? 'bg-green-100 text-green-800' 
                            : user.statusJoinedOrganization === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                           {user.statusJoinedOrganization || 'Pending'}
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


               </div>
         )}




               

         {/* Document Levels Tab */}
         {activeTab === 'documentLevels' && (
           <div>
             {/* Header with Stats */}
             <div className="mb-8">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Document Levels</h2>
                   <p className="text-gray-600 mt-1">Manage document levels for {organization.name}</p>
                 </div>
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={() => setShowAddDocumentLevelModal(true)}
                     disabled={documentLevelsLoading}
                     className="btn-primary flex items-center"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Add Level
                   </button>
                 </div>
               </div>
               
               {/* Document Levels Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-blue-700">{documentLevels.length}</p>
                       <p className="text-blue-600 font-medium">Total Levels</p>
                     </div>
                     <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                       <Folder className="h-6 w-6 text-blue-700" />
                     </div>
                   </div>
                 </div>



                 <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-purple-700">{documentLevels.filter(l => l.createdAt && new Date(l.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}</p>
                       <p className="text-purple-600 font-medium">Recent</p>
                     </div>
                     <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                       <Calendar className="h-6 w-6 text-purple-700" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Loading State */}
             {documentLevelsLoading && (
               <div className="flex items-center justify-center py-12">
                 <LoadingSpinner size="lg" text="Loading document levels..." />
               </div>
             )}

             {/* Document Levels Folder View */}
             {!documentLevelsLoading && documentLevels.length > 0 && (
               <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <Folder className="h-5 w-5 text-gray-600" />
                       <h3 className="text-lg font-semibold text-gray-900">Document Levels Hierarchy</h3>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className="text-sm text-gray-500">{documentLevels.length} levels</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="p-6">
                   <div className="space-y-3">
                     {documentLevels
                       .sort((a, b) => a.level - b.level)
                       .map((level, index) => (
                         <div key={level.id} className="group">
                           <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200">
                             <div className="flex items-center space-x-4">
                               {/* Indentation based on level */}
                               <div className="flex items-center space-x-2">
                                 {Array.from({ length: Math.min(level.level - 1, 3) }, (_, i) => (
                                   <div key={i} className="w-1 h-8 bg-gray-300 rounded-full"></div>
                                 ))}
                               </div>
                               
                               {/* Folder Icon */}
                               <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                 level.level === 1 ? 'bg-blue-100' :
                                 level.level === 2 ? 'bg-green-100' :
                                 level.level === 3 ? 'bg-purple-100' :
                                 level.level === 4 ? 'bg-orange-100' :
                                 'bg-gray-100'
                               }`}>
                                 <Folder className={`h-5 w-5 ${
                                   level.level === 1 ? 'text-blue-600' :
                                   level.level === 2 ? 'text-green-600' :
                                   level.level === 3 ? 'text-purple-600' :
                                   level.level === 4 ? 'text-orange-600' :
                                   'text-gray-600'
                                 }`} />
                               </div>
                               
                               {/* Level Info */}
                               <div className="flex-1">
                                 <div className="flex items-center space-x-3">
                                   <h4 className="text-lg font-semibold text-gray-900">{level.name}</h4>
                                   <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                     Parent
                                   </span>
                                 </div>
                                 {level.description && (
                                   <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                                 )}
                                 <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                   <span>Created: {level.createdAt ? new Date(level.createdAt).toLocaleDateString() : 'N/A'}</span>
                                   {level.documents && (
                                     <span>{level.documents.length} documents</span>
                                   )}
                                 </div>
                               </div>
                             </div>
                             
                                                            {/* Action Buttons */}
                               <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                 <button 
                                   onClick={() => toggleLevelExpansion(level.id)}
                                   className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                                   title={expandedLevels.has(level.id) ? "Collapse" : "Expand"}
                                 >
                                   {expandedLevels.has(level.id) ? (
                                     <ChevronDown className="h-4 w-4" />
                                   ) : (
                                     <ChevronRight className="h-4 w-4" />
                                   )}
                                 </button>
                                 <button 
                                   onClick={() => handleEditDocumentLevel(level)}
                                   className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                   title="Edit level"
                                 >
                                   <Edit className="h-4 w-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteDocumentLevel(level.id, level.name)}
                                   className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                   title="Delete level"
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleAddSubLevel(level)}
                                   className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                   title="Add sub-level"
                                 >
                                   <Plus className="h-4 w-4" />
                                 </button>
                               </div>
                           </div>
                           
                           {/* Child levels from API */}
                           {expandedLevels.has(level.id) && (
                             <div className="ml-8 mt-2 space-y-2">
                               {loadingChildLevels[level.id] ? (
                                 <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-100">
                                   <div className="flex items-center space-x-2">
                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                     <span className="text-sm text-gray-500">Loading child levels...</span>
                                   </div>
                                 </div>
                               ) : childLevels[level.id] && childLevels[level.id].length > 0 ? (
                                 childLevels[level.id].map((childLevel) => (
                                   <div key={childLevel.id} className="group">
                                     <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-100">
                                       <div className="flex items-center space-x-3">
                                         {/* Additional indentation for child levels */}
                                         <div className="flex items-center space-x-2">
                                           <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                                         </div>
                                         
                                         <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                           childLevel.level === 2 ? 'bg-green-100' :
                                           childLevel.level === 3 ? 'bg-purple-100' :
                                           childLevel.level === 4 ? 'bg-orange-100' :
                                           'bg-gray-100'
                                         }`}>
                                           <Folder className={`h-4 w-4 ${
                                             childLevel.level === 2 ? 'text-green-600' :
                                             childLevel.level === 3 ? 'text-purple-600' :
                                             childLevel.level === 4 ? 'text-orange-600' :
                                             'text-gray-600'
                                           }`} />
                                         </div>
                                         
                                         <div className="flex-1">
                                           <div className="flex items-center space-x-2">
                                             <h5 className="text-sm font-medium text-gray-900">{childLevel.name}</h5>

                                             <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                               Child
                                             </span>
                                           </div>
                                           {childLevel.description && (
                                             <p className="text-xs text-gray-500 mt-1">{childLevel.description}</p>
                                           )}
                                         </div>
                                       </div>
                                       
                                       {/* Child level action buttons */}
                                       <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                         <button 
                                           onClick={() => handleEditDocumentLevel(childLevel)}
                                           className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                                           title="Edit child level"
                                         >
                                           <Edit className="h-3 w-3" />
                                         </button>
                                         <button 
                                           onClick={() => handleDeleteDocumentLevel(childLevel.id, childLevel.name)}
                                           className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                           title="Delete child level"
                                         >
                                           <Trash2 className="h-3 w-3" />
                                         </button>
                                         <button 
                                           onClick={() => handleAddSubLevel(childLevel)}
                                           className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                                           title="Add sub-level to child"
                                         >
                                           <Plus className="h-3 w-3" />
                                         </button>
                                       </div>
                                     </div>
                                   </div>
                                 ))
                               ) : (
                                 <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-100">
                                   <div className="text-center">
                                     <Folder className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                     <p className="text-sm text-gray-500">No child levels found</p>
                                     <button 
                                       onClick={() => handleAddSubLevel(level)}
                                       className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                     >
                                       Add first child level
                                     </button>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                       ))}
                   </div>
                 </div>
               </div>
             )}

             {/* Empty State */}
             {!documentLevelsLoading && documentLevels.length === 0 && (
               <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                   <Folder className="h-12 w-12 text-gray-400" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">No document levels found</h3>
                 <p className="text-gray-500 mb-6 max-w-md mx-auto">
                   Start building your document hierarchy by creating the first level. This will help organize your documents in a structured folder system.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
                   <button
                     onClick={() => setShowAddDocumentLevelModal(true)}
                     className="btn-primary flex items-center"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Create First Level
                   </button>
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



         {/* Project Portals Tab */}
         {activeTab === 'projectPortals' && (
           <div>
             {/* Header with Stats */}
             <div className="mb-8">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Project Portals</h2>
                   <p className="text-gray-600 mt-1">Manage project portals for {organization.name}</p>
                 </div>
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={fetchProjectPortals}
                     disabled={projectPortalsLoading}
                     className="btn-secondary flex items-center"
                     title="Refresh portals"
                   >
                     <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     Refresh
                   </button>
                   <button
                     onClick={() => setShowAddProjectPortalModal(true)}
                     className="btn-primary flex items-center"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Add Portal
                   </button>
                 </div>
               </div>

               {/* Portal Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-blue-700">{projectPortals.length}</p>
                       <p className="text-blue-600 font-medium">Total Portals</p>
                     </div>
                     <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                       <Briefcase className="h-6 w-6 text-blue-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-green-700">{projectPortals.filter(p => p.isEnabled !== false).length}</p>
                       <p className="text-green-600 font-medium">Active Portals</p>
                     </div>
                     <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                       <CheckCircle className="h-6 w-6 text-green-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-purple-700">
                         {projectPortals.reduce((total, portal) => total + (portal.projects?.length || 0), 0)}
                       </p>
                       <p className="text-purple-600 font-medium">Total Projects</p>
                     </div>
                     <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                       <FolderOpen className="h-6 w-6 text-purple-700" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Loading State */}
             {projectPortalsLoading && (
               <div className="flex items-center justify-center py-12">
                 <LoadingSpinner size="lg" text="Loading project portals..." />
               </div>
             )}

             {/* Portals Grid */}
             {!projectPortalsLoading && projectPortals.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {projectPortals.map((portal) => (
                 <div key={portal.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                   {/* Portal Header */}
                   <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center">
                       <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                         <Briefcase className="h-6 w-6 text-white" />
                       </div>
                       <div className="flex-1">
                         <h3 className="text-lg font-semibold text-gray-900">{portal.name}</h3>
                         <p className="text-sm text-gray-500">{portal.description || 'No description'}</p>
                       </div>
                     </div>
                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                       portal.isEnabled !== false 
                         ? 'bg-green-100 text-green-800 border-green-200' 
                         : 'bg-red-100 text-red-800 border-red-200'
                     }`}>
                       {portal.isEnabled !== false ? 'Active' : 'Inactive'}
                     </span>
                   </div>

                   {/* Portal Stats */}
                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-blue-50 rounded-lg p-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-lg font-bold text-blue-700">{portal.projects?.length || 0}</p>
                           <p className="text-blue-600 text-sm">Projects</p>
                         </div>
                         <FolderOpen className="h-5 w-5 text-blue-600" />
                       </div>
                     </div>
                     <div className="bg-purple-50 rounded-lg p-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-lg font-bold text-purple-700">
                             {portal.createdAt ? new Date(portal.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                           </p>
                           <p className="text-purple-600 text-sm">Created</p>
                         </div>
                         <Calendar className="h-5 w-5 text-purple-600" />
                       </div>
                     </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                     <div className="flex space-x-2">
                       <button
                         onClick={() => handleEditProjectPortal(portal)}
                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                         title="Edit portal"
                       >
                         <Edit className="h-4 w-4" />
                       </button>
                       <button
                         onClick={() => handleDeleteProjectPortal(portal.id, portal.name)}
                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                         title="Delete portal"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                     </div>
                     <div className="text-xs text-gray-400">
                       ID: {portal.id}
                     </div>
                   </div>
                 </div>
                 ))}
               </div>
             )}

             {/* Empty State */}
             {!projectPortalsLoading && projectPortals.length === 0 && (
               <div className="text-center py-16">
                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                   <Briefcase className="h-16 w-16 text-gray-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">No project portals found</h3>
                 <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                   This organization doesn't have any project portals yet. Create portals to organize your projects effectively.
                 </p>
                 <button
                   onClick={() => setShowAddProjectPortalModal(true)}
                   className="btn-primary flex items-center mx-auto"
                 >
                   <Plus className="h-4 w-4 mr-2" />
                   Create First Portal
                 </button>
                     </div>
                   )}
           </div>
         )}

         {/* Document Categories Tab */}
         {activeTab === 'documentCategories' && (
           <div>
             {/* Header with Stats */}
             <div className="mb-8">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Document Categories</h2>
                   <p className="text-gray-600 mt-1">Manage document categories for {organization.name}</p>
                 </div>
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={fetchDocumentCategories}
                     disabled={documentCategoriesLoading}
                     className="btn-secondary flex items-center"
                     title="Refresh categories"
                   >
                     <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     Refresh
                   </button>
                   <button
                     onClick={() => setShowAddCategoryModal(true)}
                     className="btn-primary flex items-center"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Add Category
                   </button>
                 </div>
               </div>

               {/* Category Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-blue-700">{docCategories.length}</p>
                       <p className="text-blue-600 font-medium">Total Categories</p>
                     </div>
                     <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                       <Tag className="h-6 w-6 text-blue-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-green-700">{docCategories.filter(c => c.isEnabled !== false).length}</p>
                       <p className="text-green-600 font-medium">Active Categories</p>
                     </div>
                     <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                       <CheckCircle className="h-6 w-6 text-green-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-purple-700">
                         {docCategories.reduce((total, category) => total + (category.documents?.length || 0), 0)}
                       </p>
                       <p className="text-purple-600 font-medium">Total Documents</p>
                     </div>
                     <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                       <FileText className="h-6 w-6 text-purple-700" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Loading State */}
             {documentCategoriesLoading && (
               <div className="flex items-center justify-center py-12">
                 <LoadingSpinner size="lg" text="Loading document categories..." />
               </div>
             )}

             {/* Categories Grid */}
             {!documentCategoriesLoading && docCategories.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {docCategories.map((category) => (
                 <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                   {/* Category Header */}
                   <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center">
                                             <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                         <Tag className="h-6 w-6 text-white" />
                       </div>
                       <div className="flex-1">
                         <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                         <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
                       </div>
                     </div>
                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                       category.isEnabled !== false 
                         ? 'bg-green-100 text-green-800 border border-green-200' 
                         : 'bg-red-100 text-red-800 border border-red-200'
                     }`}>
                       {category.isEnabled !== false ? '🟢 Active' : '🔴 Inactive'}
                     </span>
                   </div>
                   
                   {/* Category Stats */}
                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-blue-50 rounded-lg p-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-lg font-bold text-blue-700">{category.documents?.length || 0}</p>
                           <p className="text-blue-600 text-sm">Documents</p>
                         </div>
                         <FileText className="h-5 w-5 text-blue-600" />
                       </div>
                     </div>
                     <div className="bg-purple-50 rounded-lg p-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-lg font-bold text-purple-700">
                             {category.createdAt ? new Date(category.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                           </p>
                           <p className="text-purple-600 text-sm">Created</p>
                         </div>
                         <Calendar className="h-5 w-5 text-purple-600" />
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                     <div className="flex space-x-2">
                       <button 
                         onClick={() => handleEditCategory(category)}
                         className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                       >
                         <Edit className="h-4 w-4 mr-1" />
                         Edit Category
                       </button>
                       <button 
                         onClick={() => handleDeleteCategory(category.id, category.name)}
                         className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                       >
                         <Trash2 className="h-4 w-4 mr-1" />
                         Delete Category
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
             )}

             {/* Empty State */}
             {!documentCategoriesLoading && docCategories.length === 0 && (
               <div className="text-center py-16">
                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                   <Tag className="h-16 w-16 text-gray-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">No document categories found</h3>
                 <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                   This organization doesn't have any document categories yet. Create categories to organize your documents and improve file management.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
                   <button
                     onClick={() => setShowAddCategoryModal(true)}
                     className="btn-primary flex items-center"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Create First Category
                   </button>
                   <button
                     onClick={fetchDocumentCategories}
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



             







             

       {/* Add Category Modal */}
       {showAddCategoryModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-2xl w-full p-6">
             <h2 className="text-xl font-semibold mb-4">Add Category</h2>
             <form onSubmit={handleAddCategory} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                 <input
                   type="text"
                   value={categoryFormData.name}
                   onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                   className="input-field"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea
                   value={categoryFormData.description}
                   onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                   className="input-field"
                   rows="3"
                   required
                 />
               </div>
               <div className="flex space-x-3 pt-4">
                 <button type="submit" className="btn-primary flex-1">Add Category</button>
                 <button
                   type="button"
                   onClick={() => setShowAddCategoryModal(false)}
                   className="btn-secondary flex-1"
                 >
                   Cancel
                 </button>
               </div>
             </form>
             </div>
         </div>
       )}

       {/* Edit Category Modal */}
       {showEditCategoryModal && editingCategory && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-2xl w-full p-6">
             <h2 className="text-xl font-semibold mb-4">Edit Category: {editingCategory.name}</h2>
             <form onSubmit={handleUpdateCategory} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                 <input
                   type="text"
                   value={categoryFormData.name}
                   onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                   className="input-field"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea
                   value={categoryFormData.description}
                   onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                   className="input-field"
                   rows="3"
                   required
                 />
               </div>
               <div className="flex space-x-3 pt-4">
                 <button type="submit" className="btn-primary flex-1">Update Category</button>
                 <button
                   type="button"
                   onClick={() => setShowEditCategoryModal(false)}
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

      {/* Edit Team Modal */}
      {showEditTeamModal && editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Team: {editingTeam.name}</h2>
            <form onSubmit={handleUpdateTeam} className="space-y-4">
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
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Update Team</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTeamModal(false)
                    setEditingTeam(null)
                    setTeamFormData({
                      name: '',
                      description: ''
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identified</label>
                  <input
                    type="text"
                    value={userFormData.identified}
                    onChange={(e) => setUserFormData({...userFormData, identified: e.target.value})}
                    className="input-field"
                    required
                    readOnly
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identified</label>
                  <input
                    type="text"
                    value={userFormData.identified || editingUser.identified || ''}
                    onChange={(e) => setUserFormData({...userFormData, identified: e.target.value})}
                    className="input-field"
                    required
                    readOnly
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
                    <option value="SuperAdmin">SuperAdmin</option>
                    <option value="Organization">Organization</option>
                    <option value="Approval">Approval</option>
                    <option value="Management">Management</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <select
                    value={userFormData.teamId}
                    onChange={(e) => {
                      setUserFormData({...userFormData, teamId: e.target.value, positionId: ''})
                      // Fetch positions for the selected team
                      if (e.target.value) {
                        fetchPositionsForTeam(e.target.value)
                      } else {
                        setPositions([])
                      }
                    }}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={userFormData.positionId}
                  onChange={(e) => setUserFormData({...userFormData, positionId: e.target.value})}
                  className="input-field"
                  disabled={!userFormData.teamId || positionsLoading}
                >
                  <option value="">
                    {!userFormData.teamId ? 'Select a team first' : 
                     positionsLoading ? 'Loading positions...' : 'Select Position'}
                  </option>
                  {!positionsLoading && positions.map(position => (
                    <option key={position.id} value={position.id}>{position.name}</option>
                  ))}
                </select>
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
                      identified: '',
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

      {/* Organization Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="h-5 w-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Organization Settings</h2>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateSettings} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={settingsFormData.name}
                      onChange={(e) => setSettingsFormData({...settingsFormData, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={settingsFormData.description}
                      onChange={(e) => setSettingsFormData({...settingsFormData, description: e.target.value})}
                      className="input-field"
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={settingsFormData.email}
                      onChange={(e) => setSettingsFormData({...settingsFormData, email: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={settingsFormData.phone}
                      onChange={(e) => setSettingsFormData({...settingsFormData, phone: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={settingsFormData.address}
                      onChange={(e) => setSettingsFormData({...settingsFormData, address: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={settingsFormData.websiteURL}
                      onChange={(e) => setSettingsFormData({...settingsFormData, websiteURL: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select
                      value={settingsFormData.industriesId}
                      onChange={(e) => setSettingsFormData({...settingsFormData, industriesId: e.target.value})}
                      className="input-field"
                      required
                      disabled={industriesLoading}
                    >
                      <option value="">
                        {industriesLoading ? 'Loading industries...' : 'Select Industry'}
                      </option>
                      {industries.map((industry) => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Organization Status */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Organization Status</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Organization Status</p>
                      <p className="text-sm text-gray-500">Enable or disable the organization</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.isEnabled}
                        onChange={(e) => setSettingsFormData({...settingsFormData, isEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Lock className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Allow Public Registration</p>
                      <p className="text-sm text-gray-500">Allow users to register without invitation</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.allowPublicRegistration}
                        onChange={(e) => setSettingsFormData({...settingsFormData, allowPublicRegistration: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Require Email Verification</p>
                      <p className="text-sm text-gray-500">Users must verify their email address</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.requireEmailVerification}
                        onChange={(e) => setSettingsFormData({...settingsFormData, requireEmailVerification: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Require Admin Approval</p>
                      <p className="text-sm text-gray-500">New users require admin approval</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.requireAdminApproval}
                        onChange={(e) => setSettingsFormData({...settingsFormData, requireAdminApproval: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Team Size</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={settingsFormData.maxTeamSize}
                        onChange={(e) => setSettingsFormData({...settingsFormData, maxTeamSize: parseInt(e.target.value)})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={settingsFormData.sessionTimeout}
                        onChange={(e) => setSettingsFormData({...settingsFormData, sessionTimeout: parseInt(e.target.value)})}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Settings */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Feature Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Allow Document Upload</p>
                      <p className="text-sm text-gray-500">Users can upload and share documents</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.allowDocumentUpload}
                        onChange={(e) => setSettingsFormData({...settingsFormData, allowDocumentUpload: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Allow Team Creation</p>
                      <p className="text-sm text-gray-500">Users can create new teams</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.allowTeamCreation}
                        onChange={(e) => setSettingsFormData({...settingsFormData, allowTeamCreation: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Key className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Password Policy</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      value={settingsFormData.passwordPolicy.minLength}
                      onChange={(e) => setSettingsFormData({
                        ...settingsFormData, 
                        passwordPolicy: {...settingsFormData.passwordPolicy, minLength: parseInt(e.target.value)}
                      })}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">Require Uppercase</p>
                        <p className="text-sm text-gray-500">At least one uppercase letter</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsFormData.passwordPolicy.requireUppercase}
                          onChange={(e) => setSettingsFormData({
                            ...settingsFormData, 
                            passwordPolicy: {...settingsFormData.passwordPolicy, requireUppercase: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">Require Lowercase</p>
                        <p className="text-sm text-gray-500">At least one lowercase letter</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsFormData.passwordPolicy.requireLowercase}
                          onChange={(e) => setSettingsFormData({
                            ...settingsFormData, 
                            passwordPolicy: {...settingsFormData.passwordPolicy, requireLowercase: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">Require Numbers</p>
                        <p className="text-sm text-gray-500">At least one number</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsFormData.passwordPolicy.requireNumbers}
                          onChange={(e) => setSettingsFormData({
                            ...settingsFormData, 
                            passwordPolicy: {...settingsFormData.passwordPolicy, requireNumbers: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">Require Special Characters</p>
                        <p className="text-sm text-gray-500">At least one special character</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsFormData.passwordPolicy.requireSpecialChars}
                          onChange={(e) => setSettingsFormData({
                            ...settingsFormData, 
                            passwordPolicy: {...settingsFormData.passwordPolicy, requireSpecialChars: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Bell className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Send email notifications to users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.notificationSettings.emailNotifications}
                        onChange={(e) => setSettingsFormData({
                          ...settingsFormData, 
                          notificationSettings: {...settingsFormData.notificationSettings, emailNotifications: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Team Join Requests</p>
                      <p className="text-sm text-gray-500">Notify admins of team join requests</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.notificationSettings.teamJoinRequests}
                        onChange={(e) => setSettingsFormData({
                          ...settingsFormData, 
                          notificationSettings: {...settingsFormData.notificationSettings, teamJoinRequests: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Document Updates</p>
                      <p className="text-sm text-gray-500">Notify users of document changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.notificationSettings.documentUpdates}
                        onChange={(e) => setSettingsFormData({
                          ...settingsFormData, 
                          notificationSettings: {...settingsFormData.notificationSettings, documentUpdates: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">User Activity</p>
                      <p className="text-sm text-gray-500">Track and notify of user activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsFormData.notificationSettings.userActivity}
                        onChange={(e) => setSettingsFormData({
                          ...settingsFormData, 
                          notificationSettings: {...settingsFormData.notificationSettings, userActivity: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button type="submit" className="btn-primary flex-1">Save Settings</button>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Position Management Modal */}
      {showPositionManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Key className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Position Management</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchAllPositions}
                    disabled={allPositionsLoading}
                    className="btn-secondary flex items-center"
                    title="Refresh positions"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowAddPositionModal(true)}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Position
                  </button>
                  <button
                    onClick={() => setShowPositionManagementModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
                             {/* Position Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-indigo-700">{allPositions.length}</p>
                       <p className="text-indigo-600 font-medium">Total Positions</p>
                     </div>
                     <div className="h-12 w-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                       <Key className="h-6 w-6 text-indigo-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-green-700">{allPositions.filter(p => p.isEnabled !== false).length}</p>
                       <p className="text-green-600 font-medium">Active Positions</p>
                     </div>
                     <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                       <CheckCircle className="h-6 w-6 text-green-700" />
                     </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-2xl font-bold text-blue-700">{teams.length}</p>
                       <p className="text-blue-600 font-medium">Available Teams</p>
                     </div>
                     <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                       <Users2 className="h-6 w-6 text-blue-700" />
                     </div>
                   </div>
                 </div>
               </div>

              {/* Loading State */}
              {allPositionsLoading && (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" text="Loading positions..." />
                </div>
              )}

              {/* Positions Grid */}
              {!allPositionsLoading && allPositions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {allPositions.map((position) => (
                    <div key={position.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      {/* Position Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-4">
                            <Key className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{position.name}</h3>
                            <p className="text-sm text-gray-500">{position.description || 'No description'}</p>
                            {position.team && (
                              <p className="text-sm text-indigo-600 font-medium">
                                Team: {position.team.name}
                              </p>
                            )}
                          </div>
                        </div>
                                                 <div className="flex items-center space-x-2">
                           <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                             position.isEnabled !== false 
                               ? 'bg-green-100 text-green-800 border border-green-200' 
                               : 'bg-red-100 text-red-800 border border-red-200'
                           }`}>
                             {position.isEnabled !== false ? '🟢 Active' : '🔴 Inactive'}
                           </span>
                         </div>
                      </div>

                                             {/* Position Details */}
                       <div className="space-y-3 mb-4">
                         {position.description && (
                           <div className="text-sm">
                             <p className="text-gray-500 font-medium mb-1">Description:</p>
                             <p className="text-gray-700">{position.description}</p>
                           </div>
                         )}
                       </div>

                      {/* Position Actions */}
                      <div className="flex space-x-2 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleEditPosition(position)}
                          className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePosition(position.id, position.name)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!allPositionsLoading && allPositions.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                    <Key className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No positions found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                    This organization doesn't have any positions yet. Create the first position to define roles and responsibilities for your team members.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setShowAddPositionModal(true)}
                      className="btn-primary flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Position
                    </button>
                    <button
                      onClick={fetchAllPositions}
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
          </div>
        </div>
      )}

      {/* Add Position Modal */}
      {showAddPositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Plus className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Add New Position</h2>
                </div>
                <button
                  onClick={() => setShowAddPositionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

                         <form onSubmit={handleAddPosition} className="p-6 space-y-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Position Name *</label>
                 <input
                   type="text"
                   value={positionFormData.name}
                   onChange={(e) => setPositionFormData({...positionFormData, name: e.target.value})}
                   className="input-field"
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea
                   value={positionFormData.description}
                   onChange={(e) => setPositionFormData({...positionFormData, description: e.target.value})}
                   className="input-field"
                   rows="3"
                   placeholder="Enter position description..."
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                 <select
                   value={positionFormData.teamId}
                   onChange={(e) => setPositionFormData({...positionFormData, teamId: e.target.value})}
                   className="input-field"
                 >
                   <option value="">No Team (General)</option>
                   {teams.map(team => (
                     <option key={team.id} value={team.id}>{team.name}</option>
                   ))}
                 </select>
               </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Create Position</button>
                <button
                  type="button"
                  onClick={() => setShowAddPositionModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Position Modal */}
      {showEditPositionModal && editingPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Edit className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Edit Position: {editingPosition.name}</h2>
                </div>
                <button
                  onClick={() => setShowEditPositionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

                         <form onSubmit={handleUpdatePosition} className="p-6 space-y-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Position Name *</label>
                 <input
                   type="text"
                   value={positionFormData.name}
                   onChange={(e) => setPositionFormData({...positionFormData, name: e.target.value})}
                   className="input-field"
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea
                   value={positionFormData.description}
                   onChange={(e) => setPositionFormData({...positionFormData, description: e.target.value})}
                   className="input-field"
                   rows="3"
                   placeholder="Enter position description..."
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                 <select
                   value={positionFormData.teamId}
                   onChange={(e) => setPositionFormData({...positionFormData, teamId: e.target.value})}
                   className="input-field"
                 >
                   <option value="">No Team (General)</option>
                   {teams.map(team => (
                     <option key={team.id} value={team.id}>{team.name}</option>
                   ))}
                 </select>
               </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Update Position</button>
                <button
                  type="button"
                  onClick={() => setShowEditPositionModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Add Project Portal Modal */}
      {showAddProjectPortalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Project Portal</h2>
              <button
                onClick={() => setShowAddProjectPortalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddProjectPortal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portal Name</label>
                <input
                  type="text"
                  value={projectPortalFormData.name}
                  onChange={(e) => setProjectPortalFormData({...projectPortalFormData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={projectPortalFormData.description}
                  onChange={(e) => setProjectPortalFormData({...projectPortalFormData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Add Portal</button>
                <button
                  type="button"
                  onClick={() => setShowAddProjectPortalModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Portal Modal */}
      {showEditProjectPortalModal && editingProjectPortal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Project Portal: {editingProjectPortal.name}</h2>
              <button
                onClick={() => setShowEditProjectPortalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateProjectPortal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portal Name</label>
                <input
                  type="text"
                  value={projectPortalFormData.name}
                  onChange={(e) => setProjectPortalFormData({...projectPortalFormData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={projectPortalFormData.description}
                  onChange={(e) => setProjectPortalFormData({...projectPortalFormData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Update Portal</button>
                <button
                  type="button"
                  onClick={() => setShowEditProjectPortalModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Level Modal */}
      {showAddDocumentLevelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add Document Level</h2>
            <form onSubmit={handleAddDocumentLevel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level Name *</label>
                <input
                  type="text"
                  value={documentLevelFormData.name}
                  onChange={(e) => setDocumentLevelFormData({...documentLevelFormData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={documentLevelFormData.description}
                  onChange={(e) => setDocumentLevelFormData({...documentLevelFormData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Enter level description..."
                />
              </div>
               {documentLevels.length > 0 && (
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Parent Level (Optional)</label>
                   <select
                     value={documentLevelFormData.parentId}
                     onChange={(e) => setDocumentLevelFormData({...documentLevelFormData, parentId: e.target.value})}
                     className="input-field"
                   >
                     <option value="">No Parent (Root Level)</option>
                     {documentLevels
                       .filter(l => l.level < parseInt(documentLevelFormData.level || 1) && l.id !== editingDocumentLevel?.id)
                       .map(level => (
                         <option key={level.id} value={level.id}>
                           {level.name} (Level {level.level})
                         </option>
                       ))}
                   </select>
                 </div>
               )}
              
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Create Level</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDocumentLevelModal(false)
                    setDocumentLevelFormData({
                      name: '',
                      description: '',
                      parentId: ''
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

      {/* Edit Document Level Modal */}
      {showEditDocumentLevelModal && editingDocumentLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Document Level: {editingDocumentLevel.name}</h2>
            <form onSubmit={handleUpdateDocumentLevel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level Name *</label>
                <input
                  type="text"
                  value={documentLevelFormData.name}
                  onChange={(e) => setDocumentLevelFormData({...documentLevelFormData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={documentLevelFormData.description}
                  onChange={(e) => setDocumentLevelFormData({...documentLevelFormData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Enter level description..."
                />
              </div>
              {documentLevels.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Level (Optional)</label>
                  <select
                    value={documentLevelFormData.parentId}
                    onChange={(e) => setDocumentLevelFormData({...documentLevelFormData, parentId: e.target.value})}
                    className="input-field"
                  >
                    <option value="">No Parent (Root Level)</option>
                    {documentLevels
                      .filter(l => l.id !== editingDocumentLevel?.id)
                      .map(level => (
                        <option key={level.id} value={level.id}>
                          {level.name} (Level {level.level})
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Update Level</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditDocumentLevelModal(false)
                    setEditingDocumentLevel(null)
                    setDocumentLevelFormData({
                      name: '',
                      description: '',
                      parentId: ''
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

      {/* QR Code Modal */}
      {showQRModal && qrCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <QrCode className="h-5 w-5 text-purple-600" />
    </div>
                <h2 className="text-xl font-semibold text-gray-900">QR Code</h2>
              </div>
              <button
                onClick={() => {
                  setShowQRModal(false)
                  setQrCodeData(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {qrCodeData.organizationName}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Organization Code: <span className="font-mono font-medium">{qrCodeData.code}</span>
                </p>
                <div className="flex justify-center mb-4">
                  <img 
                    src={qrCodeData.qrCodeUrl} 
                    alt="QR Code" 
                    className="border border-gray-200 rounded-lg"
                    width="200"
                    height="200"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Scan this QR code to access the organization
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    try {
                      // Fetch the QR code image as a blob
                      const response = await fetch(qrCodeData.qrCodeUrl)
                      const blob = await response.blob()
                      
                      // Create a download link
                      const url = window.URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `qr-code-${qrCodeData.organizationName}.png`
                      
                      // Trigger download
                      document.body.appendChild(link)
                      link.click()
                      
                      // Clean up
                      document.body.removeChild(link)
                      window.URL.revokeObjectURL(url)
                    } catch (error) {
                      console.error('Error downloading QR code:', error)
                      Swal.fire(
                        'Error!',
                        'Failed to download QR code. Please try again.',
                        'error'
                      )
                    }
                  }}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setShowQRModal(false)
                    setQrCodeData(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}

export default OrganizationOverview 