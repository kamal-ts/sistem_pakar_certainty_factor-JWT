import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard';
import Login from "./components/Login";
import Navbar from './components/Navbar';
import Register from './components/Register';
import Footer from './components/Footer'
import IsNotFound from './components/ISNotFound'
import { ListMakanan } from './components/Makanan/index'
import { ListPenyakit, ListGejala } from './components/Penyakit/index'
import { ListPasien } from './components/Pasien';
import { KonsultasiMakanan, KonsultasiPakar } from './components/Konsultasi';
import { Profile } from './components/Pasien';

function App() {
  return (
    <BrowserRouter>
      <div className="container-xxl bg-white p-0">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='/' element={[<Navbar />, <Dashboard />, <Footer />]} />
          <Route path='makanan' element={[<Navbar />, <ListMakanan />, <Footer />]} />
          <Route path='penyakit' element={[<Navbar />, <ListPenyakit />, <Footer />]} />
          <Route path='penyakit/:id' element={[<Navbar />, <ListGejala />, <Footer />]} />

          <Route path='users' element={[<Navbar />, <ListPasien />, <Footer />]} />

          <Route path='konsultasi-penyakit' element={[<Navbar />, <KonsultasiPakar />, <Footer />]} />
          <Route path='konsultasi-makanan' element={[<Navbar />, <KonsultasiMakanan />, <Footer />]} />

          <Route path='profile' element={[<Navbar />, <Profile />, <Footer />]} />

          <Route path='/*' element={[<Navbar />, <IsNotFound />, <Footer />]} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
