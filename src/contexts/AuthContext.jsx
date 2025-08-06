import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (identified, pin) => {
    try {
      const response = await fetch('http://10.0.100.19:9904/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identified: identified,
          pin: pin
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Handle the nested API response structure
        const result = data.result
        if (result && result.serviceResult.code === 200) {
          const userData = result.data.user
          const tokenData = result.data.token
          
          const userInfo = {
            id: userData.id,
            identified: userData.identified,
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role,
            token: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            avatarURL: userData.avatarURL,
            isEnabled: userData.isEnabled,
            gender: userData.gender,
            firstName: userData.firstName,
            lastName: userData.lastName,
            dob: userData.dob,
            position: userData.position,
            team: userData.team,
            joinOrganization: userData.joinOrganization,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            // Extract organization details from joinOrganization
            organizationId: userData.joinOrganization?.organization?.id || null,
            organizationCode: userData.joinOrganization?.organization?.code || null,
            organizationName: userData.joinOrganization?.organization?.name || null,
            organizationEmail: userData.joinOrganization?.organization?.email || null,
            organizationPhone: userData.joinOrganization?.organization?.phone || null,
            organizationDescription: userData.joinOrganization?.organization?.description || null,
            statusJoinedOrganization: userData.statusJoinedOrganization
          }
          
          setUser(userInfo)
          localStorage.setItem('user', JSON.stringify(userInfo))
          
          return { success: true }
        } else {
          return { success: false, error: result?.serviceResult?.message || 'Login failed' }
        }
      } else {
        return { success: false, error: data.message || data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please check your connection.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const refreshToken = async () => {
    if (!user?.refreshToken) return false
    
    try {
      const response = await fetch('http://10.0.100.19:9904/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: user.refreshToken
        })
      })

      const data = await response.json()
      
      if (response.ok && data.result?.serviceResult?.code === 200) {
        const tokenData = data.result.data.token
        const updatedUser = { ...user, token: tokenData.accessToken, refreshToken: tokenData.refreshToken }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  const fetchUserOrganization = async () => {
    if (!user?.token) return null
    
    try {
      const response = await fetch('http://10.0.100.19:9904/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (response.ok && data.result?.serviceResult?.code === 200) {
        const userData = data.result.data.user
        const updatedUser = {
          ...user,
          // Extract organization details from joinOrganization
          organizationId: userData.joinOrganization?.organization?.id || null,
          organizationCode: userData.joinOrganization?.organization?.code || null,
          organizationName: userData.joinOrganization?.organization?.name || null,
          organizationEmail: userData.joinOrganization?.organization?.email || null,
          organizationPhone: userData.joinOrganization?.organization?.phone || null,
          organizationDescription: userData.joinOrganization?.organization?.description || null
        }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return updatedUser
      }
      return null
    } catch (error) {
      console.error('Error fetching user organization:', error)
      return null
    }
  }

  const value = {
    user,
    login,
    logout,
    refreshToken,
    fetchUserOrganization,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 