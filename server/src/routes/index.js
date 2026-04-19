import { Router } from "express"
import authRouter from "./auth.routes.js"
import surveyRouter from "./survey.routes.js"

const router = Router()

router.use("/auth", authRouter)
router.use("/surveys", surveyRouter)

export default router
router.get("/test-analytics", (req, res) => {
    res.json({ message: "Analytics route working" });
  });