import { createChunks } from "./chunk-utils"
import { embedChunks } from "./embedding-util"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

let embeddedVectorArray;
export const createEmbeds = async (text: string, docId: string) => {
    const chunks = await createChunks(text!)
    embeddedVectorArray = await embedChunks(chunks)

    if (!embeddedVectorArray) return { msg: "Embedded vector array not found" }

    for (let i = 0; i < chunks.length; i++) {
        await prisma.$executeRaw`INSERT INTO "Chunk" (content, embedding, documentId) VALUES (${chunks[i]}, ${embeddedVectorArray[i]}, ${docId})`
    }

    return { msg: "Created" }
}   