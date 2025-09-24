
type Props={
    TextValue: string
}

export const DisplayText=({TextValue}: Props)=>{
    
    return(
        <>
            <p className="bg-amber-500 font-semibold">{TextValue}</p>
        </>
    )
}