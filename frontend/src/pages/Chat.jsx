import { useState, useEffect, useRef, useCallback } from 'react'
import { FaPaperPlane, FaCircle } from 'react-icons/fa'
import Layout from '../components/Layout'
import { toast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import { messageService } from '../services/messageService'
import api from '../services/api'
import '../styles/pages/chat.css'

export default function Chat() {
  // Pull socketRef from context — same socket that AuthContext manages,
  // no second connection created here
  const { user, socketRef } = useAuth()

  const [allUsers, setAllUsers]       = useState([])
  const [activeUser, setActiveUser]   = useState(null)
  const [messages, setMessages]       = useState([])
  const [input, setInput]             = useState('')
  const [loadingMsgs, setLoadingMsgs] = useState(false)

  const bottomRef = useRef(null)
  const myId      = user?._id || user?.id

  // Register receiveMessage listener on the shared socket
  useEffect(() => {
    const socket = socketRef?.current
    if (!socket) return

    const handleReceive = (msg) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    }

    socket.on('receiveMessage', handleReceive)

    // Clean up only the listener — do NOT disconnect the shared socket
    return () => {
      socket.off('receiveMessage', handleReceive)
    }
  }, [socketRef])

  // Load user list
  useEffect(() => {
    api.get('/api/users/chat-users')
      .then(({ data }) => {
        const others = (data.users || []).filter(u => (u._id || u.id) !== myId)
        setAllUsers(others)
      })
      .catch(() => toast.error('Could not load users.'))
  }, [myId])

  // Load conversation history when switching users
  useEffect(() => {
    if (!activeUser) return
    setLoadingMsgs(true)
    messageService.getConversation(activeUser._id || activeUser.id)
      .then(msgs => setMessages(msgs || []))
      .catch(() => toast.error('Failed to load messages.'))
      .finally(() => setLoadingMsgs(false))
  }, [activeUser])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(() => {
    const socket = socketRef?.current
    if (!input.trim() || !activeUser || !socket) return

    socket.emit('sendMessage', {
      senderId:   String(myId),
      receiverId: String(activeUser._id || activeUser.id),
      message:    input.trim()
    })
    setInput('')
  }, [input, activeUser, myId, socketRef])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <Layout compact>
      <section className="page-header" style={{ marginBottom: '16px' }}>
        <h1>Messages</h1>
        <p>Real-time chat with other students.</p>
      </section>

      <div className="chat-shell">

        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">Conversations</div>
          {allUsers.length === 0
            ? <p className="chat-empty-users">No other users found.</p>
            : allUsers.map(u => (
                <button
                  key={u._id || u.id}
                  className={`chat-user-item ${(activeUser?._id || activeUser?.id) === (u._id || u.id) ? 'active' : ''}`}
                  onClick={() => setActiveUser(u)}
                >
                  <div className="chat-avatar">{u.name?.[0]?.toUpperCase()}</div>
                  <div className="chat-user-info">
                    <span className="chat-user-name">{u.name}</span>
                    <span className="chat-user-email">{u.email}</span>
                  </div>
                  <FaCircle className="online-dot" size={8} />
                </button>
              ))
          }
        </aside>

        <div className="chat-main">
          {!activeUser ? (
            <div className="chat-placeholder">
              <span>💬</span>
              <p>Select a conversation to begin</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-avatar large">{activeUser.name?.[0]?.toUpperCase()}</div>
                <div>
                  <strong>{activeUser.name}</strong>
                  <span>{activeUser.email}</span>
                </div>
              </div>

              <div className="chat-messages">
                {loadingMsgs
                  ? <div className="chat-loading"><span className="btn-spinner" /></div>
                  : messages.length === 0
                    ? <p className="chat-no-msgs">No messages yet. Say hi!</p>
                    : messages.map((msg, i) => {
                        const mine = String(msg.sender?._id || msg.sender) === String(myId)
                        return (
                          <div key={msg._id || i} className={`bubble-wrap ${mine ? 'mine' : 'theirs'}`}>
                            <div className={`bubble ${mine ? 'bubble-mine' : 'bubble-theirs'}`}>
                              <p>{msg.message}</p>
                              <span className="bubble-time">{formatTime(msg.createdAt)}</span>
                            </div>
                          </div>
                        )
                      })
                }
                <div ref={bottomRef} />
              </div>

              <div className="chat-input-row">
                <input
                  type="text"
                  className="chat-input"
                  placeholder={`Message ${activeUser.name}…`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button className="chat-send-btn" onClick={sendMessage} disabled={!input.trim()}>
                  <FaPaperPlane />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </Layout>
  )
}