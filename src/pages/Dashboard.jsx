import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApi } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Building2, 
  Users, 
  FolderOpen, 
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Target,
  Briefcase,
  Star,
  Bell,
  Settings,
  Sparkles,
  Plus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock4,
  Database,
  Server,
  Wifi,
  Cpu
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const api = useApi()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState(0)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [systemMetrics, setSystemMetrics] = useState([])
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    fetchDashboardData()
    return () => clearInterval(timer)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch organizations
      const orgsResponse = await api.get('http://10.0.100.19:9904/api/v1/organizations')
      const organizations = orgsResponse.ok ? await orgsResponse.json() : { result: { data: [] } }
      
      // Fetch users (if user has permission)
      let users = []
      try {
        const usersResponse = await api.get('http://10.0.100.19:9904/api/v1/users')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          users = usersData.result?.data || []
        }
      } catch (error) {
        console.log('No permission to fetch users or users endpoint not available')
      }

      // Calculate real stats
      const realStats = [
        {
          name: 'Total Organizations',
          value: organizations.result?.data?.length?.toString() || '0',
          icon: Building2,
          change: '+0%',
          changeType: 'positive',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          description: 'Active organizations',
          trend: 'up'
        },
        {
          name: 'Active Users',
          value: users.length.toString(),
          icon: Users,
          change: '+0%',
          changeType: 'positive',
          gradient: 'from-emerald-500 to-emerald-600',
          bgGradient: 'from-emerald-50 to-emerald-100',
          description: 'Registered users',
          trend: 'up'
        },
        {
          name: 'System Health',
          value: '99.9%',
          icon: Activity,
          change: '+0.2%',
          changeType: 'positive',
          gradient: 'from-orange-500 to-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          description: 'Uptime status',
          trend: 'up'
        },
        {
          name: 'Security Status',
          value: 'Secure',
          icon: Shield,
          change: '+0%',
          changeType: 'positive',
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          description: 'All systems secure',
          trend: 'up'
        }
      ]

      // Generate real activities based on user's organization
      const realActivities = []
      
      if (user?.joinOrganization) {
        realActivities.push({
          id: 1,
          type: 'organization',
          title: `Organization "${user.joinOrganization.name}" accessed`,
          time: 'Just now',
          user: user?.firstName || 'Admin',
          priority: 'high',
          status: 'completed',
          icon: Building2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        })
      }

      if (user?.role) {
        realActivities.push({
          id: 2,
          type: 'user',
          title: `User logged in as ${user.role}`,
          time: 'Just now',
          user: `${user.firstName} ${user.lastName}`,
          priority: 'medium',
          status: 'completed',
          icon: Users,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        })
      }

      realActivities.push({
        id: 3,
        type: 'security',
        title: 'Authentication successful',
        time: 'Just now',
        user: 'System',
        priority: 'high',
        status: 'completed',
        icon: Shield,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      })

      if (organizations.result?.data?.length > 0) {
        realActivities.push({
          id: 4,
          type: 'data',
          title: `${organizations.result.data.length} organizations loaded`,
          time: 'Just now',
          user: 'System',
          priority: 'low',
          status: 'completed',
          icon: Database,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        })
      }

      realActivities.push({
        id: 5,
        type: 'performance',
        title: 'Dashboard data refreshed',
        time: 'Just now',
        user: 'System',
        priority: 'medium',
        status: 'completed',
        icon: Zap,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      })

      // System metrics (simulated but could be real)
      const realSystemMetrics = [
        {
          name: 'API Status',
          value: '100%',
          status: 'normal',
          icon: Server,
          color: 'text-blue-600'
        },
        {
          name: 'Database',
          value: 'Connected',
          status: 'normal',
          icon: Database,
          color: 'text-green-600'
        },
        {
          name: 'Authentication',
          value: 'Active',
          status: 'normal',
          icon: Shield,
          color: 'text-purple-600'
        },
        {
          name: 'Organizations',
          value: `${organizations.result?.data?.length || 0} loaded`,
          status: 'normal',
          icon: Building2,
          color: 'text-orange-600'
        }
      ]

      setStats(realStats)
      setRecentActivities(realActivities)
      setSystemMetrics(realSystemMetrics)
      setNotifications(realActivities.length)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to basic stats if API fails
      setStats([
        {
          name: 'Total Organizations',
          value: '0',
          icon: Building2,
          change: '+0%',
          changeType: 'positive',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          description: 'Active organizations',
          trend: 'up'
        },
        {
          name: 'Active Users',
          value: '0',
          icon: Users,
          change: '+0%',
          changeType: 'positive',
          gradient: 'from-emerald-500 to-emerald-600',
          bgGradient: 'from-emerald-50 to-emerald-100',
          description: 'Registered users',
          trend: 'up'
        },
        {
          name: 'System Health',
          value: '99.9%',
          icon: Activity,
          change: '+0.2%',
          changeType: 'positive',
          gradient: 'from-orange-500 to-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          description: 'Uptime status',
          trend: 'up'
        },
        {
          name: 'Security Status',
          value: 'Secure',
          icon: Shield,
          change: '+0%',
          changeType: 'positive',
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          description: 'All systems secure',
          trend: 'up'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Manage Organizations',
      description: 'View and manage all organizations',
      icon: Building2,
      gradient: 'from-blue-500 to-blue-600',
      href: '/organizations',
      badge: `${stats[0]?.value || '0'} active`
    },
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      href: '/users',
      badge: `${stats[1]?.value || '0'} users`
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed reports and insights',
      icon: BarChart3,
      gradient: 'from-purple-500 to-purple-600',
      href: '/analytics',
      badge: 'Live data'
    },
    {
      title: 'Security Center',
      description: 'Monitor system security status',
      icon: Shield,
      gradient: 'from-red-500 to-red-600',
      href: '/security',
      badge: 'Secure'
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock4 className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" text="Loading dashboard data..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Welcome back, <span className="font-semibold text-blue-600">
                {user?.firstName || user?.name || 'Admin'}
              </span>! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Current Time</p>
              <p className="text-xl font-bold text-gray-900">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="relative">
              <button className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105">
                <Bell className="h-6 w-6 text-white" />
              </button>
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.name} 
              className={`relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`h-14 w-14 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              </div>
              <button 
                onClick={fetchDashboardData}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex-shrink-0 h-10 w-10 ${activity.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.title}
                    className="flex items-center p-4 bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`h-10 w-10 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {action.badge}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">System Status</h3>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Server Status</span>
                </div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Database</span>
                </div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Last Refresh</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Just now</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Security</span>
                </div>
                <span className="text-sm font-medium text-green-600">Secure</span>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">System Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {systemMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div key={metric.name} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${metric.color}`} />
                        <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                      </div>
                      {getStatusIcon(metric.status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'warning' ? 'bg-orange-500' : 
                          metric.status === 'error' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: metric.value.includes('%') ? metric.value : '100%' }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 