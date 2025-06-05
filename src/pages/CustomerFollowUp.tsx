import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { 
  MessageCircle, 
  User, 
  Phone, 
  Calendar, 
  Search, 
  Filter,
  Download,
  RotateCcw,
  TrendingUp
} from "lucide-react";
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
  notes?: string;
  isBlocked?: boolean;
  blockReason?: string;
  purchases: any[];
}

const CustomerFollowUp = () => {
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "أحمد محمد",
      phone: "0501234567",
      lastPurchase: "2024-01-15",
      totalPurchases: 150,
      totalAmount: 4500,
      averagePrice: 30,
      messageSent: false,
      notes: "عميل مميز",
      purchases: [
        {
          id: "p1",
          date: "2024-01-15",
          batteryType: "بطاريات عادية",
          quantity: 50,
          pricePerKg: 30,
          total: 1500,
          discount: 100,
          finalTotal: 1400
        }
      ]
    },
    {
      id: "2",
      name: "سارة أحمد",
      phone: "0559876543",
      lastPurchase: "2024-02-01",
      totalPurchases: 120,
      totalAmount: 3600,
      averagePrice: 30,
      messageSent: true,
      lastMessageSent: "2024-02-05",
      notes: "يحتاج إلى متابعة بعد أسبوعين",
      purchases: [
        {
          id: "p2",
          date: "2024-02-01",
          batteryType: "بطاريات جافة",
          quantity: 40,
          pricePerKg: 30,
          total: 1200,
          discount: 50,
          finalTotal: 1150
        }
      ]
    },
    {
      id: "3",
      name: "محمد علي",
      phone: "0534567890",
      lastPurchase: "2024-01-20",
      totalPurchases: 100,
      totalAmount: 3000,
      averagePrice: 30,
      messageSent: false,
      notes: "عميل جديد",
      purchases: [
        {
          id: "p3",
          date: "2024-01-20",
          batteryType: "بطاريات زجاج",
          quantity: 30,
          pricePerKg: 30,
          total: 900,
          discount: 20,
          finalTotal: 880
        }
      ]
    },
    {
      id: "4",
      name: "فاطمة سالم",
      phone: "0567890123",
      lastPurchase: "2024-02-10",
      totalPurchases: 95,
      totalAmount: 2850,
      averagePrice: 30,
      messageSent: true,
      lastMessageSent: "2024-02-12",
      notes: "مهتم بالعروض",
      purchases: [
        {
          id: "p4",
          date: "2024-02-10",
          batteryType: "بطاريات تعبئة",
          quantity: 25,
          pricePerKg: 30,
          total: 750,
          discount: 30,
          finalTotal: 720
        }
      ]
    },
    {
      id: "5",
      name: "عبدالله حسن",
      phone: "0543210987",
      lastPurchase: "2024-01-25",
      totalPurchases: 80,
      totalAmount: 2400,
      averagePrice: 30,
      messageSent: false,
      notes: "يحتاج إلى تذكير بالصيانة",
      purchases: [
        {
          id: "p5",
          date: "2024-01-25",
          batteryType: "رصاص",
          quantity: 20,
          pricePerKg: 30,
          total: 600,
          discount: 10,
          finalTotal: 590
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDays, setFilterDays] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    if (filterDays === "all") return matchesSearch;
    
    const daysSinceLastPurchase = Math.ceil(
      (new Date().getTime() - new Date(customer.lastPurchase).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const daysFilter = parseInt(filterDays);
    return matchesSearch && daysSinceLastPurchase >= daysFilter;
  });

  const sendMessage = (customerId: string) => {
    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال رسالة المتابعة للعميل",
      duration: 2000,
    });
  };

  const exportToExcel = () => {
    toast({
      title: "تصدير البيانات",
      description: "تم تصدير بيانات العملاء إلى Excel",
      duration: 2000,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterDays("all");
    toast({
      title: "إعادة تعيين الفلاتر",
      description: "تم إعادة تعيين جميع الفلاتر",
      duration: 2000,
    });
  };

  const getDaysSinceLastPurchase = (lastPurchase: string) => {
    const today = new Date();
    const purchaseDate = new Date(lastPurchase);
    const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityLevel = (days: number) => {
    if (days >= 30) return { label: "عالي", color: "bg-red-500" };
    if (days >= 14) return { label: "متوسط", color: "bg-yellow-500" };
    return { label: "منخفض", color: "bg-green-500" };
  };

  const handleShowCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl" dir="rtl">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <MessageCircle className="w-6 h-6" />
            متابعة العملاء
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالاسم أو رقم الجوال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterDays} onValueChange={setFilterDays}>
                <SelectTrigger className="w-48 text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع العملاء</SelectItem>
                  <SelectItem value="7" style={{ fontFamily: 'Tajawal, sans-serif' }}>لم يشتري منذ 7 أيام</SelectItem>
                  <SelectItem value="14" style={{ fontFamily: 'Tajawal, sans-serif' }}>لم يشتري منذ 14 يوم</SelectItem>
                  <SelectItem value="30" style={{ fontFamily: 'Tajawal, sans-serif' }}>لم يشتري منذ شهر</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={exportToExcel}
                variant="outline"
                className="flex items-center gap-2 flex-row-reverse"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Download className="w-4 h-4" />
                تصدير Excel
              </Button>
              
              <Button 
                onClick={resetFilters}
                variant="outline"
                className="flex items-center gap-2 flex-row-reverse"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <RotateCcw className="w-4 h-4" />
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => {
              const daysSince = getDaysSinceLastPurchase(customer.lastPurchase);
              const priority = getPriorityLevel(daysSince);
              
              return (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between flex-row-reverse">
                      <div className="text-right">
                        <h3 className="font-semibold text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{customer.phone}</p>
                      </div>
                      <Badge className={`${priority.color} text-white`}>
                        {priority.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          آخر شراء: {customer.lastPurchase} (منذ {daysSince} يوم)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          إجمالي المشتريات: {customer.totalPurchases} كيلو
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <span className="w-4 h-4 text-gray-500">💰</span>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          إجمالي المبلغ: {customer.totalAmount} ريال
                        </span>
                      </div>
                    </div>
                    
                    {customer.notes && (
                      <div className="bg-yellow-50 p-2 rounded text-sm">
                        <span className="font-medium text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          ملاحظة: 
                        </span>
                        <span className="text-yellow-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.notes}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleShowCustomerDetails(customer)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2 flex-row-reverse"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <TrendingUp className="w-4 h-4" />
                        إحصائيات العميل
                      </Button>
                      
                      <Button
                        onClick={() => sendMessage(customer.id)}
                        size="sm"
                        className="flex-1 flex items-center gap-2 flex-row-reverse"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        إرسال رسالة
                      </Button>
                    </div>
                    
                    {customer.messageSent && customer.lastMessageSent && (
                      <div className="text-xs text-green-600 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        آخر رسالة: {customer.lastMessageSent}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد نتائج
              </h3>
              <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لم يتم العثور على عملاء يطابقون معايير البحث
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDetailsDialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomerFollowUp;
