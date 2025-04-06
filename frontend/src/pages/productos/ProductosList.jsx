import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente para mostrar la lista de productos
function ProductosList() {
    // Estado para almacenar la lista de productos y el estado de carga
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Efecto para cargar los productos al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Realizar petición GET a la API
                const response = await axios.get('http://localhost:5001/api/productos');
                // Actualizar estado con los datos recibidos
                setProductos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('Error al cargar los productos. Por favor, intenta de nuevo.');
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Añadir esta función dentro del componente para manejar la eliminación
    const handleDeleteProducto = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await axios.delete(`http://localhost:5001/api/productos/${id}`);
                // Actualizar la lista después de eliminar
                setProductos(productos.filter(producto => producto.id !== id));
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    alert('Error al eliminar el producto.');
                }
            }
        }
    };

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
                <h2>Listado de Productos</h2>
                <Link to="/productos/nuevo" className="btn btn-primary">
                    Nuevo Producto
                </Link>
            </div>

            {/* Mostrar mensaje si no hay productos */}
            {productos.length === 0 ? (
                <div className="alert alert-info">No hay productos registrados.</div>
            ) : (
                // Tabla de productos
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th> {/* Añadir esta columna */}
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(producto => (
                                <tr key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.precio.toFixed(2)} €</td>
                                    <td>{producto.stock}</td>
                                    <td> {/* Añadir esta celda con los botones */}
                                        <div className="btn-group" role="group">
                                            <Link to={`/productos/editar/${producto.id}`} className="btn btn-sm btn-warning me-1">
                                                Editar
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteProducto(producto.id)}
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

export default ProductosList;