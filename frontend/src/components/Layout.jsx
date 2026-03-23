import Navbar from './Navbar'
import Toast from './Toast'
import { useToast } from '../hooks/useToast'
import { _registerToast } from '../utils/toast'
import '../styles/layout.css'

export default function Layout({ children, compact = false }) {
  const { toasts, addToast, removeToast } = useToast()
  _registerToast(addToast)

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
      </div>

      <div className="grid-overlay" />

      <Navbar />

      <main className="page-container" style={compact ? { paddingBottom: '100px' } : {}}>
        {children}
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}