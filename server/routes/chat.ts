import { Router } from "express";
import { auth, type ER } from "../middleware";
import { embedChunks } from "../helper/embedding-util";
import { envConfig } from "../config";
import Groq from "groq-sdk";
import { prisma } from ".."

const chatRouter = Router()
const groq = new Groq({ apiKey: envConfig.GROQ_API_KEY })

chatRouter.post("/", auth, async (req: ER, res) => {
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

export default chatRouter;