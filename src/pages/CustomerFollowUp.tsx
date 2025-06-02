
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, MessageCircle } from "lucide-react";
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
    averagePrice: 300
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
    averagePrice: 300
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
    averagePrice: 300
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
    
    // Move customer to bottom of list
    setCustomers(prev => {
      const updatedCustomers = prev.map(c => 
        c.id === customer.id ? { ...c, messageSent: true } : c
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة العملاء
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تواصل مع العملاء وتابع حالة الرسائل المرسلة
          </p>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardTitle className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Users className="w-5 h-5" />
                متابعة العملاء
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          {/* Customers List */}
          <div className="grid gap-4">
            {filteredCustomers.map(customer => {
              const daysSinceLastPurchase = getDaysSinceLastPurchase(customer.lastPurchase);
              const isInactive = daysSinceLastPurchase > 30;
              
              return (
                <Card key={customer.id} className={`shadow-md transition-all duration-300 ${customer.messageSent ? 'bg-gray-50 border-gray-300' : isInactive ? 'border-orange-200' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                          <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {customer.name}
                          </h3>
                          {customer.messageSent && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              تم الإرسال
                            </Badge>
                          )}
                          {isInactive && !customer.messageSent && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              غير نشط
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            📱 {customer.phone}
                          </p>
                          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            📅 آخر شراء: {customer.lastPurchase}
                          </p>
                          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            ⏰ منذ {daysSinceLastPurchase} يوم
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => sendWhatsAppMessage(customer)}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                        disabled={customer.messageSent}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {customer.messageSent ? "تم الإرسال" : "إرسال واتساب"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredCustomers.length === 0 && (
            <Card className="shadow-md">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا توجد عملاء مطابقين للبحث
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerFollowUp;
