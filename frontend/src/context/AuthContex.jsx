import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"

export const AuthContext = createContext()

async function checkProfileCompleted(role) {
  if (!role) return false
  try {
    const res = await api.get(`/${role}/profile`)
    return !!res.data.data 
  } catch {
    return false
  }
}

export const AuthProvider = ({children}) =>{
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


   useEffect(() => {
    api.get("/auth/current-user")
      .then(async (res) => {
        const loggedInUser = res.data.data
        if (loggedInUser) {
          const profileCompleted = await checkProfileCompleted(loggedInUser.role)
          setUser({ ...loggedInUser, profileCompleted })
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])
  
  const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password })
  const loggedInUser = res.data.data.user
  const profileCompleted = await checkProfileCompleted(loggedInUser.role)
  const fullUser = { ...loggedInUser, profileCompleted }
  setUser(fullUser)
  return fullUser 
}

  const logout = async()=>{
    await api.get("/auth/logout")
    setUser(null)
  }

  const markProfileCompleted = () => {
    setUser((prev) => (prev ? { ...prev, profileCompleted: true } : prev))
  }

  const setRoleLocally = (role) => {
    setUser((prev) => (prev ? { ...prev, role, profileCompleted: false } : prev))
  }
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, markProfileCompleted, checkProfileCompleted, setRoleLocally }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)