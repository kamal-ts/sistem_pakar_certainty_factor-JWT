import express from 'express'
import { verifyTokenAdmin } from '../middleware/VerifyToken.mjs'
import { postValidasiMakanan, updateValidasiMakanan } from '../middleware/Validasi.mjs'
import { getMakanan, getMakananById, addMakanan, deletMakanan, updateMakanan, addMakanans } from '../controllers/MakananController.mjs'

const router = express.Router()

router.get('/makanan', getMakanan)
router.get('/makanan/:id', getMakananById)
router.post('/makanan', verifyTokenAdmin, postValidasiMakanan, addMakanan)
router.patch('/makanan/:id', updateValidasiMakanan, updateMakanan)
router.delete('/makanan/:id', verifyTokenAdmin, deletMakanan)
// router.get('/makanans', addMakanans)


export default router