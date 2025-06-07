
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ShoppingBag, Plus, Search, CreditCard, Banknote, Smartphone, Calendar, Printer, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Purchase, PurchaseItem } from "@/types/purchases";
import { addTransactionToSupplier } from "@/utils/accountUtils";

interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  phone: string;
  balance: number;
}

const mockSuppliers: Supplier[] = [
  { id: "1", supplierCode: "S001", name: "مورد البطاريات الأول", phone: "0501234567", balance: -800 },
  { id: "2", supplierCode: "S002", name: "شركة الطاقة المتجددة", phone: "0507654321", balance: 0 },
  { id: "3", supplierCode: "S003", name: "مؤسسة الكهرباء", phone: "0502345678", balance: -1200 },
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

const PurchasesPage = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { id: "1", batteryType: "بطاريات عادية", quantity: 0, price: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [searchTerm, setSearchTerm] = useState("");
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [vatEnabled, setVatEnabled] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPurchaseItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      batteryType: "بطاريات عادية",
      quantity: 0,
      price: 0,
      total: 0
    };
    setPurchaseItems([...purchaseItems, newItem]);
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }
    
    setPurchaseItems(updatedItems);
  };

  const removePurchaseItem = (index: number) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return purchaseItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    if (!vatEnabled) return 0;
    return Math.round(calculateSubtotal() * 0.15);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const resetForm = () => {
    setSelectedSupplier(null);
    setPurchaseItems([{ id: "1", batteryType: "بطاريات عادية", quantity: 0, price: 0, total: 0 }]);
    setDiscount(0);
    setPaymentMethod("cash");
    setVatEnabled(false);
  };

  const generatePurchaseInvoice = () => {
    if (!selectedSupplier) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المورد أولاً",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (purchaseItems.some(item => !item.quantity || !item.price)) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع بيانات الأصناف",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const invoiceNumber = `PUR-${Date.now()}`;
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      items: [...purchaseItems],
      subtotal: calculateSubtotal(),
      discount,
      tax: calculateTax(),
      total: calculateTotal(),
      paymentMethod,
      status: "completed"
    };

    // Add to recent purchases
    setRecentPurchases([newPurchase, ...recentPurchases]);

    // Handle supplier balance and account statement for credit purchases
    if (paymentMethod === 'credit') {
      addTransactionToSupplier(selectedSupplier.id, {
        date: newPurchase.date,
        type: 'purchase',
        description: `فاتورة مشتريات رقم ${invoiceNumber}`,
        amount: newPurchase.total,
        invoiceNumber,
        vatAmount: newPurchase.tax
      });
    }

    toast({
      title: "تم إنشاء فاتورة المشتريات",
      description: `تم إنشاء فاتورة رقم ${invoiceNumber} بنجاح`,
      duration: 2000,
    });

    // Reset form
    resetForm();
  };

  const SupplierSearchDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 flex-row-reverse">
          <Search className="w-4 h-4" />
          {selectedSupplier ? selectedSupplier.name : "اختر المورد"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            اختيار المورد
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن مورد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredSuppliers.map(supplier => (
              <div
                key={supplier.id}
                onClick={() => {
                  setSelectedSupplier(supplier);
                  setSearchTerm("");
                }}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {supplier.name}
                    </p>
                    <p className="text-sm text-gray-600">{supplier.phone}</p>
                    <Badge variant="secondary" className="mt-1">
                      {supplier.supplierCode}
                    </Badge>
                  </div>
                  <div className="text-left">
                    <p className={`font-bold ${supplier.balance <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.abs(supplier.balance).toLocaleString()} ريال
                    </p>
                    <p className="text-xs text-gray-500">المستحق</p>
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
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            نظام المشتريات
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إنشاء فاتورة مشتريات جديدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Supplier Selection */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المورد</Label>
                <SupplierSearchDialog />
                {selectedSupplier && (
                  <div className="mt-2 p-3 bg-orange-50 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedSupplier.name}
                        </p>
                        <p className="text-sm text-gray-600">{selectedSupplier.phone}</p>
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${selectedSupplier.balance <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.abs(selectedSupplier.balance).toLocaleString()} ريال
                        </p>
                        <p className="text-xs text-gray-500">المستحق الحالي</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Items */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>أصناف الفاتورة</Label>
                <div className="space-y-3 mt-2">
                  {purchaseItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <Select
                          value={item.batteryType}
                          onValueChange={(value) => updatePurchaseItem(index, 'batteryType', value)}
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
                          onChange={(e) => updatePurchaseItem(index, 'quantity', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="السعر"
                          value={item.price || ''}
                          onChange={(e) => updatePurchaseItem(index, 'price', Number(e.target.value) || 0)}
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
                          onClick={() => removePurchaseItem(index)}
                          disabled={purchaseItems.length === 1}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addPurchaseItem}
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

              {/* VAT Toggle */}
              <div className="flex items-center justify-between">
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>تطبيق ضريبة القيمة المضافة (15%)</Label>
                <Switch
                  checked={vatEnabled}
                  onCheckedChange={setVatEnabled}
                />
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

              {/* Action Button */}
              <Button
                onClick={generatePurchaseInvoice}
                className="w-full"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إنشاء فاتورة المشتريات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Summary */}
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
              {vatEnabled && (
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>ضريبة القيمة المضافة (15%):</span>
                  <span className="font-bold">{calculateTax().toLocaleString()} ريال</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الخصم:</span>
                <span className="font-bold text-red-600">-{discount.toLocaleString()} ريال</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي:</span>
                  <span className="font-bold text-orange-600">{calculateTotal().toLocaleString()} ريال</span>
                </div>
              </div>
              
              {paymentMethod === 'credit' && (
                <div className="bg-yellow-50 p-3 rounded border">
                  <p className="text-sm text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ملاحظة: سيتم إضافة هذا المبلغ لرصيد المورد في حالة الشراء الآجل
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Purchases */}
          {recentPurchases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  آخر المشتريات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPurchases.slice(0, 5).map(purchase => (
                    <div key={purchase.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{purchase.invoiceNumber}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {purchase.supplierName}
                          </p>
                          <Badge variant={purchase.paymentMethod === 'credit' ? 'destructive' : 'default'} className="text-xs mt-1">
                            {paymentMethods.find(m => m.value === purchase.paymentMethod)?.label}
                          </Badge>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-orange-600">{purchase.total.toLocaleString()} ريال</p>
                          <div className="flex gap-1 mt-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              title="طباعة"
                            >
                              <Printer className="w-3 h-3" />
                            </Button>
                          </div>
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

export default PurchasesPage;
