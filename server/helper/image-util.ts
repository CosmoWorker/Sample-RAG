import { Groq } from "groq-sdk"
import { envConfig } from "../config"
const groq = new Groq({
    apiKey: envConfig.GROQ_API_KEY
})

export const getImageDesc = async (imageUrl: string) => {
    try {
        const systemPrompt = "You are highly accurate descriptor of an image. Your sole purpose is to analyze the image and and give description or content only with respect to the image without any additional fluff."
        const userPrompt = "Describe/explain the image in detail"
        const response = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    content: [
                        {
                            "type": "text",
                            "text": userPrompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageUrl
                            }
                        }
                    ]
                }
            ],
            "model": "meta-llama/llama-4-maverick-17b-128e-instruct"
        })
        const imageDescription = response.choices[0]?.message.content;

        return imageDescription;
    } catch (e) {
        console.log(`Error getting image description ${e}`)
    }

}