import jwt, { type SignOptions } from "jsonwebtoken";
import { envConfig } from "../config";

export const generateRefreshToken=(userId : string)=>{
    const payload={
        userId, tokenId: crypto.randomUUID()
    }
    return jwt.sign(payload, envConfig.SECRET_KEY, {expiresIn: envConfig.REFRESH_TOKEN_EXPIRY} as SignOptions)
}

export const generateAccessToken=(userId: string)=>{
    const payload={
        userId, tokenId: crypto.randomUUID()
    }
    return jwt.sign(payload, envConfig.SECRET_KEY, {expiresIn: envConfig.ACCESS_TOKEN_EXPIRY} as SignOptions)
}

export const verifyToken=(token: string, secret: string)=>{
    return jwt.verify(token, secret);
}   

