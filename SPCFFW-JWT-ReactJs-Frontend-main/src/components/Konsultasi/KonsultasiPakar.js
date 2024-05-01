import React, { useState, useEffect, useRef, useId } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Modal, Button } from 'react-bootstrap'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf"

const KonsultasiPakar = () => {

    const [dataPenyakit, setDataPenyakit] = useState([])
    const navigate = useNavigate()
    const [selectPenyakit, setSelectPenyakit] = useState(false)
    const [dataSelect, setDataSelect] = useState([])
    const [dataBobot, setDataBobot] = useState([])

    const [dataResponse, setDataResponse] = useState([])

    const [changeGejala, setChangeGejala] = useState([])

    // login
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')


    const [show, setShow] = useState(false)
    const handleClose = () => navigate('/')
    const handleShow = () => setShow(true)

    const [loading, setLoading] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)

    useEffect(() => {
        refreshToke()
        getPenyakit()
        getBobot()
    }, [dataSelect])

    const refreshToke = async () => {
        try {
            const response = await axios.get(`${urlAPI}/token`)
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
            const response = await axios.get(`${urlAPI}/token`)
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

    const handleChange = (data) => {

        const duplicate = dataSelect.find((arr) => arr.namaPenyakit == data.namaPenyakit)
        if (duplicate) {
            for (let index = 0; index < changeGejala.length; index++) {
                if (changeGejala[index].namaPenyakit == duplicate.namaPenyakit) {
                    changeGejala.splice(index, 1)
                }
            }
            const tes = dataSelect.filter((arr) => arr.namaPenyakit != duplicate.namaPenyakit)
            setDataSelect(tes)
        } else {
            setDataSelect([...dataSelect, data])
        }

    }

    const getBobot = async () => {
        try {
            const response = await axios.get(`${urlAPI}/bobot?select=user`)
            setDataBobot(response.data)
        } catch (error) {
            console.info(error.response)
        }
    }

    const handleChangeGejala = (role, namaPenyakit, idGejala) => {

        const gejala = changeGejala.find((gejala, index) => gejala.namaPenyakit == namaPenyakit)
        if (gejala) {
            const duplicateGejala = gejala.dataCF.find((duplicate, index) => duplicate.idGejala == idGejala)
            if (duplicateGejala) {
                const newDataCF = gejala.dataCF.filter((arr) => arr.idGejala != idGejala)
                gejala.dataCF = newDataCF
            }
            gejala.dataCF.push({ idGejala, CFUser: role })
        } else {

            setChangeGejala([...changeGejala, {
                namaPenyakit,
                dataCF: [
                    {
                        idGejala,
                        CFUser: role
                    }
                ]
            }])

        }
    }

    const postPatient = async (e) => {
        e.preventDefault()
        setBtnLoading(true)
        let validasi = true
        changeGejala.forEach((gejala, index) => {
            dataSelect.forEach((data, index) => {
                if (gejala.namaPenyakit == data.namaPenyakit) {
                    if (gejala.dataCF.length != data.gejala.length) {
                        validasi = false
                    }
                }
            })
        })

        if (validasi == false) {
            Swal.fire({
                icon: 'warning',
                title: 'Gagal!',
                text: "Jawaban Tidak boleh kosong!"
            })
        } else {

            try {
                const response = await axiosJWT.post(`${urlAPI}/patient`, changeGejala, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setDataResponse(response.data.konsultasi)
                handleShow()
                Swal.fire({
                    icon: 'success',
                    title: 'konsultasi berhasil!',
                })

            } catch (error) {
                if (error.response.data.msg) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Gagal!',
                        text: "Jawaban Tidak boleh kosong!"
                    })
                } else {
                    console.info(error.response)
                }
            }
        }

        setBtnLoading(false)

    }

    const pdfExportComponent = useRef(null)
    const handleExport = (event) => {
        pdfExportComponent.current.save()
    }

    const head = (
        <div id='konsultasiPenyakit' className="container-xxl bg-primary page-header">
            <div className="container text-center">
                <h1 className="text-white animated zoomIn mb-3">Konsultasi Penyakit</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                        <li className="breadcrumb-item"><a className="text-white" href="#">Service</a></li>
                        <li className="breadcrumb-item text-white active" aria-current="page">Konsultasi Penyakit</li>
                    </ol>
                </nav>
            </div>
        </div>
    )

    return (
        <div>
            {head}

            <div className='container-xxl' style={{ paddingBottom: '100px' }}>
                <div className='container'>
                    <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
                        <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Our Services</div>
                        <h2 className="mb-5 text-capitalize">The following services for disease consultation</h2>
                    </div>
                    {dataPenyakit.length < 1 && (

                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) || (

                            <div className="row">
                                <div className="col-sm-3 " style={{ marginBottom: '10px' }}>
                                    <div className="card shadow wow fadeInUp" data-wow-delay="0.1s">
                                        {dataPenyakit.map((penyakit, index) => (
                                            <label key={index} className="list-group-item text-capitalize" htmlFor={penyakit.namaPenyakit}>
                                                <input className="form-check-input me-1" disabled={changeGejala.find((arr) => arr.namaPenyakit == penyakit.namaPenyakit) ? true : false} type="checkbox" id={penyakit.namaPenyakit} value={selectPenyakit} onChange={() => handleChange(penyakit)} />
                                                {penyakit.namaPenyakit}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-sm-9">
                                    {dataSelect.map((arr, index) => (
                                        <div key={index} className="card px-4 py-4 shadow wow fadeInUp" data-wow-delay="0.1s" style={{ marginBottom: "10px" }}>
                                            <div className="ms-2 me-auto">
                                                <h5 className='text-capitalize text-inline'><span style={{ marginRight: '10px' }}>{index + 1}.</span>{arr.namaPenyakit}</h5>
                                                {arr.gejala.map((gejala, index) => (
                                                    <div key={index} className="mb-2 row mx-3">
                                                        <div className='col-sm-8 '>
                                                            <label htmlFor={gejala._id} className="col-form-label">Apakah anda  mengalami {gejala.gejala}?</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <select id={gejala._id} className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={(e) => { handleChangeGejala(e.target.value, arr.namaPenyakit, gejala._id); }}>
                                                                <option defaultValue={''} value={''} >Pilih Jawaban</option>
                                                                {dataBobot.map((bobot, index) => (
                                                                    <option key={index} value={bobot.nilai}>{bobot.ket} | {bobot.nilai}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {dataSelect.length > 0 && (
                                        <div className="d-flex justify-content-end wow fadeInUp" data-wow-delay="0.1s">
                                            <form onSubmit={postPatient} >
                                                <Link to={'/'} className='btn btn-danger align-end'>Cancel</Link>
                                                {btnLoading && (
                                                    <button className="btn btn-primary align-end" style={{ marginLeft: "8px" }} type="button" disabled>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        Simpan...
                                                    </button>
                                                ) || (

                                                        <button type='submit' className='btn btn-primary align-end' style={{ marginLeft: "8px" }}>Simpan</button>
                                                    )}
                                            </form>
                                        </div>
                                    )}
                                    {dataSelect.length < 1 && (
                                        <>
                                            <div className="card shadow wow fadeInUp" data-wow-delay="0.1s">
                                                <div className="card-body py-5 px-5 " >
                                                    <h5 className="card-title">Konsultasi Penyakit</h5>
                                                    <p>Konsultasi penyakit untuk mengetahui diagnosa penyakit yang kemungkinan diderita berdasarkan gejala yang sedang dialami oleh pasien.</p>
                                                    <p className="card-text">Pilih penyakit yang ada pada list yang anda ingin Konsultasi kan</p>

                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end my-2">
                                                <Link to={'/'} className='btn btn-danger align-end'>Cancel</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
                <Modal show={show} onHide={handleClose} size="xl" >

                    <Modal.Header closeButton>
                        <Modal.Title>Hasil Konsultasi</Modal.Title>
                    </Modal.Header>

                    <PDFExport ref={pdfExportComponent} paperSize="auto">

                        <Modal.Body >
                            <div className='card py-4 px-4 '>
                                <div className='py-2'>
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
                                    <div key={index} className='card px-4 py-4 my-2 border border-primary'>
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
        </div >
    )

}

export default KonsultasiPakar