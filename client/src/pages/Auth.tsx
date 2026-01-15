import { useState } from "react"
import { AuthForm } from "../components/AuthForm"
import axios from "axios"

export const Auth = () => {
    const [formType, setFormType] = useState<"signup" | "login">("signup")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const formValues = Object.fromEntries(formData)
            if (formType === "signup") {
                await axios.post("/api/auth/signup", {
                    username: formValues.email,
                    name: formValues.name,
                    password: formValues.password
                })
                alert("Account Created Successfully.")
                setFormType("login")
            }

            if (formType === "login") {
                await axios.post("/api/auth/login", {
                    username: formValues.email,
                    password: formValues.password
                })
                alert("Logged in successfully")
            }

        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 409) {
                    alert("User already exists")
                } else if (e.response?.status === 401) {
                    alert("Invalid email or password")
                } else if (e.response?.status === 404) {
                    alert("User Not Found")
                } else {
                    alert("Request failed.")
                }
            } else {
                console.log("Unexpected error:", e)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <AuthForm form={formType} onFormChange={() => setFormType((prev) => (prev === "signup" ? "login" : "signup"))} onSubmit={handleSubmit} isLoading={isLoading} />
        </>
    )
}