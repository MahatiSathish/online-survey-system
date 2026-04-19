import dotenv from "dotenv"
import app from "./app.js"
import connectToDatabase from "./config/db.js"
import prisma from "./lib/prisma.js"

dotenv.config()

const port = process.env.PORT || 5000

async function bootstrap() {
  try {
    await connectToDatabase()
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })

    async function shutdown() {
      await prisma.$disconnect()
      server.close(() => process.exit(0))
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
  } catch (error) {
    console.error("Failed to start server", error.message)
    process.exit(1)
  }
}

bootstrap()
