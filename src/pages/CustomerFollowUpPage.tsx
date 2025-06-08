import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Phone, Mail, MapPin, Calendar, DollarSign, ShoppingCart } from "lucide-react";
import { CustomerManagement } from "@/components/CustomerManagement";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { CustomerSearchDialog } from "@/components/CustomerSearchDialog";
import { CustomerStatistics } from "@/components/CustomerStatistics";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  totalPurchases: number;
  lastPurchase: string;
  status: 'active' | 'inactive';
  balance: number;
  notes: string;
}

const CustomerFollowUpPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: 'ascending' | 'descending';
  } | null>(null);

  useEffect(() => {
    // Fetch customers data
    const fetchCustomers = async () => {
      // This would be replaced with an actual API call
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          phone: '0501234567',
          email: 'ahmed@example.com',
          address: 'الرياض، حي النزهة',
          joinDate: '2023-01-15',
          totalPurchases: 12500,
          lastPurchase: '2023-06-20',
          status: 'active',
          balance: 1500,
          notes: 'عميل منتظم، يفضل بطاريات نوع A'
        },
        {
          id: '2',
          name: 'فاطمة علي',
          phone: '0559876543',
          email: 'fatima@example.com',
          address: 'جدة، حي الروضة',
          joinDate: '2022-11-05',
          totalPurchases: 8700,
          lastPurchase: '2023-05-12',
          status: 'active',
          balance: -500,
          notes: 'تفضل الدفع بالتقسيط'
        },
        {
          id: '3',
          name: 'خالد عبدالله',
          phone: '0561122334',
          email: 'khalid@example.com',
          address: 'الدمام، حي الشاطئ',
          joinDate: '2023-03-22',
          totalPurchases: 3200,
          lastPurchase: '2023-04-30',
          status: 'inactive',
          balance: 0,
          notes: 'يحتاج متابعة'
        },
        {
          id: '4',
          name: 'نورة سعد',
          phone: '0555667788',
          email: 'noura@example.com',
          address: 'الرياض، حي الملقا',
          joinDate: '2022-09-10',
          totalPurchases: 15800,
          lastPurchase: '2023-06-25',
          status: 'active',
          balance: 2200,
          notes: 'عميلة مهمة، تشتري بكميات كبيرة'
        },
        {
          id: '5',
          name: 'محمد العلي',
          phone: '0509988776',
          email: 'mohammad@example.com',
          address: 'مكة، حي العزيزية',
          joinDate: '2023-02-18',
          totalPurchases: 6500,
          lastPurchase: '2023-05-05',
          status: 'active',
          balance: -1200,
          notes: 'يفضل التعامل المباشر'
        },
      ];
      setCustomers(mockCustomers);
    };

    fetchCustomers();
  }, []);

  const handleSort = (key: keyof Customer) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    if (a[key] < b[key]) {
      return direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditOpen(true);
  };

  const handleAddCustomer = () => {
    setIsAddOpen(true);
  };

  const handleAdvancedSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSaveCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => 
      c.id === updatedCustomer.id ? updatedCustomer : c
    ));
    setIsEditOpen(false);
  };

  const handleCreateCustomer = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
    setIsAddOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">متابعة العملاء</h1>
          <p className="text-gray-500">إدارة وتتبع معلومات العملاء والمبيعات</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="بحث عن عميل..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleAdvancedSearch}>
            بحث متقدم
          </Button>
          <Button onClick={handleAddCustomer}>
            <Plus className="mr-2 h-4 w-4" /> إضافة عميل
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-blue-500" />
              إجمالي المبيعات للعملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">46,700 ريال</div>
            <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">عدد العملاء النشطين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 عملاء</div>
            <p className="text-xs text-muted-foreground">من إجمالي 5 عملاء</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجمالي المديونية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,000 ريال</div>
            <p className="text-xs text-muted-foreground">لعدد 2 عملاء</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء</CardTitle>
          <CardDescription>إدارة وعرض بيانات العملاء</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                    اسم العميل
                  </th>
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('phone')}>
                    رقم الهاتف
                  </th>
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('lastPurchase')}>
                    آخر عملية شراء
                  </th>
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('totalPurchases')}>
                    إجمالي المشتريات
                  </th>
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('balance')}>
                    الرصيد
                  </th>
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('status')}>
                    الحالة
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4 font-mono">{customer.phone}</td>
                    <td className="py-3 px-4">{new Date(customer.lastPurchase).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 px-4">{customer.totalPurchases.toLocaleString()} ريال</td>
                    <td className="py-3 px-4">
                      <span className={customer.balance < 0 ? 'text-red-500' : customer.balance > 0 ? 'text-green-500' : ''}>
                        {customer.balance.toLocaleString()} ريال
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(customer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditCustomer(customer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      لا يوجد عملاء مطابقين لبحثك
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-blue-500" />
              تحليل مشتريات العملاء
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <CustomerStatistics />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>إدارة العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerManagement />
          </CardContent>
        </Card>
      </div>

      {selectedCustomer && (
        <>
          <CustomerDetailsDialog
            customer={selectedCustomer}
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
          
          <EditCustomerDialog
            customer={selectedCustomer}
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSaveCustomer}
          />
        </>
      )}
      
      <AddCustomerDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleCreateCustomer}
      />
      
      <CustomerSearchDialog
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        customers={customers}
        onSelectCustomer={(customer) => {
          setSelectedCustomer(customer);
          setIsDetailsOpen(true);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
};

export default CustomerFollowUpPage;
