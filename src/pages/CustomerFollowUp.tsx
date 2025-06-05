
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, User, Download, RotateCcw, BarChart3 } from "lucide-react";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  code: string;
  phone: string;
  address: string;
  lastPurchaseDate: string;
  lastPurchaseAmount: number;
  lastTwoQuantities: number[];
  lastTwoPrices: number[];
  totalPurchases: number;
  status: "active" | "inactive" | "blocked";
  blockedReason?: string;
}

const CustomerFollowUp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "أحمد محمد السعيد",
      code: "C001",
      phone: "0501234567",
      address: "الرياض - حي النخيل",
      lastPurchaseDate: "2024-01-15",
      lastPurchaseAmount: 850,
      lastTwoQuantities: [2, 1],
      lastTwoPrices: [400, 450],
      totalPurchases: 15420,
      status: "active"
    },
    {
      id: "2", 
      name: "فاطمة عبدالله الخالد",
      code: "C002",
      phone: "0559876543",
      address: "جدة - حي البلد",
      lastPurchaseDate: "2024-01-10",
      lastPurchaseAmount: 1200,
      lastTwoQuantities: [3, 2],
      lastTwoPrices: [350, 425],
      totalPurchases: 8900,
      status: "inactive"
    },
    {
      id: "3",
      name: "محمد علي الشمري",
      code: "C003", 
      phone: "0512345678",
      address: "الدمام - حي الفيصلية",
      lastPurchaseDate: "2024-01-12",
      lastPurchaseAmount: 600,
      lastTwoQuantities: [1, 4],
      lastTwoPrices: [600, 150],
      totalPurchases: 12750,
      status: "blocked",
      blockedReason: "عدم سداد المستحقات"
    }
  ];

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleShowDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const exportToExcel = () => {
    toast({
      title: "تصدير البيانات",
      description: "تم تصدير بيانات العملاء إلى ملف Excel بنجاح",
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    toast({
      title: "إعادة تعيين",
      description: "تم إعادة تعيين جميع الفلاتر",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "نشط";
      case "inactive": return "غير نشط";
      case "blocked": return "محظور";
      default: return "غير محدد";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة العملاء
          </h1>
          <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة شاملة لجميع العملاء ونشاطهم الشرائي
          </p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث بالاسم أو الرمز أو الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-full sm:w-80"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 ml-2" />
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع العملاء</SelectItem>
                    <SelectItem value="active" style={{ fontFamily: 'Tajawal, sans-serif' }}>النشطون</SelectItem>
                    <SelectItem value="inactive" style={{ fontFamily: 'Tajawal, sans-serif' }}>غير النشطين</SelectItem>
                    <SelectItem value="blocked" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحظورون</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  تصدير Excel
                </Button>
                <Button onClick={resetFilters} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي العملاء</p>
                  <p className="text-2xl font-bold text-blue-600">{mockCustomers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>العملاء النشطون</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockCustomers.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>العملاء المحظورون</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockCustomers.filter(c => c.status === 'blocked').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {customer.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {customer.code}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(customer.status)}>
                    {getStatusText(customer.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</p>
                    <p className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</p>
                    <p className="font-medium text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.address}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر شراء:</span>
                      <span className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.lastPurchaseDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ:</span>
                      <span className="font-medium text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.lastPurchaseAmount.toLocaleString()} ريال
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر كميتين:</span>
                      <span className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.lastTwoQuantities.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر سعرين:</span>
                      <span className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.lastTwoPrices.map(p => p.toLocaleString()).join(', ')} ريال
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشتريات:</span>
                      <span className="font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.totalPurchases.toLocaleString()} ريال
                      </span>
                    </div>
                  </div>
                </div>

                {customer.status === 'blocked' && customer.blockedReason && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <strong>سبب الحظر:</strong> {customer.blockedReason}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleShowDetails(customer)}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <BarChart3 className="w-4 h-4" />
                  إحصائيات العميل
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد نتائج
            </h3>
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لم يتم العثور على عملاء بالمعايير المحددة
            </p>
          </div>
        )}
      </div>

      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        language="ar"
      />
    </div>
  );
};

export default CustomerFollowUp;
