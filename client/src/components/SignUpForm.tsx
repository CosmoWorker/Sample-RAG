import { useEffect, useState } from "react"

type FormInfo=Record<"email"|"username"| "password", string>

export const SignUpForm=()=>{
    const [err, setErr]=useState<FormInfo>({"email":"", "username":"", "password":""})
    const [info, setInfo]=useState<FormInfo>({"email":"","username":"", "password":""})
    
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

    useEffect(()=>{
        
    }, [])

    return (
        <>
            <form action="" className="rounded-lg flex flex-col p-2 max-w-[400px] ">
                <p className="text-lg font-poppins text-left">Email</p>
                <input type="text" placeholder="Enter your email" onChange={(e)=>handleChange("email", e.target.value)} className={`font-poppins rounded-md p-2 m-2 mb-0 ${info.email.length===0?`border-black`: err.email?`border-red-600`:`border-green-600`}`}/>
                {err.email && 
                    <span className="text-red-600 mt-0 text-left ml-2 duration-500">{err.email}</span>
                }
                <p className="text-lg font-poppins text-left ">Username</p>
                <input type="text" placeholder="Enter your username" onChange={(e)=>handleChange("username", e.target.value)} className={`font-poppins rounded-md p-2 m-2 mb-0 ${info.username===""?`border-black`:err.username? `border-red-600`:`border-green-600`}`} />
                {err.username && 
                    <span className="text-red-600 mt-0 text-left ml-2">{err.username}</span>
                }
                <p className="text-lg font-poppins text-left ">Password</p>
                <input type="text" placeholder="Enter your password" onChange={(e)=>handleChange("password", e.target.value)} className={`border focus:outline-none font-poppins rounded-md p-2 m-2 mb-0 ${info.password===""?`border-[#B5CBEA]`:err.password? `border-red-600`:`border-green-600`}`}/>
                {err.password && 
                    <span className="text-red-600 mt-0 text-left ml-2">{err.password}</span>
                }
                <button type="submit" className="cursor-pointer p-2 rounded-lg min-w-[125px] w-full my-2 self-center font-medium bg-[#90D7F3] font-poppins">Sign Up</button>
            </form>
        </>
    )   
}
