import express from "express";
import { PrismaClient } from "./generated/prisma";
import cors from "cors"
import { envConfig } from "./config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import docsRouter from "./routes/docs";
import uploadRouter from "./routes/upload";

export interface JwtPayload {
    userId: string
}
export const prisma = new PrismaClient() //exporting to other routes
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173'
}

app.use(express.json());
app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/chat", chatRouter)
app.use("/api/docs", docsRouter)
app.use("/api/upload", uploadRouter)

app.listen(envConfig.PORT, () => {
    console.log(`Server is running on port ${envConfig.PORT}`)
})
