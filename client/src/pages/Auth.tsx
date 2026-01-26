import { useEffect, useState } from "react"
import { AuthForm } from "../components/AuthForm"
import axios from "axios"
import { useToast } from "../providers/ToastProvider"
import { useAuth } from "../providers/AuthProvider"
import { useNavigate } from "react-router-dom"

export const Auth = () => {
    const [formType, setFormType] = useState<"signup" | "login">("signup")
    const toast = useToast()
    const auth = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const formData = new FormData(e.currentTarget)
            const email = formData.get("email") as string
            const name = formData.get("name") as string
            const password = formData.get("password") as string;

            if (formType === "signup") {
                await auth.signup({ email: email, name: name, password: password })
                setFormType("login")
                toast.showToast({ message: "Account Creation Successfull", color: "green" })
            }
            if (formType === "login") {
                await auth.login({ email: email, password: password })
                toast.showToast({ message: "Logged in successfully", color: "green" })
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 409) {
                    toast.showToast({ message: "User already exists", color: "yellow" })
                } else if (e.response?.status === 401) {
                    toast.showToast({ message: "Invalid email or password", color: "red" })
                } else if (e.response?.status === 404) {
                    toast.showToast({ message: "User Not Found", color: "yellow" })
                } else {
                    toast.showToast({ message: "Request Failed", color: "red" })
                }
            } else {
                console.log("Unexpected error:", e)
            }
        }
    }

    useEffect(() => {
        if (auth.isAuthenticated) navigate("/")
    }, [auth.isAuthenticated])

    return (
        <>
            <AuthForm form={formType} onFormChange={() => setFormType((prev) => (prev === "signup" ? "login" : "signup"))} onSubmit={handleSubmit} isLoading={auth.isLoading} />
        </>
    )
}