import Users from '../models/UsersModel.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
// import fetch from 'node-fetch'

export const getUsers = async (req, res) => {
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const filter = req.query.filter || ''

    const re = new RegExp(search, 'i')

    try {
        let result = []
        if (filter == "noConsultation") {
            result = await Users.find({
                "patients.0": { $exists: false },
                $or: [
                    { fullName: { $regex: re } },
                    { email: { $regex: re } }]
            })
                .limit(limit)
                .sort({ createdAt: -1 })
                .skip(skip)
        } else if (filter == 'consultation') {
            result = await Users.find({
                "patients.0": { $exists: true },
                $or: [
                    { fullName: { $regex: re } },
                    { email: { $regex: re } }]
            })
                .limit(limit)
                .sort({ createdAt: -1 })
                .skip(skip)
        } else {
            result = await Users.find({
                $or: [
                    { fullName: { $regex: re } },
                    { email: { $regex: re } }]
            })
                .limit(limit)
                .sort({ createdAt: -1 })
                .skip(skip)
        }
        res.json({
            result,
            totalRows: result.length,
            hasMore: result.length >= limit ? true : false
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await Users
            .findById(req.params.id, {})
            .select('-password -refresh_token -__v')
        res.json(user)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        const { fullName, dateBirth, email, password } = await req.body
        try {
            const salt = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(password, salt)

            await Users.insertMany({
                fullName,
                dateBirth,
                email,
                password: hashPassword,
                image: 'http://placeimg.com/640/480/people'
            })
            res.json({ msg: 'Register Berhasil' })
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

export const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        try {
            const user = await Users.findOne({ email: req.body.email })
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) return res.status(400).json({ msg: "Wrong Password" })
            const _id = user._id
            const fullName = user.fullName
            const dateBirth = user.dateBirth
            const email = user.email
            const role = user.role
            const accessToken = jwt.sign({ _id, fullName, dateBirth, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
            const refreshToken = jwt.sign({ _id, fullName, dateBirth, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
            await Users.updateOne({ _id }, {
                $set: {
                    refresh_token: refreshToken
                }
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'None'
            })
            res.json({ accessToken })
        } catch (error) {
            res.status(404).json({ msg: error })
        }
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findOne({ refresh_token: refreshToken })
    if (!user) return res.sendStatus(204)
    await Users.updateOne({ _id: user._id }, {
        $set: {
            refresh_token: null
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)

}

export const postUserMany = async (req, res) => {
    try {
        const dataUser = await fetch('https://fakerapi.it/api/v1/persons?_quantity=200&_gender=male&_birthday_start=1940-01-01')
        const response = await dataUser.json()
        for (let index = 0; index < 200; index++) {

            await Users.insertMany({
                fullName: `${response.data[index].firstname} ${response.data[index].lastname}`,
                dateBirth: response.data[index].birthday,
                email: response.data[index].email,
                password: '123'
            })
            // console.info(response.data[index].id)

        }
    } catch (error) {
        res.status(404).json({ msg: error })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const response = await Users.deleteOne({ _id: req.params.id })
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: "user not found" })
    }
}