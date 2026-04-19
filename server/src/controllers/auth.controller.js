import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js"

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await getUserById(req.user.userId)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}
