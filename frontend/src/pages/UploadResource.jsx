import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUpload, FaFilePdf, FaFileWord, FaCheckCircle } from 'react-icons/fa'
import Layout from '../components/Layout'
import { toast } from '../utils/toast'
import { resourceService } from '../services/resourceService'
import '../styles/form.css'
import '../styles/pages/upload.css'

const ALLOWED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export default function UploadResource() {
  const navigate = useNavigate()

  const [title, setTitle]         = useState('')
  const [subject, setSubject]     = useState('')
  const [description, setDesc]    = useState('')
  const [file, setFile]           = useState(null)
  const [fileName, setFileName]   = useState('Drop file here or click to browse')
  const [progress, setProgress]   = useState(0)
  const [uploading, setUploading] = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState('')

  const handleFile = (f) => {
    setError('')
    if (!ALLOWED.includes(f.type)) {
      setError('Only PDF or DOC/DOCX files are allowed.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB.')
      return
    }
    setFile(f)
    setFileName(f.name)
  }

  const handleDrop  = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }
  const handleDragOver = (e) => e.preventDefault()
  const handleChange   = (e) => { const f = e.target.files[0]; if (f) handleFile(f) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file)    return setError('Please select a file.')
    if (!title.trim()) return setError('Title is required.')

    setUploading(true)
    setProgress(0)

    // Simulate progress while real upload runs
    const iv = setInterval(() => {
      setProgress(p => p < 85 ? p + 8 : p)
    }, 150)

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('title', title)
      form.append('subject', subject)
      form.append('description', description)

      await resourceService.create(form)

      clearInterval(iv)
      setProgress(100)
      setDone(true)
      toast.success('Resource uploaded successfully!')
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err) {
      clearInterval(iv)
      setProgress(0)
      setError(err.response?.data?.message || 'Upload failed.')
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const fileIcon = file?.type === 'application/pdf' ? <FaFilePdf /> : <FaFileWord />

  return (
    <Layout>
      <section className="upload-page">
        <div className="form-container">

          <div className="form-brand">
            <span className="form-brand-dot" style={{ background: '#10b981' }} />
            Upload Resource
          </div>

          <h1 className="form-title">Share a Resource</h1>
          <p className="form-subtitle">Help your peers by uploading study materials.</p>

          {done ? (
            <div className="upload-success">
              <FaCheckCircle size={48} style={{ color: '#10b981' }} />
              <p>Upload complete! Redirecting…</p>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Resource Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures Final Notes"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Engineering"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  placeholder="Brief description of the resource…"
                  value={description}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <label
                className="file-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {file
                  ? <>{fileIcon} <span className="file-name">{fileName}</span></>
                  : <><FaUpload className="upload-icon" /> <span className="file-name">{fileName}</span></>
                }
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
              </label>

              {error && <p className="upload-error">{error}</p>}

              {progress > 0 && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                  <span className="progress-label">{progress}%</span>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading
                  ? <><span className="btn-spinner" /> Uploading…</>
                  : <><FaUpload /> Upload Resource</>
                }
              </button>

            </form>
          )}

        </div>
      </section>
    </Layout>
  )
}