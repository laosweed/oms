import React from 'react'
import { 
  Building2, 
  Users, 
  FolderOpen, 
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Organizations',
      value: '12',
      icon: Building2,
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      name: 'Active Users',
      value: '156',
      icon: Users,
      change: '+12.3%',
      changeType: 'positive'
    },
    {
      name: 'Active Projects',
      value: '34',
      icon: FolderOpen,
      change: '+8.1%',
      changeType: 'positive'
    },
    {
      name: 'Documents',
      value: '1,247',
      icon: FileText,
      change: '+15.2%',
      changeType: 'positive'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'project',
      title: 'New project "Website Redesign" created',
      time: '2 hours ago',
      user: 'John Doe'
    },
    {
      id: 2,
      type: 'user',
      title: 'New user "Sarah Wilson" joined',
      time: '4 hours ago',
      user: 'Admin'
    },
    {
      id: 3,
      type: 'document',
      title: 'Document "Q4 Report" uploaded',
      time: '6 hours ago',
      user: 'Mike Johnson'
    },
    {
      id: 4,
      type: 'organization',
      title: 'Organization "TechCorp" updated',
      time: '1 day ago',
      user: 'Admin'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return <FolderOpen className="h-4 w-4 text-blue-500" />
      case 'user':
        return <Users className="h-4 w-4 text-green-500" />
      case 'document':
        return <FileText className="h-4 w-4 text-purple-500" />
      case 'organization':
        return <Building2 className="h-4 w-4 text-orange-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your office management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">by {activity.user}</p>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 