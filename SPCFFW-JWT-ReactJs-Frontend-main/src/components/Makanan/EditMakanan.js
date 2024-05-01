import React, { useState, useEffect } from 'react'
import { useQuill } from 'react-quilljs';
import axios from 'axios'
import { urlAPI } from '../../config/API'
import Swal from 'sweetalert2'


export default function EditMakanan({ id, click, token }) {
    const [nama, setNama] = useState('')
    const [penyakit, setPenyakit] = useState('')
    const [status, setStatus] = useState('')
    const [deskripsi, setDeskripsi] = useState('')


    const [dataPenyakit, setDataPenyakit] = useState([])
    const [dataStatus, setdataStatus] = useState(['rekomendasi', 'larangan'])


    const { quill, quillRef } = useQuill();
    const [msg, setMsg] = useState('')

    useEffect(() => {
        getDeetail()
        getPenyakit()
        if (quill) {
            quill.on('text-change', () => {
                setDeskripsi(quillRef.current.firstChild.innerHTML)
            });
        }
    }, [id, quill])

    const getPenyakit = async () => {
        try {
            const response = await axios.get(`${urlAPI}/penyakit?select=namaPenyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDataPenyakit(response.data)

        } catch (error) {
            console.info(error.response.data)
        }
    }

    const getDeetail = async () => {
        try {
            const response = await axios.get(`${urlAPI}/makanan/${id}`)
            setNama(response.data.nama)
            setPenyakit(response.data.penyakit)
            setStatus(response.data.status)
            setDeskripsi(response.data.deskripsi)
            quill.clipboard.dangerouslyPasteHTML(response.data.deskripsi)

        } catch (error) {
            console.info(error.response.data)
        }
    }

    const updateMakanan = async (e) => {
        e.preventDefault()
        try {
            await axios.patch(`${urlAPI}/makanan/${id}`, {
                nama,
                penyakit,
                status,
                deskripsi
            })

            Swal.fire({
                icon: 'success',
                title: 'data berhasil diUpdate!',
                showConfirmButton: false,
                timer: 1500
            })
            click()
            setMsg('')

        } catch (error) {
            setMsg(error.response.data.msg)
        }
    }

    const clearForm = () => {
        setNama('')
        setPenyakit('')
        setStatus('')
        setDeskripsi('')
        setMsg('')
        quill.clipboard.dangerouslyPasteHTML('')
        getDeetail()
    }

    return (
        <div className="modal-dialog modal-xl ">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="text-editor-modal">Edit Makanan</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={updateMakanan}>
                    <div className="modal-body">
                        {msg &&
                            <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                                <strong>{msg}!</strong>
                            </div>
                        }
                        <div className='row g-3'>
                            <div className="col-md-4">
                                <label form="nama" className="form-label">Nama Makanan</label>
                                <input type="text" className="form-control" id="nama" placeholder='makanan' value={nama} onChange={(e) => setNama(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label form="penyakit" className="form-label">Kategori Penyakit</label>
                                <select id='penyakit' className="form-select text-capitalize" aria-label="Default select example" value={penyakit} onChange={(e) => setPenyakit(e.target.value)}>
                                    <option defaultValue={''} value={''} disabled>Pilih Penyakit</option>
                                    {dataPenyakit.map((penyakit, index) => (
                                        <option key={index} value={penyakit.namaPenyakit}>{penyakit.namaPenyakit}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label form="status" className="form-label">Status Makanan</label>
                                <select id='status' className="form-select" aria-label="Default select example" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option defaultValue={''} value={''} disabled>Pilih Status</option>
                                    {dataStatus.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-12">
                                <label form="deskripsi" className="form-label">Deskripsi</label>
                                <div style={{ height: 300 }}>
                                    <div ref={quillRef} />
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" >Simpan</button>
                        <button type="button" className="btn btn-secondary" onClick={() => clearForm()} data-bs-dismiss={"modal"}>Exit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
