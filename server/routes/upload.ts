import { Router } from "express";
import { auth, type ER } from "../middleware";
import { getImageDesc } from "../helper/image-util";
import { fileAsBufferForPdfParse } from "../helper/parse-util";
import { createEmbeds } from "../helper/create-embed";
import { prisma } from ".."
import { v2 as cloudinary } from "cloudinary"
import { envConfig } from "../config";

const uploadRouter = Router()

uploadRouter.get("/cloud-sign", auth, async (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const paramsToSign = { timestamp: timestamp }
    try {
        const sign = cloudinary.utils.api_sign_request(paramsToSign, envConfig.CLOUDINARY_API_SECRET)
        res.json({
            timestamp: timestamp,
            signature: sign,
            apiKey: envConfig.CLOUDINARY_API_KEY
        })
    } catch (e) {
        console.log(`cloudinary signature error - ${e}`)
        res.json({
            msg: "Error creating signature"
        })
    }
})

uploadRouter.post("/", auth, async (req: ER, res) => {
    const info = req.body;
    if (!info) {
        return res.json("upload info is empty")
    }

    try {
        const document = await prisma.document.create({
            data: {
                userId: String(req.userId),
                subject: info.subject,
                metadata: JSON.stringify(info.metadata)
            }
        })

        if (info.metadata.format === "png" || info.metadata.format === "jpg" || info.meta.format === "jpeg") {
            const text = await getImageDesc(info.metadata.resource_type)
            const response = await createEmbeds(text!, document.id)
            if (response.msg == "Created") res.json({ msg: "Embedded Created -- image" })
            else res.json({ msg: response.msg })
        }
        else if (info.metadata.format === "pdf") {
            const text = await fileAsBufferForPdfParse(info.metadata.resource_type)
            const response = await createEmbeds(text!, document.id)
            if (response.msg == "Created") res.json({ msg: "Embedded Created -- pdf" })
            else res.json({ msg: response.msg })
        } else {
            const text = info.text;
            const response = await createEmbeds(text, document.id)
            if (response.msg == "Created") res.json({ msg: "Embedded Created" })
            else res.json({ msg: response.msg })
        }

        res.json({
            msg: `${document} Uploaded`
        })
    } catch (e) {
        console.log("Error uploading", e)
        res.json({
            msg: "Error in process during upload"
        })
    }
})

export default uploadRouter;