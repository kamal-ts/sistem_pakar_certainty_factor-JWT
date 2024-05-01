import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {urlAPI} from '../config/API'


const RefreshToke = async () => {
    const navigate = useNavigate()
    try {
        const response = await axios.get(`${urlAPI}/token`)
        const token = response.data.accessToken
        const decoded = jwt_decode(response.data.accessToken)
        const name = decoded.fullName
        const expire = decoded.exp
        return {token, name, expire}
    } catch (error) {
        if (error.response) {
            navigate('/')
        }
    }
}

export default RefreshToke