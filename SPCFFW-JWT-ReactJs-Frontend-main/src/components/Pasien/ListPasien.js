import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { urlAPI } from '../../config/API'
import InfinityScroll from 'react-infinite-scroll-component'
import Swal from 'sweetalert2'
import DetilePasien from './DetilePasien'
import { Modal } from 'react-bootstrap'
import ModalDialog from 'react-bootstrap/ModalDialog'

const ListPasien = () => {

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [keyword, setKeyword] = useState('')
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(20)
    const [totalRows, setTotalRows] = useState(0)
    const [skip, setSkip] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [filter, setFilter] = useState('')

    const [pasien, setPasien] = useState({})

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        getUsers()
    }, [filter, search, skip])

    const getUsers = async () => {
        try {
            if (users.length <= 0) {
                setLoading(true)
            }
            const response = await axios.get(`${urlAPI}/users`, {
                params: {
                    limit,
                    skip,
                    search,
                    filter
                }
            })
            const newUsers = response.data.result
            setUsers([...users, ...newUsers])
            setTotalRows(response.data.totalRows)
            setHasMore(response.data.hasMore)
        } catch (error) {
            console.info(error.mesaage)
        }

        setLoading(false)
    }

    const fetchMore = async () => {
        console.info(limit + skip)
        setSkip(limit + skip)
    }

    const Filter = (data) => {
        if (filter != data) {
            setSkip(0)
            setUsers([])
            setFilter(data)
        }
    }

    const searchData = (e) => {
        e.preventDefault()
        if (search != keyword) {
            setSkip(0)
            setUsers([])
            setSearch(keyword)
        }
    }

    const deleteUser = async (id) => {
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
                    await axios.delete(`${urlAPI}/users/${id}`)
                    setSkip(0)
                    setFilter('')
                    setUsers([])
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

    const alertIfNul = () => {
        const res = {
            consultation: '8',
            noConsultation: '6',
        }
        return res[filter] ?? '7'
    }

    return (
        <div>
            <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">Data Users</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Contact</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="container-xxl" style={{ paddingBottom: '100px' }}>
                <div className='container'>

                    {loading && (
                        <div className="d-flex justify-content-center my-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) || (
                            <div className="mx-4 ">


                                <div className="row my-4">
                                    <div className='col-sm-3 mb-2'>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle text-capitalize" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                                {filter == '' ? 'Filter : Semua' : `Filter : ${filter}`}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                                <li><button
                                                    onClick={() => Filter('')}
                                                    className={filter == '' ? "dropdown-item active" : "dropdown-item"}
                                                >
                                                    Semua
                                                </button></li>
                                                <li><button
                                                    onClick={() => Filter('noConsultation')}
                                                    className={filter == 'noConsultation' ? "dropdown-item active" : "dropdown-item"}
                                                >
                                                    NoConsultation
                                                </button></li>
                                                <li><button
                                                    onClick={() => Filter('consultation')}
                                                    className={filter == 'consultation' ? "dropdown-item active" : "dropdown-item"}
                                                >
                                                    Consultation
                                                </button></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <form onSubmit={searchData} >
                                            <div className="input-group mb-3">
                                                <input type="text"
                                                    value={keyword}
                                                    onChange={(e) => setKeyword(e.target.value)}
                                                    className="form-control" placeholder="Recipient's username"
                                                    aria-label="Recipient's username"
                                                    aria-describedby="button-addon2"
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="submit" id="button-addon2"
                                                >
                                                    Cari
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>


                                <InfinityScroll
                                    dataLength={users.length}
                                    next={fetchMore}
                                    hasMore={hasMore}
                                    loader={<p>Loading...</p>}
                                >

                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">Email</th>

                                                <th scope="col">Role</th>
                                                <th scope="col">Register</th>
                                                {filter == '' && (
                                                    <th scope="col">Konsultasi</th>
                                                )}
                                                {filter === "consultation" && (
                                                    <>
                                                        <th scope="col">First Consult</th>
                                                        <th scope="col">Last Consult</th>
                                                    </>
                                                )}
                                                <th scope="col">Handle</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length > 0 &&
                                                users.map((user, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{user.fullName}</td>
                                                        <td>{user.email}</td>
                                                        {user.role === "admin" && (
                                                            <td>
                                                                <h6>
                                                                    <span className="badge bg-dark">{user.role}</span>
                                                                </h6>
                                                            </td>
                                                        ) || (
                                                                <td>
                                                                    <h6>
                                                                        <span className="badge bg-info bg-light text-dark">{user.role}</span>
                                                                    </h6>
                                                                </td>
                                                            )}
                                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                        {(user.patients.length > 0 && filter == '') && (

                                                            <td>
                                                                <span className="badge text-success">
                                                                    <i
                                                                        className="text-success fa fa-check-square fa-lg"
                                                                        style={{ marginRight: "8px" }}
                                                                        aria-hidden="true"
                                                                    ></i>
                                                                    {filter}
                                                                </span>
                                                            </td>
                                                        ) || (user.patients.length < 1 && filter == '') && (
                                                            <td>
                                                                <span className="badge text-danger">
                                                                    <i
                                                                        className="text-danger fa fa-minus-square fa-lg"
                                                                        aria-hidden="true"
                                                                    ></i>
                                                                </span>
                                                            </td>
                                                        )}
                                                        {filter === "consultation" && user.patients.length > 0 && (
                                                            <>
                                                                <td>
                                                                    {new Date(user.patients[0].createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td>
                                                                    {new Date(user.patients[user.patients.length - 1].createdAt).toLocaleDateString()}
                                                                </td>
                                                            </>
                                                        )}
                                                        <td>
                                                            <div className="btn-group">
                                                                <button type='button' href="#" onClick={() => { setPasien(user); handleShow() }} className='btn btn-info btn-sm'
                                                                    data-bs-toggle="modal" data-bs-target="#detile-modal">
                                                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>
                                                                <button type="button" onClick={() => deleteUser(user._id)} className='btn btn-danger btn-sm'>
                                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) || (

                                                    <tr>
                                                        <td colSpan={alertIfNul()}>
                                                            <p className="alert alert-warning text-center" role="alert">Data user masih kosong</p>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </InfinityScroll>

                            </div>
                        )}
                </div>
                <Modal show={show} onHide={handleClose} size={'xl'}>
                    <DetilePasien
                        show={show}
                        handleClose={handleClose}
                        dataPasien={pasien}
                    />
                </Modal>
            </div>
        </div>
    )
}

export default ListPasien