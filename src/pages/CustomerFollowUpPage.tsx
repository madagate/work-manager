import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Search, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  lastOrderDate: string;
  createdAt: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed.mohamed@example.com",
    phone: "0555555555",
    address: "الرياض، المملكة العربية السعودية",
    ordersCount: 12,
    lastOrderDate: "2024-01-25",
    createdAt: "2023-03-15"
  },
  {
    id: "2",
    name: "ليلى خالد",
    email: "laila.khaled@example.com",
    phone: "0500000000",
    address: "جدة، المملكة العربية السعودية",
    ordersCount: 8,
    lastOrderDate: "2024-02-01",
    createdAt: "2023-05-20"
  },
  {
    id: "3",
    name: "سالم عبدالله",
    email: "salem.abdullah@example.com",
    phone: "0533333333",
    address: "الدمام، المملكة العربية السعودية",
    ordersCount: 5,
    lastOrderDate: "2024-01-10",
    createdAt: "2023-07-01"
  },
  {
    id: "4",
    name: "نورة علي",
    email: "noura.ali@example.com",
    phone: "0566666666",
    address: "مكة، المملكة العربية السعودية",
    ordersCount: 3,
    lastOrderDate: "2023-12-15",
    createdAt: "2023-09-10"
  }
];

export default function CustomerFollowUpPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.email.trim() || !newCustomer.phone.trim() || !newCustomer.address.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      ordersCount: 0,
      lastOrderDate: "غير محدد",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: "", email: "", phone: "", address: "" });
    setShowAddDialog(false);
    
    toast({
      title: "تمت إضافة عميل",
      description: `تمت إضافة العميل ${customer.name} بنجاح`,
    });
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    setEditingCustomer(null);
    
    toast({
      title: "تم تحديث العميل",
      description: `تم تحديث بيانات العميل ${updatedCustomer.name} بنجاح`,
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    toast({
      title: "تم حذف العميل",
      description: "تم حذف العميل بنجاح",
    });
  };

  const CustomerDetailsDialog = ({ open, onClose, customer }: { open: boolean; onClose: () => void; customer: Customer }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تفاصيل العميل
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${customer.name}`} />
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.name}</p>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عضو منذ: {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{customer.address}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل الطلبات
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>عدد الطلبات: {customer.ordersCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>آخر طلب: {customer.lastOrderDate === "غير محدد" ? "غير محدد" : new Date(customer.lastOrderDate).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EditCustomerDialog = ({ open, onClose, customer, onSave }: { open: boolean; onClose: () => void; customer: Customer; onSave: (customer: Customer) => void }) => {
    const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);
    const [phone, setPhone] = useState(customer.phone);
    const [address, setAddress] = useState(customer.address);

    const handleSave = () => {
      if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول",
          variant: "destructive"
        });
        return;
      }

      const updatedCustomer = { ...customer, name, email, phone, address };
      onSave(updatedCustomer);
      onClose();
    };

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تعديل بيانات العميل
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اسم العميل
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم العميل"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <div>
              <Label htmlFor="email" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <div>
              <Label htmlFor="phone" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="أدخل رقم الهاتف"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <div>
              <Label htmlFor="address" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                العنوان
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="أدخل العنوان"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إلغاء
              </Button>
              <Button type="button" onClick={handleSave} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const AddCustomerDialog = ({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: () => void }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إضافة عميل جديد
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اسم العميل
            </Label>
            <Input
              id="name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              placeholder="أدخل اسم العميل"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
          <div>
            <Label htmlFor="email" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              placeholder="أدخل البريد الإلكتروني"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
          <div>
            <Label htmlFor="phone" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              رقم الهاتف
            </Label>
            <Input
              id="phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              placeholder="أدخل رقم الهاتف"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
          <div>
            <Label htmlFor="address" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              العنوان
            </Label>
            <Textarea
              id="address"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              placeholder="أدخل العنوان"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إلغاء
            </Button>
            <Button type="button" onClick={onSave} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة العميل
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            متابعة العملاء
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-sm"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي العملاء
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">
                  {customers.length > 0 ? new Date(Math.max(...customers.map(c => new Date(c.createdAt).getTime()))).toLocaleDateString('ar-SA') : 'لا يوجد'}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تاريخ آخر انضمام
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">
                  {customers.reduce((sum, customer) => sum + customer.ordersCount, 0)}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي الطلبات
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 flex-row-reverse bg-blue-600 hover:bg-blue-700"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus className="w-4 h-4" />
            إضافة عميل جديد
          </Button>
        </div>
        
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-row-reverse">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {customer.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-right">
                    <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                      {customer.email}
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 text-right">
                    {customer.phone}
                  </p>
                </div>
                
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${customer.name}`} />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 ml-1" />
                    {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
                  </Badge>
                  <Badge>
                    <ShoppingCart className="w-3 h-3 ml-1" />
                    {customer.ordersCount} طلبات
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedCustomer(customer)}
                    variant="outline"
                    size="sm"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <User className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => setEditingCustomer(customer)}
                    variant="outline"
                    size="sm"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    variant="destructive"
                    size="sm"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCustomers.length === 0 && (
          <Card className="shadow-md">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا يوجد عملاء مطابقين للبحث
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <CustomerDetailsDialog
          open={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          customer={selectedCustomer}
        />
      )}

      {/* Edit Customer Dialog */}
      {editingCustomer && (
        <EditCustomerDialog
          open={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
          onSave={handleUpdateCustomer}
        />
      )}

      {/* Add Customer Dialog */}
      <AddCustomerDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleAddCustomer}
      />
    </div>
  );
}
