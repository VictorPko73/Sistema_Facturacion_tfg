import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { abrirFacturaPDF } from '../../services/pdfService';

function FacturasList() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/facturas');
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

    // Función para eliminar factura
    const handleDeleteFactura = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
            try {
                await axios.delete(`http://localhost:5001/api/facturas/${id}`);
                setFacturas(facturas.filter(factura => factura.id !== id));
            } catch (error) {
                console.error('Error al eliminar factura:', error);
                alert('Error al eliminar la factura.');
            }
        }
    };

    // Función para ver PDF
    const handleVerPDF = (factura) => {
        try {
            abrirFacturaPDF(factura);
        } catch (error) {
            console.error('Error al abrir PDF:', error);
            alert('Error al abrir el PDF');
        }
    };

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Listado de Facturas</h2>
                <Link to="/facturas/nueva" className="btn btn-primary">
                    Nueva Factura
                </Link>
            </div>

            {facturas.length === 0 ? (
                <div className="alert alert-info">No hay facturas registradas.</div>
            ) : (
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
                                    <td>{factura.total.toFixed(2)} €</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <Link to={`/facturas/${factura.id}`} className="btn btn-sm btn-info me-1">
                                                Ver Detalles
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-primary me-1"
                                                onClick={() => handleVerPDF(factura)}
                                            >
                                                PDF
                                            </button>
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