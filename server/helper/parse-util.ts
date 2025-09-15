import PdfParse from "pdf-parse";
import axios from "axios";

export const fileAsBufferForPdfParse = async (cloudinaryUrl: string) => {
    const response = await axios(cloudinaryUrl)
    let dataBuffer = response.data

    const data = await PdfParse(dataBuffer)
    console.log(data.metadata)
    console.log(data.text)
    console.log(data.info)

    return data.text
}