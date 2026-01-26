import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

axios.defaults.withCredentials = true // for sending cookies
axios.defaults.baseURL = "http://localhost:3000"

type User = {
    id: string,
}

type LoginPayload = {
    email: string
    password: string
}

type SignUpPayload = {
    email: string
    name: string,
    password: string
}

type authContextType = {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean

    login: (payload: LoginPayload) => Promise<void>
    signup: (payload: SignUpPayload) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<authContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const isAuthenticated = !!user

    const login = async (payload: LoginPayload) => {
        setIsLoading(true)
        try {
            const res = await axios.post("/api/auth/login", {
                username: payload.email,
                password: payload.password
            })
            setUser(res.data.userId)
            setAccessToken(res.headers.authorization)
            localStorage.setItem("accessToken", res.headers.authorization)
        }
        finally {
            setIsLoading(false)
        }
    }

    const signup = async (payload: SignUpPayload) => {
        setIsLoading(true)
        try {
            await axios.post("/api/auth/signup", {
                username: payload.email,
                name: payload.name,
                password: payload.password
            })
        }
        finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        await axios.delete("/api/auth/logout")
        setUser(null)
    }

    const restoreSession = async () => {
        setIsLoading(true)
        try {
            const res = await axios.post("/api/auth/refresh-token")
            setUser(res.data.id)
            setAccessToken(res.headers.authorization)
        } catch {
            setUser(null)
        }
        finally {
            setIsLoading(false)
        }

    }
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            if (accessToken) {
                config.headers.Authorization = accessToken
            }
            return config
        })

        return () => {
            axios.interceptors.request.eject(interceptor)
        }
    }, [accessToken])
    useEffect(() => { restoreSession() }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth to be used within AuthProvider")
    }

    return context
}