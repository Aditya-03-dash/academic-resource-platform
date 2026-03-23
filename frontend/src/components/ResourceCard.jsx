import { FaDownload, FaTrash, FaUser, FaTag } from 'react-icons/fa'
import { resourceService } from '../services/resourceService'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../utils/toast'
import Tag from './Tag'
import '../styles/resourceCard.css'

export default function ResourceCard({ resource, onDelete }) {
  const { user, isAdmin } = useAuth()

  const canDelete =
    isAdmin ||
    (resource.uploadedBy?._id || resource.uploadedBy) === (user?._id || user?.id)

  const handleDownload = () => {
    const url = resourceService.getFileUrl(resource.fileUrl)
    window.open(url, '_blank')
    toast.success('Download started!')
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this resource?')) return
    try {
      await resourceService.delete(resource._id)
      toast.success('Resource deleted.')
      onDelete?.(resource._id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div className="resource-card">
      <div className="card-glow" />

      <h3 className="resource-title">{resource.title}</h3>

      {resource.subject && <Tag label={resource.subject} />}

      {resource.description && (
        <p className="resource-desc">{resource.description}</p>
      )}

      <p className="resource-author">
        <FaUser className="author-icon" />
        {resource.uploadedBy?.name || 'Unknown'}
      </p>

      <div className="card-actions">
        <button className="download-btn" onClick={handleDownload}>
          <FaDownload />
          Download
        </button>

        {canDelete && (
          <button className="delete-btn" onClick={handleDelete}>
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  )
}