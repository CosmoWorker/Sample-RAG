import type React from "react"

type Props={value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void, onClear: ()=>void}

export const TextInput=({value, onChange, onClear}: Props)=>{

    return(
        <>
            {value && <button onClick={onClear}>Clear</button>}
            <input type="text" placeholder='Enter anything...' value={value} onChange={onChange} className='border-1 rounded-md p-1.5 mr-2'/>
        </>
    )
}