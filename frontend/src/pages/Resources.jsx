import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import Layout from '../components/Layout'
import ResourceCard from '../components/ResourceCard'
import SearchBar from '../components/SearchBar'
import { resourceService } from '../services/resourceService'
import { toast } from '../utils/toast'
import '../styles/pages/resources.css'

export default function Resources() {
  const [resources, setResources]     = useState([])
  const [allResources, setAllResources] = useState([])
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(true)
  const [subject, setSubject]         = useState('All')

  const debouncedSearch = useDebounce(search, 400)

  // Load all resources once
  useEffect(() => {
    resourceService.getAll()
      .then(data => {
        setAllResources(data.resources || [])
        setResources(data.resources || [])
      })
      .catch(() => toast.error('Failed to load resources.'))
      .finally(() => setLoading(false))
  }, [])

  // Search via backend when debounced value changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResources(allResources)
      return
    }
    resourceService.search(debouncedSearch)
      .then(data => setResources(data.resources || []))
      .catch(() => toast.error('Search failed.'))
  }, [debouncedSearch, allResources])

  // Client-side subject filter on top of search results
  const subjects = ['All', ...new Set(allResources.map(r => r.subject).filter(Boolean))]

  const displayed = subject === 'All'
    ? resources
    : resources.filter(r => r.subject === subject)

  const handleDelete = (id) => {
    setResources(prev => prev.filter(r => r._id !== id))
    setAllResources(prev => prev.filter(r => r._id !== id))
  }

  return (
    <Layout>

      <section className="page-header">
        <h1>All Resources</h1>
        <p>Browse academic materials shared by students.</p>
      </section>

      <SearchBar
        search={search}
        setSearch={setSearch}
        suggestions={allResources.filter(r =>
          r.title.toLowerCase().includes(search.toLowerCase())
        )}
      />

      {/* Subject filter pills */}
      <div className="filter-pills">
        {subjects.map(s => (
          <button
            key={s}
            className={`filter-pill ${subject === s ? 'active' : ''}`}
            onClick={() => setSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-grid">
          {[0, 1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="resource-grid">
          {displayed.length > 0
            ? displayed.map(r => (
                <ResourceCard key={r._id} resource={r} onDelete={handleDelete} />
              ))
            : <p className="no-results">No resources found for "{search}"</p>
          }
        </div>
      )}

    </Layout>
  )
}