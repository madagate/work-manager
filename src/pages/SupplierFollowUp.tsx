
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Search, Calendar, TrendingUp, User, Package, DollarSign, Edit3, Save, X, Ban, UserPlus, FileDown, RefreshCw, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AddSupplierDialog } from "@/components/AddSupplierDialog";

interface Purchase {
  id: string;
  date: string;
  batteryType: string;
  quantity: number;
  pricePerKg: number;
  total: number;
  discount: number;
  finalTotal: number;
}

interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  phone: string;
  description?: string;
  lastPurchase: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  purchases: Purchase[];
  notes?: string;
  isBlocked?: boolean;
  blockReason?: string;
  balance: number;
}

// Mock data - سيتم استبدالها ببيانات Supabase
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    supplierCode: "S001",
    name: "مورد البطاريات الذهبية",
    phone: "0501234567",
    description: "مورد موثوق للبطاريات عالية الجودة",
    lastPurchase: "2024-01-15",
    totalPurchases: 15,
    totalAmount: 4500,
    averagePrice: 300,
    balance: -1200,
    notes: "مورد مميز، توريدات منتظمة كل شهر",
    purchases: [
      {
        id: "p1",
        date: "2024-01-15",
        batteryType: "بطاريات عادية",
        quantity: 10,
        pricePerKg: 25,
        total: 250,
        discount: 0,
        finalTotal: 250
      }
    ]
  },
  {
    id: "2", 
    supplierCode: "S002",
    name: "شركة البطاريات المتطورة",
    phone: "0507654321",
    description: "متخصص في البطاريات اليابانية",
    lastPurchase: "2024-01-10",
    totalPurchases: 8,
    totalAmount: 2400,
    averagePrice: 300,
    balance: 800,
    notes: "يوفر البطاريات اليابانية عالية الجودة",
    purchases: []
  }
];

const SupplierFollowUp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [supplierNotes, setSupplierNotes] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateNextSupplierCode = () => {
    if (suppliers.length === 0) return "S001";
    
    const maxCode = suppliers.reduce((max, supplier) => {
      const codeNumber = parseInt(supplier.supplierCode.replace('S', ''));
      return codeNumber > max ? codeNumber : max;
    }, 0);
    
    return `S${String(maxCode + 1).padStart(3, '0')}`;
  };

  const exportToExcel = () => {
    toast({
      title: "تم التصدير",
      description: "تم تصدير بيانات الموردين إلى Excel بنجاح",
      duration: 2000,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين جميع الفلاتر",
      duration: 2000,
    });
  };

  const generateSupplierStatement = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      toast({
        title: "كشف حساب المورد",
        description: `تم إنشاء كشف حساب للمورد: ${supplier.name}`,
        duration: 2000,
      });
    }
  };

  const SupplierDetailsDialog = ({ supplier }: { supplier: Supplier }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
          عرض التفاصيل
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إحصائيات المورد: {supplier.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Supplier Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      عدد التوريدات
                    </p>
                    <p className="text-lg sm:text-2xl font-bold">{supplier.totalPurchases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إجمالي التوريدات
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">
                      {supplier.totalAmount.toLocaleString()} ريال
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرصيد
                    </p>
                    <p className={`text-lg sm:text-2xl font-bold ${supplier.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {supplier.balance.toLocaleString()} ريال
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      آخر توريد
                    </p>
                    <p className="text-sm font-semibold">{supplier.lastPurchase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History Table */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تاريخ التوريدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        التاريخ
                      </th>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نوع البطارية
                      </th>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الكمية
                      </th>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        سعر الكيلو
                      </th>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الإجمالي
                      </th>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الخصم
                      </th>
                      <th className="p-2 sm:p-3 font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المبلغ النهائي
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{purchase.date}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{purchase.batteryType}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{purchase.quantity}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{purchase.pricePerKg}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{purchase.total.toLocaleString()}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{purchase.discount.toLocaleString()}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm font-bold text-green-600">{purchase.finalTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            إدارة الموردين
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن مورد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="flex items-center gap-2 flex-row-reverse bg-blue-600 hover:bg-blue-700"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <UserPlus className="w-4 h-4" />
                  إضافة مورد جديد
                </Button>
                <Button
                  onClick={exportToExcel}
                  variant="outline"
                  className="flex items-center gap-2 flex-row-reverse"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <FileDown className="w-4 h-4" />
                  تصدير Excel
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="flex items-center gap-2 flex-row-reverse"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-lg sm:text-2xl font-bold">{suppliers.length}</p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي الموردين
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي التوريدات
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-lg sm:text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + s.balance, 0).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي الأرصدة
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSuppliers.map(supplier => (
          <Card key={supplier.id} className={`shadow-md hover:shadow-lg transition-shadow ${supplier.isBlocked ? 'border-red-200 bg-red-50' : ''}`}>
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-row-reverse">
                      <Badge variant="secondary" className="text-xs">
                        {supplier.supplierCode}
                      </Badge>
                      {supplier.isBlocked && (
                        <Badge variant="destructive" className="text-xs">
                          محظور
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-600">{supplier.phone}</p>
                  {supplier.description && (
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {supplier.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    آخر توريد: {supplier.lastPurchase}
                  </p>
                  <p className={`text-xs font-semibold ${supplier.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الرصيد: {supplier.balance.toLocaleString()} ريال
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوريدات</p>
                    <p className="font-semibold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{supplier.totalPurchases}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
                    <p className="font-semibold text-xs sm:text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{supplier.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <SupplierDetailsDialog supplier={supplier} />
                  
                  <Button
                    onClick={() => generateSupplierStatement(supplier.id)}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2 flex-row-reverse text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <FileText className="w-3 h-3" />
                    كشف حساب
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddSupplierDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSupplierAdded={(supplier) => {
          setSuppliers(prev => [...prev, supplier]);
          setShowAddDialog(false);
        }}
        nextSupplierCode={generateNextSupplierCode()}
        language="ar"
      />
    </div>
  );
};

export default SupplierFollowUp;
