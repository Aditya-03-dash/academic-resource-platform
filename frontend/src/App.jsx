import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Home            from './pages/Home'
import Login           from './pages/Login'
import Resources       from './pages/Resources'
import ResourceDetail  from './pages/ResourceDetail'
import Dashboard       from './pages/Dashboard'
import UploadResource  from './pages/UploadResource'
import Chat            from './pages/Chat'
import AdminPanel      from './pages/AdminPanel'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/resources"     element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>

          <Route path="/upload" element={
            <ProtectedRoute><UploadResource /></ProtectedRoute>
          }/>

          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          }/>

          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}