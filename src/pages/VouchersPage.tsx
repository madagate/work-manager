
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, CreditCard, Plus, Search, User, FileText, Filter, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Voucher {
  id: string;
  voucherNumber: string;
  date: string;
  personId: string;
  personName: string;
  type: "receipt" | "payment";
  amount: number;
  paymentMethod: string;
  description: string;
}

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  balance: number;
}

interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  phone: string;
  balance: number;
}

interface PersonWithType extends Customer {
  type: 'customer';
}

interface SupplierWithType extends Supplier {
  type: 'supplier';
}

type CombinedPerson = PersonWithType | SupplierWithType;

const mockCustomers: Customer[] = [
  { id: "1", customerCode: "C001", name: "أحمد محمد السعدي", phone: "0501234567", balance: 1200 },
  { id: "2", customerCode: "C002", name: "فاطمة علي الأحمد", phone: "0507654321", balance: -500 },
  { id: "3", customerCode: "C003", name: "محمد عبدالله الحربي", phone: "0502345678", balance: 0 },
];

const mockSuppliers: Supplier[] = [
  { id: "4", supplierCode: "S001", name: "مورد البطاريات", phone: "0508888888", balance: 500 },
  { id: "5", supplierCode: "S002", name: "شركة التوريدات", phone: "0509999999", balance: -200 },
];

const paymentMethods = [
  { value: "cash", label: "نقداً", icon: CreditCard },
  { value: "transfer", label: "تحويل بنكي", icon: CreditCard },
  { value: "online", label: "مدفوعات الكترونية", icon: CreditCard },
];

const VouchersPage = () => {
  const [voucherType, setVoucherType] = useState<"receipt" | "payment">("receipt");
  const [selectedPerson, setSelectedPerson] = useState<CombinedPerson | null>(null);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [description, setDescription] = useState("");
  const [recentVouchers, setRecentVouchers] = useState<Voucher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Combined customers and suppliers for voucher selection
  const allPersons: CombinedPerson[] = [
    ...mockCustomers.map(c => ({ ...c, type: 'customer' as const })),
    ...mockSuppliers.map(s => ({ ...s, type: 'supplier' as const }))
  ];

  const filteredPersons = allPersons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.phone.includes(searchTerm) ||
    (person.type === 'customer' ? person.customerCode : person.supplierCode)
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateVoucher = () => {
    if (!selectedPerson) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار العميل أو المورد أولاً",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (!amount) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال المبلغ",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const voucherNumber = `V-${Date.now()}`;
    const newVoucher: Voucher = {
      id: Date.now().toString(),
      voucherNumber,
      date: new Date().toISOString().split('T')[0],
      personId: selectedPerson.id,
      personName: selectedPerson.name,
      type: voucherType,
      amount,
      paymentMethod,
      description,
    };

    setRecentVouchers([newVoucher, ...recentVouchers]);

    toast({
      title: "تم إنشاء السند",
      description: `تم إنشاء سند رقم ${voucherNumber} بنجاح`,
      duration: 2000,
    });

    // Reset form
    setSelectedPerson(null);
    setAmount(0);
    setPaymentMethod("cash");
    setDescription("");
  };

  const PersonSearchDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 flex-row-reverse">
          <Search className="w-4 h-4" />
          {selectedPerson ? selectedPerson.name : "ابحث عن عميل أو مورد"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            اختيار العميل أو المورد
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن عميل أو مورد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredPersons.map(person => (
              <div
                key={`${person.type}-${person.id}`}
                onClick={() => {
                  setSelectedPerson(person);
                  setSearchTerm("");
                }}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-600">{person.phone}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {person.type === 'customer' ? person.customerCode : person.supplierCode}
                      </Badge>
                      <Badge variant={person.type === 'customer' ? 'default' : 'outline'} className="text-xs">
                        {person.type === 'customer' ? 'عميل' : 'مورد'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`font-bold ${person.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {person.balance.toLocaleString()} ريال
                    </p>
                    <p className="text-xs text-gray-500">الرصيد</p>
                  </div>
                </div>
              </div>
            ))}
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
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            إدارة السندات
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voucher Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إنشاء سند جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Voucher Type */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع السند</Label>
                <Select value={voucherType} onValueChange={(value: "receipt" | "payment") => setVoucherType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      سند قبض
                    </SelectItem>
                    <SelectItem value="payment" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      سند صرف
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Person Selection */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {voucherType === 'receipt' ? 'العميل أو المورد (المسدد)' : 'العميل أو المورد (المستلم)'}
                </Label>
                <PersonSearchDialog />
                {selectedPerson && (
                  <div className="mt-2 p-3 bg-blue-50 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedPerson.name}
                        </p>
                        <p className="text-sm text-gray-600">{selectedPerson.phone}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {selectedPerson.type === 'customer' 
                              ? selectedPerson.customerCode 
                              : selectedPerson.supplierCode}
                          </Badge>
                          <Badge variant={selectedPerson.type === 'customer' ? 'default' : 'outline'} className="text-xs">
                            {selectedPerson.type === 'customer' ? 'عميل' : 'مورد'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${selectedPerson.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedPerson.balance.toLocaleString()} ريال
                        </p>
                        <p className="text-xs text-gray-500">الرصيد الحالي</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</Label>
                <Input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              {/* Payment Method */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <Button
                        key={method.value}
                        variant={paymentMethod === method.value ? "default" : "outline"}
                        onClick={() => setPaymentMethod(method.value)}
                        className="flex items-center gap-2"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <Icon className="w-4 h-4" />
                        {method.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</Label>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف السند"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voucher Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ملخص السند
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع:</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {voucherType === "receipt" ? "سند قبض" : "سند صرف"}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {voucherType === 'receipt' ? 'المسدد:' : 'المستلم:'}
                </span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedPerson ? selectedPerson.name : "غير محدد"}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ:</span>
                <span className="font-bold text-green-600">{amount.toLocaleString()} ريال</span>
              </div>
              <Button
                onClick={generateVoucher}
                className="w-full mt-4"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إنشاء السند
              </Button>
            </CardContent>
          </Card>

          {/* Recent Vouchers */}
          {recentVouchers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  آخر السندات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentVouchers.slice(0, 5).map(voucher => (
                    <div key={voucher.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{voucher.voucherNumber}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {voucher.personName}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-green-600">{voucher.amount.toLocaleString()} ريال</p>
                          <Button variant="outline" size="sm" className="mt-1">
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VouchersPage;
