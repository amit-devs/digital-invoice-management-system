import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoice, customer) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text('INVOICE', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 30);
  doc.text(`Date: ${invoice.date}`, 14, 35);
  doc.text(`Due Date: ${invoice.dueDate}`, 14, 40);
  doc.text(`Status: ${invoice.status}`, 14, 45);

  // Customer Details
  doc.setFontSize(12);
  doc.text('Bill To:', 120, 30);
  doc.setFontSize(10);
  doc.text(`Name: ${customer?.name || 'Unknown'}`, 120, 35);
  doc.text(`Email: ${customer?.email || 'N/A'}`, 120, 40);
  doc.text(`Phone: ${customer?.phone || 'N/A'}`, 120, 45);
  doc.text(`Address: ${customer?.address || 'N/A'}`, 120, 50);

  // Items Table
  const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
  const tableRows = [];

  invoice.items.forEach(item => {
    const itemData = [
      item.description,
      item.quantity,
      `$${Number(item.unitPrice).toFixed(2)}`,
      `$${Number(item.quantity * item.unitPrice).toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY || 60;
  
  let subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  let taxAmount = subtotal * ((invoice.tax || 0) / 100);
  let discountAmount = invoice.discount || 0;
  let total = subtotal + taxAmount - discountAmount;

  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY + 10);
  doc.text(`Tax (${invoice.tax || 0}%): $${taxAmount.toFixed(2)}`, 140, finalY + 15);
  doc.text(`Discount: -$${discountAmount.toFixed(2)}`, 140, finalY + 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 30);

  doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
};
