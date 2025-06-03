
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, MessageCircle, Phone, Calendar, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  messageSent?: boolean;
  lastMessageSent?: string;
}

// Mock data - سيتم استبدالها ببيانات Supabase
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد",
    phone: "0501234567",
    lastPurchase: "2024-01-15",
    totalPurchases: 15,
    totalAmount: 4500,
    averagePrice: 300,
    lastMessageSent: "2024-01-10"
  },
  {
    id: "2", 
    name: "فاطمة علي",
    phone: "0507654321",
    lastPurchase: "2024-01-10",
    totalPurchases: 8,
    totalAmount: 2400,
    averagePrice: 300
  },
  {
    id: "3",
    name: "خالد أحمد", 
    phone: "0501111111",
    lastPurchase: "2024-01-05",
    totalPurchases: 22,
    totalAmount: 6600,
    averagePrice: 300,
    lastMessageSent: "2024-01-01"
  },
  {
    id: "4",
    name: "مريم سالم",
    phone: "0502222222",
    lastPurchase: "2024-01-20",
    totalPurchases: 12,
    totalAmount: 3600,
    averagePrice: 300
  },
  {
    id: "5",
    name: "عبدالله حسن",
    phone: "0503333333",
    lastPurchase: "2024-01-08",
    totalPurchases: 18,
    totalAmount: 5400,
    averagePrice: 300,
    lastMessageSent: "2024-01-05"
  },
  {
    id: "6",
    name: "نورا أحمد",
    phone: "0504444444",
    lastPurchase: "2024-01-12",
    totalPurchases: 25,
    totalAmount: 7500,
    averagePrice: 300
  }
];

const CustomerFollowUp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const sendWhatsAppMessage = (customer: Customer) => {
    const message = encodeURIComponent("مرحباً، طال انتظارنا لك في المحل. نتطلع لرؤيتك قريباً!");
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/^0/, '966')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Update customer with message sent info and move to bottom
    const today = new Date().toISOString().split('T')[0];
    setCustomers(prev => {
      const updatedCustomers = prev.map(c => 
        c.id === customer.id ? { ...c, messageSent: true, lastMessageSent: today } : c
      );
      const sentCustomer = updatedCustomers.find(c => c.id === customer.id);
      const otherCustomers = updatedCustomers.filter(c => c.id !== customer.id);
      return sentCustomer ? [...otherCustomers, sentCustomer] : updatedCustomers;
    });
    
    toast({
      title: "تم إرسال الرسالة",
      description: `تم إرسال رسالة واتساب إلى ${customer.name}`,
    });
  };

  const getDaysSinceLastPurchase = (lastPurchase: string) => {
    const today = new Date();
    const purchaseDate = new Date(lastPurchase);
    const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysSinceLastMessage = (lastMessage?: string) => {
    if (!lastMessage) return null;
    const today = new Date();
    const messageDate = new Date(lastMessage);
    const diffTime = Math.abs(today.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة العملاء
          </h1>
          <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تواصل مع العملاء وتابع حالة الرسائل المرسلة
          </p>
        </div>

        {/* Search Header */}
        <Card className="shadow-lg mb-6 sm:mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              متابعة العملاء ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل بالاسم أو رقم الجوال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCustomers.map(customer => {
            const daysSinceLastPurchase = getDaysSinceLastPurchase(customer.lastPurchase);
            const daysSinceLastMessage = getDaysSinceLastMessage(customer.lastMessageSent);
            const isInactive = daysSinceLastPurchase > 30;
            
            return (
              <Card 
                key={customer.id} 
                className={`shadow-lg transition-all duration-300 hover:shadow-xl ${
                  customer.messageSent ? 'bg-gray-50 border-gray-300' : 
                  isInactive ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-white'
                }`}
              >
                <CardHeader className="pb-3 p-3 sm:p-4">
                  <div className="flex justify-between items-start flex-row-reverse">
                    <div className="text-right flex-1">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-row-reverse text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {customer.messageSent && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          تم الإرسال
                        </Badge>
                      )}
                      {isInactive && !customer.messageSent && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                          غير نشط
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* Purchase Info */}
                    <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-2 flex-row-reverse mb-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-semibold text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          آخر شراء
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.lastPurchase}
                      </p>
                      <p className="text-xs text-gray-500 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        منذ {daysSinceLastPurchase} يوم
                      </p>
                    </div>

                    {/* WhatsApp Message Info */}
                    {customer.lastMessageSent && (
                      <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center gap-2 flex-row-reverse mb-2">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          <span className="text-xs sm:text-sm font-semibold text-green-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            آخر رسالة واتساب
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.lastMessageSent}
                        </p>
                        <p className="text-xs text-gray-500 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          منذ {daysSinceLastMessage} يوم
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشتريات</p>
                        <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.totalPurchases}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
                        <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.totalAmount.toLocaleString()} ر.س</p>
                      </div>
                    </div>

                    {/* WhatsApp Button */}
                    <Button
                      onClick={() => sendWhatsAppMessage(customer)}
                      className={`w-full flex items-center gap-2 flex-row-reverse text-xs sm:text-sm ${
                        customer.messageSent 
                          ? 'bg-gray-400 hover:bg-gray-500' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      disabled={customer.messageSent}
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      {customer.messageSent ? "تم الإرسال" : "إرسال واتساب"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <Card className="shadow-md mt-8">
            <CardContent className="p-8 sm:p-12 text-center">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-sm sm:text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد عملاء مطابقين للبحث
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerFollowUp;
