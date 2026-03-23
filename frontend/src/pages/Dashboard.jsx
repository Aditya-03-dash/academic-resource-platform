import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUpload, FaBook, FaLayerGroup } from 'react-icons/fa'
import Layout from '../components/Layout'
import { toast } from '../utils/toast'
import ResourceCard from '../components/ResourceCard'
import StatsCard from '../components/StatsCard'
import { resourceService } from '../services/resourceService'
import { useAuth } from '../contexts/AuthContext'
import '../styles/pages/dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading]     = useState(true)

  const fetchMine = () => {
    setLoading(true)
    resourceService.getMine()
      .then(data => setResources(data.resources || []))
      .catch(() => toast.error('Failed to load your resources.'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchMine, [])

  const subjects = [...new Set(resources.map(r => r.subject).filter(Boolean))]

  return (
    <Layout>
      <section className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <strong style={{ color: 'var(--primary-light)' }}>{user?.name}</strong>.</p>
      </section>

      <div className="stats-grid">
        <StatsCard title="Your Uploads"    value={resources.length} icon={<FaBook />}       accent="var(--primary-light)" />
        <StatsCard title="Subjects"        value={subjects.length}  icon={<FaLayerGroup />} accent="var(--gold)" />
        <StatsCard title="Account"         value={user?.role === 'admin' ? 'Admin' : 'Student'} icon={<FaUpload />} accent="var(--green-bright)" />
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Your Uploads</h2>
          <Link to="/upload" className="btn-primary btn-sm">
            <FaUpload /> Upload New
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">{[0,1].map(i => <div key={i} className="skeleton-card" />)}</div>
        ) : resources.length > 0 ? (
          <div className="resource-grid">
            {resources.map(r => (
              <ResourceCard key={r._id} resource={r} onDelete={id => setResources(prev => prev.filter(x => x._id !== id))} />
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <FaBook size={28} style={{ color: 'var(--primary-light)', opacity: 0.6 }} />
            <p>You haven't uploaded anything yet.</p>
            <Link to="/upload" className="btn-primary">Upload your first resource</Link>
          </div>
        )}
      </section>
    </Layout>
  )
}