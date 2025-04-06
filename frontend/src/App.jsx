import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClientesList from './pages/clientes/ClientesList';
import ClienteForm from './pages/clientes/ClienteForm';
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './pages/productos/ProductoForm';
import FacturasList from './pages/facturas/FacturasList';
import FacturaForm from './pages/facturas/FacturaForm';
import FacturaDetalle from './pages/facturas/FacturaDetalle';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <div className="App">
        {/* Barra de navegación principal */}
        <Navbar />
        
        {/* Contenedor principal para todas las páginas */}
        <div className="container mt-4">
          {/* Configuración de rutas */}
          <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas para clientes */}
            <Route path="/clientes" element={<ClientesList />} />
            <Route path="/clientes/nuevo" element={<ClienteForm />} />
            <Route path="/clientes/editar/:id" element={<ClienteForm />} />
            
            {/* Rutas para productos */}
            <Route path="/productos" element={<ProductosList />} />
            <Route path="/productos/nuevo" element={<ProductoForm />} />
            <Route path="/productos/editar/:id" element={<ProductoForm />} />
            
            {/* Rutas para facturas */}
            <Route path="/facturas" element={<FacturasList />} />
            <Route path="/facturas/nueva" element={<FacturaForm />} />
            <Route path="/facturas/:id" element={<FacturaDetalle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;