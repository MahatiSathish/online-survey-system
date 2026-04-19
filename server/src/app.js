import cors from "cors"
import express from "express"
import apiV1Router from "./routes/index.js"
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js"

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "survey-api" })
})

app.use("/api/v1", apiV1Router)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
