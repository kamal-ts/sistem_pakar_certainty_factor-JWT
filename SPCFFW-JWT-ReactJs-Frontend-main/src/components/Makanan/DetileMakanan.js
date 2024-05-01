import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import { Markup } from 'interweave';



export default function DetileMakanan({ id }) {

    useEffect(() => {
        getDeetail()
    }, [id])


    const [makanan, setMakanan] = useState({
        nama: '',
        penyakit: '',
        status: '',
        deskripsi: ''
    })

    const getDeetail = async () => {
        try {
            const response = await axios.get(`${urlAPI}/makanan/${id}`)
            setMakanan(response.data)
        } catch (error) {
            console.info(error.response.data)
        }
    }

    return (
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="text-editor-modal">Detail Makanan</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <h1 className="card-title text-capitalize">{makanan.nama}</h1>
                    <p className="fs-5 mb-2 text-capitalize">penyakit : {makanan.penyakit}</p>
                    <p className={makanan.status == 'rekomendasi' ? "fs-5 mb-2 text-capitalize text-success" : 'fs-5 mb-2 text-capitalize text-danger'}>status : {makanan.status}</p>
                    <hr/>
                    <h4>Deskripsi</h4>
                    <Markup content={makanan.deskripsi} />
                </div>
                <div className="modal-footer">
                </div>
            </div>
        </div>

    )
}
