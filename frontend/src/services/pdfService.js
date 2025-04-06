import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF para una factura
 * @param {Object} factura - Datos de la factura
 * @returns {jsPDF} - Documento PDF generado
 */
export const generarFacturaPDF = (factura) => {
    try {
        // Crear un nuevo documento PDF
        const doc = new jsPDF();

        // Añadir título
        doc.setFontSize(22);
        doc.text('FACTURA', 105, 20, { align: 'center' });

        // Añadir número de factura
        doc.setFontSize(16);
        doc.text(`Factura #${factura.id}`, 105, 30, { align: 'center' });

        // Información básica
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, 20, 45);
        doc.text(`Cliente: ${factura.cliente_nombre}`, 20, 55);

        // Tabla de productos
        const headers = [['Producto', 'Cantidad', 'Precio', 'Subtotal']];
        const data = factura.detalles.map(item => [
            item.producto_nombre,
            item.cantidad,
            `${parseFloat(item.precio_unitario).toFixed(2)}€`,
            `${parseFloat(item.subtotal).toFixed(2)}€`
        ]);

        // Usar autoTable como plugin
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 65,
            theme: 'grid',
            headStyles: {
                fillColor: [66, 139, 202],
                textColor: 255
            }
        });

        // Total
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text(`Total: ${parseFloat(factura.total).toFixed(2)}€`, 150, finalY);

        return doc;
    } catch (error) {
        console.error('Error generando PDF:', error);
        throw error;
    }
};

/**
 * Descarga un PDF de factura
 * @param {Object} factura - Datos de la factura
 */
export const descargarFacturaPDF = (factura) => {
    try {
        const doc = generarFacturaPDF(factura);
        doc.save(`Factura-${factura.id}.pdf`);
    } catch (error) {
        console.error('Error al descargar PDF:', error);
        alert('Error al descargar el PDF: ' + error.message);
    }
};

/**
 * Abre un PDF de factura en una nueva ventana
 * @param {Object} factura - Datos de la factura
 */
export const abrirFacturaPDF = (factura) => {
    try {
        const doc = generarFacturaPDF(factura);
        window.open(doc.output('bloburl'), '_blank');
    } catch (error) {
        console.error('Error al abrir PDF:', error);
        alert('Error al abrir el PDF: ' + error.message);
    }
};