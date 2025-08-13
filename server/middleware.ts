import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { envConfig } from "./config";

export interface ER extends Request{
    user?: string | JwtPayload
}

export const auth=(req: ER, res: Response, next: NextFunction)=>{
    const token=req.headers.authorization;
    if (!token){
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    try{ 
        jwt.verify(token, envConfig.SECRET_KEY, (err, user)=>{
            if (err) return res.json({msg: err})
            req.user=user
            next()
        })

    }catch(e){
        res.json({
            message: `Middleware Error - ${e}`
        })
    }
}
