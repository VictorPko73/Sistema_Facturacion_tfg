import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { descargarFacturaPDF, abrirFacturaPDF } from '../../services/pdfService';

function FacturaDetalle() {
    const { id } = useParams();
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/facturas/${id}`);
                setFactura(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar factura:', error);
                setError('Error al cargar los detalles de la factura.');
                setLoading(false);
            }
        };

        fetchFactura();
    }, [id]);

    // Manejadores para los botones de PDF
    const handleDescargarPDF = () => {
        try {
            descargarFacturaPDF(factura);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert('Error al descargar el PDF');
        }
    };

    const handleVerPDF = () => {
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

    if (!factura) {
        return <div className="alert alert-warning">Factura no encontrada.</div>;
    }

    return (
        <div>
            {/* Encabezado con título y botones */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Factura #{factura.id}</h2>
                <div className="d-flex gap-2">
                    <Link to="/facturas" className="btn btn-secondary">
                        Volver a Facturas
                    </Link>
                    <button
                        className="btn btn-primary"
                        onClick={handleDescargarPDF}
                    >
                        Descargar PDF
                    </button>
                    <button
                        className="btn btn-info"
                        onClick={handleVerPDF}
                    >
                        Ver PDF
                    </button>
                </div>
            </div>

            {/* Resto del componente igual que antes */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Información General</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Cliente:</strong> {factura.cliente_nombre}</p>
                            <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString()}</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p><strong>Total:</strong> ${factura.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Detalle de Productos</h5>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.detalles.map((detalle) => (
                                    <tr key={detalle.id}>
                                        <td>{detalle.producto_nombre}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>{detalle.precio_unitario.toFixed(2)} €</td>
                                        <td>{detalle.subtotal.toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3" className="text-end">Total:</th>
                                    <th>{factura.total.toFixed(2)} €</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FacturaDetalle;