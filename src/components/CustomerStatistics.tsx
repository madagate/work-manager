import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, User, Phone, Calendar, DollarSign, Package, TrendingUp, MessageCircle } from "lucide-react";

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

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase?: string;
  totalPurchases: number;
  totalAmount: number;
  purchases: Purchase[];
}

interface CustomerStatisticsProps {
  language?: string;
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد",
    phone: "0501234567",
    lastPurchase: "2024-01-15",
    totalPurchases: 5,
    totalAmount: 2500,
    purchases: [
      {
        id: "p1",
        date: "2024-01-15",
        batteryType: "بطاريات عادية",
        quantity: 10,
        pricePerKg: 25,
        total: 250,
        discount: 0,
        finalTotal: 250
      },
      {
        id: "p2",
        date: "2024-01-10",
        batteryType: "بطاريات جافة",
        quantity: 15,
        pricePerKg: 30,
        total: 450,
        discount: 50,
        finalTotal: 400
      }
    ]
  },
  {
    id: "2",
    name: "فاطمة علي",
    phone: "0507654321",
    lastPurchase: "2024-01-10",
    totalPurchases: 3,
    totalAmount: 1800,
    purchases: [
      {
        id: "p3",
        date: "2024-01-10",
        batteryType: "بطاريات زجاج",
        quantity: 20,
        pricePerKg: 35,
        total: 700,
        discount: 100,
        finalTotal: 600
      }
    ]
  }
];

export const CustomerStatistics = ({ language = "ar" }: CustomerStatisticsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const isRTL = language === "ar";
  
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleWhatsAppMessage = (customer: Customer) => {
    const message = language === "ar" 
      ? `مرحباً ${customer.name}، نحن نشتاق لك! لم نراك منذ فترة، هل لديك بطاريات تريد بيعها؟`
      : `Hello ${customer.name}, we miss you! We haven't seen you for a while, do you have batteries to sell?`;
    
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const CustomerDetailsDialog = ({ customer }: { customer: Customer }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {language === "ar" ? "عرض التفاصيل" : "View Details"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? `إحصائيات العميل: ${customer.name}` : `Customer Statistics: ${customer.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "عدد المشتريات" : "Total Purchases"}
                    </p>
                    <p className="text-2xl font-bold">{customer.totalPurchases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "إجمالي المبلغ" : "Total Amount"}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {customer.totalAmount.toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "آخر شراء" : "Last Purchase"}
                    </p>
                    <p className="font-semibold">{customer.lastPurchase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "متوسط الشراء" : "Average Purchase"}
                    </p>
                    <p className="font-semibold">
                      {Math.round(customer.totalAmount / customer.totalPurchases).toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "تاريخ المشتريات" : "Purchase History"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "التاريخ" : "Date"}
                      </th>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "نوع البطارية" : "Battery Type"}
                      </th>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "الكمية" : "Quantity"}
                      </th>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "سعر الكيلو" : "Price/Kg"}
                      </th>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "الإجمالي" : "Total"}
                      </th>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "الخصم" : "Discount"}
                      </th>
                      <th className={`p-3 font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "المبلغ النهائي" : "Final Amount"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{purchase.date}</td>
                        <td className="p-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>{purchase.batteryType}</td>
                        <td className="p-3">{purchase.quantity}</td>
                        <td className="p-3">{purchase.pricePerKg}</td>
                        <td className="p-3">{purchase.total.toLocaleString()}</td>
                        <td className="p-3">{purchase.discount.toLocaleString()}</td>
                        <td className="p-3 font-bold text-green-600">{purchase.finalTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <BarChart3 className="w-5 h-5" />
            {language === "ar" ? "إحصائيات العملاء" : "Customer Statistics"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <Input
              placeholder={language === "ar" ? "ابحث عن عميل..." : "Search for customer..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow border-2 border-gray-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-3">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.name}
                      </h3>
                      <div className={`flex items-center gap-2 text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "المشتريات" : "Purchases"}
                      </p>
                      <p className="text-lg font-bold text-green-600">{customer.totalPurchases}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {language === "ar" ? "المبلغ" : "Amount"}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {customer.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "آخر شراء" : "Last Purchase"}
                    </p>
                    <p className="text-sm font-semibold">{customer.lastPurchase}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      onClick={() => handleWhatsAppMessage(customer)}
                      className={`flex-1 flex items-center gap-2 bg-green-600 hover:bg-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}
                      size="sm"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {language === "ar" ? "واتساب" : "WhatsApp"}
                    </Button>
                    <CustomerDetailsDialog customer={customer} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
