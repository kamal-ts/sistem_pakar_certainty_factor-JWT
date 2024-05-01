import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { urlAPI } from '../../config/API'
import Swal from 'sweetalert2'

const EditGejala = ({ handleClose, colGejala, getPenyakitById, dataBobot }) => {

    const [msg, setMsg] = useState('')
    const [gejala, setGejala] = useState(colGejala.gejala)
    const [role, setRole] = useState(colGejala.role)


    useEffect(() => {
    }, [colGejala])


    const updateGejala = async (e) => {
        e.preventDefault()
        try {
            await axios.patch(`${urlAPI}/gejala/${colGejala._id}`, {
                gejala,
                role
            })
            Swal.fire({
                icon: 'success',
                title: 'data berhasil diUpdate!',
                showConfirmButton: false,
                timer: 1500
            })
            handleClose()
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

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Update Penyakit</Modal.Title>
            </Modal.Header>
            <form onSubmit={updateGejala}>
                <Modal.Body>
                    {msg &&
                        <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                            <strong>{msg}!</strong>
                        </div>
                    }
                    <div className="mb-3">
                        <label form="gejala" className="form-label">Gejala Penyakit</label>
                        <input type="text" className="form-control" id="gejala" placeholder='gejala penyakit' value={gejala} onChange={(e) => setGejala(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label form="Gejala" className="form-label">Role Gejala</label>
                        <select id='Gejala' defaultValue={''} className="form-select text-capitalize" aria-label="Default select example" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option disabled value={''}>Pilih Role</option>
                            {dataBobot.map((bobot, index) => (
                                <option key={index} value={bobot.nilai}>{bobot.ket}</option>
                            ))}
                        </select>
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

export default EditGejala