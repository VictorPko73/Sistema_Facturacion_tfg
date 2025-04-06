import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente para mostrar la lista de clientes
function ClientesList() {
    // Estado para almacenar la lista de clientes y el estado de carga
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // NUEVA FUCION PARA ELIMINAR Y MODIFICAR CLIENTES

    // Añadir esta función dentro del componente
    const handleDeleteCliente = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await axios.delete(`http://localhost:5001/api/clientes/${id}`);
                // Actualizar la lista después de eliminar
                setClientes(clientes.filter(cliente => cliente.id !== id));
            } catch (error) {
                console.error('Error al eliminar cliente:', error);
                // Mostrar el mensaje de error específico si el API lo proporciona
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    alert('Error al eliminar el cliente.');
                }
            }
        }
    };

    //---------------------------------------------------------------------


    // Efecto para cargar los clientes al montar el componente
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                // Realizar petición GET a la API
                const response = await axios.get('http://localhost:5001/api/clientes');
                // Actualizar estado con los datos recibidos
                setClientes(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar clientes:', error);
                setError('Error al cargar los clientes. Por favor, intenta de nuevo.');
                setLoading(false);
            }
        };

        fetchClientes();
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
                <h2>Listado de Clientes</h2>
                <Link to="/clientes/nuevo" className="btn btn-primary">
                    Nuevo Cliente
                </Link>
            </div>

            {/* Mostrar mensaje si no hay clientes */}
            {clientes.length === 0 ? (
                <div className="alert alert-info">No hay clientes registrados.</div>
            ) : (
                // Tabla de clientes
                <div className="table-responsive">
                   // Modificar la tabla para incluir una columna de acciones
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.direccion}</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <Link to={`/clientes/editar/${cliente.id}`} className="btn btn-sm btn-warning me-1">
                                                Editar
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteCliente(cliente.id)}
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
            )
            }
        </div >
    );
}

export default ClientesList;