
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarDays, Plus, Trash2, Check, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SupplierSearchDialog } from "./SupplierSearchDialog";
import { AddSupplierDialog } from "./AddSupplierDialog";
import { BatteryTypeSelector } from "./BatteryTypeSelector";
import { DateNavigation } from "./DateNavigation";

interface PurchaseItem {
  id: string;
  batteryType: string;
  quantity: number;
  price: number;
  total: number;
}

interface Purchase {
  id: string;
  supplierName: string;
  supplierId: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  saved: boolean;
}

interface DailyPurchasesProps {
  language?: string;
}

export const DailyPurchases = ({ language = "ar" }: DailyPurchasesProps) => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: string; name: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("آجل");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  
  const [currentItem, setCurrentItem] = useState({
    batteryType: "",
    quantity: 0,
    price: 0
  });
  const [items, setItems] = useState<PurchaseItem[]>([]);
  
  const isRTL = language === "ar";

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * 0.15; // 15% VAT
    const total = afterDiscount + tax;

    return { subtotal, discountAmount, tax, total };
  };

  const addItemToPurchase = () => {
    if (!currentItem.batteryType || currentItem.quantity <= 0 || currentItem.price <= 0) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع بيانات الصنف" : "Please fill all item data",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const item: PurchaseItem = {
      id: Date.now().toString(),
      batteryType: currentItem.batteryType,
      quantity: currentItem.quantity,
      price: currentItem.price,
      total: currentItem.quantity * currentItem.price
    };

    setItems(prev => [...prev, item]);
    setCurrentItem({
      batteryType: "",
      quantity: 0,
      price: 0
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const savePurchase = () => {
    if (!selectedSupplier || items.length === 0) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى اختيار مورد وإضافة أصناف" : "Please select supplier and add items",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    
    const purchase: Purchase = {
      id: Date.now().toString(),
      supplierName: selectedSupplier.name,
      supplierId: selectedSupplier.id,
      items: [...items],
      subtotal,
      discount: discountPercentage,
      tax,
      total,
      paymentMethod,
      saved: true
    };

    setPurchases(prev => [...prev, purchase]);
    
    // Reset form
    setItems([]);
    setSelectedSupplier(null);
    setDiscountPercentage(0);
    setCurrentItem({
      batteryType: "",
      quantity: 0,
      price: 0
    });

    toast({
      title: language === "ar" ? "تم الحفظ" : "Saved",
      description: language === "ar" ? "تم حفظ فاتورة المشتريات بنجاح" : "Purchase invoice saved successfully",
      duration: 2000,
    });
  };

  const clearAllData = () => {
    setPurchases([]);
    setItems([]);
    setSelectedSupplier(null);
    setDiscountPercentage(0);
    setCurrentItem({
      batteryType: "",
      quantity: 0,
      price: 0
    });
  };

  const handleSupplierSelect = (supplier: any) => {
    setSelectedSupplier({ id: supplier.id, name: supplier.name });
    setShowSupplierDialog(false);
  };

  const handleSupplierAdded = (supplier: any) => {
    setSelectedSupplier({ id: supplier.id, name: supplier.name });
    setShowAddSupplier(false);
  };

  const totalDailyAmount = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation and Total */}
      <div className={`flex justify-between items-center bg-white rounded-lg shadow-lg p-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <DateNavigation 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onClearData={clearAllData}
          language={language}
        />
        
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "إجمالي مشتريات اليوم" : "Daily Total"}
          </p>
          <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {totalDailyAmount.toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
          </p>
        </div>
      </div>

      {/* Purchase Form */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <CalendarDays className="w-5 h-5" />
            {language === "ar" ? "إضافة فاتورة مشتريات" : "Add Purchase Invoice"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Supplier Selection and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "المورد" : "Supplier"}
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder={language === "ar" ? "اختر مورد" : "Select supplier"}
                  value={selectedSupplier?.name || ""}
                  readOnly
                  className="flex-1"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowSupplierDialog(true)}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Search className="w-4 h-4 ml-2" />
                  {language === "ar" ? "بحث" : "Search"}
                </Button>
              </div>
            </div>

            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "طريقة الدفع" : "Payment Method"}
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقداً" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقداً</SelectItem>
                  <SelectItem value="آجل" style={{ fontFamily: 'Tajawal, sans-serif' }}>آجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Items */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "إضافة الأصناف" : "Add Items"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "نوع البطارية" : "Battery Type"}
                </Label>
                <BatteryTypeSelector
                  value={currentItem.batteryType}
                  onChange={(value) => setCurrentItem({ ...currentItem, batteryType: value })}
                  placeholder={language === "ar" ? "اختر نوع البطارية" : "Select battery type"}
                />
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "الكمية" : "Quantity"}
                </Label>
                <Input
                  type="number"
                  placeholder={language === "ar" ? "الكمية" : "Quantity"}
                  value={currentItem.quantity || ""}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "السعر" : "Price"}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={language === "ar" ? "السعر" : "Price"}
                  value={currentItem.price || ""}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addItemToPurchase} className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Plus className="w-4 h-4 ml-2" />
                  {language === "ar" ? "إضافة" : "Add"}
                </Button>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <div className="flex-1">
                      <span className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.batteryType}</span>
                      <span className="text-gray-600 mr-2">- {language === "ar" ? "الكمية:" : "Qty:"} {item.quantity}</span>
                      <span className="text-gray-600 mr-2">- {language === "ar" ? "السعر:" : "Price:"} {item.price}</span>
                      <span className="text-blue-600 font-bold mr-2">- {language === "ar" ? "المجموع:" : "Total:"} {item.total} {language === "ar" ? "ريال" : "SAR"}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            {items.length > 0 && (
              <div className="bg-gray-50 p-4 rounded border space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "نسبة الخصم (%)" : "Discount (%)"}
                    </Label>
                    <Input
                      type="number"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="text-right space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <p>{language === "ar" ? "المجموع الفرعي:" : "Subtotal:"} <span className="font-bold">{totals.subtotal.toFixed(2)} {language === "ar" ? "ريال" : "SAR"}</span></p>
                  <p>{language === "ar" ? "الخصم:" : "Discount:"} <span className="font-bold text-red-600">{totals.discountAmount.toFixed(2)} {language === "ar" ? "ريال" : "SAR"}</span></p>
                  <p>{language === "ar" ? "الضريبة (15%):" : "Tax (15%):"} <span className="font-bold text-orange-600">{totals.tax.toFixed(2)} {language === "ar" ? "ريال" : "SAR"}</span></p>
                  <p className="text-lg">{language === "ar" ? "المجموع النهائي:" : "Total:"} <span className="font-bold text-green-600">{totals.total.toFixed(2)} {language === "ar" ? "ريال" : "SAR"}</span></p>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                onClick={savePurchase}
                disabled={!selectedSupplier || items.length === 0}
                className="bg-green-600 hover:bg-green-700"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {language === "ar" ? "حفظ الفاتورة" : "Save Invoice"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Purchases List */}
      {purchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "المشتريات المحفوظة" : "Saved Purchases"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-green-50 p-4 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{purchase.supplierName}</p>
                      <p className="text-sm text-gray-600">{purchase.items.length} {language === "ar" ? "أصناف" : "items"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{purchase.total.toFixed(2)} {language === "ar" ? "ريال" : "SAR"}</p>
                      <p className="text-sm text-gray-600">{purchase.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <SupplierSearchDialog
        open={showSupplierDialog}
        onClose={() => setShowSupplierDialog(false)}
        onSupplierSelect={handleSupplierSelect}
        searchTerm=""
        language={language}
      />

      <AddSupplierDialog
        open={showAddSupplier}
        onClose={() => setShowAddSupplier(false)}
        onSupplierAdded={handleSupplierAdded}
        language={language}
      />
    </div>
  );
};
