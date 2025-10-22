type Props={
    message: String,
}

export const Toast=({message}:Props)=>{

    return (
        <>
            <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                    <div className="">
                        {/* icon */}
                    </div>
                    <p className="">{message}</p>
                    <button className="">{/*other icon*/}</button>
                </div>
                <div className=""></div>
            </div>
        </>
    )
}