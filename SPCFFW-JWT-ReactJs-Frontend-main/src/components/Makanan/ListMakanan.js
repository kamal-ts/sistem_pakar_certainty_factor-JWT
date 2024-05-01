import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'
import { DetileMakanan, EditMakanan } from './index'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const ListMakanan = () => {


    const [dataMakanan, setDataMakanan] = useState([])
    const [totalPage, setTotalPage] = useState('')
    const [totalRows, setTotalRows] = useState('')
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')

    const [nama, setNama] = useState('')
    const [penyakit, setPenyakit] = useState('')
    const [status, setStatus] = useState('')
    const [deskripsi, setDeskripsi] = useState('')

    const [filterStatus, setFilterStatus] = useState('')
    const [dataPenyakit, setDataPenyakit] = useState([])


    const [msg, setMsg] = useState('')

    const placeholder = 'Write something about...';

    const { quill, quillRef } = useQuill({ placeholder });

    const [detileMakanan, setDetileMakanan] = useState('')
    const [editMakanan, setEditMakanan] = useState('')

    // login
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        refreshToke()
        getMakanan()
        getPenyakit()
        if (quill) {
            quill.on('text-change', () => {
                console.log(quillRef.current.firstChild.innerHTML)
                setDeskripsi(quillRef.current.firstChild.innerHTML)
            });
        }
    }, [page, search, filterStatus, quill])

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


    const getMakanan = async () => {
        try {
            const response = await axios.get(`${urlAPI}/makanan?page=${page}&limit=10&search=${search}&status=${filterStatus}`)
            setDataMakanan(response.data.result)
            setTotalPage(response.data.totalPage)
            setTotalRows(response.data.totalRows)
        } catch (error) {
            console.info(error.response)
        }
    }

    const getPenyakit = async () => {
        try {
            const response = await axiosJWT.get(`${urlAPI}/penyakit?select=namaPenyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDataPenyakit(response.data)
        } catch (error) {
            console.info(error.response)
        }
    }

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    const searchData = (e) => {
        e.preventDefault()
        if (query != search) {
            setPage(0)
            setSearch(query)
        }
    }

    const Filter = (filter) => {
        setFilterStatus(filter)
        setPage(0)
    }

    const addMakanan = async (e) => {
        e.preventDefault()
        try {
            await axiosJWT.post(`${urlAPI}/makanan`, {
                nama,
                penyakit,
                status,
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
            clearForm()
            getMakanan()

        } catch (error) {
            setMsg(error.response.data.msg)
        }
    }

    const deleteMakanan = async (id) => {
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
                    await axiosJWT.delete(`${urlAPI}/makanan/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    getMakanan()
                    setPage(0)
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
        setNama('')
        setPenyakit('')
        setStatus('')
        setDeskripsi('')
        setMsg('')
        quill.clipboard.dangerouslyPasteHTML('');
    }


    return (
        <div>
            <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">Data Makanan</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Contact</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="container-xxl " style={{ paddingBottom: '100px' }}>
                <div className="container">
                    <div className='row'>
                        <div className='col-sm-4 wow fadeInUp' data-wow-delay="0.1s">
                            <div className='card shadow py-4 px-4'>
                                <h4 className='mb-4'>Tambah data Makanan</h4>
                                {msg &&
                                    <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                                        <strong>{msg}!</strong>
                                    </div>
                                }
                                <form onSubmit={addMakanan}>
                                    <div className="mb-3">
                                        <label form="nama" className="form-label">Nama Makanan</label>
                                        <input type="text" className="form-control" id="nama" placeholder='makanan' value={nama} onChange={(e) => setNama(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label form="penyakit" className="form-label">Kategori Penyakit</label>
                                        <select id='penyakit' className="form-select text-capitalize" aria-label="Default select example" value={penyakit} onChange={(e) => setPenyakit(e.target.value)}>
                                            <option defaultValue={''} value={''} disabled>Pilih Penyakit</option>
                                            {dataPenyakit.map((penyakit, index) => (
                                                <option key={index} value={penyakit.namaPenyakit}>{penyakit.namaPenyakit}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label form="status" className="form-label">Status Makanan</label>
                                        <select id='status' className="form-select" aria-label="Default select example" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option defaultValue={''} value={''} disabled>Pilih Status</option>
                                            <option value={'rekomendasi'}>Rekomendasi</option>
                                            <option value={'larangan'}>Larangan</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label form="status" className="form-label">Deskripsi</label>
                                        <div className="d-grid gap-2">
                                            <button className="btn bg-white text-start fw-normal border" data-bs-toggle="modal" data-bs-target="#text-editor-modal" type="button">Open Text Editor</button>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Simpan</button>
                                    {(nama || penyakit || status) && (
                                        <>
                                            <button type="button" onClick={() => clearForm()} className="btn btn-danger" style={{ marginLeft: '10px' }}>Cancel</button>
                                        </>
                                    )}
                                </form>
                            </div>
                        </div>
                        <div className='col-sm-8 wow fadeInUp' data-wow-delay="0.2s">
                            <div className='card shadow py-4 px-4'>
                                <div className='row'>

                                    <div className='col-sm-2 mb-2'>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                                Filter
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                                <li><button onClick={() => Filter('')} className={filterStatus == '' ? "dropdown-item active" : "dropdown-item"} >Semua</button></li>
                                                <li><button onClick={() => Filter('rekomendasi')} className={filterStatus == 'rekomendasi' ? "dropdown-item active" : "dropdown-item"}  >Rekomendasi</button></li>
                                                <li><button onClick={() => Filter('larangan')} className={filterStatus == 'larangan' ? "dropdown-item active" : "dropdown-item"} >Larangan</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='col-sm-10 '>
                                        <form onSubmit={searchData}>
                                            <div className="input-group col-md-6 mb-3">
                                                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="form-control" placeholder="masukkan kata kunci" aria-label="Recipient's username" aria-describedby="button-addon2" />
                                                <button className="btn btn-info" type='submit' id="button-addon2">Search</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Nama Makanan</th>
                                            <th scope="col">Kategori Penyakit</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataMakanan.map((makanan, index) => (
                                            <tr key={index}>
                                                <th scope="row">{page * 10 + (index + 1)}</th>
                                                <td>{makanan.nama}</td>
                                                <td>{makanan.penyakit}</td>
                                                <td>{makanan.status}</td>
                                                {/* <td><Markup content={makanan.deskripsi} /></td> */}
                                                <td>
                                                    <div className="btn-group">
                                                        <button type='button' href="#" className='btn btn-info btn-sm'
                                                            onClick={() => setDetileMakanan(makanan._id)} data-bs-toggle="modal" data-bs-target="#detile-modal">
                                                            <i className="fa fa-eye " aria-hidden="true"></i>
                                                        </button>
                                                        <button type='button' className='btn btn-warning btn-sm '
                                                            onClick={() => setEditMakanan(makanan._id)} data-bs-toggle="modal" data-bs-target="#edit-modal">
                                                            <i className="fa fa-pencil" aria-hidden="true"></i>
                                                        </button>
                                                        <button onClick={() => deleteMakanan(makanan._id)} type="button" className='btn btn-danger btn-sm'>
                                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p>Total Rows: {totalRows} | Page: {page + 1} of {totalPage}</p>
                                <nav className='align-self-center' key={totalRows} role={'navigation'} aria-label='pagination' >

                                    <ReactPaginate
                                        previousLabel={"< Prev"}
                                        nextLabel={"Next >"}
                                        pageCount={totalPage}
                                        onPageChange={changePage}
                                        containerClassName={"pagination"}
                                        pageLinkClassName={"page-link"}
                                        previousLinkClassName={"page-link"}
                                        nextLinkClassName={"page-link"}
                                        activeClassName={"page-item active"}
                                        disabledClassName={"page-item disabled"}
                                    />
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal text editor */}
            <div className="modal fade" id="text-editor-modal" tabIndex={"-1"} aria-labelledby="text-editor-modal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable h-100">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="text-editor-modal">Deskripi</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ height: 400 }}>
                                <div ref={quillRef} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Selesai</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="detile-modal" tabIndex={"-1"} aria-labelledby="text-editor-modal" aria-hidden="true">
                <DetileMakanan id={detileMakanan} />
            </div>

            <div className="modal fade" id="edit-modal" tabIndex={"-1"} aria-labelledby="text-editor-modal" aria-hidden="true">
                <EditMakanan id={editMakanan} click={getMakanan} token={token} />
            </div>
        </div>
    )
}

export default ListMakanan