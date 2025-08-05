import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OrganizationManagement from './pages/OrganizationManagement'
import OrganizationOverview from './pages/OrganizationOverview'
import UserManagement from './pages/UserManagement'
import ProjectManagement from './pages/ProjectManagement'
import DocumentManagement from './pages/DocumentManagement'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/organizations" element={<OrganizationManagement />} />
                    <Route path="/organizations/:id" element={<OrganizationOverview />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/projects" element={<ProjectManagement />} />
                    <Route path="/documents" element={<DocumentManagement />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App 