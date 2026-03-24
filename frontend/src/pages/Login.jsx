import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

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
                <label>Full Name</label>
                <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
              </div>
            )}
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} required />
            </div>
            {!isLogin && (
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required />
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