
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, MessageCircle, Phone, Calendar, Filter, User, Package, DollarSign, Edit3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";

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
  customerCode: string;
  name: string;
  phone: string;
  description?: string;
  notes?: string;
  lastPurchase: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  messageSent?: boolean;
  lastMessageSent?: string;
  isBlocked?: boolean;
  blockReason?: string;
  purchases: Purchase[];
  last2Quantities?: number[];
  last2Prices?: number[];
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    customerCode: "C001",
    name: "أحمد محمد",
    phone: "0501234567",
    description: "عميل مميز",
    notes: "يشتري بانتظام",
    lastPurchase: "2024-01-15",
    totalPurchases: 15,
    totalAmount: 4500,
    averagePrice: 300,
    lastMessageSent: "2024-01-10",
    purchases: [
      { id: "p1", date: "2024-01-15", batteryType: "بطاريات عادية", quantity: 12, pricePerKg: 25, total: 300, discount: 0, finalTotal: 300 },
      { id: "p2", date: "2024-01-10", batteryType: "بطاريات جافة", quantity: 8, pricePerKg: 30, total: 240, discount: 20, finalTotal: 220 }
    ],
    last2Quantities: [12, 8],
    last2Prices: [25, 30]
  }
];

const CustomerFollowUpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [lastBuyFilter, setLastBuyFilter] = useState("all");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditDialog(true);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === updatedCustomer.id ? updatedCustomer : c
    ));
    setShowEditDialog(false);
    setEditingCustomer(null);
  };

  const sendWhatsAppMessage = (customer: Customer) => {
    const message = encodeURIComponent("مرحباً، طال انتظارنا لك في المحل. نتطلع لرؤيتك قريباً!");
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/^0/, '966')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "تم إرسال الرسالة",
      description: `تم إرسال رسالة واتساب إلى ${customer.name}`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة العملاء
          </h1>
          <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            عرض وتعديل بيانات العملاء وإرسال رسائل المتابعة
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg mb-6 sm:mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              قائمة العملاء ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل بالاسم أو رقم الجوال أو كود العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setLastBuyFilter("all");
                  setSearchTerm("");
                }}
                variant="outline"
                className="flex items-center gap-2 flex-row-reverse"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Filter className="w-4 h-4" />
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredCustomers.map(customer => (
            <Card key={customer.id} className="shadow-lg transition-all duration-300 hover:shadow-xl bg-white border-blue-200">
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
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      كود العميل: {customer.customerCode}
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                    عميل
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Customer Info */}
                  <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center gap-2 flex-row-reverse mb-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      <span className="text-xs sm:text-sm font-semibold text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        معلومات العميل
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {customer.description || "لا يوجد وصف"}
                    </p>
                    <p className="text-xs text-gray-500 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الملاحظات: {customer.notes || "لا توجد ملاحظات"}
                    </p>
                  </div>

                  {/* Purchase Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشتريات</p>
                      <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.totalPurchases}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
                      <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتوسط</p>
                      <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.averagePrice}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Edit Button */}
                    <Button
                      onClick={() => handleEditCustomer(customer)}
                      className="w-full flex items-center gap-2 flex-row-reverse text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      تعديل بيانات العميل
                    </Button>

                    {/* WhatsApp Button */}
                    <Button
                      onClick={() => sendWhatsAppMessage(customer)}
                      className="w-full flex items-center gap-2 flex-row-reverse text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      إرسال واتساب
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

      {/* Edit Customer Dialog */}
      <EditCustomerDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        customer={editingCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />
    </div>
  );
};

export default CustomerFollowUpPage;
