import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { MessageCircle, Search, Filter, Phone, Calendar, DollarSign, Package, BarChart3, Download, RefreshCw } from "lucide-react";
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
  last2Quantities?: number[];
  last2Prices?: number[];
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد",
    phone: "0501234567",
    lastPurchase: "2024-01-15",
    totalPurchases: 45,
    totalAmount: 12500,
    averagePrice: 278,
    messageSent: false,
    notes: "عميل مميز",
    purchases: [],
    last2Quantities: [25, 30],
    last2Prices: [280, 275]
  },
  {
    id: "2",
    name: "فاطمة علي",
    phone: "0507654321",
    lastPurchase: "2024-01-10",
    totalPurchases: 32,
    totalAmount: 8900,
    averagePrice: 278,
    messageSent: true,
    lastMessageSent: "2024-01-12",
    purchases: [],
    last2Quantities: [15, 20],
    last2Prices: [285, 270]
  },
  {
    id: "3",
    name: "خالد أحمد",
    phone: "0551234567",
    lastPurchase: "2024-01-05",
    totalPurchases: 28,
    totalAmount: 7800,
    averagePrice: 279,
    messageSent: false,
    isBlocked: true,
    blockReason: "مدين بمبلغ كبير",
    purchases: [],
    last2Quantities: [10, 18],
    last2Prices: [290, 268]
  },
];

const CustomerFollowUp = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, filterType);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    applyFilters(searchTerm, type);
  };

  const applyFilters = (search: string, filter: string) => {
    let filtered = customers;

    if (search) {
      filtered = filtered.filter(customer =>
        customer.name.includes(search) || customer.phone.includes(search)
      );
    }

    if (filter !== "all") {
      filtered = filtered.filter(customer => {
        switch (filter) {
          case "no-message":
            return !customer.messageSent;
          case "message-sent":
            return customer.messageSent;
          case "blocked":
            return customer.isBlocked;
          case "active":
            return !customer.isBlocked;
          default:
            return true;
        }
      });
    }

    setFilteredCustomers(filtered);
  };

  const sendMessage = (customerId: string) => {
    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال رسالة المتابعة للعميل",
      duration: 2000,
    });
  };

  const exportToExcel = () => {
    toast({
      title: "تصدير Excel",
      description: "جاري تصدير البيانات إلى ملف Excel...",
      duration: 2000,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilteredCustomers(customers);
    toast({
      title: "تم إعادة تعيين الفلاتر",
      description: "تم إعادة تعيين جميع الفلاتر بنجاح",
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

  const showCustomerStats = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <MessageCircle className="w-5 h-5" />
            متابعة العملاء
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالاسم أو رقم الجوال..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pr-10 text-right"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full md:w-48 text-right">
                <SelectValue placeholder="فلترة العملاء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع العملاء</SelectItem>
                <SelectItem value="no-message" style={{ fontFamily: 'Tajawal, sans-serif' }}>لم يتم إرسال رسالة</SelectItem>
                <SelectItem value="message-sent" style={{ fontFamily: 'Tajawal, sans-serif' }}>تم إرسال رسالة</SelectItem>
                <SelectItem value="blocked" style={{ fontFamily: 'Tajawal, sans-serif' }}>محظور</SelectItem>
                <SelectItem value="active" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشط</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Download className="w-4 h-4" />
                تصدير Excel
              </Button>

              <Button
                onClick={resetFilters}
                variant="outline"
                className="flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className={`hover:shadow-lg transition-shadow ${customer.isBlocked ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-row-reverse">
                      <h3 className="font-semibold text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.name}
                      </h3>
                      <Badge variant={customer.isBlocked ? "destructive" : (customer.messageSent ? "default" : "secondary")}>
                        {customer.isBlocked ? "محظور" : (customer.messageSent ? "تم الإرسال" : "لم يتم الإرسال")}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{customer.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          آخر شراء: {customer.lastPurchase} (منذ {getDaysSinceLastPurchase(customer.lastPurchase)} يوم)
                        </span>
                      </div>

                      {customer.last2Quantities && customer.last2Prices && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <div className="flex justify-between items-center">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر كميتين:</span>
                            <span>{customer.last2Quantities.join(' - ')} كيلو</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر سعرين:</span>
                            <span>{customer.last2Prices.join(' - ')} ريال</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشتريات: {customer.totalPurchases} كيلو</span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المبلغ: {customer.totalAmount.toLocaleString()} ريال</span>
                      </div>

                      {customer.notes && (
                        <div className="text-gray-600 text-xs bg-yellow-50 p-2 rounded">
                          <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات: </span>
                          {customer.notes}
                        </div>
                      )}

                      {customer.isBlocked && customer.blockReason && (
                        <div className="text-red-600 text-xs bg-red-100 p-2 rounded">
                          <span className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>سبب الحظر: </span>
                          {customer.blockReason}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => showCustomerStats(customer)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <BarChart3 className="w-3 h-3 ml-1" />
                        إحصائيات العميل
                      </Button>
                      
                      <Button
                        onClick={() => sendMessage(customer.id)}
                        disabled={customer.messageSent || customer.isBlocked}
                        size="sm"
                        className="flex-1 text-xs"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <MessageCircle className="w-3 h-3 ml-1" />
                        {customer.messageSent ? "تم الإرسال" : "إرسال رسالة"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد عملاء مطابقون للبحث
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDetailsDialog
        open={showCustomerDetails}
        onClose={() => setShowCustomerDetails(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomerFollowUp;
