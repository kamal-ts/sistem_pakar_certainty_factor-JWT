import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import Swal from 'sweetalert2'
import { Modal, Button } from 'react-bootstrap'
import EditPenyakit from './EditPenyakit'
import { useNavigate, Link } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const ListPenyakit = () => {

    const navigate = useNavigate()

    const [show, setShow] = useState(false);
    const [showTambah, setShowTambah] = useState(false);
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleCloseTambah = () => setShowTambah(false)
    const handleShowTambah = () => setShowTambah(true)

    const [dataPenyakit, setDataPenyakit] = useState([])

    const [msg, setMsg] = useState('')
    const [namaPenyakit, setNamaPenyakit] = useState('')
    const [deskripsi, setDeskripsi] = useState('')

    const [shareId, setShareId] = useState('')

    // login
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')

    useEffect(() => {
        refreshToke()
        getPenyakit()
    }, [])

    const refreshToke = async () => {
        try {
            const response = await axios.get(`${urlAPI}/token-admin`)
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        } catch (error) {
            if (error.response) {
                navigate('/login')
            }
        }
    }

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${urlAPI}/token-admin`)
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => Promise.reject(error))


    const getPenyakit = async () => {
        try {
            const response = await axiosJWT.get(`${urlAPI}/penyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDataPenyakit(response.data)
        } catch (error) {
            console.info(error.response)
        }
    }

    const addPenyakit = async (e) => {
        e.preventDefault()
        try {
            await axiosJWT.post(`${urlAPI}/penyakit`, {
                namaPenyakit,
                deskripsi
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            Swal.fire({
                icon: 'success',
                title: 'data berhasil ditambah!',
                showConfirmButton: false,
                timer: 1500
            })
            getPenyakit()
            clearForm()
            handleCloseTambah()
        } catch (error) {
            setMsg(error.response.data.msg)
        }
    }

    const deletePenyakit = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosJWT.delete(`${urlAPI}/penyakit/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    getPenyakit()
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                } catch (error) {
                    console.info(error.response.data)
                }

            }
        })
    }

    const clearForm = () => {
        setNamaPenyakit('')
        setDeskripsi('')
        setMsg('')
    }

    return (
        <div>
            <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">Data Penyakit</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Contact</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className='container-xxl' style={{ paddingBottom: '100px' }}>
                <div className='container'>

                    <button onClick={handleShowTambah} className=" btn btn-lg btn-primary" type="submit"><i className="fa fa-plus-square" style={{ marginRight: '10px' }} aria-hidden="true" ></i>Tambah Penyakit</button>

                    <div className="row row-cols-1 row-cols-md-3 g-4 my-2">

                        {dataPenyakit.map((penyakit, index) => (
                            <div key={index} className="col wow fadeInUp " data-wow-delay={"0." + (index % 3 + 1) + "s"}>
                                <div className="card h-100 shadow-lg service-item ">

                                    <div className="card-header" style={{ backgroundColor: 'white' }}>
                                        <Link to={`/penyakit/${penyakit._id}`}>
                                            <h5 className="card-title text-capitalize text-primary">{penyakit.namaPenyakit}</h5>
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{penyakit.deskripsi.length > 100 ? `${penyakit.deskripsi.substring(0,110)}....` : penyakit.deskripsi}.</p>
                                    </div>

                                    <div className="card-footer " style={{ backgroundColor: 'white' }}>
                                        <Link to={`/penyakit/${penyakit._id}`} className='btn btn-outline-dark btn-sm' style={{ marginRight: '10px' }}>
                                            <i className="fa fa-eye fa-lg" style={{ marginRight: '10px' }} aria-hidden="true"></i>Gejala : {penyakit.gejala.length}
                                        </Link>
                                        <button type='button' className='btn btn-outline-warning btn-sm ' style={{ marginRight: '10px' }}
                                            onClick={() => { handleShow(); setShareId(penyakit._id) }} data-bs-toggle="modal" data-bs-target="#edit-modal">
                                            <i className="fa fa-pencil" style={{ marginRight: '10px' }} aria-hidden="true"></i>Edit
                                        </button>
                                        <button onClick={() => { deletePenyakit(penyakit._id) }} type="button" className='btn btn-outline-danger btn-sm'>
                                            <i className="fa fa-trash" style={{ marginRight: '10px' }} aria-hidden="true"></i>Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>




                </div>
            </div >
            <Modal show={show} onHide={handleClose} >
                <EditPenyakit handleClose={handleClose} id={shareId} getPenyakit={getPenyakit} />
            </Modal>

            <Modal show={showTambah} onHide={handleCloseTambah} >
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Penyakit</Modal.Title>
                </Modal.Header>
                <form onSubmit={addPenyakit}>
                    <Modal.Body>
                        {msg &&
                            <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                                <strong>{msg}!</strong>
                            </div>
                        }
                        <div className="mb-3">
                            <label form="nama" className="form-label">Nama Penyakit</label>
                            <input type="text" className="form-control" id="nama" placeholder='penyakit' value={namaPenyakit} onChange={(e) => setNamaPenyakit(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label form="deskripsi" className="form-label">Deskripsi</label>
                            <textarea className="form-control" id="deskripsi" placeholder='deskripsi'
                                rows={6}
                                cols={5}
                                value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}

                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { handleCloseTambah(); clearForm() }}>
                            Close
                        </Button>
                        <button type="submit" className="btn btn-primary">Save Change</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div >
    )
}

export default ListPenyakit
