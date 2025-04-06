from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Inicialización del objeto SQLAlchemy
db = SQLAlchemy()

class Cliente(db.Model):
    """
    Modelo para representar a los clientes del sistema.
    Almacena información básica como nombre, email, teléfono y dirección.
    """
    id = db.Column(db.Integer, primary_key=True)  # Clave primaria
    nombre = db.Column(db.String(100), nullable=False)  # Nombre del cliente (obligatorio)
    email = db.Column(db.String(100))  # Correo electrónico
    telefono = db.Column(db.String(20))  # Número de teléfono
    direccion = db.Column(db.String(200))  # Dirección física
    # Relación con las facturas (un cliente puede tener muchas facturas)
    facturas = db.relationship('Factura', backref='cliente', lazy=True)

    def to_dict(self):
        """
        Convierte el objeto Cliente a un diccionario para facilitar
        la serialización a JSON en las respuestas API.
        """
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'telefono': self.telefono,
            'direccion': self.direccion
        }

class Producto(db.Model):
    """
    Modelo para representar los productos disponibles en el sistema.
    Almacena información como nombre, descripción, precio y stock.
    """
    id = db.Column(db.Integer, primary_key=True)  # Clave primaria
    nombre = db.Column(db.String(100), nullable=False)  # Nombre del producto (obligatorio)
    descripcion = db.Column(db.Text)  # Descripción detallada
    precio = db.Column(db.Float, nullable=False)  # Precio unitario (obligatorio)
    stock = db.Column(db.Integer, default=0)  # Cantidad disponible en inventario
    # Relación con los detalles de factura (un producto puede estar en muchos detalles)
    detalles = db.relationship('DetalleFactura', backref='producto', lazy=True)

    def to_dict(self):
        """
        Convierte el objeto Producto a un diccionario para facilitar
        la serialización a JSON en las respuestas API.
        """
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio,
            'stock': self.stock
        }

class Factura(db.Model):
    """
    Modelo para representar las facturas generadas en el sistema.
    Cada factura está asociada a un cliente y tiene una fecha y un total.
    """
    id = db.Column(db.Integer, primary_key=True)  # Clave primaria
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)  # Referencia al cliente
    fecha = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de creación (automática)
    total = db.Column(db.Float, default=0.0)  # Monto total de la factura
    # Relación con los detalles (una factura tiene muchos detalles)
    detalles = db.relationship('DetalleFactura', backref='factura', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """
        Convierte el objeto Factura a un diccionario para facilitar
        la serialización a JSON en las respuestas API.
        Incluye los detalles asociados a la factura.
        """
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'cliente_nombre': self.cliente.nombre,  # Incluimos el nombre del cliente para facilitar la visualización
            'fecha': self.fecha.strftime('%Y-%m-%d %H:%M:%S'),  # Formato legible de fecha
            'total': self.total,
            'detalles': [detalle.to_dict() for detalle in self.detalles]  # Lista de detalles
        }

class DetalleFactura(db.Model):
    """
    Modelo para representar los ítems individuales de una factura.
    Cada detalle está asociado a una factura y a un producto.
    """
    id = db.Column(db.Integer, primary_key=True)  # Clave primaria
    factura_id = db.Column(db.Integer, db.ForeignKey('factura.id'), nullable=False)  # Referencia a la factura
    producto_id = db.Column(db.Integer, db.ForeignKey('producto.id'), nullable=False)  # Referencia al producto
    cantidad = db.Column(db.Integer, nullable=False)  # Cantidad del producto
    precio_unitario = db.Column(db.Float, nullable=False)  # Precio por unidad en el momento de la venta
    subtotal = db.Column(db.Float, nullable=False)  # Subtotal calculado (cantidad * precio_unitario)

    def to_dict(self):
        """
        Convierte el objeto DetalleFactura a un diccionario para facilitar
        la serialización a JSON en las respuestas API.
        """
        return {
            'id': self.id,
            'factura_id': self.factura_id,
            'producto_id': self.producto_id,
            'producto_nombre': self.producto.nombre,  # Incluimos el nombre del producto para facilitar la visualización
            'cantidad': self.cantidad,
            'precio_unitario': self.precio_unitario,
            'subtotal': self.subtotal
        }