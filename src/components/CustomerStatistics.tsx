
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, User, Phone, Calendar, DollarSign, Package, TrendingUp } from "lucide-react";

interface Sale {
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
  purchases: Sale[];
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

  const CustomerDetailsDialog = ({ customer }: { customer: Customer }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
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
                      {language === "ar" ? "عدد المبيعات" : "Total Sales"}
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
                      {language === "ar" ? "آخر بيع" : "Last Sale"}
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
                      {language === "ar" ? "متوسط البيع" : "Average Sale"}
                    </p>
                    <p className="font-semibold">
                      {Math.round(customer.totalAmount / customer.totalPurchases).toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales History */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "تاريخ المبيعات" : "Sales History"}
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

          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.name}
                        </h3>
                        <div className={`flex items-center gap-2 text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className={`flex items-center gap-4 text-sm text-gray-500 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {language === "ar" ? "عدد المبيعات:" : "Sales:"} {customer.totalPurchases}
                          </span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {language === "ar" ? "إجمالي المبلغ:" : "Total Amount:"} {customer.totalAmount.toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
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
