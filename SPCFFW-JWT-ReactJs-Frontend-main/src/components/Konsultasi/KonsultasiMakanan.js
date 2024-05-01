import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf"


const KonsultasiMakanan = () => {

    const [dataPenyakit, setDataPenyakit] = useState([])


    const [selectPenyakit, setSelectPenyakit] = useState(false)
    const [selectDeskripsi, setselectDeskripsi] = useState([])
    const [dataSelect, setDataSelect] = useState([])
    const [mknRekomen, setMknRekomen] = useState([])
    const [mknLarangan, setMknLarangan] = useState([])
    const [deskripsi, setDeskripsi] = useState([])

    useEffect(() => {
        getPenyakit()
    }, [])


    const getPenyakit = async () => {
        try {
            const response = await axios.get(`${urlAPI}/penyakit`)
            setDataPenyakit(response.data)
        } catch (error) {
            console.info(error.response.message)
        }

    }

    const handleChange = (data, deskripsi) => {

        const duplicate = dataSelect.find((arr) => arr == data)
        console.log('duplicate', duplicate)
        if (duplicate) {
            const tes = dataSelect.filter((arr) => arr != duplicate)
            const des = selectDeskripsi.filter((arr) => arr.penyakit != duplicate)
            setselectDeskripsi(des)
            setDataSelect(tes)
        } else {
            setselectDeskripsi([...selectDeskripsi, {
                penyakit: data,
                deskripsi
            }])
            setDataSelect([...dataSelect, data])
        }
    }

    const getPostMakanan = async () => {
        try {
            const rekomendasi = await axios.get(`${urlAPI}/makanan`, {
                params: {
                    status: 'rekomendasi',
                    penyakits: dataSelect
                }
                })
            const larangan = await axios.get(`${urlAPI}/makanan`, {
                params: {
                    status: 'larangan',
                    penyakits: dataSelect
                }
                })

            setMknRekomen(rekomendasi.data)
            setMknLarangan(larangan.data)
            setDeskripsi(selectDeskripsi)
        } catch (error) {
            console.log('error', error.response.message)
        }
    }

    const pdfExportComponent = useRef(null)
    const handleExport = (event) => {
        pdfExportComponent.current.save()
    }


    return (
        <div>
            <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">Konsultasi Makanan</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-white" href="#">Service</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Konsultasi Makanan</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className='container-xxl' style={{ paddingBottom: '100px' }}>
                <div className='container'>
                    <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
                        <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Our Services</div>
                        <h2 className="mb-5 text-capitalize">The following is a food consulting service</h2>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 " style={{ marginBottom: '10px' }}>
                            <div className="card shadow wow fadeInUp" data-wow-delay="0.1s">
                                {dataPenyakit.map((penyakit, index) => (
                                    <label key={index} className="list-group-item text-capitalize" htmlFor={penyakit.namaPenyakit}>
                                        <input className="form-check-input me-1" type="checkbox" id={penyakit.namaPenyakit} value={selectPenyakit} onChange={() => handleChange(penyakit.namaPenyakit, penyakit.deskripsi)} />
                                        {penyakit.namaPenyakit}
                                    </label>
                                ))}
                                {dataSelect.length > 0 && (

                                    <a onClick={getPostMakanan} className=' btn btn-primary ' style={{ borderRadius: "0 0 6px 6px " }}>Lanjut</a>
                                )} 
                            </div>
                        </div>

                        {mknLarangan.length > 0 && (

                            <div className="col-sm-9 " style={{ marginBottom: '10px' }}>
                                <div className="card  shadow wow fadeInUp" data-wow-delay="0.01s">
                                    <div className="card-header">
                                        <a className='btn btn-dark' onClick={handleExport}>
                                            <i class="fa fa-download" aria-hidden="true"></i> Unduh PDF</a>
                                    </div>
                                    <PDFExport ref={pdfExportComponent} paperSize="auto">
                                        <div className='card border-0 py-4 px-4'>
                                            
                                        <div className="card-body">
                                            {deskripsi.map((penyakit, index) => (
                                                <>
                                                    <h5 key={index} className='text-capitalize text-inline'><span style={{ marginRight: '10px' }}>#</span>{penyakit.penyakit}</h5>
                                                    <p>{penyakit.deskripsi}</p>
                                                </>
                                            ))}
                                            <div className="row">
                                                <div className="col-sm-6 mt-3">
                                                    <div class="d-flex align-items-center mb-3">
                                                        <div class="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                                            <i class="fa fa-cutlery fa-lg text-white"></i>
                                                        </div>
                                                        <h6 class="mb-0">Makanan Rekomendasi</h6>
                                                    </div>
                                                    <ol class="list-group list-group-numbered border border-primary">
                                                        {mknRekomen.map((rekom) => (
                                                            <li class="list-group-item text-capitalize">{rekom.nama}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                                <div className="col-sm-6 mt-3">
                                                    <div class="d-flex align-items-center mb-3">
                                                        <div class="flex-shrink-0 btn-square bg-danger rounded-circle me-3">
                                                            <i class="fa fa-cutlery fa-lg text-white" ></i>
                                                        </div>
                                                        <h6 class="mb-0">Makanan Dilarang</h6>
                                                    </div>
                                                    <ol class="list-group list-group-numbered border border-danger">
                                                        {mknLarangan.map((rekom) => (
                                                            <li class="list-group-item text-capitalize">{rekom.nama}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </PDFExport>
                                </div>
                            </div>
                        )}
                        {mknLarangan.length < 1 && (
                            <div className="col-sm-9 " style={{ marginBottom: '10px' }}>
                                <div className="card py-4 px-4 shadow wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="card-body">
                                        <h4>Pilih Penyakit</h4>
                                        <p>Piling penyakit untuk mengetahui makanan apa saja yang dilarang dan direkomendasikan sesuai dengan penyakit anda</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KonsultasiMakanan