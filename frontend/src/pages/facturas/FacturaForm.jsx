import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Componente para crear nuevas facturas
function FacturaForm() {
    const navigate = useNavigate();

    // Estado para almacenar listas de clientes y productos
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);

    // Estado para controlar carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estado para los datos de la factura
    const [factura, setFactura] = useState({
        cliente_id: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        detalles: [],
        total: 0
    });

    // Estados para el producto que se está agregando
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);

    // Cargar clientes y productos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Realizar ambas peticiones en paralelo
                const [clientesRes, productosRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/clientes'),
                    axios.get('http://localhost:5001/api/productos')
                ]);

                setClientes(clientesRes.data);
                setProductos(productosRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar los datos necesarios para crear la factura.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para calcular el total de la factura
    const calcularTotal = (detalles) => {
        return detalles.reduce((sum, item) => sum + item.subtotal, 0);
    };

    // Manejador para cambio de cliente
    const handleClienteChange = (e) => {
        setFactura({
            ...factura,
            cliente_id: e.target.value
        });
    };

    // Manejador para cambio de producto
    const handleProductoChange = (e) => {
        setProductoSeleccionado(e.target.value);
    };

    // Manejador para cambio de cantidad
    const handleCantidadChange = (e) => {
        setCantidad(parseInt(e.target.value, 10));
    };

    // Función para agregar un producto a la factura
    const agregarProducto = () => {
        // Validaciones básicas
        if (!productoSeleccionado || cantidad <= 0) return;

        // Buscar el producto seleccionado en la lista
        const producto = productos.find(p => p.id === parseInt(productoSeleccionado, 10));
        if (!producto) return;

        // Calcular precio y subtotal
        const precioUnitario = producto.precio;
        const subtotal = precioUnitario * cantidad;

        // Crear objeto de detalle
        const nuevoDetalle = {
            producto_id: producto.id,
            producto_nombre: producto.nombre,
            cantidad,
            precio_unitario: precioUnitario,
            subtotal
        };

        // Actualizar factura con el nuevo detalle
        const nuevosDetalles = [...factura.detalles, nuevoDetalle];
        const nuevoTotal = calcularTotal(nuevosDetalles);

        setFactura({
            ...factura,
            detalles: nuevosDetalles,
            total: nuevoTotal
        });

        // Resetear selección para el siguiente producto
        setProductoSeleccionado('');
        setCantidad(1);
    };

    // Función para eliminar un producto de la factura
    const eliminarProducto = (index) => {
        const nuevosDetalles = factura.detalles.filter((_, i) => i !== index);
        const nuevoTotal = calcularTotal(nuevosDetalles);

        setFactura({
            ...factura,
            detalles: nuevosDetalles,
            total: nuevoTotal
        });
    };

    // Manejador para envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!factura.cliente_id) {
            setError('Debes seleccionar un cliente.');
            return;
        }

        if (factura.detalles.length === 0) {
            setError('Debes agregar al menos un producto.');
            return;
        }

        try {
            // Enviar factura a la API
            await axios.post('http://localhost:5001/api/facturas', factura);
            // Redireccionar al listado de facturas
            navigate('/facturas');
        } catch (error) {
            console.error('Error al guardar factura:', error);
            setError('Error al guardar la factura. Por favor, inténtalo de nuevo.');
        }
    };

    // Mostrar spinner mientras se cargan los datos
    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    return (
        <div>
            <h2>Nueva Factura</h2>
            {/* Mostrar mensajes de error si los hay */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Sección de datos principales */}
                <div className="row mb-4">
                    {/* Selección de cliente */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="cliente" className="form-label">Cliente</label>
                            <select
                                className="form-select"
                                id="cliente"
                                value={factura.cliente_id}
                                onChange={handleClienteChange}
                                required
                            >
                                <option value="">Selecciona un cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selección de fecha */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="fecha" className="form-label">Fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha"
                                value={factura.fecha}
                                onChange={(e) => setFactura({ ...factura, fecha: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Sección para agregar productos */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Agregar Productos</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {/* Selección de producto */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="producto" className="form-label">Producto</label>
                                    <select
                                        className="form-select"
                                        id="producto"
                                        value={productoSeleccionado}
                                        onChange={handleProductoChange}
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {productos.map(producto => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.nombre} - ${producto.precio.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Entrada de cantidad */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="cantidad"
                                        min="1"
                                        value={cantidad}
                                        onChange={handleCantidadChange}
                                    />
                                </div>
                            </div>

                            {/* Botón para agregar producto */}
                            <div className="col-md-2 d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3 w-100"
                                    onClick={agregarProducto}
                                    disabled={!productoSeleccionado}
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección para mostrar el detalle de la factura */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Detalle de Factura</h5>
                    </div>
                    <div className="card-body">
                        {factura.detalles.length === 0 ? (
                            <div className="alert alert-info">No hay productos agregados.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Subtotal</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {factura.detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.producto_nombre}</td>
                                                <td>{detalle.cantidad}</td>
                                                <td>${detalle.precio_unitario.toFixed(2)}</td>
                                                <td>${detalle.subtotal.toFixed(2)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => eliminarProducto(index)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="3" className="text-end">Total:</th>
                                            <th>${factura.total.toFixed(2)}</th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        Guardar Factura
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/facturas')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FacturaForm;