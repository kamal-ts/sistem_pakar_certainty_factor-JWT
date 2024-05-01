import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { urlAPI } from '../../config/API'
import Accordion from 'react-bootstrap/Accordion';


const DetilePasien = ({ handleClose, show, handleShow, dataPasien }) => {

    const [patients, setPatients] = useState(dataPasien.patients)

    useEffect(() => {
    }, [])


    return (

        <div>
            <Modal.Header closeButton >
                <Modal.Title className=''>Detile User</Modal.Title>
            </Modal.Header>
            <Modal.Body className='' >
                <div className='row my-2 lead '>
                    <div className='col-sm-8'>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        Nama
                                    </div>
                                    <div className='col-sm-1'>
                                        :
                                    </div>
                                    <div className='col-sm-4'>
                                        {dataPasien.fullName}
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        Tgl. Lahir
                                    </div>
                                    <div className='col-sm-1'>
                                        :
                                    </div>
                                    <div className='col-sm-4'>
                                        {dataPasien.dateBirth}
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        Email
                                    </div>
                                    <div className='col-sm-1'>
                                        :
                                    </div>
                                    <div className='col-sm-4'>
                                        {dataPasien.email}
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        Tgl. Register
                                    </div>
                                    <div className='col-sm-1'>
                                        :
                                    </div>
                                    <div className='col-sm-4'>
                                        {new Date(dataPasien.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        Role
                                    </div>
                                    <div className='col-sm-1'>
                                        :
                                    </div>
                                    <div className='col-sm-4'>
                                        {dataPasien.role}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='col-sm-4 d-flex align-items-center'>
                        <div className='rounded-circle bg-image my-auto mx-auto '
                            style={{
                                height: 200,
                                width: 200,
                                backgroundImage: `url(${dataPasien.image})`,
                                backgroundSize: 'cover'
                            }}
                        >

                        </div>
                        {/* <img src={dataPasien.image} className="img-fluid " alt="..." /> */}
                    </div>
                    <hr />
                </div>

                <h5 className='text-decoration-underline will'>Riwayat konsultasi</h5>

                {patients.length > 0 && (


                    <Accordion defaultActiveKey="0" className='row mx-auto'>
                        {[...patients].reverse().map((p, index) => (
                            <>
                                <Accordion.Item eventKey={index} key={index} className="col-sm-11 p-0">
                                    <Accordion.Header>{new Date(p.createdAt).toUTCString()}</Accordion.Header>
                                    <Accordion.Body>
                                        <div className='my-4'>
                                            <ul className="list-group " style={{ maxWidth: '500px' }}>
                                                {p.konsultasi.map((k, index2) => (
                                                    <li key={index2} className="list-group-item d-flex justify-content-between align-items-center border border-primary">
                                                        <h6 className='text-capitalize'>{k.namaPenyakit}</h6>
                                                        <span className="btn btn-primary btn-sm rounded-pill">Kemungkinan : {k.hasilCF} %</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div>
                                                {p.konsultasi.map((response, index2) => (
                                                    <div key={index2} className='card px-4 py-4 my-4 border border-primary'>
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
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <div className='col d-flex justify-content-center p-0'>
                                    <a className='btn btn-outline-danger my-auto rounded-circle'  >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </>
                        ))}
                    </Accordion>

                ) || (
                        <div class="alert alert-warning "role="alert">
                            Riwayat konsultasi tidak ada!
                        </div>
                    )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>
                    Close
                </Button>
            </Modal.Footer>



        </div>


    )
}

export default DetilePasien