import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaUser } from 'react-icons/fa'
import Tag from './Tag'
import '../styles/resourceCard.css'

export default function ResourceCard({ resource }) {
  const navigate = useNavigate()

  return (
    <div
      className="resource-card"
      onClick={() => navigate(`/resources/${resource._id}`)}
    >
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
      <div className="card-cta">
        <span>View details</span>
        <FaArrowRight className="card-cta-arrow" />
      </div>
    </div>
  )
}