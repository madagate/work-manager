
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Plus, Calendar, DollarSign, TrendingUp, Eye, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CustomerSearchDialog } from "@/components/CustomerSearchDialog";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  description?: string;
  notes?: string;
  totalSales: number;
  totalAmount: number;
  averageOrder: number;
  balance: number;
  lastSale?: string;
  sales: any[];
}

// Mock data - سيتم استبدالها ببيانات Supabase
const mockCustomers: Customer[] = [
  {
    id: "1",
    customerCode: "C001",
    name: "أحمد محمد السعدي",
    phone: "0501234567",
    description: "عميل مميز",
    notes: "يفضل الدفع نقداً",
    totalSales: 15,
    totalAmount: 12500,
    averageOrder: 833,
    balance: 1200,
    lastSale: "2024-01-20",
    sales: []
  },
  {
    id: "2",
    customerCode: "C002", 
    name: "فاطمة علي الأحمد",
    phone: "0507654321",
    description: "عميل جديد",
    notes: "",
    totalSales: 8,
    totalAmount: 6800,
    averageOrder: 850,
    balance: -500,
    lastSale: "2024-01-18",
    sales: []
  },
  {
    id: "3",
    customerCode: "C003",
    name: "محمد عبدالله الحربي", 
    phone: "0502345678",
    description: "عميل منتظم",
    notes: "يشتري بكميات كبيرة",
    totalSales: 22,
    totalAmount: 18900,
    averageOrder: 859,
    balance: 0,
    lastSale: "2024-01-15",
    sales: []
  }
];

const CustomerFollowUpPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerDetailsDialog, setShowCustomerDetailsDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetailsDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditDialog(true);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === updatedCustomer.id ? updatedCustomer : c
    ));
  };

  // حساب الإحصائيات
  const totalCustomers = customers.length;
  const totalSales = customers.reduce((sum, customer) => sum + customer.totalAmount, 0);
  const averageOrderValue = totalSales / customers.reduce((sum, customer) => sum + customer.totalSales, 0) || 0;

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
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-lg sm:text-2xl font-bold">{totalCustomers}</p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي العملاء
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {totalSales.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي المبيعات
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {averageOrderValue.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  متوسط الطلب
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود العميل</th>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</th>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</th>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبيعات</th>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد</th>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر عملية</th>
                  <th className="p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{customer.customerCode}</td>
                    <td className="p-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.name}</td>
                    <td className="p-3">{customer.phone}</td>
                    <td className="p-3">
                      <div>
                        <span className="font-bold">{customer.totalSales}</span> عملية
                        <br />
                        <span className="text-sm text-gray-600">
                          {customer.totalAmount.toLocaleString()} ريال
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`font-bold ${customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {customer.balance.toLocaleString()} ريال
                      </span>
                    </td>
                    <td className="p-3">{customer.lastSale || 'لا يوجد'}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleViewDetails(customer)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          عرض
                        </Button>
                        <Button
                          onClick={() => handleEditCustomer(customer)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          تعديل
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CustomerDetailsDialog
        open={showCustomerDetailsDialog}
        onClose={() => setShowCustomerDetailsDialog(false)}
        customer={selectedCustomer}
      />

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
