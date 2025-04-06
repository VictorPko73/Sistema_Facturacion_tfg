from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Cliente, Producto, Factura, DetalleFactura
import os
from datetime import datetime

# Inicializar la aplicación Flask
app = Flask(__name__)

# Habilitar CORS para permitir peticiones desde el frontend
CORS(app)

# Configuración de la base de datos SQLite
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'facturacion.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos con la aplicación
db.init_app(app)

#------------------------------------------------------
# Rutas para el manejo de Clientes
#------------------------------------------------------

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    """
    Obtiene la lista de todos los clientes registrados.

    Método: GET
    Ruta: /api/clientes
    Respuesta: Lista de objetos cliente en formato JSON
    """
    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes])

@app.route('/api/clientes', methods=['POST'])
def add_cliente():
    """
    Crea un nuevo cliente con los datos proporcionados.

    Método: POST
    Ruta: /api/clientes
    Cuerpo de la petición: JSON con los datos del cliente
    Respuesta: Datos del cliente creado en formato JSON
    """
    data = request.json
    nuevo_cliente = Cliente(
        nombre=data['nombre'],
        email=data.get('email', ''),  # Usamos .get para campos opcionales
        telefono=data.get('telefono', ''),
        direccion=data.get('direccion', '')
    )
    db.session.add(nuevo_cliente)
    db.session.commit()
    return jsonify(nuevo_cliente.to_dict()), 201  # Código 201 Created

## MODIFICACION PARA ELIMINAR Y MODIFICAR CLLIENTES------------

@app.route('/api/clientes/<int:id>', methods=['PUT'])
def update_cliente(id):
    """
    Actualiza un cliente existente.

    Método: PUT
    Ruta: /api/clientes/<id>
    Cuerpo de la petición: JSON con los datos actualizados del cliente
    Respuesta: Datos del cliente actualizado en formato JSON
    """
    cliente = Cliente.query.get_or_404(id)
    data = request.json

    cliente.nombre = data['nombre']
    cliente.email = data.get('email', '')
    cliente.telefono = data.get('telefono', '')
    cliente.direccion = data.get('direccion', '')

    db.session.commit()
    return jsonify(cliente.to_dict())

@app.route('/api/clientes/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    """
    Elimina un cliente.

    Método: DELETE
    Ruta: /api/clientes/<id>
    Respuesta: Mensaje de confirmación o error si no se puede eliminar
    """
    cliente = Cliente.query.get_or_404(id)

    # Verificar si el cliente tiene facturas asociadas
    if cliente.facturas:
        return jsonify({"error": "No se puede eliminar el cliente porque tiene facturas asociadas"}), 400

    db.session.delete(cliente)
    db.session.commit()
    return jsonify({"message": "Cliente eliminado correctamente"})

#####-----------------------------------------------------------#####


@app.route('/api/clientes/<int:id>', methods=['GET'])
def get_cliente(id):
    """
    Obtiene un cliente específico por su ID.

    Método: GET
    Ruta: /api/clientes/<id>
    Respuesta: Datos del cliente en formato JSON o error 404 si no existe
    """
    cliente = Cliente.query.get_or_404(id)
    return jsonify(cliente.to_dict())

#------------------------------------------------------
# Rutas para el manejo de Productos
#------------------------------------------------------

@app.route('/api/productos', methods=['GET'])
def get_productos():
    """
    Obtiene la lista de todos los productos registrados.

    Método: GET
    Ruta: /api/productos
    Respuesta: Lista de objetos producto en formato JSON
    """
    productos = Producto.query.all()
    return jsonify([producto.to_dict() for producto in productos])

@app.route('/api/productos', methods=['POST'])
def add_producto():
    """
    Crea un nuevo producto con los datos proporcionados.

    Método: POST
    Ruta: /api/productos
    Cuerpo de la petición: JSON con los datos del producto
    Respuesta: Datos del producto creado en formato JSON
    """
    data = request.json
    nuevo_producto = Producto(
        nombre=data['nombre'],
        descripcion=data.get('descripcion', ''),
        precio=data['precio'],
        stock=data.get('stock', 0)
    )
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify(nuevo_producto.to_dict()), 201  # Código 201 Created

##-----MODIFICACION DE RUTAS PARA MODIFICAR Y ELIMINAR PRODUCTOS-------##

@app.route('/api/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    """
    Actualiza un producto existente.

    Método: PUT
    Ruta: /api/productos/<id>
    Cuerpo de la petición: JSON con los datos actualizados del producto
    Respuesta: Datos del producto actualizado en formato JSON
    """
    producto = Producto.query.get_or_404(id)
    data = request.json

    producto.nombre = data['nombre']
    producto.descripcion = data.get('descripcion', '')
    producto.precio = data['precio']
    producto.stock = data.get('stock', 0)

    db.session.commit()
    return jsonify(producto.to_dict())

@app.route('/api/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    """
    Elimina un producto.

    Método: DELETE
    Ruta: /api/productos/<id>
    Respuesta: Mensaje de confirmación o error si no se puede eliminar
    """
    producto = Producto.query.get_or_404(id)

    # Verificar si el producto está en alguna factura
    if producto.detalles:
        return jsonify({"error": "No se puede eliminar el producto porque está incluido en facturas"}), 400

    db.session.delete(producto)
    db.session.commit()
    return jsonify({"message": "Producto eliminado correctamente"})
######------------------------------------------------########




@app.route('/api/productos/<int:id>', methods=['GET'])
def get_producto(id):
    """
    Obtiene un producto específico por su ID.

    Método: GET
    Ruta: /api/productos/<id>
    Respuesta: Datos del producto en formato JSON o error 404 si no existe
    """
    producto = Producto.query.get_or_404(id)
    return jsonify(producto.to_dict())

#------------------------------------------------------
# Rutas para el manejo de Facturas
#------------------------------------------------------

##------------------ MODIFICACION PARA ELIMINAR FACTURAS----------------

@app.route('/api/facturas', methods=['GET'])
def get_facturas():
    """
    Obtiene todas las facturas con información básica.

    Método: GET
    Ruta: /api/facturas
    Respuesta: Lista de facturas en formato JSON
    """
    facturas = Factura.query.all()
    result = []

    for factura in facturas:
        # Obtener el nombre del cliente
        cliente = Cliente.query.get(factura.cliente_id)
        cliente_nombre = cliente.nombre if cliente else "Cliente desconocido"

        # Calcular el total de la factura
        total = sum(detalle.subtotal for detalle in factura.detalles)

        # Crear diccionario con datos de la factura
        factura_dict = factura.to_dict()
        factura_dict['cliente_nombre'] = cliente_nombre
        factura_dict['total'] = total

        # Añadir detalles básicos de los productos
        detalles = []
        for detalle in factura.detalles:
            producto = Producto.query.get(detalle.producto_id)
            producto_nombre = producto.nombre if producto else "Producto desconocido"

            detalle_dict = detalle.to_dict()
            detalle_dict['producto_nombre'] = producto_nombre
            detalles.append(detalle_dict)

        factura_dict['detalles'] = detalles
        result.append(factura_dict)

    return jsonify(result)

@app.route('/api/facturas', methods=['POST'])
def create_factura():
    """
    Crea una nueva factura con los datos proporcionados.

    Método: POST
    Ruta: /api/facturas
    Cuerpo de la petición: JSON con los datos de la factura y sus detalles
    Respuesta: Datos de la factura creada en formato JSON
    """
    try:
        data = request.json

        # Verificar que el cliente existe
        cliente = Cliente.query.get(data['cliente_id'])
        if not cliente:
            return jsonify({"error": f"Cliente con ID {data['cliente_id']} no encontrado"}), 404

        # Crear la factura principal
        nueva_factura = Factura(
            cliente_id=data['cliente_id'],
            total=data['total']
        )

        # Si se proporciona una fecha, intentar usarla
        if 'fecha' in data:
            try:
                # Si es string, convertir a datetime
                if isinstance(data['fecha'], str):
                    nueva_factura.fecha = datetime.strptime(data['fecha'], '%Y-%m-%d')
                else:
                    nueva_factura.fecha = data['fecha']
            except ValueError:
                # Si hay error, usar la fecha actual
                nueva_factura.fecha = datetime.utcnow()

        db.session.add(nueva_factura)
        db.session.commit()  # Commit para obtener el ID de la factura

        # Agregar los detalles de la factura
        for detalle in data['detalles']:
            # Verificar que el producto existe
            producto = Producto.query.get(detalle['producto_id'])
            if not producto:
                # Hacer rollback y devolver error
                db.session.rollback()
                return jsonify({"error": f"Producto con ID {detalle['producto_id']} no encontrado"}), 404

            nuevo_detalle = DetalleFactura(
                factura_id=nueva_factura.id,
                producto_id=detalle['producto_id'],
                cantidad=detalle['cantidad'],
                precio_unitario=detalle['precio_unitario'],
                subtotal=detalle['subtotal']
            )
            db.session.add(nuevo_detalle)

        db.session.commit()
        return jsonify(nueva_factura.to_dict()), 201  # Código 201 Created

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
###### MODIFICACION PARA ELIMINAR UNA FACTURA-------------------

@app.route('/api/facturas/<int:id>', methods=['DELETE'])
def delete_factura(id):
    """
    Elimina una factura y sus detalles.

    Método: DELETE
    Ruta: /api/facturas/<id>
    Respuesta: Mensaje de confirmación
    """
    factura = Factura.query.get_or_404(id)

    db.session.delete(factura)
    db.session.commit()
    return jsonify({"message": "Factura eliminada correctamente"})

#### --------------------------------------- ##########

@app.route('/api/facturas/<int:id>', methods=['GET'])
def get_factura(id):
    """
    Obtiene una factura específica con todos sus detalles.

    Método: GET
    Ruta: /api/facturas/<id>
    Respuesta: Datos de la factura en formato JSON
    """
    factura = Factura.query.get_or_404(id)

    # Obtener el nombre del cliente
    cliente = Cliente.query.get(factura.cliente_id)
    cliente_nombre = cliente.nombre if cliente else "Cliente desconocido"

    # Calcular el total de la factura
    total = sum(detalle.subtotal for detalle in factura.detalles)

    # Crear diccionario con datos de la factura
    factura_dict = factura.to_dict()
    factura_dict['cliente_nombre'] = cliente_nombre
    factura_dict['total'] = total

    # Añadir detalles completos de los productos
    detalles = []
    for detalle in factura.detalles:
        producto = Producto.query.get(detalle.producto_id)
        producto_nombre = producto.nombre if producto else "Producto desconocido"

        detalle_dict = detalle.to_dict()
        detalle_dict['producto_nombre'] = producto_nombre
        detalles.append(detalle_dict)

    factura_dict['detalles'] = detalles
    return jsonify(factura_dict)

# Punto de entrada principal
if __name__ == '__main__':
    # Crear las tablas al iniciar la aplicación
    with app.app_context():
        db.create_all()
    # Iniciar el servidor en el puerto 5001
    app.run(port=5001, debug=True)