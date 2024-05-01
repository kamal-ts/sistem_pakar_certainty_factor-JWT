import express from 'express'
import { verifyToken } from '../middleware/VerifyToken.mjs'
import { addPatient, deletPatient, getPatient, getPatientIdUser } from '../controllers/PatientController.mjs'

const router = express.Router()

router.get('/patient', getPatient)
router.get('/patient/:id', getPatientIdUser)
router.post('/patient', verifyToken, addPatient)
router.delete('/patient/:id', deletPatient)

export default router