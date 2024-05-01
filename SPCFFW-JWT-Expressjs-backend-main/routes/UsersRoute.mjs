import express from 'express'

import { getUsers, Register, Login, Logout, getUserById, deleteUser } from '../controllers/UsersController.mjs'
import { verifyToken } from '../middleware/VerifyToken.mjs'
import { refreshToken, refreshTokenAdmin } from '../controllers/RefreshToken.mjs'
import { postValidasiLogin, postValidasiUsers } from '../middleware/Validasi.mjs'

const router = express.Router()

router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.post('/users', postValidasiUsers, Register)
router.delete('/users/:id', deleteUser)

router.post('/login', postValidasiLogin, Login)
router.get('/token', refreshToken)
router.get('/token-admin', refreshTokenAdmin)
router.delete('/logout', Logout)

export default router