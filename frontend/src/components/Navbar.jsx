import { Link, useLocation } from 'react-router-dom'
import { FaBook, FaUpload, FaUser, FaHome, FaCommentDots, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import '../styles/navbar.css'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { pathname } = useLocation()

  const baseItems = [
    { icon: <FaHome />,   label: 'Home',      path: '/' },
    { icon: <FaBook />,   label: 'Resources', path: '/resources' },
    { icon: <FaUpload />, label: 'Upload',    path: '/upload' },
  ]

  const authItems = isAuthenticated
    ? [
        { icon: <FaCommentDots />, label: 'Chat',      path: '/chat' },
        { icon: <FaUser />,        label: 'Dashboard', path: '/dashboard' },
        ...(isAdmin ? [{ icon: <FaShieldAlt />, label: 'Admin', path: '/admin' }] : []),
      ]
    : [{ icon: <FaUser />, label: 'Login', path: '/login' }]

  const navItems = [...baseItems, ...authItems]

  return (
    <nav className="dock-navbar">
      <Link to="/" className="dock-logo">LearnHive</Link>

      <ul className="dock-menu">
        {navItems.map((item, i) => (
          <li key={i} className={`dock-item ${pathname === item.path ? 'active' : ''}`}>
            <Link to={item.path}>
              <div className="dock-icon">{item.icon}</div>
              <span className="dock-label">{item.label}</span>
            </Link>
          </li>
        ))}

        {isAuthenticated && (
          <li className="dock-item">
            <button className="dock-logout-btn" onClick={logout} title="Logout">
              <div className="dock-icon"><FaSignOutAlt /></div>
              <span className="dock-label">Logout</span>
            </button>
          </li>
        )}
      </ul>

      {isAuthenticated && (
        <div className="dock-user">
          <span className="dock-avatar">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
      )}
    </nav>
  )
}