import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  Upload
} from 'lucide-react'

const OrganizationOverview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [organization, setOrganization] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [showAddTeamModal, setShowAddTeamModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    leader: ''
  })
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: '',
    team: '',
    status: 'Active',
    joinDate: '',
    location: '',
    manager: ''
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

  // Mock approval requests data
  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: 1,
      userId: 15,
      userName: 'Alex Johnson',
      userEmail: 'alex.johnson@techcorp.com',
      teamId: 1,
      teamName: 'Development Team',
      department: 'IT',
      role: 'Employee',
      requestDate: '2024-01-15',
      status: 'Pending',
      reason: 'New team member joining development team'
    },
    {
      id: 2,
      userId: 16,
      userName: 'Sarah Miller',
      userEmail: 'sarah.miller@techcorp.com',
      teamId: 2,
      teamName: 'HR Team',
      department: 'HR',
      role: 'Employee',
      requestDate: '2024-01-14',
      status: 'Pending',
      reason: 'HR team expansion'
    },
    {
      id: 3,
      userId: 17,
      userName: 'Mike Davis',
      userEmail: 'mike.davis@techcorp.com',
      teamId: 1,
      teamName: 'Development Team',
      department: 'IT',
      role: 'Employee',
      requestDate: '2024-01-13',
      status: 'Approved',
      reason: 'Backend developer joining team'
    }
  ])



  // Mock data - in a real app, this would come from an API
  const mockOrganizations = [
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
       ],
       documents: [
         {
           id: 1,
           title: 'Employee Handbook',
           description: 'Complete employee handbook with policies and procedures',
           category: 'HR',
           author: 'Emily Brown',
           version: '2.1',
           status: 'Active',
           uploadDate: '2024-01-10',
           fileSize: '2.5 MB',
           downloads: 45
         },
         {
           id: 2,
           title: 'Development Guidelines',
           description: 'Coding standards and development best practices',
           category: 'Technical',
           author: 'John Doe',
           version: '1.5',
           status: 'Active',
           uploadDate: '2024-01-15',
           fileSize: '1.8 MB',
           downloads: 32
         },
         {
           id: 3,
           title: 'Project Proposal Template',
           description: 'Standard template for project proposals',
           category: 'Business',
           author: 'David Kim',
           version: '1.0',
           status: 'Active',
           uploadDate: '2024-01-08',
           fileSize: '0.8 MB',
           downloads: 28
         }
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
       ],
       documents: [
         {
           id: 4,
           title: 'Marketing Strategy 2024',
           description: 'Annual marketing strategy and campaign plans',
           category: 'Marketing',
           author: 'Sarah Wilson',
           version: '1.0',
           status: 'Active',
           uploadDate: '2024-01-12',
           fileSize: '3.2 MB',
           downloads: 18
         },
         {
           id: 5,
           title: 'Financial Report Q4 2023',
           description: 'Quarterly financial performance report',
           category: 'Finance',
           author: 'Alex Chen',
           version: '1.0',
           status: 'Active',
           uploadDate: '2024-01-05',
           fileSize: '1.5 MB',
           downloads: 25
         }
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
       ],
       documents: [
         {
           id: 6,
           title: 'Design System Guide',
           description: 'Complete design system and brand guidelines',
           category: 'Design',
           author: 'Lisa Park',
           version: '2.0',
           status: 'Active',
           uploadDate: '2024-01-18',
           fileSize: '4.1 MB',
           downloads: 15
         },
         {
           id: 7,
           title: 'Sales Process Manual',
           description: 'Standardized sales process and procedures',
           category: 'Sales',
           author: 'Mike Johnson',
           version: '1.2',
           status: 'Active',
           uploadDate: '2024-01-14',
           fileSize: '2.8 MB',
           downloads: 22
         }
       ]
    }
  ]

  useEffect(() => {
    const org = mockOrganizations.find(org => org.id === parseInt(id))
    setOrganization(org)
  }, [id])

  const handleAddTeam = (e) => {
    e.preventDefault()
    const newTeam = {
      id: Date.now(),
      ...teamFormData,
      members: []
    }
    
    setOrganization(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam]
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
      users: [...prev.users, newUser]
    }))
    
    setShowAddUserModal(false)
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Employee',
      department: '',
      team: '',
      status: 'Active',
      joinDate: '',
      location: '',
      manager: ''
    })
  }

  const handleApproval = (requestId, status) => {
    setApprovalRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status } : request
    ))
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
      documents: [...prev.documents, newDocument]
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
              <p className="text-gray-600 mt-1">{organization.industry} • Founded {organization.founded}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{organization.users.length}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Users2 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{organization.teams.length}</p>
              <p className="text-sm text-gray-500">Teams</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{organization.users.filter(u => u.status === 'Active').length}</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
                 <div className="card">
           <div className="flex items-center">
             <Building2 className="h-8 w-8 text-orange-600 mr-3" />
             <div>
               <p className="text-2xl font-bold text-gray-900">{new Set(organization.users.map(u => u.department)).size}</p>
               <p className="text-sm text-gray-500">Departments</p>
             </div>
           </div>
         </div>
         <div className="card">
           <div className="flex items-center">
             <FileText className="h-8 w-8 text-indigo-600 mr-3" />
             <div>
               <p className="text-2xl font-bold text-gray-900">{organization.documents?.length || 0}</p>
               <p className="text-sm text-gray-500">Documents</p>
             </div>
           </div>
         </div>
      </div>

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
                         <div className="space-y-6">
               <div>
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                 <div className="space-y-4">
                   <div className="flex items-center text-sm">
                     <Mail className="h-4 w-4 text-gray-400 mr-3" />
                     <span className="text-gray-900">{organization.email}</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <Phone className="h-4 w-4 text-gray-400 mr-3" />
                     <span className="text-gray-900">{organization.phone}</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                     <span className="text-gray-900">{organization.address}</span>
                   </div>
                 </div>
               </div>
               
               <div>
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                 <div className="space-y-4">
                   <div className="flex items-center text-sm">
                     <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                     <span className="text-gray-900">Industry: {organization.industry}</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                     <span className="text-gray-900">Founded: {organization.founded}</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <Users className="h-4 w-4 text-gray-400 mr-3" />
                     <span className="text-gray-900">Employees: {organization.employees}</span>
                   </div>
                   <div className="pt-2">
                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                       organization.status === 'Active' 
                         ? 'bg-green-100 text-green-800' 
                         : 'bg-red-100 text-red-800'
                     }`}>
                       Status: {organization.status}
                     </span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Teams</h2>
              <button
                onClick={() => setShowAddTeamModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organization.teams.map((team) => (
                <div key={team.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <FolderOpen className="h-6 w-6 text-primary-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-500">{team.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Leader:</span>
                      <span className="font-medium">{team.leader}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Members:</span>
                      <span className="font-medium">{team.members.length}</span>
                    </div>
                  </div>
                                     <div className="border-t border-gray-100 pt-4">
                     <h4 className="text-sm font-medium text-gray-900 mb-3">Team Members</h4>
                                           <div className="space-y-2">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700">{member.name}</span>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            const newRequest = {
                              id: Date.now(),
                              userId: Date.now() + 1,
                              userName: 'New User',
                              userEmail: 'newuser@example.com',
                              teamId: team.id,
                              teamName: team.name,
                              department: 'IT',
                              role: 'Employee',
                              requestDate: new Date().toISOString().split('T')[0],
                              status: 'Pending',
                              reason: `Requesting to join ${team.name}`
                            }
                            setApprovalRequests(prev => [...prev, newRequest])
                          }}
                          className="w-full btn-secondary flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Request to Join Team
                        </button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Users</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organization.users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.team || 'No Team'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
               {organization.documents?.map((document) => (
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
             
             {(!organization.documents || organization.documents.length === 0) && (
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
                     {organization.users.filter(u => u.status === 'Active').map(user => (
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
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold">Team Join Requests</h2>
               <div className="flex space-x-2">
                 <span className="text-sm text-gray-500">
                   {approvalRequests.filter(r => r.status === 'Pending').length} pending
                 </span>
               </div>
             </div>
             
             <div className="space-y-4">
               {approvalRequests.map((request) => (
                 <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center">
                       <User className="h-8 w-8 text-primary-600 mr-3" />
                       <div>
                         <h3 className="text-lg font-semibold text-gray-900">{request.userName}</h3>
                         <p className="text-sm text-gray-500">{request.userEmail}</p>
                         <p className="text-sm text-gray-500">{request.department} • {request.role}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                         request.status === 'Pending' 
                           ? 'bg-yellow-100 text-yellow-800' 
                           : request.status === 'Approved'
                           ? 'bg-green-100 text-green-800'
                           : 'bg-red-100 text-red-800'
                       }`}>
                         {request.status}
                       </span>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                       <h4 className="text-sm font-medium text-gray-900 mb-2">Requesting to Join</h4>
                       <div className="flex items-center">
                         <Users2 className="h-4 w-4 text-green-600 mr-2" />
                         <span className="text-sm text-gray-700">{request.teamName}</span>
                       </div>
                     </div>
                     <div>
                       <h4 className="text-sm font-medium text-gray-900 mb-2">Request Date</h4>
                       <span className="text-sm text-gray-700">{new Date(request.requestDate).toLocaleDateString()}</span>
                     </div>
                   </div>
                   
                   <div className="mb-4">
                     <h4 className="text-sm font-medium text-gray-900 mb-2">Reason</h4>
                     <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.reason}</p>
                   </div>
                   
                   {request.status === 'Pending' && (
                     <div className="flex space-x-3 pt-4 border-t border-gray-100">
                       <button
                         onClick={() => handleApproval(request.id, 'Approved')}
                         className="btn-primary flex items-center"
                       >
                         <Eye className="h-4 w-4 mr-2" />
                         Approve
                       </button>
                       <button
                         onClick={() => handleApproval(request.id, 'Rejected')}
                         className="btn-secondary flex items-center"
                       >
                         <X className="h-4 w-4 mr-2" />
                         Reject
                       </button>
                     </div>
                   )}
                   
                   {request.status !== 'Pending' && (
                     <div className="pt-4 border-t border-gray-100">
                       <p className="text-sm text-gray-500">
                         {request.status === 'Approved' ? '✅ Request approved' : '❌ Request rejected'}
                       </p>
                     </div>
                   )}
                 </div>
               ))}
               
               {approvalRequests.length === 0 && (
                 <div className="text-center py-12">
                   <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-500">No approval requests found.</p>
                   <p className="text-sm text-gray-400 mt-2">Team join requests will appear here.</p>
                 </div>
               )}
             </div>
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
                  {organization.users.filter(u => u.status === 'Active').map(user => (
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
                    {organization.teams.map(team => (
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
    </div>
  )
}

export default OrganizationOverview 