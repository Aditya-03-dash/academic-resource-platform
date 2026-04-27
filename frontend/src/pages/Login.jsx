import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { toast } from '../utils/toast'
import '../styles/form.css'
import '../styles/pages/login.css'

export default function Login() {
  const [isLogin, setIsLogin]   = useState(true)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)

  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!isLogin && password !== confirm) { toast.error('Passwords do not match.'); return }

    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        await register(name, email, password)
        toast.success('Account created! Please log in.')
        setIsLogin(true)
        setName(''); setEmail(''); setPassword(''); setConfirm('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <section className="login-page">
        <div className="form-container">
          <div className="form-brand">
            <span className="form-brand-dot" />
            LearnHive
          </div>

          <h1 className="form-title">
            {isLogin ? 'Welcome back.' : 'Join the hive.'}
          </h1>
          <p className="form-subtitle">
            {isLogin
              ? 'Sign in to access your resources and community.'
              : 'Create your account and start sharing knowledge.'}
          </p>

          <form className="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@university.edu"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="switch-form">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <span onClick={() => setIsLogin(v => !v)}>
              {isLogin ? ' Sign Up' : ' Sign In'}
            </span>
          </p>
        </div>
      </section>
    </Layout>
  )
}