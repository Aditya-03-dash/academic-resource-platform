import { useState, useEffect } from 'react'
import { FaTrash, FaUsers, FaBook, FaShieldAlt } from 'react-icons/fa'
import Layout from '../components/Layout'
import { toast } from '../utils/toast'
import { authService } from '../services/authService'
import { resourceService } from '../services/resourceService'
import StatsCard from '../components/StatsCard'
import '../styles/pages/admin.css'

export default function AdminPanel() {
  const [tab, setTab]           = useState('users')
  const [users, setUsers]       = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([authService.getAllUsers(), resourceService.getAll()])
      .then(([uData, rData]) => { setUsers(uData.users || []); setResources(rData.resources || []) })
      .catch(() => toast.error('Failed to load admin data.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return
    try { await authService.deleteUser(id); setUsers(prev => prev.filter(u => (u._id||u.id) !== id)); toast.success('User deleted.') }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.') }
  }

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    try { await resourceService.delete(id); setResources(prev => prev.filter(r => r._id !== id)); toast.success('Resource deleted.') }
    catch { toast.error('Delete failed.') }
  }

  const subjects = [...new Set(resources.map(r => r.subject).filter(Boolean))]

  return (
    <Layout>
      <section className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <FaShieldAlt style={{ color:'var(--gold)', fontSize:28 }} />
          <div><h1>Admin Panel</h1><p>Manage users and resources across the platform.</p></div>
        </div>
      </section>

      <div className="stats-grid">
        <StatsCard title="Total Users"     value={users.length}     icon={<FaUsers />} accent="var(--primary-light)" />
        <StatsCard title="Total Resources" value={resources.length} icon={<FaBook />}  accent="var(--gold)" />
        <StatsCard title="Subjects"        value={subjects.length}  icon={<FaBook />}  accent="var(--green-bright)" />
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab==='users'?'active':''}`} onClick={()=>setTab('users')}><FaUsers /> Users</button>
        <button className={`admin-tab ${tab==='resources'?'active':''}`} onClick={()=>setTab('resources')}><FaBook /> Resources</button>
      </div>

      {loading ? (
        <div className="loading-grid">{[0,1,2].map(i=><div key={i} className="skeleton-card"/>)}</div>
      ) : tab==='users' ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u._id||u.id}>
                  <td><div className="table-user"><div className="chat-avatar sm">{u.name?.[0]?.toUpperCase()}</div>{u.name}</div></td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{u.role!=='admin'&&<button className="icon-btn danger" onClick={()=>handleDeleteUser(u._id||u.id)}><FaTrash/></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Subject</th><th>Uploaded By</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {resources.map(r=>(
                <tr key={r._id}>
                  <td>{r.title}</td>
                  <td>{r.subject||'—'}</td>
                  <td>{r.uploadedBy?.name||'—'}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td><button className="icon-btn danger" onClick={()=>handleDeleteResource(r._id)}><FaTrash/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}