
import { Sale } from '../types/sales';

export const printInvoice = (sale: Sale): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const invoiceHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة رقم ${sale.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Tajawal', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          direction: rtl;
        }
        .invoice-header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .invoice-details {
          margin-bottom: 20px;
        }
        .invoice-details div {
          margin-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f5f5f5;
        }
        .totals {
          margin-top: 20px;
          text-align: left;
        }
        .totals div {
          margin-bottom: 5px;
        }
        .total-final {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #333;
          padding-top: 10px;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <h1>فاتورة مبيعات</h1>
        <h2>رقم الفاتورة: ${sale.invoiceNumber}</h2>
      </div>
      
      <div class="invoice-details">
        <div><strong>التاريخ:</strong> ${new Date(sale.date).toLocaleDateString('ar-SA')}</div>
        <div><strong>العميل:</strong> ${sale.customerName}</div>
        <div><strong>طريقة الدفع:</strong> ${getPaymentMethodLabel(sale.paymentMethod)}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${sale.items.map(item => `
            <tr>
              <td>${item.batteryType}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toLocaleString()} ريال</td>
              <td>${item.total.toLocaleString()} ريال</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div>المجموع الفرعي: ${sale.subtotal.toLocaleString()} ريال</div>
        ${sale.tax > 0 ? `<div>ضريبة القيمة المضافة (15%): ${sale.tax.toLocaleString()} ريال</div>` : ''}
        ${sale.discount > 0 ? `<div>الخصم: -${sale.discount.toLocaleString()} ريال</div>` : ''}
        <div class="total-final">الإجمالي: ${sale.total.toLocaleString()} ريال</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

const getPaymentMethodLabel = (method: string): string => {
  const labels: { [key: string]: string } = {
    cash: 'نقداً',
    card: 'بطاقة',
    transfer: 'تحويل',
    credit: 'آجل'
  };
  return labels[method] || method;
};
