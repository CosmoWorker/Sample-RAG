import cloudCodeSvg from "../assets/illustrations/cloud-code.svg"
import laptopBinarySvg from "../assets/illustrations/Laptop-binary.svg"

export const Illustration = () => {
    return (
        <div className="relative flex md:flex-col items-center justify-center w-full h-full">
            <p className="font-mclaren md:block hidden absolute z-10 top-6">Your computer science assistant, here for your queries.</p>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <img
                    src={laptopBinarySvg}   
                    alt="LaptopBinaryImage" 
                    className="md:w-[90%] md:max-w-[800px] md:block hidden z-10 md:translate-y-[65%] transition-all duration-300" 
                />
                <img 
                    src={cloudCodeSvg} 
                    alt="CloudCodeImg" 
                    className="md:w-[73%] md:max-w-[750px] sm:w-[60%] md:-translate-y-[81%] md:-translate-x-[15%] transition-all duration-300" 
                />
            </div>
        </div>
    )
}