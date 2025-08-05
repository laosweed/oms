import { useAuth } from '../contexts/AuthContext'

export const createApiClient = (authContext) => {
  const makeRequest = async (url, options = {}) => {
    const { user, refreshToken } = authContext
    
    // Add authorization header if user is logged in
    if (user?.token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${user.token}`
      }
    }

    try {
      const response = await fetch(url, options)
      
      // If token is expired (401), try to refresh
      if (response.status === 401 && user?.refreshToken) {
        const refreshSuccess = await refreshToken()
        if (refreshSuccess) {
          // Retry the original request with new token
          const newUser = JSON.parse(localStorage.getItem('user'))
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newUser.token}`
          }
          return await fetch(url, options)
        }
      }
      
      return response
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  return {
    get: (url) => makeRequest(url, { method: 'GET' }),
    post: (url, data) => makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }),
    put: (url, data) => makeRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }),
    delete: (url) => makeRequest(url, { method: 'DELETE' })
  }
}

// Hook to use API client
export const useApi = () => {
  const auth = useAuth()
  return createApiClient(auth)
} 