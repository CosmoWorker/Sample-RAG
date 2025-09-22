import PdfParse from "pdf-parse";
import axios from "axios";

export const fileAsBufferForPdfParse = async (cloudinaryUrl: string) => {
    const response = await axios(cloudinaryUrl, {responseType: "arraybuffer"})
    let dataBuffer = response.data

    const data = await PdfParse(dataBuffer)
    console.log(data.text)

    return data.text
}