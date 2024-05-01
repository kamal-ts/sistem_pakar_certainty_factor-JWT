import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Dashboard = () => {

  // const [name, setName] = useState('')
  // const [token, setToken] = useState('')
  // const [expire, setExpire] = useState('')
  // const navigate = useNavigate()

  // useEffect(() => {
  //   refreshToke()
  // }, [])


  // const refreshToke = async () => {
  //   try {
  //     const response = await axios.get(`${urlAPI}/token`)
  //     setToken(response.data.accessToken)
  //     const decoded = jwt_decode(response.data.accessToken)
  //     setName(decoded.fullName)
  //     setExpire(decoded.exp)
  //   } catch (error) {
  //     if (error.response) {
  //       navigate('/')
  //     }
  //   }
  // }

  // const axiosJWT = axios.create()

  // axiosJWT.interceptors.request.use(async (config) => {
  //   const currentDate = new Date()
  //   if (expire * 1000 < currentDate.getTime()) {
  //     const response = await axios.get(`${urlAPI}/token`)
  //     config.headers.Authorization = `Bearer ${response.data.accessToken}`
  //     setToken(response.data.accessToken)
  //     const decoded = jwt_decode(response.data.accessToken)
  //     setName(decoded.fullName)
  //     setExpire(decoded.exp)
  //   }
  //   return config
  // }, (error) => Promise.reject(error))

  // const getUsers = async () => {
  //   const response = await axiosJWT.get(`${urlAPI}/users`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   console.info(response.data)
  // }

  return (
    <div>
      <div className="container-xxl position-relative p-0">
        <div className="container-xxl bg-primary hero-header">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6 text-center text-lg-start">
                <h1 className="text-white mb-4 animated zoomIn text-capitalize">We help people to live healthier</h1>
                <p className="text-white pb-3 animated zoomIn">We offer solutions for those of you who may have trouble finding information related to your health. You can do an expert consultation and you can find out a list of foods that are healthy and bad for health</p>
                <a href="#service" className="btn btn-outline-light rounded-pill border-2 py-3 px-5 animated slideInRight">Learn More</a>
              </div>
              <div className="col-lg-6 text-center text-lg-start">
                <img className="img-fluid animated zoomIn" src="img/hero2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id='service' className="container-xxl py-6">
        <div className="container">
          <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Our Services</div>
            <h2 className="mb-5">The Following Are The Services We Provide For You</h2>
          </div>
          <div className="row g-4">
            <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <Link to={'/konsultasi-penyakit'}>
                <div className="service-item shadow-lg rounded h-100">
                  <div className="d-flex justify-content-between">
                    <div className="service-icon">
                      <i className="fa fa-stethoscope fa-2x"></i>
                    </div>
                    <div className="service-btn" >
                      <i className="fa fa-link fa-2x"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-3">Konsultasi Penyakit</h3>
                    <span className='text-dark'>Konsultasi penyakit untuk mengetahui diagnosa penyakit yang kemungkinan diderita berdasarkan gejala yang sedang dialami oleh pasien.</span>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <Link to={'/konsultasi-makanan'} >
                <div className="service-item shadow-lg rounded h-100">
                  <div className="d-flex justify-content-between">
                    <div className="service-icon">
                      <i className="fa fa-apple fa-2x"></i>
                    </div>
                    <div className="service-btn" >
                      <i className="fa fa-link fa-2x"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-3">Konsultasi Makanan</h3>
                    <span className='text-dark'>Konsultasi makanan untuk mengetahui jenis makanan apa saja yang diRekomendasi dan dilarangan sesuai dengan penyakit yang diderita</span>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}

export default Dashboard