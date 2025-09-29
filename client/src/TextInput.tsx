import type React from "react"

type Props={value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void, ref: React.RefObject<HTMLInputElement | null>, keyDown: (e: React.KeyboardEvent<HTMLInputElement>)=> void}

export const TextInput=({value, onChange, ref, keyDown}: Props)=>{

    return(
        <>
            <input type="text" placeholder='Enter anything...' ref={ref} value={value} onChange={onChange} onKeyDown={keyDown} className='border-1 rounded-md p-1.5 mr-2'/>
        </>
    )
}