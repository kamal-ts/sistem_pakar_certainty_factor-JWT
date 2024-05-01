import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import Swal from 'sweetalert2'
import { Modal, Button } from 'react-bootstrap'
import EditGejala from './EditGejala'
import jwt_decode from 'jwt-decode'

const ListGejala = () => {
    const { id } = useParams()
    const [colGejala, setColGejala] = useState({
        gejala: '',
        role: '',
        _id: ''
    })

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const [msg, setMsg] = useState('')
    const [namaPenyakit, setNamaPenyakit] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [dataGejala, setDataGejala] = useState([])

    const [gejala, setGejala] = useState('')
    const [role, setRole] = useState('')
    const [dataBobot, setDataBobot] = useState([])

    // login
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        refreshToke()
        getPenyakitById()
        getBobot()
    }, [id])

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

    const getPenyakitById = async () => {
        try {
            const response = await axios.get(`${urlAPI}/penyakit/${id}`)
            setDeskripsi(response.data.deskripsi)
            setNamaPenyakit(response.data.namaPenyakit)
            setDataGejala(response.data.gejala)
        } catch (error) {
            console.info(error.response)
        }
    }
    const getBobot = async () => {
        try {
            const response = await axios.get(`${urlAPI}/bobot?select=admin`)
            setDataBobot(response.data)
        } catch (error) {
            console.info(error.response)
        }
    }

    const addGejala = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${urlAPI}/gejala/${id}`, {
                gejala,
                role
            })

            Swal.fire({
                icon: 'success',
                title: 'data berhasil ditambah!',
                showConfirmButton: false,
                timer: 1500
            })
            clearForm()
            getPenyakitById()

        } catch (error) {
            setMsg(error.response.data.msg)
        }
    }

    const clearForm = () => {
        setGejala('')
        setRole('')
        setMsg('')
    }

    const onEdit = (colGejala) => {
        setColGejala(colGejala)
        handleShow()
    }

    const deleteGejala = async (id) => {
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
                    await axios.delete(`${urlAPI}/gejala/${id}`)
                    getPenyakitById()
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

    return (
        <div>
            <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3 text-capitalize">Data Gejala {namaPenyakit}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-white" href="#">Data Penyakit</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Data Gejala {namaPenyakit}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className='container-xxl' style={{ paddingBottom: '100px' }}>
                <div className='container'>
                    <div className="card shadow py-4 px-4 " style={{ marginBottom: '20px' }}>

                        <h2 className='text-capitalize'>{namaPenyakit}</h2>
                        <p>{deskripsi}</p>
                        <div>
                            <Link to="/penyakit" className="btn btn-outline-info" style={{ color: 'blue' }}>
                                <i className="fa fa-chevron-circle-left fa-lg" style={{ marginRight: '10px' }} aria-hidden="true"></i>
                                back to disease list</Link>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className="card shadow py-4 px-4 ">
                                <h4 className='mb-4'>Tambah Gejala {namaPenyakit}</h4>
                                {msg &&
                                    <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                                        <strong>{msg}!</strong>
                                    </div>
                                }
                                <form onSubmit={addGejala}>
                                    <div className="mb-3">
                                        <label form="gejala" className="form-label">Gejala</label>
                                        <input type="text" className="form-control" id="gejala" placeholder='gejala' value={gejala} onChange={(e) => setGejala(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label form="Role" className="form-label">Role Gejala</label>
                                        <select id='Role' className="form-select text-capitalize" aria-label="Default select example" value={role} onChange={(e) => setRole(e.target.value)}>
                                            <option  defaultValue={''} value={''} disabled>Pilih Role</option>
                                            {dataBobot.map((bobot, index) => (
                                                <option key={index} value={bobot.nilai}>{bobot.ket}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Simpan</button>
                                    {(gejala || role) && (
                                        <>
                                            <button type="button" onClick={() => clearForm()} className="btn btn-danger" style={{ marginLeft: '10px' }}>Cancel</button>
                                        </>
                                    )}
                                </form>
                            </div>
                        </div>
                        <div className='col-sm-8'>
                            <div className="card shadow py-4 px-4">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Gejala</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Keterangan</th>
                                            <th scope="col">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(dataGejala.length < 1) && (
                                            <tr>
                                                <td colSpan={'5'}>
                                                    <p className="alert alert-warning text-center" role="alert">Data gejala masih kosong</p>
                                                </td>
                                            </tr>
                                        )}
                                        {dataGejala.map((gejala, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{gejala.gejala}</td>
                                                <td>{gejala.role}</td>
                                                <td>{gejala.ket}</td>
                                                <td>
                                                    <button type='button' className='btn btn-warning btn-sm ' style={{ marginRight: '10px' }}
                                                        onClick={() => onEdit(gejala)} data-bs-toggle="modal" data-bs-target="#edit-modal">
                                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>
                                                    <button onClick={() => { deleteGejala(gejala._id) }} type="button" className='btn btn-danger btn-sm'>
                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} >
                <EditGejala handleClose={handleClose} dataBobot={dataBobot} colGejala={colGejala} getPenyakitById={getPenyakitById} />
            </Modal>
        </div>
    )
}

export default ListGejala