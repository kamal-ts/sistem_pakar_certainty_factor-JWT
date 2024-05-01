import Patient from '../models/PatientModel.mjs'
import Penyakit from '../models/DiseaseModel.mjs'
import Bobot from '../models/BobotModel.mjs'
import Users from '../models/UsersModel.mjs'


export const getPatient = async (req, res) => {
    try {
        const patient = Patient.find()
        res.json(patient)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getPatientIdUser = async (req, res) => {
    try {
        const user = await Users
            .findById(req.params.id, {})
            .sort({ "patients.createdAt": -1 })
            .select('-password -refresh_token -__v -_id')
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addPatient = async (req, res) => {
    try {

        const patients = []

        const reqBody = req.body
        if (reqBody.length < 1) throw new Error('gejala tidak boleh kosong!')
        
        for (let index = 0; index < reqBody.length; index++) {

            const { namaPenyakit, dataCF } = reqBody[index]

            const penyakit = await Penyakit.findOne({ namaPenyakit })
            if (!penyakit) throw new Error('penyakit tidak ditemukan!')
            const gejalas = penyakit.gejala
            const bobot = await Bobot.findOne()
            const bobotUser = bobot.user
            const CFHE = []

            dataCF.forEach((CF, index) => {
                const cekIdGejala = gejalas.find(gejala => gejala._id == CF.idGejala)
                if (!cekIdGejala) throw new Error('id gejala tidak ditemukan!')
                if (CF.CFUser == '') throw new Error('gejala tidak boleh kosong!')
                gejalas.forEach((gejala) => {
                    if (CF.idGejala == gejala._id) {
                        const ket = bobotUser.find(bobot => bobot.nilai == dataCF[index].CFUser)
                        dataCF[index].ket = (ket.ket)
                        dataCF[index].gejala = (gejala.gejala)
                        // dataCF[index].CFAdmin = (gejala.role)
                        CFHE.push(parseFloat((gejala.role * dataCF[index].CFUser).toFixed(2)))
                    }
                })
            })

            const CFCombinate = []
            let old = CFHE[0]
            for (let index = 1; index < CFHE.length; index++) {
                if (old >= 0 && CFHE[index] >= 0) {
                    CFCombinate.push((old) + (CFHE[index]) * (1 - (old)))
                    old = ((old) + (CFHE[index]) * (1 - (old)))
                }
                else if (old < 0 && CFHE[index] < 0) {
                    CFCombinate.push((old) + (CFHE[index]) * (1 + (old)))
                    old = ((old) + (CFHE[index]) * (1 + (old)))
                }
                else {
                    CFCombinate.push(((old) + (CFHE[index])) / (1 - Math.min(old, CFHE[index])))
                    old = (((old) + (CFHE[index])) / (1 - Math.min(old, CFHE[index])))
                }
            }
            const patient = {
                namaPenyakit,
                hasilCF: parseFloat((old * 100).toFixed(3)),
                dataCF
            }

            patients.push(patient)
        }

        // const user = await Users.findById(req.userId)
        // user.patients.push({konsultasi: patients})
        // const response = await user.save()

        const response = await Users.findOneAndUpdate(
            { _id: req.userId },
            {
                $push: {
                    patients: { konsultasi: patients }
                }
            },
            { returnOriginal: false }
        )

        // const response = await patient.save(patient)
        
        res.status(201).json(response.patients[(response.patients.length - 1)])
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}

export const deletPatient = async (req, res) => {
    try {
        const user = await Users.findOne({ "patients._id": req.params.id })
        const response = await Users.updateOne(
            { _id: user._id },
            {
                "$pull": {
                    "patients": {
                        "_id": req.params.id
                    }
                }
            })
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}


