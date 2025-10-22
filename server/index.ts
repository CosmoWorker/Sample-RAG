import express from "express";
import { auth, type ER } from "./middleware";
import { PrismaClient } from "./generated/prisma";
import cors from "cors"
import jwt from "jsonwebtoken"
import { envConfig } from "./config";
import { generateAccessToken, generateRefreshToken } from "./helper/jwt-utils";
import ms, { type StringValue } from "ms";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"
import { getImageDesc } from "./helper/image-util";
import { fileAsBufferForPdfParse } from "./helper/parse-util";
import { createEmbeds } from "./helper/create-embed";
import { embedChunks } from "./helper/embedding-util";
import Groq from "groq-sdk";

interface JwtPayload {
    userId: string
}

const prisma = new PrismaClient()
const app = express();
const groq = new Groq({ apiKey: envConfig.GROQ_API_KEY })
app.use(express.json());
app.use(cors())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
    const info = req.body;
    const passwordHash = await Bun.password.hash(info.password)

    const exists=await prisma.user.findFirst({
        where:{username: info.username}
    })

    if (exists){
        res.json({
            message: "User already exists"
        })
    }

    const result = await prisma.user.create({
        data: {
            username: info.username,
            password: passwordHash,
            name: info.name
        }
    })
    res.json({
        userId: result.id
    })
})

app.post("/login", async (req, res) => {
    const info = req.body;
    const user = await prisma.user.findFirst({ where: { username: info.username } })
    if (!user) {
        return res.status(401).json({ message: "User Not found" })
    }
    const isMatch = await Bun.password.verify(info.password, user.password)
    if (isMatch) {
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)
        const refreshToken_hash = await Bun.password.hash(refreshToken)

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash: refreshToken_hash }
        })

        console.log(envConfig.REFRESH_TOKEN_EXPIRY)
        console.log(typeof (envConfig.REFRESH_TOKEN_EXPIRY))
        console.log(ms(envConfig.REFRESH_TOKEN_EXPIRY as StringValue))

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                maxAge: ms(envConfig.REFRESH_TOKEN_EXPIRY as StringValue)
            })
            .header("Authorization", accessToken)
            .json({ message: "Login Successfull" })

    } else {
        res.status(401).json({
            message: "Incorrect password"
        })
    }
})

app.delete("/logout", async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.json("No token found -- logout")

    try {
        const payload = jwt.verify(token, envConfig.SECRET_KEY) as JwtPayload;
        const user = await prisma.user.findFirst({ where: { id: payload.userId } })
        if (!user) {
            return res.json({ msg: "User not found during Refresh Token" })
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash: null }
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            path: "/"
        })

        res.json({
            message: "Logged Out"
        })
    } catch (e) {
        console.log(`Error Logging out - ${e}`)
        res.json({
            message: "Error Logging out"
        })
    }
})

app.post("/refresh-token", async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.json("No token found -- refresh token")

    try {
        const payload = jwt.verify(token, envConfig.SECRET_KEY) as JwtPayload;
        const user = await prisma.user.findFirst({ where: { id: payload.userId } })
        if (!user) return res.json({ msg: "User not found during Refresh Token" })

        const isMatch = await Bun.password.verify(token, user.refreshTokenHash!)
        if (isMatch) {
            const newAccessToken = generateAccessToken(user.id)
            const newRefreshToken = generateRefreshToken(user.id)
            const newRefreshTokenHash = await Bun.password.hash(newRefreshToken)
            await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: newRefreshTokenHash } })
            res
                .cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    path: "/",
                    maxAge: Number(ms(Number(envConfig.REFRESH_TOKEN_EXPIRY)))
                })
                .header("Authorization", newAccessToken)
        }

    } catch (e) {
        console.log(`Error refresh token -  ${e}`)
        res.status(401).json({
            message: "Refresh Token Invalid - Error"
        })
    }
})

app.get("/cloud-sign", auth, async (req, res) => {
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

app.post("/upload", auth, async (req: ER, res) => {
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

app.get("/docs/:user_id", auth, async (req, res) => {
    const user_id = req.params.user_id;
    if (!user_id) {
        return res.json({ message: "No userId given for docs" })
    }
    const docs = await prisma.document.findMany({ where: { userId: user_id } })
    if (docs) {
        res.json({
            documents: docs
        })
    } else {
        res.json({
            documents: "No Docs Uploaded yet"
        })
    }
})

app.post("/chat", auth, async (req: ER, res) => {
    const query = req.body.query;
    try {
        if (!query) return res.json({ msg: "No chat Query provided" })
        const embeddings = await embedChunks([query])
        if (!Array.isArray(embeddings) || embeddings.length == 0) {
            return res.json({ msg: "Failed to get query embeddings" })
        }
        const [queryEmbedding] = embeddings
        if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
            return res.status(500).json({ msg: "Failed to create query embedding" });
        }

        const vectorLiteral = `[${queryEmbedding.join(",")}]`;
        const topK = 7
        const relevantChunks = await prisma.$queryRaw<{ id: string; content: string; cosine_similarity: number }[]>
                                `   
                                    SELECT
                                        c.id, 
                                        c.content, 
                                        1-(c.embedding<=>${vectorLiteral}::vector) AS cosine_similarity
                                    FROM "Chunk" c
                                    JOIN "Document" d ON d.id=c.documentId
                                    WHERE d.userId = ${req.userId}
                                    ORDER BY cosine_similarity DESC
                                    LIMIT ${topK}
                                `

        const context = relevantChunks.map(c => c.content).join("\n\n")
        const systemPrompt = `Your are Computer Science Expert. You answer user's questions and queries 
        within the vast field of Computer Science. Answer queries from the context given. 
        If the question is unrelated to Computer science field, say so and do not frabicate from answering it with a
        proper message to the user.
        `
        const prompt = `Context:\n${context}\n\nUser query: ${query}`

        const response = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    "content": prompt
                },
            ],
            "model": "openai/gpt-oss-120b"
        })

        res.json({
            msg: response.choices[0]?.message.content,
            context_used: context
        })
    } catch (e) {
        console.log("Chat Quering Failed with Error: ", e)
        res.json({
            msg: "Chat query Failed"
        })
    }
})

app.listen(envConfig.PORT, () => {
    console.log(`Server is running on port ${envConfig.PORT}`)
})
