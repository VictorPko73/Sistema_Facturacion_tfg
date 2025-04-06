import { Link } from 'react-router-dom';

// Página de inicio de la aplicación
function Home() {
    return (
        <div className="jumbotron">
            <h1 className="display-4">Sistema de Facturación</h1>
            <p className="lead">
                Gestiona tus clientes, productos y facturas de manera sencilla.
            </p>
            <hr className="my-4" />

            {/* Tarjetas de acceso rápido */}
            <div className="row">
                {/* Tarjeta de Clientes */}
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Clientes</h5>
                            <p className="card-text">Administra la información de tus clientes.</p>
                            <Link to="/clientes" className="btn btn-primary">Ver Clientes</Link>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Productos */}
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Productos</h5>
                            <p className="card-text">Gestiona tu inventario de productos.</p>
                            <Link to="/productos" className="btn btn-primary">Ver Productos</Link>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Facturas */}
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Facturas</h5>
                            <p className="card-text">Crea y consulta facturas para tus clientes.</p>
                            <Link to="/facturas" className="btn btn-primary">Ver Facturas</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;