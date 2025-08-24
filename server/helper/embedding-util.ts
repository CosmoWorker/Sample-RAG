import { AzureOpenAI } from "openai";
import { envConfig } from "../config";

const endpoint = envConfig.AZURE_OPENAI_ENDPOINT
const apiKey = envConfig.AZURE_OPENAI_API_KEY
const deployment = envConfig.AZURE_OPENAI_DEPLOYMENT_NAME
const apiVersion = "2024-10-21"
const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment
})

export const embedChunks = async (chunks: string[]) => {
    let emebeddedVectors: number[][] = []
    for (let chunk of chunks) {
        const response = await client.embeddings.create({
            input: chunk,
            model: "text-embedding-3-large"
        })
        if (!response.data[0]?.embedding) {
            console.log("Response : ", response)
            console.log("Error getting embedding response")
            return;
        }
        emebeddedVectors.push(response.data[0]?.embedding)
    }
    return emebeddedVectors
}