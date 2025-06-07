
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Phone, MessageCircle, Ban, CheckCircle, Edit, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  description?: string;
  notes?: string;
  lastPurchase?: string;
  totalPurchases: number;
  averagePrice: number;
  totalAmount: number;
  purchases: any[];
  isBlocked?: boolean;
  blockReason?: string;
  messageSent?: boolean;
  lastMessageSent?: string;
  last2Quantities?: number[];
  last2Prices?: number[];
  last2BatteryTypes?: string[];
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    customerCode: "C001",
    name: "أحمد محمد السعيد",
    phone: "0501234567",
    description: "عميل مميز",
    notes: "يفضل التوصيل صباحاً",
    lastPurchase: "2024-01-15",
    totalPurchases: 15,
    averagePrice: 125.50,
    totalAmount: 1882.50,
    purchases: [],
    isBlocked: false,
    messageSent: false,
    last2Quantities: [100, 150],
    last2Prices: [120, 130],
    last2BatteryTypes: ["AAA", "AA"]
  },
  {
    id: "2",
    customerCode: "C002", 
    name: "فاطمة أحمد",
    phone: "0507654321",
    description: "عميل جديد",
    notes: "",
    lastPurchase: "2024-01-10",
    totalPurchases: 5,
    averagePrice: 85.00,
    totalAmount: 425.00,
    purchases: [],
    isBlocked: true,
    blockReason: "تأخر في السداد",
    messageSent: true,
    lastMessageSent: "2024-01-18",
    last2Quantities: [50, 75],
    last2Prices: [80, 90],
    last2BatteryTypes: ["D", "C"]
  }
];

const CustomerFollowUpPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "blocked" | "active">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const searchMatch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase());

    const typeMatch = 
      filterType === "all" || 
      (filterType === "blocked" && customer.isBlocked) ||
      (filterType === "active" && !customer.isBlocked);

    return searchMatch && typeMatch;
  });

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditDialog(true);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const toggleCustomerBlock = (customerId: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, isBlocked: !customer.isBlocked }
        : customer
    ));
    
    const customer = customers.find(c => c.id === customerId);
    toast({
      title: customer?.isBlocked ? "تم إلغاء الحظر" : "تم حظر العميل",
      description: `تم ${customer?.isBlocked ? "إلغاء حظر" : "حظر"} العميل بنجاح`,
    });
  };

  const sendMessage = (customerId: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { 
            ...customer, 
            messageSent: true, 
            lastMessageSent: new Date().toISOString().split('T')[0] 
          }
        : customer
    ));
    
    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال رسالة للعميل بنجاح",
    });
  };

  const getCustomerStatusColor = (customer: Customer) => {
    if (customer.isBlocked) return "text-red-600";
    if (customer.totalPurchases >= 10) return "text-green-600";
    return "text-yellow-600";
  };

  const getCustomerStatusText = (customer: Customer) => {
    if (customer.isBlocked) return "محظور";
    if (customer.totalPurchases >= 10) return "مميز";
    return "عادي";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            متابعة العملاء
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  size="sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  الكل
                </Button>
                <Button
                  variant={filterType === "active" ? "default" : "outline"}
                  onClick={() => setFilterType("active")}
                  size="sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  نشط
                </Button>
                <Button
                  variant={filterType === "blocked" ? "default" : "outline"}
                  onClick={() => setFilterType("blocked")}
                  size="sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  محظور
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-lg sm:text-2xl font-bold">{customers.length}</p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي العملاء
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {customers.filter(c => !c.isBlocked).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عملاء نشطون
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Ban className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-red-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {customers.filter(c => c.isBlocked).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عملاء محظورون
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {customers.filter(c => c.messageSent).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  رسائل مرسلة
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {customer.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">كود: {customer.customerCode}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </div>
                <Badge 
                  variant={customer.isBlocked ? "destructive" : "default"}
                  className={getCustomerStatusColor(customer)}
                >
                  {getCustomerStatusText(customer)}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>إجمالي المشتريات:</span>
                  <span className="font-bold">{customer.totalPurchases}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>متوسط السعر:</span>
                  <span className="font-bold">{customer.averagePrice.toFixed(2)} ريال</span>
                </div>
                {customer.lastPurchase && (
                  <div className="flex justify-between text-sm">
                    <span>آخر شراء:</span>
                    <span>{customer.lastPurchase}</span>
                  </div>
                )}
                {customer.isBlocked && customer.blockReason && (
                  <div className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{customer.blockReason}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCustomerSelect(customer)}
                    className="flex-1 text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    التفاصيل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCustomer(customer)}
                    className="flex-1 text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Edit className="w-3 h-3 ml-1" />
                    تعديل
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={customer.isBlocked ? "default" : "destructive"}
                    size="sm"
                    onClick={() => toggleCustomerBlock(customer.id)}
                    className="flex-1 text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    {customer.isBlocked ? "إلغاء الحظر" : "حظر"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(customer.id)}
                    disabled={customer.messageSent}
                    className="flex-1 text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <MessageCircle className="w-3 h-3 ml-1" />
                    {customer.messageSent ? "تم الإرسال" : "إرسال رسالة"}
                  </Button>
                </div>
              </div>

              {customer.messageSent && customer.lastMessageSent && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  آخر رسالة: {customer.lastMessageSent}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد عملاء تطابق البحث
            </p>
          </CardContent>
        </Card>
      )}

      <CustomerDetailsDialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        customer={selectedCustomer}
      />

      <EditCustomerDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />
    </div>
  );
};

export default CustomerFollowUpPage;
