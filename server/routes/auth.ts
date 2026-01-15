import { Router } from "express"
import { generateAccessToken, generateRefreshToken } from "../helper/jwt-utils";
import ms, { type StringValue } from "ms";
import { envConfig } from "../config";
import jwt from "jsonwebtoken"
import { prisma } from ".."
import { type JwtPayload } from ".."; // from index.ts

const authRouter = Router()

authRouter.post("/signup", async (req, res) => {
    const info = req.body;
    const passwordHash = await Bun.password.hash(info.password)

    const exists = await prisma.user.findFirst({
        where: { username: info.username }
    })

    if (exists) {
        return res.status(409).json({
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

authRouter.post("/login", async (req, res) => {
    const info = req.body;
    const user = await prisma.user.findFirst({ where: { username: info.username } })
    if (!user) {
        return res.status(404).json({ message: "User Not found" })
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

authRouter.delete("/logout", async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json("No token found -- logout")

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

authRouter.post("/refresh-token", async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.json("No token found -- refresh token")

    try {
        const payload = jwt.verify(token, envConfig.SECRET_KEY) as JwtPayload;
        const user = await prisma.user.findFirst({ where: { id: payload.userId } })
        if (!user) return res.status(401).json({ msg: "User not found during Refresh Token" })

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

export default authRouter;