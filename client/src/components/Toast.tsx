import { useEffect, useRef, useState } from "react"
import { XMark } from "./HeroIcon"

type ToastColor = "blue" | "green" | "red" | "yellow"
type Props = {
    message: string,
    color: ToastColor,
}

const colorMap: Record<ToastColor, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500"
}
export const Toast = ({ message, color }: Props) => {
    const [show, setShow] = useState(true)
    const [isVisible, setIsVisible] = useState(true)
    const timeoutRef = useRef<number>(0)

    const handleClose = () => {
        if (!isVisible) return;
        setIsVisible(false)
        setTimeout(() => setShow(false), 300)
    }

    useEffect(() => {
        if (isVisible) {
            timeoutRef.current = setTimeout(() => handleClose(), 5000)
        }
        return () => clearTimeout(timeoutRef.current)
    }, [isVisible])

    return (
        <>
            {
                show &&
                <div className={`flex flex-col fixed bottom-5 right-6 z-20 bg-[#90D7F3] rounded-t-md rounded-b-xs overflow-hidden shadow-lg ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity ease-in duration-300`}>
                    <div className="flex items-center gap-0.5 max-w-md w-full py-1">
                        <p className="font-poppins py-0.5 pl-2 text-slate-900 flex-1">{message}</p>
                        <button className="cursor-pointer text-slate-900 hover:opacity-70 hover:bg-[#90D7F3] transition-colors ease-in duration-200 p-1" onClick={handleClose}><XMark /></button>
                    </div>
                    <div className={`${colorMap[color]} h-2.5`}></div>
                </div>
            }
        </>
    )
}