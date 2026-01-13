import { useEffect, useRef, useState } from "react"
import { XMark } from "./HeroIcon"

export type ToastColor = "blue" | "green" | "red" | "yellow"
type Props = {
    message: string,
    color: ToastColor,
    onDone: () => void
}

const colorMap: Record<ToastColor, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500"
}
export const Toast = ({ message, color, onDone }: Props) => {
    const [displayMsg, setDisplayMsg] = useState(message)
    const [displayColor, setDisplayColor] = useState(color)
    const [isVisible, setIsVisible] = useState(true)

    const timeoutRef = useRef<number>(0)
    const closeIntentRef = useRef<"final" | "replace">("final")
    const pendingRef = useRef<{ message: string; color: ToastColor } | null>(null)

    const handleClose = (intent: "replace" | "final") => {
        if (!isVisible) return;
        clearTimer()
        closeIntentRef.current = intent
        setIsVisible(false)
    }

    const clearTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    useEffect(() => {
        if (isVisible) return

        const t = setTimeout(() => {
            if (closeIntentRef.current === "replace" && pendingRef.current) {
                const next = pendingRef.current
                setDisplayColor(next.color)
                setDisplayMsg(next.message)
                pendingRef.current = null;
                closeIntentRef.current = "final"
                setIsVisible(true)
            }else{
                onDone()
            }
        }, 300) // matching css fade duration 

        return () => clearTimeout(t)
    }, [isVisible])

    useEffect(() => {
        if (isVisible) {
            timeoutRef.current = setTimeout(() => handleClose("final"), 5000)
        }
        return clearTimer
    }, [isVisible])

    useEffect(() => {
        if (message != displayMsg || color != displayColor) {
            pendingRef.current = { message, color }
            handleClose("replace")
        }
    }, [message, color])

    return (
        <>
            <div className={`flex flex-col fixed bottom-5 right-6 z-20 bg-[#90D7F3] rounded-t-md rounded-b-xs overflow-hidden shadow-lg ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity ease-in duration-300`}>
                <div className="flex items-center gap-0.5 max-w-md w-full py-1">
                    <p className="font-poppins py-0.5 pl-2 text-slate-900 flex-1">{displayMsg}</p>
                    <button className="cursor-pointer text-slate-900 hover:opacity-70 hover:bg-[#90D7F3] transition-colors ease-in duration-200 p-1" onClick={() => handleClose("final")}><XMark /></button>
                </div>
                <div className={`${colorMap[displayColor]} h-2.5`}></div>
            </div>
        </>
    )
}