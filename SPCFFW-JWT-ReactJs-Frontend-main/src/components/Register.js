import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate, Link} from 'react-router-dom'
import {urlAPI} from '../config/API'
import Swal from 'sweetalert2'

const Register = () => {


    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [dateBirth, setDateBirth] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [msg, setMsg] = useState('')
    const navigate = useNavigate()

    const Register = async(e) =>{
        e.preventDefault()
        try {
            await axios.post(`${urlAPI}/users`, {
                fullName,
                dateBirth,
                email,
                password,
                confPassword
            })
            alert()
            navigate('/login')
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }


    const alert = () => {
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            showConfirmButton: false,
            timer: 1500
        })
    }



    return (
        <section className='bg-light text-center'>
            <div className="row justify-content-center" style={{ marginTop: "40px" }}>
                <div className="col-md-4">
                    <div className='px-5'>
                        <form onSubmit={Register}>
                            <img src="/img/logo.png" className='mb-2' width="70" height="70" />
                            <h4 className=" mb-4 fw-normal">Create Account</h4>
                            {msg &&
                                <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                                    <strong>{msg}!</strong>
                                </div>
                            }
                            <div className="form-floating rounded-bottom">
                                <input type="text" className="form-control rounded-0 rounded-top" id="fullName" placeholder="full name" value={fullName} onChange={(e) => setFullName(e.target.value)}  />
                                <label form="fullName" >Full Name</label>
                            </div>
                            <div className="form-floating rounded-bottom">
                                <input type="date" className="form-control rounded-0 " id="dateBirth" placeholder="name@example.com" value={dateBirth} onChange={(e) => setDateBirth(e.target.value)} />
                                <label form="dateBirth" >Date Birth</label>
                            </div>
                            <div className="form-floating rounded-bottom">
                                <input type="email" className="form-control rounded-0 " id="floatingInput" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label form="floatingInput" >Email address</label>
                            </div>
                            <div className="form-floating rounded-bottom">
                                <input type="password" className="form-control rounded-0" id="floatingPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <label form="floatingPassword" >Password</label>
                            </div>
                            <div className="form-floating rounded-bottom">
                                <input type="password" className="form-control rounded-0 rounded-bottom" id="confPassword" placeholder="Password" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                <label form="confPassword" >Confirm Password</label>
                            </div>
                            <div className="d-grid gap-2 mt-4">
                                <button className=" btn btn-lg btn-primary" type="submit">Register</button>
                                <p className=' mt-2'>
                                    <Link to={'/login'} className="">Already have an account? login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register