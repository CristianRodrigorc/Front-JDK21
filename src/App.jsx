import 'bootstrap-icons/font/bootstrap-icons.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home' 


import Profesor from './pages/Profesor'
import Materia from './pages/Materia'
import Curso from './pages/Curso'
import Centros from './pages/Centros'
import Empresa from './pages/Empresa'
import Comunidad from './pages/Comunidad'

function App() {
  return (
    <div className="w-full h-full bg-gray-100 ">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 justif bg-surface shadow-custom">
        <div>
          <h1 className="flex items-center gap-2 m-0 text-lg font-medium">
            🎓 Academia Panel 
            <span className="bg-accent-soft text-accent px-2 py-0.5 rounded-full text-xs uppercase tracking-wider">demo</span>
          </h1>
        </div>
        <nav>
          <ul className="hidden font-michroma md:flex flex-row md:w-1/3 gap-4 text-md md:text-md lg:text-xl lg:gap-6 [&>li:hover]:underline ">
            <li><Link to="/profesor">Profesor</Link></li>
            <li><Link to="/materia">Materia</Link></li>
            <li><Link to="/curso">Curso</Link></li>
            <li><Link to="/comunidad">Comunidad</Link></li>
            <li><Link to="/centros">Centros</Link></li>
            <li><Link to="/empresa">Empresa</Link></li>
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <small className="text-xs text-muted">GraphQL & REST · Spring</small>
          <img src="https://www.hacerta.es/wp-content/uploads/2022/02/logo-hacerta-blanco.png"
            alt="Hacerta.es"
            className="h-6 bg-orange px-1.5 py-0.5 rounded-md" />
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profesor" element={<Profesor />}/>
          <Route path="/materia" element={<Materia />}/>
          <Route path="/curso" element={<Curso />}/>
          <Route path="/comunidad" element={<Comunidad />}/>
          <Route path="/centros" element={<Centros />}/>
          <Route path="/empresa" element={<Empresa />}/>
        </Routes>
      </main>

      <footer className="py-4 mt-16 text-center text-gray-600 border-t border-gray-200">
        <p className="text-sm">
          Proyecto Demo: Panel de Gestión Académica | Desarrollado por JDK21
        </p>
        <p className="mt-1 text-xs text-muted">
          Utilizando React, React Router, GraphQL & REST (Spring Boot).
        </p>
      </footer>
    </div>
  )
}

export default App;