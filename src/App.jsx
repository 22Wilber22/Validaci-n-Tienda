import './App.css'
import { Route, BrowserRouter, Routes, Link} from 'react-router-dom'
import Inicio from './assets/Componentes/Paginas/Inicio'
import Login from './assets/Componentes/Login'
import Register from './assets/Componentes/Paginas/Register'
import EditForm from './assets/Componentes/Paginas/EditForm'
import RegisterProduct from './assets/Componentes/Paginas/RegisterProduct'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/inicio' element={<Inicio />} />
        <Route path='/registro' element={<Register />} />
        <Route path='/editar/:id' element={<EditForm />} /> 
        <Route path='/agregar' element={<RegisterProduct />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
