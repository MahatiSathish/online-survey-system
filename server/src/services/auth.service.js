import prisma from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/token.js"

function sanitizeUser(userDoc) {
  return {
    id: userDoc.id,
    name: userDoc.name,
    email: userDoc.email,
  }
}

export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    const error = new Error("name, email and password are required")
    error.statusCode = 400
    throw error
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters")
    error.statusCode = 400
    throw error
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    const error = new Error("Email already in use")
    error.statusCode = 409
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    },
  })
  const token = generateToken({ userId: user.id, email: user.email })

  return { user: sanitizeUser(user), token }
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error("email and password are required")
    error.statusCode = 400
    throw error
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (!user) {
    const error = new Error("Invalid credentials")
    error.statusCode = 401
    throw error
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    const error = new Error("Invalid credentials")
    error.statusCode = 401
    throw error
  }

  const token = generateToken({ userId: user.id, email: user.email })
  return { user: sanitizeUser(user), token }
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  if (!user) {
    const error = new Error("User not found")
    error.statusCode = 404
    throw error
  }

  return sanitizeUser(user)
}
