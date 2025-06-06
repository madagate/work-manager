
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Receipt, ArrowUp, ArrowDown, Search, Calendar, Banknote, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Voucher {
  id: string;
  voucherNumber: string;
  type: "receipt" | "payment";
  date: string;
  customerName: string;
  amount: number;
  description: string;
  paymentMethod: string;
}

const VouchersPage = () => {
  const [voucherType, setVoucherType] = useState<"receipt" | "payment">("receipt");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const generateVoucherNumber = (type: "receipt" | "payment") => {
    const prefix = type === "receipt" ? "REC" : "PAY";
    const timestamp = Date.now();
    return `${prefix}-${timestamp}`;
  };

  const createVoucher = () => {
    if (!customerName.trim() || !amount || !description.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const newVoucher: Voucher = {
      id: Date.now().toString(),
      voucherNumber: generateVoucherNumber(voucherType),
      type: voucherType,
      date: new Date().toISOString().split('T')[0],
      customerName: customerName.trim(),
      amount,
      description: description.trim(),
      paymentMethod
    };

    setVouchers([newVoucher, ...vouchers]);
    
    toast({
      title: "تم إنشاء السند",
      description: `تم إنشاء ${voucherType === "receipt" ? "سند قبض" : "سند صرف"} رقم ${newVoucher.voucherNumber}`,
      duration: 2000,
    });

    // Reset form
    setCustomerName("");
    setAmount(0);
    setDescription("");
    setPaymentMethod("cash");
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReceipts = vouchers.filter(v => v.type === "receipt").reduce((sum, v) => sum + v.amount, 0);
  const totalPayments = vouchers.filter(v => v.type === "payment").reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            سندات القبض والصرف
          </CardTitle>
        </CardHeader>

        {/* Statistics */}
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold text-green-600">{totalReceipts.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي المقبوضات
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-red-600" />
                <p className="text-lg sm:text-2xl font-bold text-red-600">{totalPayments.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي المدفوعات
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Banknote className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                <p className={`text-lg sm:text-2xl font-bold ${(totalReceipts - totalPayments) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(totalReceipts - totalPayments).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  صافي النقدية
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voucher Form */}
        <div className="lg:col-span-1">
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
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={voucherType === "receipt" ? "default" : "outline"}
                    onClick={() => setVoucherType("receipt")}
                    className="flex items-center gap-2"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <ArrowUp className="w-4 h-4" />
                    سند قبض
                  </Button>
                  <Button
                    variant={voucherType === "payment" ? "default" : "outline"}
                    onClick={() => setVoucherType("payment")}
                    className="flex items-center gap-2"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <ArrowDown className="w-4 h-4" />
                    سند صرف
                  </Button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {voucherType === "receipt" ? "اسم العميل" : "اسم المستفيد"}
                </Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={voucherType === "receipt" ? "أدخل اسم العميل" : "أدخل اسم المستفيد"}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
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
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقداً</SelectItem>
                    <SelectItem value="card" style={{ fontFamily: 'Tajawal, sans-serif' }}>بطاقة</SelectItem>
                    <SelectItem value="transfer" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحويل بنكي</SelectItem>
                    <SelectItem value="check" style={{ fontFamily: 'Tajawal, sans-serif' }}>شيك</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>البيان</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل بيان السند..."
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  rows={3}
                />
              </div>

              <Button
                onClick={createVoucher}
                className="w-full flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="w-4 h-4" />
                إنشاء السند
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Vouchers List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>السندات</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ابحث في السندات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-64"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredVouchers.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد سندات بعد
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVouchers.map(voucher => (
                    <div key={voucher.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {voucher.type === "receipt" ? (
                              <ArrowUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-semibold">{voucher.voucherNumber}</span>
                            <Badge variant={voucher.type === "receipt" ? "default" : "destructive"}>
                              {voucher.type === "receipt" ? "قبض" : "صرف"}
                            </Badge>
                          </div>
                          <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {voucher.customerName}
                          </p>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {voucher.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {voucher.date} - {voucher.paymentMethod === "cash" ? "نقداً" : 
                             voucher.paymentMethod === "card" ? "بطاقة" :
                             voucher.paymentMethod === "transfer" ? "تحويل" : "شيك"}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className={`text-xl font-bold ${voucher.type === "receipt" ? 'text-green-600' : 'text-red-600'}`}>
                            {voucher.type === "payment" ? "-" : "+"}{voucher.amount.toLocaleString()} ريال
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VouchersPage;
