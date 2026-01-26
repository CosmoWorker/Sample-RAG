import { createContext, useContext, useState } from "react"
import { Toast, type ToastColor } from "../components/Toast"

type ToastPayload = {
    message: string,
    color: ToastColor
}

type ToastContextType = {
    showToast: (payload: ToastPayload) => void
}
const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastPayload | null>(null)

    const showToast = (payload: ToastPayload) => {
        setToast(payload)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <Toast message={toast.message} color={toast.color} onDone={() => setToast(null)} />}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast should be in wihtin ToastProvider")
    }

    return context
}