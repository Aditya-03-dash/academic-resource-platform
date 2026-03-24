import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'
import { authService } from '../services/authService'
import { BASE_URL } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const socketRef             = useRef(null)

  function initSocket(userId) {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    const socket = io(BASE_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[socket] connected, registering:', userId)
      socket.emit('registerUser', String(userId))
    })

    socket.on('reconnect', () => {
      console.log('[socket] reconnected, re-registering:', userId)
      socket.emit('registerUser', String(userId))
    })
  }

  useEffect(() => {
    const storedUser  = authService.getStoredUser()
    const storedToken = authService.getToken()
    if (storedUser && storedToken) {
      setUser(storedUser)
      const id = storedUser._id || storedUser.id
      initSocket(id)
    }
    setLoading(false)

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    const id = data.user._id || data.user.id
    initSocket(id)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    return authService.register(name, email, password)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    socketRef.current?.disconnect()
    socketRef.current = null
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      // Expose the ref itself, not socketRef.current — the ref object is stable
      // and always points to the live socket, whereas .current can be stale
      socketRef,
      isAuthenticated: !!user && !!authService.getToken(),
      isAdmin:         user?.role === 'admin',
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}