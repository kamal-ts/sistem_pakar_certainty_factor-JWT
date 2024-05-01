import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { urlAPI } from '../config/API'
import Swal from 'sweetalert2'
// import { useCookies } from 'react-cookie';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const navigate = useNavigate()
    // const [cookies, setCookie] = useCookies(["refreshToken"])


    const Login = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${urlAPI}/login`, {
                email,
                password
            }, { withCredentials: true })

            Swal.fire({
                icon: 'success',
                title: 'Login Successfully',
                showConfirmButton: false,
                timer: 1500
            })

            console.log('res', res)

            navigate('/')
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }

    return (
        <section className='bg-light mx-auto my-auto text-center'>
            <div className="row justify-content-center" style={{ marginTop: "100px" }}>
                <div className="col-md-4">
                    <div className='px-5'>
                        <form onSubmit={Login}>
                            <img src="/img/logo.png" className='mb-2' width="70" height="70" />
                            <h3 className="h3 mb-4 fw-normal">Please sign in</h3>
                            {msg &&
                                <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                                    <strong>{msg}!</strong>
                                </div>
                            }
                            <div className="form-floating rounded-bottom">
                                <input type="email" className="form-control rounded-0 rounded-top" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label form="floatingInput" >Email address</label>
                            </div>
                            <div className="form-floating rounded-bottom">
                                <input type="password" className="form-control rounded-0 rounded-bottom" id="floatingPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <label form="floatingPassword" >Password</label>
                            </div>
                            <div className="d-grid gap-2 mt-4">
                                <button className=" btn btn-lg btn-primary" type="submit">Sign in</button>
                                <p className=' mt-2'>
                                    <Link to={'/register'} className="">New user? Register Now</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login