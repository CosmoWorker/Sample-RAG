import express from "express";
import { auth } from "./middleware";
import { PrismaClient } from "./generated/prisma";

const prisma=new PrismaClient()
const app=express();
app.use(express.json());

app.post("/signup", async(req, res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const name=req.body.name;

    
})

app.post("/signin", async(req, res)=>{
    const username=req.body.username
    const password=req.body.password;

})

app.post("/upload", auth, async(req, res)=>{
    
})

app.get("/docs", auth, async(req, res)=>{

})

app.post("/chat", auth, async(req, res)=>{

})


app.listen(process.env.PORT)
