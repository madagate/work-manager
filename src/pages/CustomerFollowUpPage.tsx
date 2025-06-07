

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Plus, Edit, Trash2, MessageSquare, Phone, ShoppingCart, DollarSign, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

interface CustomerFollowUp {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  description?: string;
  notes?: string;
  lastPurchase: string; // Changed from optional to required
  totalPurchases: number;
  averagePrice: number;
  totalAmount: number;
  purchases: any[];
  balance: number;
  isBlocked?: boolean;
  blockReason?: string;
  messageSent?: boolean;
  lastMessageSent?: string;
  last2Quantities?: number[];
  last2Prices?: number[];
  last2BatteryTypes?: string[];
}

const mockCustomers: CustomerFollowUp[] = [
  {
    id: "1",
    customerCode: "C001",
    name: "أحمد محمد العلي",
    phone: "0501234567",
    description: "عميل مميز",
    notes: "يفضل التوصيل صباحاً",
    lastPurchase: "2024-01-15", // Now required
    totalPurchases: 15,
    averagePrice: 125.50,
    totalAmount: 1882.50,
    purchases: [],
    balance: 250.00,
    isBlocked: false,
    messageSent: false,
    last2Quantities: [50, 30],
    last2Prices: [120, 130],
    last2BatteryTypes: ["AA", "AAA"]
  },
  {
    id: "2",
    customerCode: "C002",
    name: "فاطمة عبدالله",
    phone: "0507654321",
    description: "عميل جديد",
    notes: "",
    lastPurchase: "2024-01-10", // Now required
    totalPurchases: 5,
    averagePrice: 85.00,
    totalAmount: 425.00,
    purchases: [],
    balance: -150.00,
    isBlocked: false,
    messageSent: true,
    lastMessageSent: "2024-01-12",
    last2Quantities: [20, 15],
    last2Prices: [80, 90],
    last2BatteryTypes: ["C", "D"]
  }
];

const CustomerFollowUpPage = () => {
  const [customers, setCustomers] = useState<CustomerFollowUp[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerFollowUp | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [customerToBlock, setCustomerToBlock] = useState<CustomerFollowUp | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;
  const blockedCustomers = customers.filter(c => c.isBlocked).length;
  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
  const totalSales = customers.reduce((sum, c) => sum + c.totalAmount, 0);

  const handleCustomerUpdated = (updatedCustomer: CustomerFollowUp) => {
    setCustomers(prev => 
      prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
    setSelectedCustomer(updatedCustomer);
  };

  const handleCustomerAdded = (newCustomer: CustomerFollowUp) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleViewDetails = (customer: CustomerFollowUp) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleEditCustomer = (customer: CustomerFollowUp) => {
    setSelectedCustomer(customer);
    setShowEditDialog(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    toast({
      title: "تم الحذف",
      description: "تم حذف العميل بنجاح",
    });
  };

  const handleBlockCustomer = (customer: CustomerFollowUp) => {
    setCustomerToBlock(customer);
    setShowBlockDialog(true);
  };

  const confirmBlockCustomer = () => {
    if (customerToBlock) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === customerToBlock.id
            ? { ...c, isBlocked: true, blockReason: blockReason }
            : c
        )
      );
      setShowBlockDialog(false);
      setBlockReason("");
      setCustomerToBlock(null);
      toast({
        title: "تم حظر العميل",
        description: "تم حظر العميل بنجاح",
      });
    }
  };

  const handleUnblockCustomer = (customerId: string) => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, isBlocked: false, blockReason: undefined }
          : c
      )
    );
    toast({
      title: "تم إلغاء الحظر",
      description: "تم إلغاء حظر العميل بنجاح",
    });
  };

  const handleSendMessage = (customerId: string) => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, messageSent: true, lastMessageSent: new Date().toISOString().split('T')[0] }
          : c
      )
    );
    toast({
      title: "تم الإرسال",
      description: "تم إرسال رسالة للعميل",
    });
  };

  const generateNextCustomerCode = () => {
    if (customers.length === 0) return "C001";
    const lastNumber = Math.max(...customers.map(c => parseInt(c.customerCode.slice(1))));
    return `C${(lastNumber + 1).toString().padStart(3, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            متابعة العملاء
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل بالاسم أو الجوال أو الرمز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة عميل جديد
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{totalCustomers}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي العملاء
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{totalSales.toFixed(2)}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي المبيعات
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(totalBalance).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {totalBalance >= 0 ? 'رصيد العملاء' : 'مديونية العملاء'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{blockedCustomers}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عملاء محظورين
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
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>رمز العميل</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر عملية بيع</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المبيعات</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</th>
                  <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{customer.customerCode}</td>
                    <td className="p-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.name}</td>
                    <td className="p-3" dir="ltr">{customer.phone}</td>
                    <td className="p-3">{customer.lastPurchase}</td>
                    <td className="p-3 font-bold text-green-600">{customer.totalAmount.toFixed(2)} ريال</td>
                    <td className={`p-3 font-bold ${customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(customer.balance).toFixed(2)} ريال
                    </td>
                    <td className="p-3">
                      {customer.isBlocked ? (
                        <Badge variant="destructive">محظور</Badge>
                      ) : (
                        <Badge variant="default">نشط</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <ShoppingCart className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(customer.id)}
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                        {customer.isBlocked ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUnblockCustomer(customer.id)}
                          >
                            إلغاء الحظر
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleBlockCustomer(customer)}
                          >
                            حظر
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="w-3 h-3" />
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
        open={showCustomerDetails}
        onClose={() => setShowCustomerDetails(false)}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />

      <EditCustomerDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />

      <AddCustomerDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCustomerAdded={handleCustomerAdded}
        nextCustomerCode={generateNextCustomerCode()}
      />

      {/* Block Customer Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              حظر العميل
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
              هل أنت متأكد من حظر العميل: <strong>{customerToBlock?.name}</strong>؟
            </p>
            <div>
              <Label htmlFor="blockReason" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                سبب الحظر
              </Label>
              <Textarea
                id="blockReason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="أدخل سبب الحظر..."
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowBlockDialog(false)} variant="outline">
                إلغاء
              </Button>
              <Button onClick={confirmBlockCustomer} variant="destructive">
                تأكيد الحظر
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerFollowUpPage;
