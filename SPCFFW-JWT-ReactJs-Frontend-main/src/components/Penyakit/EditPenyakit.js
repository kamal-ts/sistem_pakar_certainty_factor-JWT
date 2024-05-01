import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { urlAPI } from '../../config/API'
import Swal from 'sweetalert2'

const EditPenyakit = ({ handleClose, id, getPenyakit }) => {

    const [msg, setMsg] = useState('')
    const [namaPenyakit, setNamaPenyakit] = useState('')
    const [deskripsi, setDeskripsi] = useState('')

    useEffect(() => {
        getPenyakitById()
    }, [id])

    const getPenyakitById = async () => {
        try {
            const response = await axios.get(`${urlAPI}/penyakit/${id}`)
            setDeskripsi(response.data.deskripsi)
            setNamaPenyakit(response.data.namaPenyakit)
        } catch (error) {
            console.info(error.response)
        }
    }

    const updatePenyakit = async (e) => {
        e.preventDefault()
        try {
            await axios.patch(`${urlAPI}/penyakit/${id}`, {
                namaPenyakit,
                deskripsi
            })
            Swal.fire({
                icon: 'success',
                title: 'data berhasil diUpdate!',
                showConfirmButton: false,
                timer: 1500
            })
            getPenyakit()
            handleClose()

        } catch (error) {
            setMsg(error.response.data.msg)
        }
    }

    const clearForm = () => {
        setNamaPenyakit('')
        setDeskripsi('')
        setMsg('')
    }

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Update Penyakit</Modal.Title>
            </Modal.Header>
            <form onSubmit={updatePenyakit}>
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
                    <Button variant="secondary" onClick={() => { clearForm(); handleClose() }}>
                        Close
                    </Button>
                    <button type="submit" className="btn btn-primary">Save Change</button>
                </Modal.Footer>
            </form>
        </div>
    )
}

export default EditPenyakit