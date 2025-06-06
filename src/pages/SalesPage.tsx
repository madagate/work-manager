
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Search, User, CreditCard, Banknote, Smartphone, Calendar, Printer, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SaleItem {
  id: string;
  batteryType: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
}

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  balance: number;
}

const mockCustomers: Customer[] = [
  { id: "1", customerCode: "C001", name: "أحمد محمد السعدي", phone: "0501234567", balance: 1200 },
  { id: "2", customerCode: "C002", name: "فاطمة علي الأحمد", phone: "0507654321", balance: -500 },
  { id: "3", customerCode: "C003", name: "محمد عبدالله الحربي", phone: "0502345678", balance: 0 },
];

const batteryTypes = [
  "بطاريات عادية",
  "بطاريات جافة",
  "بطاريات زجاج",
  "بطاريات تعبئة",
  "رصاص"
];

const paymentMethods = [
  { value: "cash", label: "نقداً", icon: Banknote },
  { value: "card", label: "بطاقة", icon: CreditCard },
  { value: "transfer", label: "تحويل", icon: Smartphone },
  { value: "credit", label: "آجل", icon: Calendar }
];

const SalesPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    { id: "1", batteryType: "بطاريات عادية", quantity: 0, price: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSaleItem = () => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      batteryType: "بطاريات عادية",
      quantity: 0,
      price: 0,
      total: 0
    };
    setSaleItems([...saleItems, newItem]);
  };

  const updateSaleItem = (index: number, field: keyof SaleItem, value: any) => {
    const updatedItems = [...saleItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }
    
    setSaleItems(updatedItems);
  };

  const removeSaleItem = (index: number) => {
    if (saleItems.length > 1) {
      setSaleItems(saleItems.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.15); // 15% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const generateInvoice = () => {
    if (!selectedCustomer) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار العميل أولاً",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (saleItems.some(item => !item.quantity || !item.price)) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع بيانات الأصناف",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const newSale: Sale = {
      id: Date.now().toString(),
      invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: [...saleItems],
      subtotal: calculateSubtotal(),
      discount,
      tax: calculateTax(),
      total: calculateTotal(),
      paymentMethod,
      status: "completed"
    };

    setRecentSales([newSale, ...recentSales]);
    
    toast({
      title: "تم إنشاء الفاتورة",
      description: `تم إنشاء فاتورة رقم ${invoiceNumber} بنجاح`,
      duration: 2000,
    });

    // Reset form
    setSelectedCustomer(null);
    setSaleItems([{ id: "1", batteryType: "بطاريات عادية", quantity: 0, price: 0, total: 0 }]);
    setDiscount(0);
    setPaymentMethod("cash");
  };

  const CustomerSearchDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 flex-row-reverse">
          <Search className="w-4 h-4" />
          {selectedCustomer ? selectedCustomer.name : "اختر العميل"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            اختيار العميل
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                onClick={() => {
                  setSelectedCustomer(customer);
                  setSearchTerm("");
                }}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                    <Badge variant="secondary" className="mt-1">
                      {customer.customerCode}
                    </Badge>
                  </div>
                  <div className="text-left">
                    <p className={`font-bold ${customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {customer.balance.toLocaleString()} ريال
                    </p>
                    <p className="text-xs text-gray-500">الرصيد</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            نظام المبيعات
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إنشاء فاتورة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Selection */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</Label>
                <CustomerSearchDialog />
                {selectedCustomer && (
                  <div className="mt-2 p-3 bg-blue-50 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedCustomer.name}
                        </p>
                        <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${selectedCustomer.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedCustomer.balance.toLocaleString()} ريال
                        </p>
                        <p className="text-xs text-gray-500">الرصيد الحالي</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sale Items */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>أصناف الفاتورة</Label>
                <div className="space-y-3 mt-2">
                  {saleItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <Select
                          value={item.batteryType}
                          onValueChange={(value) => updateSaleItem(index, 'batteryType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {batteryTypes.map(type => (
                              <SelectItem key={type} value={type} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="الكمية"
                          value={item.quantity || ''}
                          onChange={(e) => updateSaleItem(index, 'quantity', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="السعر"
                          value={item.price || ''}
                          onChange={(e) => updateSaleItem(index, 'price', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={item.total.toLocaleString()}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSaleItem(index)}
                          disabled={saleItems.length === 1}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addSaleItem}
                  variant="outline"
                  className="mt-3 w-full flex items-center gap-2"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="w-4 h-4" />
                  إضافة صنف
                </Button>
              </div>

              {/* Payment Method */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <Button
                        key={method.value}
                        variant={paymentMethod === method.value ? "default" : "outline"}
                        onClick={() => setPaymentMethod(method.value)}
                        className="flex items-center gap-2"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <Icon className="w-4 h-4" />
                        {method.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Discount */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الخصم</Label>
                <Input
                  type="number"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ملخص الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المجموع الفرعي:</span>
                <span className="font-bold">{calculateSubtotal().toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>ضريبة القيمة المضافة (15%):</span>
                <span className="font-bold">{calculateTax().toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الخصم:</span>
                <span className="font-bold text-red-600">-{discount.toLocaleString()} ريال</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي:</span>
                  <span className="font-bold text-green-600">{calculateTotal().toLocaleString()} ريال</span>
                </div>
              </div>
              
              <Button
                onClick={generateInvoice}
                className="w-full mt-4"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إنشاء الفاتورة
              </Button>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          {recentSales.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  آخر المبيعات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales.slice(0, 5).map(sale => (
                    <div key={sale.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{sale.invoiceNumber}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {sale.customerName}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-green-600">{sale.total.toLocaleString()} ريال</p>
                          <Button variant="outline" size="sm" className="mt-1">
                            <Printer className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
