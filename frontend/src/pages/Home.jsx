import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaBookOpen, FaUsers, FaUpload } from 'react-icons/fa'
import Layout from '../components/Layout'
import ResourceCard from '../components/ResourceCard'
import { resourceService } from '../services/resourceService'
import { useAuth } from '../contexts/AuthContext'
import '../styles/pages/home.css'

export default function Home() {
  const [resources, setResources] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    resourceService.getAll()
      .then(data => setResources(data.resources?.slice(0, 3) || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }, [])

  const { isAuthenticated } = useAuth()

  const features = [
    { icon: <FaBookOpen />, title: 'Curated Notes',  desc: 'Quality materials vetted by your peers, not algorithms.' },
    { icon: <FaUsers />,    title: 'Peer Community', desc: 'Connect directly with classmates across every subject.' },
    { icon: <FaUpload />,   title: 'Instant Upload', desc: 'Share PDFs and docs in seconds. No friction.' },
  ]

  return (
    <Layout>
      <section className="home-hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          LearnHive
        </div>
        <h1 className="hero-title">
          Study smarter.<br />
          <span className="hero-accent">Together.</span>
        </h1>
        <p className="hero-subtitle">
          LearnHive is where students share notes, guides, and study
          materials so nobody has to figure it all out alone.
        </p>
        <div className="hero-cta">
          <Link to="/resources" className="btn-primary">
            Browse Resources <FaArrowRight />
          </Link>
          <Link to={isAuthenticated ? '/upload' : '/login'} className="btn-ghost">
            Start sharing
          </Link>
        </div>
        <div className="hero-line" />
      </section>

      <section className="features-strip">
        {features.map((f, i) => (
          <div key={i} className="feature-item">
            <div className="feature-icon">{f.icon}</div>
            <div><h4>{f.title}</h4><p>{f.desc}</p></div>
          </div>
        ))}
      </section>

      <section>
        <div className="section-header">
          <h2>Latest Resources</h2>
          <Link to="/resources" className="see-all">Browse all <FaArrowRight /></Link>
        </div>
        {loading ? (
          <div className="loading-grid">{[0,1,2].map(i => <div key={i} className="skeleton-card" />)}</div>
        ) : (
          <div className="resource-grid">
            {resources.length > 0
              ? resources.map(r => <ResourceCard key={r._id} resource={r} />)
              : <p className="empty-state">No resources yet. <Link to="/upload">Be the first to upload!</Link></p>
            }
          </div>
        )}
      </section>
    </Layout>
  )
}