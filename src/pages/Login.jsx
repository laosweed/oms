import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Lock, Phone, Building2, Shield, Zap, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = () => {
  const [identified, setIdentified] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [isValidPin, setIsValidPin] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // Validate phone number format
  useEffect(() => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    const cleanedPhone = identified.replace(/\s/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '')
    setIsValidPhone(cleanedPhone.length >= 10 && phoneRegex.test(cleanedPhone))
  }, [identified])

  // Validate PIN format
  useEffect(() => {
    setIsValidPin(pin.length >= 4 && /^\d+$/.test(pin))
  }, [pin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(identified, pin)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handlePhoneChange = (e) => {
    setIdentified(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent"></div>
      
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center">
          <img src="/aidc_logo.png" alt="Super Work Logo" className="h-24 w-auto mx-auto" />
          <h1 className="mt-8 text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
            Super Work
          </h1>
          
          <p className="mt-4 text-gray-600 text-base leading-relaxed">
            Secure access to your organization dashboard
          </p>
          
          {/* Status indicator */}

        </div>
        
        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-200/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Phone Number Field */}
              <div className="space-y-2">
                <label htmlFor="identified" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  Phone Number
                  {isValidPhone && (
                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                  )}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    id="identified"
                    name="identified"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={identified}
                    onChange={handlePhoneChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-4 py-4 bg-white/50 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                      focusedField === 'phone' 
                        ? 'border-blue-500 focus:ring-blue-500/50' 
                        : isValidPhone 
                          ? 'border-green-500/50' 
                          : 'border-gray-300'
                    }`}
                    placeholder="+8562079991636"
                  />
                  {isValidPhone && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* PIN Field */}
              <div className="space-y-2">
                <label htmlFor="pin" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-600" />
                  PIN Code
                  {isValidPin && (
                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                  )}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === 'pin' ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="pin"
                    name="pin"
                    type={showPin ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onFocus={() => setFocusedField('pin')}
                    onBlur={() => setFocusedField('')}
                    maxLength={6}
                    className={`w-full pl-12 pr-12 py-4 bg-white/50 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                      focusedField === 'pin' 
                        ? 'border-blue-500 focus:ring-blue-500/50' 
                        : isValidPin 
                          ? 'border-green-500/50' 
                          : 'border-gray-300'
                    }`}
                    placeholder="Enter your 6-digit PIN"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                    )}
                  </button>
                  {isValidPin && (
                    <div className="absolute inset-y-0 right-12 flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isValidPhone || !isValidPin}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:transform-none"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                {loading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <Zap className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                )}
              </span>
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              <span className="absolute right-0 inset-y-0 flex items-center pr-4">
                <Sparkles className="h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
              </span>
            </button>


          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="text-center group">
            <div className="h-12 w-12 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-700 font-medium">Secure</p>
            <p className="text-xs text-gray-500 mt-1">End-to-end encryption</p>
          </div>
          <div className="text-center group">
            <div className="h-12 w-12 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-700 font-medium">Organized</p>
            <p className="text-xs text-gray-500 mt-1">Smart management</p>
          </div>
          <div className="text-center group">
            <div className="h-12 w-12 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-700 font-medium">Fast</p>
            <p className="text-xs text-gray-500 mt-1">Lightning quick</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2024 Office Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 