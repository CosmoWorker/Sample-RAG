import { Router } from "express";
import { auth } from "../middleware";
import { prisma } from "../index"

const docsRouter = Router()

docsRouter.get("/:user_id", auth, async (req, res) => {
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

export default docsRouter;