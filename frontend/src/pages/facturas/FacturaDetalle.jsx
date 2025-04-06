import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Componente para mostrar el detalle de una factura
function FacturaDetalle() {
    // Obtener el ID de la factura de la URL
    const { id } = useParams();

    // Estado para almacenar los datos de la factura
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Cargar datos de la factura al montar el componente
    useEffect(() => {
        const fetchFactura = async () => {
            try {
                // Realizar petición GET a la API
                const response = await axios.get(`http://localhost:5001/api/facturas/${id}`);
                // Actualizar estado con los datos recibidos
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

    // Mostrar spinner mientras se cargan los datos
    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    // Mostrar mensaje de error si hay algún problema
    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    // Mostrar mensaje si no se encuentra la factura
    if (!factura) {
        return <div className="alert alert-warning">Factura no encontrada.</div>;
    }

    return (
        <div>
            {/* Encabezado con título y botón para volver */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Factura #{factura.id}</h2>
                <Link to="/facturas" className="btn btn-secondary">
                    Volver a Facturas
                </Link>
            </div>

            {/* Tarjeta con información general */}
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

            {/* Tarjeta con detalle de productos */}
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
                                        <td>${detalle.precio_unitario.toFixed(2)}</td>
                                        <td>${detalle.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3" className="text-end">Total:</th>
                                    <th>${factura.total.toFixed(2)}</th>
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