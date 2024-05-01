import mongoose from 'mongoose'

const dataCF = mongoose.Schema({
    idGejala: {
        type: String,
        require: true
    },
    gejala: {
        type: String,
        require: true
    },
    CFUser: {
        type: Number,
        require: true
    },
    ket: {
        type: String,
        require: true
    }
})

const konsultasi = mongoose.Schema({
    
    namaPenyakit: {
        type: String,
        require: true
    },
    hasilCF: {
        type: Number,
        require: true
    },
    dataCF: [dataCF],
})

const Patients = mongoose.Schema({
    konsultasi: [konsultasi]
}, {
    timestamps: true
})

const Users = mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    dateBirth: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    refresh_token: {
        type: String,
        default: null
    },
    role:{
        type: String,
        default: "user"
    },
    patients: [Patients],
    image: {
        type: String,
        require: true
    }

}, {
    timestamps: true
})

export default mongoose.model('User', Users)