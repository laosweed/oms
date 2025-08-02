import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  Download,
  Eye,
  Folder,
  Calendar,
  User,
  Building2,
  Filter,
  Upload,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Star,
  Share2
} from 'lucide-react'

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Q4 Financial Report.pdf',
      type: 'pdf',
      size: '2.5 MB',
      organization: 'TechCorp Solutions',
      uploadedBy: 'John Doe',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-15',
      category: 'Financial',
      tags: ['report', 'finance', 'quarterly'],
      description: 'Fourth quarter financial performance report',
      status: 'Active',
      version: '1.0',
      isStarred: true
    },
    {
      id: 2,
      name: 'Marketing Strategy 2024.docx',
      type: 'docx',
      size: '1.8 MB',
      organization: 'Global Innovations Ltd',
      uploadedBy: 'Sarah Wilson',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-12',
      category: 'Marketing',
      tags: ['strategy', 'marketing', '2024'],
      description: 'Comprehensive marketing strategy for 2024',
      status: 'Active',
      version: '2.1',
      isStarred: false
    },
    {
      id: 3,
      name: 'Company Logo.png',
      type: 'png',
      size: '450 KB',
      organization: 'Creative Studios',
      uploadedBy: 'Mike Johnson',
      uploadDate: '2024-01-08',
      lastModified: '2024-01-08',
      category: 'Design',
      tags: ['logo', 'branding', 'design'],
      description: 'Official company logo in high resolution',
      status: 'Active',
      version: '1.0',
      isStarred: true
    },
    {
      id: 4,
      name: 'Employee Handbook.pdf',
      type: 'pdf',
      size: '3.2 MB',
      organization: 'TechCorp Solutions',
      uploadedBy: 'Emily Brown',
      uploadDate: '2024-01-05',
      lastModified: '2024-01-14',
      category: 'HR',
      tags: ['handbook', 'hr', 'policies'],
      description: 'Updated employee handbook with new policies',
      status: 'Active',
      version: '3.0',
      isStarred: false
    },
    {
      id: 5,
      name: 'Project Timeline.xlsx',
      type: 'xlsx',
      size: '890 KB',
      organization: 'Global Innovations Ltd',
      uploadedBy: 'Alex Chen',
      uploadDate: '2024-01-12',
      lastModified: '2024-01-13',
      category: 'Project',
      tags: ['timeline', 'project', 'planning'],
      description: 'Detailed project timeline and milestones',
      status: 'Active',
      version: '1.2',
      isStarred: false
    },
    {
      id: 6,
      name: 'Product Demo.mp4',
      type: 'mp4',
      size: '15.7 MB',
      organization: 'Creative Studios',
      uploadedBy: 'Lisa Park',
      uploadDate: '2024-01-14',
      lastModified: '2024-01-14',
      category: 'Media',
      tags: ['demo', 'product', 'video'],
      description: 'Product demonstration video for clients',
      status: 'Active',
      version: '1.0',
      isStarred: true
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    organization: '',
    status: 'Active'
  })

  const categories = ['All', 'Financial', 'Marketing', 'Design', 'HR', 'Project', 'Media', 'Legal', 'Technical']
  const organizations = ['TechCorp Solutions', 'Global Innovations Ltd', 'Creative Studios']

  const filteredDocuments = documents.filter(doc =>
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (categoryFilter === 'All' || doc.category === categoryFilter)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDoc) {
      setDocuments(docs => docs.map(doc => 
        doc.id === editingDoc.id ? { ...doc, ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) } : doc
      ))
    }
    setShowModal(false)
    setEditingDoc(null)
    setFormData({
      name: '',
      description: '',
      category: '',
      tags: '',
      organization: '',
      status: 'Active'
    })
  }

  const handleEdit = (doc) => {
    setEditingDoc(doc)
    setFormData({
      name: doc.name,
      description: doc.description,
      category: doc.category,
      tags: doc.tags.join(', '),
      organization: doc.organization,
      status: doc.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(docs => docs.filter(doc => doc.id !== id))
    }
  }

  const handleStar = (id) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === id ? { ...doc, isStarred: !doc.isStarred } : doc
    ))
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <FileImage className="h-6 w-6 text-purple-500" />
      case 'mp4':
      case 'avi':
        return <FileVideo className="h-6 w-6 text-orange-500" />
      case 'mp3':
      case 'wav':
        return <FileAudio className="h-6 w-6 text-pink-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (size) => {
    return size
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
        <p className="text-gray-600 mt-2">Organize, search, and manage your documents</p>
      </div>

      {/* Header with Search, Filter, View Toggle and Upload Button */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search documents..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field pl-10"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current rounded-sm h-1"></div>
                <div className="bg-current rounded-sm h-1"></div>
                <div className="bg-current rounded-sm h-1"></div>
              </div>
            </button>
          </div>
          <button className="btn-primary flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getFileIcon(doc.type)}
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate max-w-32">{doc.name}</h3>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStar(doc.id)}
                    className={`p-1 rounded ${doc.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star className="h-4 w-4" fill={doc.isStarred ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    {doc.organization}
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {doc.uploadedBy}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    v{doc.version}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  doc.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {doc.status}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {doc.category}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {doc.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{doc.tags.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(doc.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(doc.size)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStar(doc.id)}
                          className={`${doc.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        >
                          <Star className="h-4 w-4" fill={doc.isStarred ? 'currentColor' : 'none'} />
                        </button>
                        <button className="text-gray-400 hover:text-green-600">
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="report, finance, quarterly"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <select
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
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
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingDoc(null)
                    setFormData({
                      name: '',
                      description: '',
                      category: '',
                      tags: '',
                      organization: '',
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
    </div>
  )
}

export default DocumentManagement 