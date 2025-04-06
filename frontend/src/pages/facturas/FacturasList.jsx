import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente para mostrar la lista de facturas
function FacturasList() {
    // Estado para almacenar la lista de facturas y el estado de carga
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleDeleteFactura = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
            try {
                await axios.delete(`http://localhost:5001/api/facturas/${id}`);
                // Actualizar la lista después de eliminar
                setFacturas(facturas.filter(factura => factura.id !== id));
            } catch (error) {
                console.error('Error al eliminar factura:', error);
                alert('Error al eliminar la factura.');
            }
        }
    };

    // Efecto para cargar las facturas al montar el componente
    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                // Realizar petición GET a la API
                const response = await axios.get('http://localhost:5001/api/facturas');
                // Actualizar estado con los datos recibidos
                setFacturas(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar facturas:', error);
                setError('Error al cargar las facturas. Por favor, intenta de nuevo.');
                setLoading(false);
            }
        };

        fetchFacturas();
    }, []);

    // Mostrar spinner mientras se cargan los datos
    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    // Mostrar mensaje de error si hay algún problema
    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            {/* Encabezado con título y botón para agregar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Listado de Facturas</h2>
                <Link to="/facturas/nueva" className="btn btn-primary">
                    Nueva Factura
                </Link>
            </div>

            {/* Mostrar mensaje si no hay facturas */}
            {facturas.length === 0 ? (
                <div className="alert alert-info">No hay facturas registradas.</div>
            ) : (
                // Tabla de facturas
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map(factura => (
                                <tr key={factura.id}>
                                    <td>{factura.id}</td>
                                    <td>{factura.cliente_nombre}</td>
                                    <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                                    <td>${factura.total.toFixed(2)}</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <Link to={`/facturas/${factura.id}`} className="btn btn-sm btn-info me-1">
                                                Ver Detalles
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteFactura(factura.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FacturasList;