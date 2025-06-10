
interface Voucher {
  id: string;
  voucherNumber: string;
  date: string;
  type: "receipt" | "payment";
  entityType: "customer" | "supplier";
  entityId: string;
  entityName: string;
  amount: number;
  description: string;
  paymentMethod: string;
}

export const printVoucher = (voucher: Voucher): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const getPaymentMethodLabel = (method: string): string => {
    const labels: { [key: string]: string } = {
      cash: 'نقداً',
      card: 'بطاقة',
      transfer: 'تحويل'
    };
    return labels[method] || method;
  };

  const getVoucherTypeLabel = (type: string): string => {
    return type === 'receipt' ? 'سند قبض' : 'سند دفع';
  };

  const getEntityTypeLabel = (entityType: string): string => {
    return entityType === 'customer' ? 'العميل' : 'المورد';
  };

  const voucherHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getVoucherTypeLabel(voucher.type)} رقم ${voucher.voucherNumber}</title>
      <style>
        body {
          font-family: 'Tajawal', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          direction: rtl;
          font-size: 14px;
        }
        .voucher-header {
          text-align: center;
          border: 2px solid #333;
          padding: 20px;
          margin-bottom: 20px;
          background-color: #f9f9f9;
        }
        .voucher-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .voucher-number {
          font-size: 18px;
          color: #666;
        }
        .voucher-details {
          border: 1px solid #ddd;
          padding: 20px;
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f5f5f5;
        }
        .detail-label {
          font-weight: bold;
          color: #333;
        }
        .detail-value {
          color: #666;
        }
        .amount-section {
          border: 2px solid #333;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
          background-color: #f0f8f0;
        }
        .amount-label {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .amount-value {
          font-size: 28px;
          font-weight: bold;
          color: #2d5016;
        }
        .description-section {
          border: 1px solid #ddd;
          padding: 15px;
          margin: 20px 0;
          min-height: 60px;
        }
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          text-align: center;
          width: 200px;
        }
        .signature-line {
          border-bottom: 1px solid #333;
          margin-bottom: 10px;
          height: 50px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="voucher-header">
        <div class="voucher-title">${getVoucherTypeLabel(voucher.type)}</div>
        <div class="voucher-number">رقم السند: ${voucher.voucherNumber}</div>
      </div>
      
      <div class="voucher-details">
        <div class="detail-row">
          <span class="detail-label">التاريخ:</span>
          <span class="detail-value">${new Date(voucher.date).toLocaleDateString('ar-SA')}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">${getEntityTypeLabel(voucher.entityType)}:</span>
          <span class="detail-value">${voucher.entityName}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">طريقة الدفع:</span>
          <span class="detail-value">${getPaymentMethodLabel(voucher.paymentMethod)}</span>
        </div>
      </div>

      <div class="amount-section">
        <div class="amount-label">المبلغ</div>
        <div class="amount-value">${voucher.amount.toLocaleString()} ريال سعودي</div>
      </div>

      ${voucher.description ? `
        <div class="description-section">
          <strong>البيان:</strong><br>
          ${voucher.description}
        </div>
      ` : ''}

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div>توقيع المستلم</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div>توقيع المسؤول</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(voucherHTML);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
