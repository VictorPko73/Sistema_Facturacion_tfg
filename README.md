
# 🧾 Sistema de Facturación · Gestión de clientes, productos y facturas con exportación a PDF

Aplicación de gestión comercial desarrollada como Trabajo de Fin de Grado. React + Vite en el frontend y Flask en el backend. CRUD de clientes y productos, creación de facturas con líneas de detalle y generación de PDF descargable.

`Flask` `React` `Vite` `SQLAlchemy` `SQLite`

---

## ✨ Características

- 👤 CRUD completo de **clientes** (nombre, email, teléfono, dirección).
- 📦 CRUD completo de **productos** con control de stock.
- 🧾 Creación de **facturas** asociando cliente + múltiples productos con cantidades.
- 🧮 Cálculo automático de subtotales y total.
- 📊 Listado histórico de facturas y vista de detalle por factura.
- 📄 Generación, previsualización y descarga de facturas en **PDF** (jsPDF + autoTable).
- 🔒 Reglas de integridad: no se puede eliminar un cliente con facturas ni un producto usado en facturas.

---

## 🧭 Arquitectura

- **Frontend:** React + Vite en `frontend/`.
- **Backend:** Flask en `backend/`, API REST en `app.py`.
- **Persistencia:** SQLite gestionada con Flask-SQLAlchemy (`models.py`).
- Comunicación 100% vía API REST en JSON (arquitectura desacoplada).

   ### Estructura del proyecto:

```
backend/
  app.py                 # Rutas REST: clientes, productos, facturas
  models.py              # Modelos SQLAlchemy: Cliente, Producto, Factura, DetalleFactura
  facturacion.db         # Base de datos SQLite
frontend/
  src/
    components/          # Navbar y componentes comunes
    pages/
      clientes/           # ClientesList, ClienteForm
      productos/           # ProductosList, ProductoForm
      facturas/            # FacturasList, FacturaForm, FacturaDetalle
    services/
      pdfService.js       # Generación de PDF con jsPDF

```
---

## ⚙️ Requisitos

- 🐍 Python 3
- 🟢 Node.js 18+

---

## 🚀 Ejecución local

### Backend

```bash
cd backend
pip install flask flask-cors flask-sqlalchemy
python app.py
```

📍 Servidor disponible en `http://localhost:5001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

📍 Aplicación disponible en `http://localhost:5173`.

---

## 🔌 Endpoints principales

### 👤 Clientes
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/clientes` | Lista todos los clientes |
| GET | `/api/clientes/<id>` | Obtiene un cliente por ID |
| POST | `/api/clientes` | Crea un cliente |
| PUT | `/api/clientes/<id>` | Actualiza un cliente |
| DELETE | `/api/clientes/<id>` | Elimina un cliente (si no tiene facturas) |

### 📦 Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Lista todos los productos |
| GET | `/api/productos/<id>` | Obtiene un producto por ID |
| POST | `/api/productos` | Crea un producto |
| PUT | `/api/productos/<id>` | Actualiza un producto |
| DELETE | `/api/productos/<id>` | Elimina un producto (si no está en facturas) |

### 🧾 Facturas
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/facturas` | Lista todas las facturas con totales |
| GET | `/api/facturas/<id>` | Obtiene una factura con sus detalles |
| POST | `/api/facturas` | Crea una factura con sus líneas de detalle |
| DELETE | `/api/facturas/<id>` | Elimina una factura y sus detalles |

---

## ✨ Posibles mejoras futuras

- 🔐 Autenticación con JWT y roles de usuario.
- ✅ Validación y descuento de stock al facturar.
- 💰 Uso de tipos decimales (`Numeric`) en lugar de `float` para importes.
- 🧪 Añadir tests automatizados.
- 🗃️ Migraciones con Alembic en lugar de `db.create_all()`.

---

## 👨‍💻 Autor

**Víctor**
```
