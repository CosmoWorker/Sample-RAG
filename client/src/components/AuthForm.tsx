import { useEffect, useState } from "react"
import { Logo } from "./Logo"
import { Illustration } from "./Illustration"
import { EyeIcon, EyeSlashIcon } from "./HeroIcon"
import axios from "axios"

type FormInfo = Record<"email" | "name" | "password", string>
type Props = {
    form: "signup" | "login"
    onFormChange: () => void
}

export const AuthForm = ({ form, onFormChange }: Props) => {
    const [err, setErr] = useState<FormInfo>({ "email": "", "name": "", "password": "" })
    const [info, setInfo] = useState<FormInfo>({ "email": "", "name": "", "password": "" })
    const [showPwd, setShowPwd] = useState(false)

    const handleChange = (field: keyof FormInfo, value: string) => {
        setInfo(prev => ({ ...prev, [field]: value }));

        let error = "";

        if (form === "signup") {
            if (field === "email") {
                if (value !== "" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value)) {
                    error = "Invalid Email Format";
                }
            } else if (field === "name") {
                if (value !== "" && !/^[a-zA-Z0-9._%+-]{4,}$/.test(value)) {
                    error = "Username should be at least 4 characters";
                }
            } else if (field === "password") {
                if (value !== "" && !/^[a-zA-Z0-9].{5,}$/.test(value)) {
                    error = "Password should be at least 6 characters";
                }
            }
        }

        setErr(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form === "signup" && !err) {
            const formData = new FormData(e.currentTarget)
            const formValues = Object.fromEntries(formData)
            const response = await axios.post("/api/auth/signup", {
                "username": formValues.email,
                "name": formValues.name,
                "password": formValues.password
            })

            // change alert to a custom toast component
            if (response.data.message === "User already exists") {
                alert("Please login, an account exists with that email")
            } else {
                if (response.data.userId) {
                    alert("Account Created Successfully")
                }
            }
            onFormChange()
        }
        else if (form === "login") {
            try {
                const formData = new FormData(e.currentTarget)
                const formValues = Object.fromEntries(formData)
                await axios.post("/api/login", {
                    "username": formValues.email,
                    "password": formValues.password
                })
                //utilise toast
            } catch (e) {
                if (axios.isAxiosError(e)) {
                    if (e.response?.status === 401) {
                        alert("Email or password is Invalid")
                    } else {
                        alert("Something went wrong.")
                    }
                } else {
                    console.log("Unexpected Error: ", e)
                }
            }
        }
    }

    useEffect(() => {
        setInfo({ "email": "", "name": "", "password": "" })
        setErr({ "email": "", "name": "", "password": "" })
    }, [form])

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <div className="md:grow bg-[#E3EAF4] md:h-auto h-[25vh]">
                <Illustration />
            </div>
            <div className="flex flex-col gap-5 justify-center items-center w-full md:w-[40%] mt-5">
                <div className="flex gap-1 justify-center">
                    <Logo />
                    <p className="font-martian-mono text-3xl md:text-4xl font-semibold">CScribe</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-2xl md:text-3xl font-martian-mono text-left">{form === "signup" ? "Create Account" : (<>Login to your<br /> Account</>)}</p>
                    <form onSubmit={handleSubmit} className="flex flex-col max-w-[400px] font-poppins mt-2 gap-1">
                        <label className="text-lg text-left">Email</label>
                        <input type="text" placeholder="Enter your email" name="email" onChange={(e) => handleChange("email", e.target.value)} className={`border focus:outline-none rounded-md p-2 ${form === "signup" ? (info.email === "" ? `border-[#B5CBEA]` : err.email ? `border-red-600` : `border-green-600`) : "border-[#B5CBEA]"}`} />
                        <span className="text-red-600 text-sm mt-0 transition-all duration-500">{err.email || ""}</span>
                        {
                            form === "signup" &&
                            <>
                                <label className="text-lg text-left ">Name</label>
                                <input type="text" name="name" placeholder="Enter your name" onChange={(e) => handleChange("name", e.target.value)} className={`border focus:outline-none rounded-md p-2 ${info.name === "" ? `border-[#B5CBEA]` : err.name ? `border-red-600` : `border-green-600`}`} />
                                <span className="text-red-600 text-sm mt-0 duration-500 transition-all">{err.name || ""}</span>
                            </>
                        }
                        <label className="text-lg text-left ">Password</label>
                        <div className="relative flex items-center">
                            <input type={showPwd ? "text" : "password"} name="password" placeholder="Enter your password" onChange={(e) => handleChange("password", e.target.value)} className={`border focus:outline-none rounded-md p-2 ${form === "signup" ? (info.password === "" ? `border-[#B5CBEA]` : err.password ? `border-red-600` : `border-green-600`) : "border-[#B5CBEA]"}`} />
                            <button onClick={() => setShowPwd(!showPwd)} type="button" className="cursor-pointer absolute right-2 focus:outline-none">
                                {showPwd ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <span className="text-red-600 text-sm mt-0 duration-500 transition-all">{err.password || ""}</span>
                        <button type="submit" className="cursor-pointer p-2 rounded-lg my-5 font-medium text-lg bg-[#90D7F3]">{form === "signup" ? "Sign Up" : "Login"}</button>
                    </form>
                    <div className="flex gap-1 font-poppins">
                        <p>{form === "login" ? "Not Registered Yet?" : "Already have account?"}</p>
                        <p onClick={onFormChange} className="cursor-pointer hover:underline hover:text-blue-400">{form === "login" ? "Sign Up" : "Login"}</p> {/*will link button later */}
                    </div>
                </div>
            </div>
        </div>
    )
}