import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Componente para crear y editar productos
function ProductoForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener id de la URL si estamos editando
    const isEditing = !!id; // Flag para saber si estamos editando o creando

    // Estado para almacenar los datos del formulario
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: ''
    });

    // Estados para manejar carga y errores
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(isEditing);
    const [error, setError] = useState('');

    // Si estamos editando, cargar los datos del producto
    useEffect(() => {
        if (isEditing) {
            const fetchProducto = async () => {
                try {
                    const response = await axios.get(`http://localhost:5001/api/productos/${id}`);
                    setProducto(response.data);
                    setFetchingData(false);
                } catch (error) {
                    console.error('Error al cargar producto:', error);
                    setError('Error al cargar los datos del producto.');
                    setFetchingData(false);
                }
            };

            fetchProducto();
        }
    }, [id, isEditing]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProducto => ({
            ...prevProducto,
            [name]: value
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convertir precio y stock a números antes de enviar
            const productoData = {
                ...producto,
                precio: parseFloat(producto.precio),
                stock: parseInt(producto.stock, 10)
            };

            if (isEditing) {
                // Si estamos editando, hacer PUT
                await axios.put(`http://localhost:5001/api/productos/${id}`, productoData);
            } else {
                // Si estamos creando, hacer POST
                await axios.post('http://localhost:5001/api/productos', productoData);
            }
            // Redireccionar al listado después de guardar
            navigate('/productos');
        } catch (error) {
            console.error('Error al guardar producto:', error);
            setError('Error al guardar el producto. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };

    // Mostrar spinner mientras se cargan los datos en modo edición
    if (fetchingData) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>

            {/* Mostrar mensajes de error si los hay */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
                {/* Campo: Nombre */}
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo: Descripción */}
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>

                {/* Campo: Precio */}
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        id="precio"
                        name="precio"
                        value={producto.precio}
                        onChange={handleChange}
                        required
                    />
                    <small className="form-text text-muted">Ingrese el precio unitario</small>
                </div>

                {/* Campo: Stock */}
                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={producto.stock}
                        onChange={handleChange}
                        required
                    />
                    <small className="form-text text-muted">Cantidad disponible en inventario</small>
                </div>

                {/* Botones de acción */}
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/productos')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductoForm;