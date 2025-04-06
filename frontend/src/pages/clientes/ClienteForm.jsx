import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Componente para crear y editar clientes
function ClienteForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener id de la URL si estamos editando
    const isEditing = !!id; // Flag para saber si estamos editando o creando

    // Estado para almacenar los datos del formulario
    const [cliente, setCliente] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
    });

    // Estados para manejar carga y errores
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(isEditing);
    const [error, setError] = useState('');

    // Si estamos editando, cargar los datos del cliente
    useEffect(() => {
        if (isEditing) {
            const fetchCliente = async () => {
                try {
                    const response = await axios.get(`http://localhost:5001/api/clientes/${id}`);
                    setCliente(response.data);
                    setFetchingData(false);
                } catch (error) {
                    console.error('Error al cargar cliente:', error);
                    setError('Error al cargar los datos del cliente.');
                    setFetchingData(false);
                }
            };

            fetchCliente();
        }
    }, [id, isEditing]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prevCliente => ({
            ...prevCliente,
            [name]: value
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing) {
                // Si estamos editando, hacer PUT
                await axios.put(`http://localhost:5001/api/clientes/${id}`, cliente);
            } else {
                // Si estamos creando, hacer POST
                await axios.post('http://localhost:5001/api/clientes', cliente);
            }
            // Redireccionar al listado después de guardar
            navigate('/clientes');
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            setError('Error al guardar el cliente. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };

    // Mostrar spinner mientras se cargan los datos en modo edición
    if (fetchingData) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>

            {/* Mostrar mensajes de error si los hay */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Formulario (igual que antes) */}
            <form onSubmit={handleSubmit}>
                {/* ...campos del formulario como antes... */}
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={cliente.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={cliente.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={cliente.telefono}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <textarea
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={cliente.direccion}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/clientes')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ClienteForm;