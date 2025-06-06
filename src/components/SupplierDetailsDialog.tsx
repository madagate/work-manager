import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Calendar, Package, DollarSign, TrendingUp, ShoppingCart, MessageCircle } from "lucide-react";

interface Purchase {
  id: string;
  date: string;
  batteryType: string;
  quantity: number;
  pricePerKg: number;
  total: number;
  discount: number;
  finalTotal: number;
}

interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  phone: string;
  description?: string;
  lastPurchase?: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  purchases: Purchase[];
  notes?: string;
  isBlocked?: boolean;
  blockReason?: string;
  balance: number;
  messageSent?: boolean;
  lastMessageSent?: string;
  last2Quantities?: number[];
  last2Prices?: number[];
  last2BatteryTypes?: string[];
}

interface SupplierDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const SupplierDetailsDialog = ({ open, onClose, supplier }: SupplierDetailsDialogProps) => {
  if (!supplier) return null;

  const getDaysSinceLastPurchase = (lastPurchase?: string) => {
    if (!lastPurchase) return 0;
    const today = new Date();
    const purchaseDate = new Date(lastPurchase);
    const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysSinceLastMessage = (lastMessage?: string) => {
    if (!lastMessage) return 0;
    const today = new Date();
    const messageDate = new Date(lastMessage);
    const diffTime = Math.abs(today.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إحصائيات المورد - {supplier.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <User className="w-5 h-5" />
                معلومات المورد الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم:</span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{supplier.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال:</span>
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر توريد:</span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {supplier.lastPurchase ? `${supplier.lastPurchase} (منذ ${getDaysSinceLastPurchase(supplier.lastPurchase)} يوم)` : "لا يوجد"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر رسالة:</span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {supplier.lastMessageSent ? `${supplier.lastMessageSent} (منذ ${getDaysSinceLastMessage(supplier.lastMessageSent)} يوم)` : "لم ترسل رسائل"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Badge variant={supplier.isBlocked ? "destructive" : "default"}>
                    {supplier.isBlocked ? "محظور" : "نشط"}
                  </Badge>
                  {supplier.messageSent && (
                    <Badge variant="secondary">
                      تم إرسال رسالة
                    </Badge>
                  )}
                </div>
              </div>
              {supplier.description && (
                <div className="mt-4">
                  <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف: </span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{supplier.description}</span>
                </div>
              )}
              {supplier.notes && (
                <div className="mt-4">
                  <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات: </span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{supplier.notes}</span>
                </div>
              )}
              {supplier.isBlocked && supplier.blockReason && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <span className="font-semibold text-red-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>سبب الحظر: </span>
                  <span className="text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>{supplier.blockReason}</span>
                </div>
              )}
              
              {/* Last 2 Purchases Details */}
              {supplier.last2Quantities && supplier.last2Quantities.length >= 2 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر عمليتي شراء:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        العملية الأخيرة
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الصنف:</span>
                          <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {supplier.last2BatteryTypes?.[0] || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية:</span>
                          <span className="font-semibold">{supplier.last2Quantities[0]} كيلو</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر:</span>
                          <span className="font-semibold text-green-600">{supplier.last2Prices![0]} ريال</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        العملية السابقة
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الصنف:</span>
                          <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {supplier.last2BatteryTypes?.[1] || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية:</span>
                          <span className="font-semibold">{supplier.last2Quantities[1]} كيلو</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر:</span>
                          <span className="font-semibold text-green-600">{supplier.last2Prices![1]} ريال</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comparison */}
                  <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                    <h5 className="font-semibold text-yellow-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      مقارنة التغييرات
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تغيير الكمية: </span>
                        <span className={`font-semibold ${supplier.last2Quantities[0] > supplier.last2Quantities[1] ? 'text-green-600' : 'text-red-600'}`}>
                          {supplier.last2Quantities[0] > supplier.last2Quantities[1] ? '↗' : '↘'} 
                          {Math.abs(supplier.last2Quantities[0] - supplier.last2Quantities[1])} كيلو
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تغيير السعر: </span>
                        <span className={`font-semibold ${supplier.last2Prices![0] > supplier.last2Prices![1] ? 'text-red-600' : 'text-green-600'}`}>
                          {supplier.last2Prices![0] > supplier.last2Prices![1] ? '↗' : '↘'} 
                          {Math.abs(supplier.last2Prices![0] - supplier.last2Prices![1])} ريال
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <TrendingUp className="w-5 h-5" />
                إحصائيات التوريدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">{supplier.totalPurchases}</p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الكمية</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{supplier.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المبلغ (ريال)</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">{supplier.averagePrice}</p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط السعر (ريال)</p>
                </div>
                <div className={`${supplier.balance >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-4 text-center`}>
                  <DollarSign className={`w-8 h-8 mx-auto mb-2 ${supplier.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <p className={`text-2xl font-bold ${supplier.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {supplier.balance.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد (ريال)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <ShoppingCart className="w-5 h-5" />
                تاريخ التوريدات والمدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {supplier.purchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع البطارية</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>سعر الكيلو</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخصم</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ النهائي</th>
                        <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.purchases.map((purchase, index) => (
                        <tr key={purchase.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">{purchase.date}</td>
                          <td className="p-3 text-sm">
                            <Badge variant="default" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              فاتورة توريد
                            </Badge>
                          </td>
                          <td className="p-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{purchase.batteryType}</td>
                          <td className="p-3 text-sm">{purchase.quantity}</td>
                          <td className="p-3 text-sm">{purchase.pricePerKg}</td>
                          <td className="p-3 text-sm">{purchase.total.toLocaleString()}</td>
                          <td className="p-3 text-sm">{purchase.discount.toLocaleString()}</td>
                          <td className="p-3 text-sm font-bold text-green-600">{purchase.finalTotal.toLocaleString()}</td>
                          <td className="p-3 text-sm font-bold text-blue-600">
                            {supplier.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا توجد توريدات مسجلة
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
