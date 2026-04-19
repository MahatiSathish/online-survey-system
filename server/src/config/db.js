import prisma from "../lib/prisma.js"

async function connectToDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }

  await prisma.$connect()
  console.log("Connected to PostgreSQL via Prisma")
}

export default connectToDatabase
