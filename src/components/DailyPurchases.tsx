
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CustomerSearchDialog } from "./CustomerSearchDialog";
import { StickyNotes } from "./StickyNotes";

interface Purchase {
  id: string;
  customerName: string;
  batteryType: string;
  quantity: number;
  price: number;
  total: number;
  discount: number;
  finalTotal: number;
}

const batteryTypes = [
  "بطاريات عادية",
  "بطاريات جافة", 
  "بطاريات زجاج",
  "بطاريات تعبئة",
  "رصاص"
];

export const DailyPurchases = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: "1",
      customerName: "",
      batteryType: "بطاريات عادية",
      quantity: 0,
      price: 0,
      total: 0,
      discount: 0,
      finalTotal: 0
    }
  ]);
  
  const [focusedCell, setFocusedCell] = useState<{row: number, col: string} | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [selectedRowForCustomer, setSelectedRowForCustomer] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const calculateTotals = (purchase: Purchase): Purchase => {
    const total = Math.round(purchase.quantity * purchase.price);
    const finalTotal = total - purchase.discount;
    return { ...purchase, total, finalTotal };
  };

  const updatePurchase = (index: number, field: keyof Purchase, value: any) => {
    setPurchases(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      updated[index] = calculateTotals(updated[index]);
      return updated;
    });
  };

  const addRow = () => {
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      customerName: "",
      batteryType: "بطاريات عادية",
      quantity: 0,
      price: 0,
      total: 0,
      discount: 0,
      finalTotal: 0
    };
    setPurchases(prev => [...prev, newPurchase]);
  };

  const deleteRow = (index: number) => {
    if (purchases.length > 1) {
      setPurchases(prev => prev.filter((_, i) => i !== index));
      toast({
        title: "تم حذف السطر",
        description: "تم حذف السطر بنجاح",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    const totalRows = purchases.length;
    const fields = ['customerName', 'batteryType', 'quantity', 'price', 'discount'];
    const currentFieldIndex = fields.indexOf(field);

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      
      // Move to next field in same row, or first field of next row
      if (currentFieldIndex < fields.length - 1) {
        setFocusedCell({ row: rowIndex, col: fields[currentFieldIndex + 1] });
      } else if (rowIndex < totalRows - 1) {
        setFocusedCell({ row: rowIndex + 1, col: fields[0] });
      } else {
        // Add new row if we're at the last cell
        addRow();
        setTimeout(() => {
          setFocusedCell({ row: totalRows, col: fields[0] });
        }, 100);
      }
    } else if (e.key === 'ArrowDown' && rowIndex < totalRows - 1) {
      e.preventDefault();
      setFocusedCell({ row: rowIndex + 1, col: field });
    } else if (e.key === 'ArrowUp' && rowIndex > 0) {
      e.preventDefault();
      setFocusedCell({ row: rowIndex - 1, col: field });
    } else if (e.key === 'ArrowRight' && currentFieldIndex > 0) {
      e.preventDefault();
      setFocusedCell({ row: rowIndex, col: fields[currentFieldIndex - 1] });
    } else if (e.key === 'ArrowLeft' && currentFieldIndex < fields.length - 1) {
      e.preventDefault();
      setFocusedCell({ row: rowIndex, col: fields[currentFieldIndex + 1] });
    }
  };

  const handleCustomerSearch = (rowIndex: number) => {
    setSelectedRowForCustomer(rowIndex);
    setShowCustomerDialog(true);
  };

  const handleCustomerSelect = (customer: any) => {
    updatePurchase(selectedRowForCustomer, 'customerName', customer.name);
    setShowCustomerDialog(false);
  };

  const totalDailyAmount = purchases.reduce((sum, purchase) => sum + purchase.finalTotal, 0);

  // Focus management
  useEffect(() => {
    if (focusedCell) {
      const input = document.getElementById(`${focusedCell.row}-${focusedCell.col}`);
      if (input) {
        input.focus();
      }
    }
  }, [focusedCell]);

  return (
    <div className="space-y-6">
      {/* Header with Date and Total */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="text-lg font-semibold border rounded-lg px-3 py-2"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          />
        </div>
        
        <div className="text-left">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إجمالي مشتريات اليوم
          </p>
          <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {totalDailyAmount.toLocaleString()} ريال
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sticky Notes */}
        <div className="lg:col-span-1">
          <StickyNotes compact={true} />
        </div>

        {/* Daily Purchases Table */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <CalendarDays className="w-5 h-5" />
                المشتريات اليومية
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="overflow-x-auto" ref={tableRef}>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع البطارية</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخصم</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي النهائي</th>
                      <th className="p-3 text-center font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {purchases.map((purchase, index) => (
                      <tr key={purchase.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Input
                            id={`${index}-customerName`}
                            value={purchase.customerName}
                            onChange={(e) => updatePurchase(index, 'customerName', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'customerName')}
                            onFocus={() => setFocusedCell({row: index, col: 'customerName'})}
                            onClick={() => handleCustomerSearch(index)}
                            placeholder="اضغط للبحث عن عميل"
                            className="text-right"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </td>
                        
                        <td className="p-2">
                          <Select
                            value={purchase.batteryType}
                            onValueChange={(value) => updatePurchase(index, 'batteryType', value)}
                          >
                            <SelectTrigger 
                              id={`${index}-batteryType`}
                              onKeyDown={(e) => handleKeyDown(e, index, 'batteryType')}
                              className="text-right"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {batteryTypes.map((type) => (
                                <SelectItem key={type} value={type} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        
                        <td className="p-2">
                          <Input
                            id={`${index}-quantity`}
                            type="number"
                            value={purchase.quantity || ''}
                            onChange={(e) => updatePurchase(index, 'quantity', Number(e.target.value) || 0)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                            onFocus={() => setFocusedCell({row: index, col: 'quantity'})}
                            className="text-center"
                          />
                        </td>
                        
                        <td className="p-2">
                          <Input
                            id={`${index}-price`}
                            type="number"
                            step="0.01"
                            value={purchase.price || ''}
                            onChange={(e) => updatePurchase(index, 'price', Number(e.target.value) || 0)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'price')}
                            onFocus={() => setFocusedCell({row: index, col: 'price'})}
                            className="text-center"
                          />
                        </td>
                        
                        <td className="p-2 text-center font-semibold">
                          {purchase.total.toLocaleString()}
                        </td>
                        
                        <td className="p-2">
                          <Input
                            id={`${index}-discount`}
                            type="number"
                            value={purchase.discount || ''}
                            onChange={(e) => updatePurchase(index, 'discount', Number(e.target.value) || 0)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'discount')}
                            onFocus={() => setFocusedCell({row: index, col: 'discount'})}
                            className="text-center"
                          />
                        </td>
                        
                        <td className="p-2 text-center font-bold text-green-600">
                          {purchase.finalTotal.toLocaleString()}
                        </td>
                        
                        <td className="p-2 text-center">
                          <Button
                            onClick={() => deleteRow(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <Button
                  onClick={addRow}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="w-4 h-4" />
                  إضافة سطر جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CustomerSearchDialog
        open={showCustomerDialog}
        onClose={() => setShowCustomerDialog(false)}
        onCustomerSelect={handleCustomerSelect}
      />
    </div>
  );
};
