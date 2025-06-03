import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, MessageCircle, Phone, Calendar, Filter, User, Package, DollarSign, Edit3, Save, X, Ban } from "lucide-react";
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
}

// Mock data - سيتم استبدالها ببيانات Supabase
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد",
    phone: "0501234567",
    lastPurchase: "2024-01-15",
    totalPurchases: 15,
    totalAmount: 4500,
    averagePrice: 300,
    lastMessageSent: "2024-01-10",
    notes: "عميل مميز، يشتري بانتظام كل شهر"
  },
  {
    id: "2", 
    name: "فاطمة علي",
    phone: "0507654321",
    lastPurchase: "2024-01-10",
    totalPurchases: 8,
    totalAmount: 2400,
    averagePrice: 300,
    notes: "تفضل البطاريات اليابانية"
  },
  {
    id: "3",
    name: "خالد أحمد", 
    phone: "0501111111",
    lastPurchase: "2024-01-05",
    totalPurchases: 22,
    totalAmount: 6600,
    averagePrice: 300,
    lastMessageSent: "2024-01-01",
    isBlocked: true,
    blockReason: "مشاكل في الدفع"
  },
  {
    id: "4",
    name: "مريم سالم",
    phone: "0502222222",
    lastPurchase: "2024-01-20",
    totalPurchases: 12,
    totalAmount: 3600,
    averagePrice: 300
  },
  {
    id: "5",
    name: "عبدالله حسن",
    phone: "0503333333",
    lastPurchase: "2024-01-08",
    totalPurchases: 18,
    totalAmount: 5400,
    averagePrice: 300,
    lastMessageSent: "2024-01-05"
  },
  {
    id: "6",
    name: "نورا أحمد",
    phone: "0504444444",
    lastPurchase: "2024-01-12",
    totalPurchases: 25,
    totalAmount: 7500,
    averagePrice: 300
  }
];

const CustomerFollowUp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [lastBuyFilter, setLastBuyFilter] = useState("all");
  const [lastMessageFilter, setLastMessageFilter] = useState("all");
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [customerNotes, setCustomerNotes] = useState("");

  // Helper functions moved to top before they are used
  const getDaysSinceLastPurchase = (lastPurchase: string) => {
    const today = new Date();
    const purchaseDate = new Date(lastPurchase);
    const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysSinceLastMessage = (lastMessage?: string) => {
    if (!lastMessage) return null;
    const today = new Date();
    const messageDate = new Date(lastMessage);
    const diffTime = Math.abs(today.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const daysSinceLastPurchase = getDaysSinceLastPurchase(customer.lastPurchase);
    const daysSinceLastMessage = customer.lastMessageSent ? getDaysSinceLastMessage(customer.lastMessageSent) : null;
    
    let matchesLastBuy = true;
    if (lastBuyFilter === "recent") matchesLastBuy = daysSinceLastPurchase <= 7;
    else if (lastBuyFilter === "week") matchesLastBuy = daysSinceLastPurchase > 7 && daysSinceLastPurchase <= 30;
    else if (lastBuyFilter === "month") matchesLastBuy = daysSinceLastPurchase > 30;
    
    let matchesLastMessage = true;
    if (lastMessageFilter === "sent") matchesLastMessage = !!customer.lastMessageSent;
    else if (lastMessageFilter === "not_sent") matchesLastMessage = !customer.lastMessageSent;
    else if (lastMessageFilter === "recent_sent") matchesLastMessage = daysSinceLastMessage !== null && daysSinceLastMessage <= 7;
    
    return matchesSearch && matchesLastBuy && matchesLastMessage;
  });

  const sendWhatsAppMessage = (customer: Customer) => {
    const message = encodeURIComponent("مرحباً، طال انتظارنا لك في المحل. نتطلع لرؤيتك قريباً!");
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/^0/, '966')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Update customer with message sent info and move to bottom
    const today = new Date().toISOString().split('T')[0];
    setCustomers(prev => {
      const updatedCustomers = prev.map(c => 
        c.id === customer.id ? { ...c, messageSent: true, lastMessageSent: today } : c
      );
      const sentCustomer = updatedCustomers.find(c => c.id === customer.id);
      const otherCustomers = updatedCustomers.filter(c => c.id !== customer.id);
      return sentCustomer ? [...otherCustomers, sentCustomer] : updatedCustomers;
    });
    
    toast({
      title: "تم إرسال الرسالة",
      description: `تم إرسال رسالة واتساب إلى ${customer.name}`,
    });
  };

  const updateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, notes } : c
    ));
    setEditingCustomer(null);
    toast({
      title: "تم حفظ الملاحظة",
      description: "تم حفظ ملاحظة العميل بنجاح",
    });
  };

  const toggleCustomerBlock = (customerId: string, blockReason?: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { 
        ...c, 
        isBlocked: !c.isBlocked, 
        blockReason: !c.isBlocked ? blockReason : undefined 
      } : c
    ));
    
    const customer = customers.find(c => c.id === customerId);
    toast({
      title: customer?.isBlocked ? "تم إلغاء حظر العميل" : "تم حظر العميل",
      description: customer?.isBlocked ? "تم إلغاء حظر العميل بنجاح" : "تم حظر العميل بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة العملاء
          </h1>
          <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تواصل مع العملاء وتابع حالة الرسائل المرسلة
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg mb-6 sm:mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              متابعة العملاء ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل بالاسم أو رقم الجوال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  فلترة حسب آخر شراء
                </label>
                <Select value={lastBuyFilter} onValueChange={setLastBuyFilter}>
                  <SelectTrigger className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العملاء</SelectItem>
                    <SelectItem value="recent">آخر أسبوع</SelectItem>
                    <SelectItem value="week">آخر شهر</SelectItem>
                    <SelectItem value="month">أكثر من شهر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  فلترة حسب رسائل الواتساب
                </label>
                <Select value={lastMessageFilter} onValueChange={setLastMessageFilter}>
                  <SelectTrigger className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العملاء</SelectItem>
                    <SelectItem value="sent">تم إرسال رسالة</SelectItem>
                    <SelectItem value="not_sent">لم يتم الإرسال</SelectItem>
                    <SelectItem value="recent_sent">تم الإرسال مؤخراً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setLastBuyFilter("all");
                    setLastMessageFilter("all");
                    setSearchTerm("");
                  }}
                  variant="outline"
                  className="w-full flex items-center gap-2 flex-row-reverse"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Filter className="w-4 h-4" />
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredCustomers.map(customer => {
            const daysSinceLastPurchase = getDaysSinceLastPurchase(customer.lastPurchase);
            const daysSinceLastMessage = getDaysSinceLastMessage(customer.lastMessageSent);
            
            return (
              <Card 
                key={customer.id} 
                className={`shadow-lg transition-all duration-300 hover:shadow-xl ${
                  customer.isBlocked ? 'bg-red-50 border-red-300' :
                  customer.messageSent ? 'bg-gray-50 border-gray-300' : 'bg-white border-blue-200'
                }`}
              >
                <CardHeader className="pb-3 p-3 sm:p-4">
                  <div className="flex justify-between items-start flex-row-reverse">
                    <div className="text-right flex-1">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-row-reverse text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {customer.isBlocked && (
                        <Badge variant="destructive" className="text-xs">
                          محظور
                        </Badge>
                      )}
                      {customer.messageSent && !customer.isBlocked && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          تم الإرسال
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* Purchase Info */}
                    <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-2 flex-row-reverse mb-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-semibold text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          آخر شراء
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {customer.lastPurchase}
                      </p>
                      <p className="text-xs text-gray-500 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        منذ {daysSinceLastPurchase} يوم
                      </p>
                    </div>

                    {/* WhatsApp Message Info */}
                    <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-2 flex-row-reverse mb-2">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <span className="text-xs sm:text-sm font-semibold text-green-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          آخر رسالة واتساب
                        </span>
                      </div>
                      {customer.lastMessageSent ? (
                        <>
                          <p className="text-xs sm:text-sm text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {customer.lastMessageSent}
                          </p>
                          <p className="text-xs text-gray-500 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            منذ {daysSinceLastMessage} يوم
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-500 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          لم يتم إرسال رسالة
                        </p>
                      )}
                    </div>

                    {/* Purchase Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية</p>
                        <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.totalPurchases}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
                        <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتوسط</p>
                        <p className="font-bold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customer.averagePrice}</p>
                      </div>
                    </div>

                    {/* Customer Notes */}
                    <div className="bg-yellow-50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between flex-row-reverse mb-2">
                        <div className="flex items-center gap-2 flex-row-reverse">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                          <span className="text-xs sm:text-sm font-semibold text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            ملاحظات العميل
                          </span>
                        </div>
                        <Button
                          onClick={() => {
                            setEditingCustomer(customer.id);
                            setCustomerNotes(customer.notes || "");
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                      {editingCustomer === customer.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={customerNotes}
                            onChange={(e) => setCustomerNotes(e.target.value)}
                            placeholder="أضف ملاحظة عن العميل..."
                            rows={3}
                            className="text-xs text-right"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                          <div className="flex gap-1 flex-row-reverse">
                            <Button
                              onClick={() => updateCustomerNotes(customer.id, customerNotes)}
                              size="sm"
                              className="text-xs"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              حفظ
                            </Button>
                            <Button
                              onClick={() => setEditingCustomer(null)}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.notes || "لا توجد ملاحظات"}
                        </p>
                      )}
                    </div>

                    {/* Block Reason */}
                    {customer.isBlocked && customer.blockReason && (
                      <div className="bg-red-50 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center gap-2 flex-row-reverse mb-2">
                          <Ban className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                          <span className="text-xs sm:text-sm font-semibold text-red-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            سبب الحظر
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.blockReason}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* WhatsApp Button */}
                      <Button
                        onClick={() => sendWhatsAppMessage(customer)}
                        className={`w-full flex items-center gap-2 flex-row-reverse text-xs sm:text-sm ${
                          customer.messageSent || customer.isBlocked
                            ? 'bg-gray-400 hover:bg-gray-500' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                        disabled={customer.messageSent || customer.isBlocked}
                      >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {customer.isBlocked ? "محظور" : customer.messageSent ? "تم الإرسال" : "إرسال واتساب"}
                      </Button>

                      {/* Block/Unblock Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={customer.isBlocked ? "outline" : "destructive"}
                            size="sm"
                            className="w-full flex items-center gap-2 flex-row-reverse text-xs"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          >
                            <Ban className="w-3 h-3" />
                            {customer.isBlocked ? "إلغاء الحظر" : "حظر العميل"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl">
                          <DialogHeader>
                            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {customer.isBlocked ? "إلغاء حظر العميل" : "حظر العميل"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {!customer.isBlocked && (
                              <div>
                                <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  سبب الحظر
                                </label>
                                <Textarea
                                  placeholder="اكتب سبب حظر العميل..."
                                  className="text-right"
                                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                                  onChange={(e) => setCustomerNotes(e.target.value)}
                                />
                              </div>
                            )}
                            <div className="flex gap-2 flex-row-reverse">
                              <Button
                                onClick={() => toggleCustomerBlock(customer.id, customer.isBlocked ? undefined : customerNotes)}
                                variant={customer.isBlocked ? "outline" : "destructive"}
                                style={{ fontFamily: 'Tajawal, sans-serif' }}
                              >
                                {customer.isBlocked ? "إلغاء الحظر" : "حظر العميل"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <Card className="shadow-md mt-8">
            <CardContent className="p-8 sm:p-12 text-center">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-sm sm:text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد عملاء مطابقين للبحث أو الفلاتر المحددة
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerFollowUp;
