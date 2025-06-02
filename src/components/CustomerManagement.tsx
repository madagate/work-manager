
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, MessageCircle, Calendar, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
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
  }
];

const whatsappMessages = {
  ar: "مرحباً، طال انتظارنا لك في المحل. نتطلع لرؤيتك قريباً!",
  en: "Hello! We've been waiting for you at the shop. Looking forward to seeing you soon!",
  hi: "नमस्ते! हम दुकान में आपका इंतज़ार कर रहे हैं। जल्दी मिलने की उम्मीद है!",
  bn: "হ্যালো! আমরা দোকানে আপনার জন্য অপেক্ষা করছি। শীঘ্রই দেখা হওয়ার আশায়!"
};

export const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [customers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const sendWhatsAppMessage = (customer: Customer) => {
    const message = whatsappMessages[selectedLanguage as keyof typeof whatsappMessages];
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/^0/, '966')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "تم فتح واتساب",
      description: `تم فتح محادثة مع ${customer.name}`,
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
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Users className="w-5 h-5" />
            إدارة العملاء
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي العملاء
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي المبيعات
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">
                  {Math.round(customers.reduce((sum, c) => sum + c.averagePrice, 0) / customers.length)}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  متوسط سعر الكيلو
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map(customer => {
          const daysSinceLastPurchase = getDaysSinceLastPurchase(customer.lastPurchase);
          const isInactive = daysSinceLastPurchase > 30;
          
          return (
            <Card key={customer.id} className={`shadow-md ${isInactive ? 'border-orange-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.name}
                      </h3>
                      {isInactive && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          غير نشط
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-1">{customer.phone}</p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      آخر شراء: {customer.lastPurchase} ({daysSinceLastPurchase} يوم)
                    </p>
                  </div>
                  
                  <div className="text-left">
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المشتريات
                        </p>
                        <p className="font-semibold">{customer.totalPurchases}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الإجمالي
                        </p>
                        <p className="font-semibold">{customer.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          متوسط السعر
                        </p>
                        <p className="font-semibold">{customer.averagePrice}</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => sendWhatsAppMessage(customer)}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      واتساب
                    </Button>
                  </div>
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
  );
};
