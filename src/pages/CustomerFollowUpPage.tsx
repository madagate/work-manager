
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Phone, 
  User, 
  Calendar,
  Edit,
  Eye,
  ShoppingCart
} from "lucide-react";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { CustomerSearchDialog } from "@/components/CustomerSearchDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";

// Customer interface matching the one used in dialogs
interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  description?: string;
  notes?: string;
  lastPurchase?: string;
  totalAmount?: number;
  averagePrice?: number;
  purchases?: number;
}

// Mock data - will be replaced with Supabase data
const mockCustomers: Customer[] = [
  {
    id: "1",
    customerCode: "C001",
    name: "أحمد محمد علي",
    phone: "0501234567",
    description: "عميل دائم - يشتري بطاريات السيارات",
    lastPurchase: "2024-01-15",
    totalAmount: 15600,
    averagePrice: 1200,
    purchases: 13,
    notes: "يفضل البطاريات الكورية"
  },
  {
    id: "2", 
    customerCode: "C002",
    name: "فاطمة أحمد السالم",
    phone: "0507654321",
    description: "عميل جديد",
    lastPurchase: "2024-01-10",
    totalAmount: 2400,
    averagePrice: 800,
    purchases: 3,
    notes: "تحتاج متابعة"
  },
  {
    id: "3",
    customerCode: "C003", 
    name: "خالد عبدالله",
    phone: "0501111111",
    description: "تاجر جملة",
    lastPurchase: "2024-01-05",
    totalAmount: 45000,
    averagePrice: 2250,
    purchases: 20,
    notes: "خصم 15% على الكميات الكبيرة"
  },
  {
    id: "4",
    customerCode: "C004",
    name: "مريم سعد",
    phone: "0502222222", 
    description: "عميل VIP",
    lastPurchase: "2024-01-12",
    totalAmount: 8900,
    averagePrice: 1480,
    purchases: 6,
    notes: "دفع فوري - خدمة ممتازة"
  }
];

const CustomerFollowUpPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.description && customer.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const generateNextCustomerCode = () => {
    const maxCode = customers.reduce((max, customer) => {
      const num = parseInt(customer.customerCode.replace('C', ''));
      return num > max ? num : max;
    }, 0);
    return `C${String(maxCode + 1).padStart(3, '0')}`;
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    const customerWithDefaults = {
      ...newCustomer,
      customerCode: generateNextCustomerCode(),
      totalAmount: 0,
      averagePrice: 0,
      purchases: 0
    };
    setCustomers([...customers, customerWithDefaults]);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditDialog(true);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
    setSelectedCustomer(null);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const handleSearchSelect = (customer: Customer) => {
    // Handle customer selection from search
    console.log("Selected customer:", customer);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ر.س`;
  };

  const getCustomerStatusColor = (totalAmount: number) => {
    if (totalAmount >= 20000) return "bg-green-100 text-green-800";
    if (totalAmount >= 10000) return "bg-blue-100 text-blue-800";
    if (totalAmount >= 5000) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getCustomerStatusText = (totalAmount: number) => {
    if (totalAmount >= 20000) return "عميل ذهبي";
    if (totalAmount >= 10000) return "عميل فضي";
    if (totalAmount >= 5000) return "عميل برونزي";
    return "عميل عادي";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة العملاء
          </h1>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة ومتابعة بيانات العملاء ومبيعاتهم
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSearchDialog(true)}
            variant="outline"
            className="flex items-center gap-2"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            <Search className="w-4 h-4" />
            بحث متقدم
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus className="w-4 h-4" />
            إضافة عميل
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="ابحث عن عميل بالاسم، رقم الجوال، أو رمز العميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي العملاء
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {customers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي المبيعات
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(customers.reduce((sum, customer) => sum + (customer.totalAmount || 0), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العملاء النشطين
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {customers.filter(customer => customer.lastPurchase).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  متوسط المبيعات
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(Math.round(customers.reduce((sum, customer) => sum + (customer.totalAmount || 0), 0) / customers.length) || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {customer.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {customer.customerCode}
                    </Badge>
                    <Badge className={`text-xs ${getCustomerStatusColor(customer.totalAmount || 0)}`}>
                      {getCustomerStatusText(customer.totalAmount || 0)}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(customer)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCustomer(customer)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              
              {customer.description && (
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {customer.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي المبيعات
                  </p>
                  <p className="font-semibold text-sm">
                    {formatCurrency(customer.totalAmount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عدد المبيعات
                  </p>
                  <p className="font-semibold text-sm">
                    {customer.purchases || 0}
                  </p>
                </div>
              </div>

              {customer.lastPurchase && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    آخر بيع
                  </p>
                  <p className="text-sm font-medium">
                    {customer.lastPurchase}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            لا توجد عملاء
          </h3>
          <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {searchTerm ? "لم يتم العثور على عملاء مطابقين لبحثك" : "لم يتم إضافة أي عملاء بعد"}
          </p>
        </div>
      )}

      {/* Dialogs */}
      <AddCustomerDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCustomerAdded={handleAddCustomer}
        language="ar"
        nextCustomerCode={generateNextCustomerCode()}
      />

      <CustomerSearchDialog
        open={showSearchDialog}
        onClose={() => setShowSearchDialog(false)}
        onCustomerSelect={handleSearchSelect}
        language="ar"
      />

      <EditCustomerDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        customer={selectedCustomer}
        onCustomerUpdated={handleUpdateCustomer}
      />

      <CustomerDetailsDialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        customer={selectedCustomer}
        language="ar"
      />
    </div>
  );
};

export default CustomerFollowUpPage;
