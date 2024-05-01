import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { urlAPI } from '../config/API'
import { useNavigate, Link, useParams } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Swal from 'sweetalert2'

const Navbar = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('')
    const [userId, setUserId] = useState('')

    useEffect(() => {
        Token()
    }, [])


    const Token = async () => {
        try {
            const response = await axios.get(`${urlAPI}/token`)
            const decoded = jwt_decode(response.data.accessToken)
            setFullName(decoded.fullName)
            setRole(decoded.role)
            setUserId(decoded.userId)
        } catch (error) {
            console.info(error)
        }
    }

    const Logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "you want to logout!",
            imageUrl: '/img/talk-show-cry.gif',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    await axios.delete(`${urlAPI}/logout`)
                    Swal.fire({
                        icon: 'success',
                        title: 'Logout!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    navigate('/login')
                } catch (error) {
                    console.info(error)
                }

            }
        })

    }


    return (


        <div className="container-xxl position-relative p-0">
            <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                <a href="index.html" className="navbar-brand p-0">
                    <h1 className="m-0">CFconsult</h1>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="fa fa-bars"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0">
                        <Link to={'/'}
                            className={window.location.pathname == '/' ? "nav-item nav-link active" : "nav-item nav-link"}
                        >
                            Home
                        </Link>
                        <a className={window.location.pathname == '/about' ? "nav-item nav-link active" : "nav-item nav-link"}>About</a>
                        <div className="nav-item dropdown" >
                            <a href="#" className={window.location.pathname == '/konsultasi-penyakit' || window.location.pathname == '/konsultasi-makanan' ? "nav-link dropdown-toggle active" : "nav-link dropdown-toggle"} data-bs-toggle="dropdown">Service</a>
                            <div className="dropdown-menu m-0">
                                <Link to={'/konsultasi-penyakit'} className={window.location.pathname == '/konsultasi-penyakit' ? "dropdown-item active" : "dropdown-item"}>Konsultasi Penyakit</Link>
                                <Link to={'/konsultasi-makanan'} className={window.location.pathname == '/konsultasi-makanan' ? "dropdown-item active" : "dropdown-item"}>Konsultasi Makanan</Link>

                            </div>
                        </div>
                        {role == 'admin' &&
                            <>
                                <Link to={'/penyakit'} className={window.location.pathname == '/penyakit' || window.location.pathname == `/penyakit/${id}` ? "nav-item nav-link active" : "nav-item nav-link"}>Penyakit & Gejala</Link>
                                <Link to={'/users'} className={window.location.pathname == '/users' ? "nav-item nav-link active" : "nav-item nav-link"}>Users</Link>
                                <Link to={'/makanan'} className={window.location.pathname == '/makanan' ? "nav-item nav-link active" : "nav-item nav-link"}>Makanan</Link>
                            </>
                        }
                        {!fullName && (

                            <Link to={'/login'} className="btn  nav-item nav-link ms-lg-5 fw-bold" >Sign In</Link>

                        )}
                    </div>
                    {!fullName && (
                        <Link to={'/register'} className="btn btn-light rounded text-primary py-1 px-2 ms-lg-3">Register</Link>
                    )}
                    {fullName && (
                        <div className='nav-item dropdown'>

                            <a href="#" className="bg-primary rounded-pill py-2 px-3 ms-lg-5 text-light dropdown-toggle" data-bs-toggle="dropdown">
                                <i className="fa fa-user text-white" style={{ marginRight: '7px' }}></i>
                                {fullName}
                            </a>
                            <div className="dropdown-menu m-0">
                                <Link to={`/profile`} className="dropdown-item">Profile</Link>
                                <a href='#' onClick={Logout} className="dropdown-item">Logout</a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default Navbar