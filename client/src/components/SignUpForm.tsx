import { useEffect, useState } from "react"
import { Logo } from "./Logo"
import { Illustration } from "./Illustration"

type FormInfo = Record<"email" | "username" | "password", string>

export const SignUpForm = () => {
    const [err, setErr] = useState<FormInfo>({ "email": "", "username": "", "password": "" })
    const [info, setInfo] = useState<FormInfo>({ "email": "", "username": "", "password": "" })

    const handleChange = (field: keyof FormInfo, value: string) => {
        setInfo(prev => ({ ...prev, [field]: value }));

        let error = "";

        if (field === "email") {
            if (value !== "" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value)) {
                error = "Invalid Email Format";
            }
        } else if (field === "username") {
            if (value !== "" && !/^[a-zA-Z0-9._%+-]{4,}$/.test(value)) {
                error = "Username should be at least 4 characters";
            }
        } else if (field === "password") {
            if (value !== "" && !/^[a-zA-Z0-9].{5,}$/.test(value)) {
                error = "Password should be at least 6 characters";
            }
        }

        setErr(prev => ({ ...prev, [field]: error }));
    };

    useEffect(() => {

    }, [])

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <div className="md:grow bg-[#E3EAF4] md:h-auto h-[25vh]">
                <Illustration />
            </div>
            <div className="flex flex-col gap-5 justify-center items-center w-full md:w-[40%] mt-6">
                <div className="flex gap-1 justify-center">
                    <Logo />
                    <p className="font-martian-mono text-3xl md:text-4xl font-semibold">CScribe</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-2xl md:text-3xl font-martian-mono text-left">Create Account</p>
                    <form action="" className="flex flex-col max-w-[400px] font-poppins mt-2 gap-1">
                        <label className="text-lg text-left">Email</label>
                        <input type="text" placeholder="Enter your email" onChange={(e) => handleChange("email", e.target.value)} className={`border focus:outline-none rounded-md p-2 ${info.email.length === 0 ? `border-[#B5CBEA]` : err.email ? `border-red-600` : `border-green-600`}`} />
                        <span className="text-red-600 text-sm mt-0 transition-all duration-500">{err.email || ""}</span>
                        <label className="text-lg text-left ">Username</label>
                        <input type="text" placeholder="Enter your username" onChange={(e) => handleChange("username", e.target.value)} className={`border focus:outline-none rounded-md p-2 ${info.username === "" ? `border-[#B5CBEA]` : err.username ? `border-red-600` : `border-green-600`}`} />
                        <span className="text-red-600 text-sm mt-0 duration-500 transition-all">{err.username || ""}</span>
                        <label className="text-lg text-left ">Password</label>
                        <input type="text" placeholder="Enter your password" onChange={(e) => handleChange("password", e.target.value)} className={`border focus:outline-none rounded-md p-2 ${info.password === "" ? `border-[#B5CBEA]` : err.password ? `border-red-600` : `border-green-600`}`} />
                        <span className="text-red-600 text-sm mt-0 duration-500 transition-all">{err.password || ""}</span>
                        <button type="submit" className="cursor-pointer p-2 rounded-lg my-5 font-medium text-lg bg-[#90D7F3]">Sign Up</button>
                    </form>
                    <div className="flex gap-1">
                        <p>Already have account?</p>
                        <p className="cursor-pointer hover:underline hover:text-blue-400">Login</p> {/*will link button later */}
                    </div>
                </div>
            </div>
        </div>
    )
}
