import { useEffect, useState } from 'react'

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 3700)
    return () => clearTimeout(t)
  }, [toast.id, onRemove])

  const colors = {
    success: '#10b981',
    error:   '#ef4444',
    info:    '#6366f1',
    warning: '#f59e0b'
  }

  const icons = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
    warning: '⚠'
  }

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
        padding:      '12px 16px',
        borderRadius: '12px',
        background:   'rgba(10,15,30,0.92)',
        backdropFilter: 'blur(20px)',
        border:       `1px solid ${colors[toast.type] || colors.info}40`,
        boxShadow:    `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${colors[toast.type] || colors.info}20`,
        cursor:       'pointer',
        userSelect:   'none',
        maxWidth:     '340px',
        transform:    visible ? 'translateX(0)' : 'translateX(120%)',
        opacity:      visible ? 1 : 0,
        transition:   'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease'
      }}
    >
      <span style={{
        width:        '22px',
        height:       '22px',
        borderRadius: '50%',
        background:   `${colors[toast.type] || colors.info}20`,
        border:       `1px solid ${colors[toast.type] || colors.info}60`,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        fontSize:     '11px',
        color:        colors[toast.type] || colors.info,
        flexShrink:   0,
        fontWeight:   700
      }}>
        {icons[toast.type] || icons.info}
      </span>
      <span style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.4 }}>
        {toast.message}
      </span>
    </div>
  )
}

export default function Toast({ toasts, removeToast }) {
  return (
    <div style={{
      position:      'fixed',
      bottom:        '90px',
      right:         '20px',
      zIndex:        9999,
      display:       'flex',
      flexDirection: 'column',
      gap:           '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}