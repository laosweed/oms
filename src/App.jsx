import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import OrganizationManagement from './pages/OrganizationManagement'
import OrganizationOverview from './pages/OrganizationOverview'
import UserManagement from './pages/UserManagement'
import ProjectManagement from './pages/ProjectManagement'
import DocumentManagement from './pages/DocumentManagement'

function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App 