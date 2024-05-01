import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { Modal, Button } from 'react-bootstrap'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf"
import Swal from 'sweetalert2'


const Profile = () => {

    const pdfExportComponent = useRef(null)

    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')
    const [dateBirth, setDateBirth] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [updatedAt, setUpdatedAt] = useState(new Date())
    // let updatedAt


    const [dataPatient, setDataPatient] = useState([
        {
            _id: '',
            idUser: '',
            konsultasi: []
        }
    ])

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const [dataResponse, setDataResponse] = useState([])
    const [dateResponse, setDateResponse] = useState(new Date())

    const navigate = useNavigate()

    useEffect(() => {
        refreshToke()
    }, [userId])


    const refreshToke = async () => {
        try {
            const response = await axios.get(`${urlAPI}/token`)
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setName(decoded.fullName)
            setUserId(decoded.userId)
            setExpire(decoded.exp)
            setEmail(decoded.email)
            setDateBirth(decoded.dateBirth)
            setImage(decoded.image)
            setUpdatedAt(new Date(decoded.updatedAt))
            getPatient()
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
            const response = await axios.get(`${urlAPI}/token`)
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setName(decoded.fullName)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => Promise.reject(error))

    const getPatient = async () => {
        try {
            const response = await axiosJWT.get(`${urlAPI}/patient/${userId}`)
            setDataPatient(response.data.patients)
        } catch (error) {
            console.log('error', error.message)
        }
    }

    const handleExport = (event) => {
        pdfExportComponent.current.save()
    }

    const deletePatient = async (id) => {
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
                    await axios.delete(`${urlAPI}/patient/${id}`)
                    getPatient()
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
                    <h1 className="text-white animated zoomIn mb-3">My Profile</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">My Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className='container-xxl' style={{ paddingBottom: '100px' }}>
                <div className='container'>

                    <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
                        <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">My Profile</div>
                        <h2 className="mb-5 text-capitalize">The following services for disease consultation</h2>
                    </div>
                    <div className="row">
                        <div className={dataPatient.length > 0 ? "col-sm-6" : "col"} style={{ marginBottom: '10px' }}>
                            <h4 className='text-decoration-underline'># My Biodata</h4>
                            <div className="card mb-3 py-2 px-2 shadow border-primary" >
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src={image} className="img-fluid rounded-start" alt="..." />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{name}</h5>
                                            <p className="card-text">{email}</p>
                                            <p className="card-text">Tanggal lahir, {dateBirth}</p>
                                            <p className="card-text"><small className="text-muted">Last updated {`${updatedAt.toUTCString()}`} ago</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {dataPatient.length > 0 && (

                            <div className="col-sm-6" style={{ marginBottom: '10px' }}>
                                <h4 className='text-decoration-underline'># Riwayat Konsultasi</h4>
                                {[...dataPatient].reverse().map((patient, index) => (
                                    <div key={index} className="card border-primary shadow" style={{ marginBottom: '20px' }} >
                                        <div className="card-body">
                                            <p>{new Date(patient.createdAt).toUTCString()}</p>
                                            <ul className="list-group ">
                                                {patient.konsultasi.map((response, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <h6 className='text-capitalize'>{response.namaPenyakit}</h6>
                                                        <div className="btn btn-outline-primary btn-sm ">Kemungkinan : {response.hasilCF}%</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="card-footer" >
                                            <a onClick={() => { handleShow(); setDataResponse(patient.konsultasi); setDateResponse(new Date(patient.createdAt)) }} className="btn btn-primary btn-sm" style={{marginRight: '10px'}}>Detile</a>
                                            <a onClick={() => deletePatient(patient._id)} className="btn btn-danger btn-sm">Hapus</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="xl" >

                <Modal.Header closeButton>
                    <Modal.Title>Hasil Konsultasi</Modal.Title>
                </Modal.Header>

                <PDFExport ref={pdfExportComponent} paperSize="auto">

                    <Modal.Body >
                        <div className='card py-4 px-4 '>
                            <div className=''>
                                <p>CFConsult | {dateResponse.toUTCString()}</p>
                                <h3 className='text-center'>Hasil Konsultasi Certain Faktor </h3>
                                <hr />
                                <h6>Anda kemungkinan mengalami penyakit : </h6>
                                <ul className="list-group " style={{ maxWidth: '500px' }}>
                                    {dataResponse.map((response, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center border border-primary">
                                            <h6 className='text-capitalize'>{response.namaPenyakit}</h6>
                                            <span className="btn btn-primary btn-sm rounded-pill">Kemungkinan : {response.hasilCF} %</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {dataResponse.map((response, index) => (
                                <div key={index} className='card px-4 py-4 my-4 border border-primary'>
                                    <h6 className='text-capitalize'>{response.namaPenyakit}</h6>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Gejala</th>
                                                <th scope="col">Keterangan</th>
                                                <th scope="col">Nilai</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {response.dataCF.map((dataCF, index2) => (
                                                <tr key={index2}>
                                                    <th scope="row">{index2 + 1}</th>
                                                    <td>{dataCF.gejala}</td>
                                                    <td>{dataCF.ket}</td>
                                                    <td>{dataCF.CFUser}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>

                    </Modal.Body>
                </PDFExport>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { handleClose() }}>
                        Close
                    </Button>
                    <Button variant='danger' onClick={handleExport} className="btn btn-danger">Save to PDF</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Profile