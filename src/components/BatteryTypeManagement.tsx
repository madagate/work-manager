
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Battery, Search, Plus, Edit3, Trash2, Save, X, Minus, TrendingDown, Package, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BatteryType {
  id: string;
  name: string;
  description?: string;
  defaultPrice: number;
  currentQty: number;
  averageBuyingPrice: number;
  lastPrice: number;
  isActive: boolean;
  createdAt: string;
}

// Mock data with enhanced details
const mockBatteryTypes: BatteryType[] = [
  {
    id: "1",
    name: "بطاريات عادية",
    description: "بطاريات السيارات العادية",
    defaultPrice: 25,
    currentQty: 150,
    averageBuyingPrice: 20,
    lastPrice: 22,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "بطاريات جافة",
    description: "بطاريات جافة للسيارات الحديثة",
    defaultPrice: 30,
    currentQty: 85,
    averageBuyingPrice: 25,
    lastPrice: 28,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "بطاريات زجاج",
    description: "بطاريات الزجاج عالية الجودة",
    defaultPrice: 35,
    currentQty: 45,
    averageBuyingPrice: 30,
    lastPrice: 32,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: "4",
    name: "بطاريات ليثيوم",
    description: "بطاريات ليثيوم متقدمة",
    defaultPrice: 50,
    currentQty: 0,
    averageBuyingPrice: 45,
    lastPrice: 48,
    isActive: false,
    createdAt: "2024-01-01"
  }
];

export const BatteryTypeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [batteryTypes, setBatteryTypes] = useState<BatteryType[]>(mockBatteryTypes);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDecreaseDialog, setShowDecreaseDialog] = useState<string | null>(null);
  const [decreaseAmount, setDecreaseAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultPrice: 0,
    currentQty: 0,
    averageBuyingPrice: 0,
    lastPrice: 0
  });

  const filteredTypes = batteryTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddType = () => {
    if (!formData.name.trim() || formData.defaultPrice <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم النوع والسعر الافتراضي",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const newType: BatteryType = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      defaultPrice: formData.defaultPrice,
      currentQty: formData.currentQty || 0,
      averageBuyingPrice: formData.averageBuyingPrice || 0,
      lastPrice: formData.lastPrice || 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBatteryTypes(prev => [...prev, newType]);
    setFormData({ name: "", description: "", defaultPrice: 0, currentQty: 0, averageBuyingPrice: 0, lastPrice: 0 });
    setShowAddDialog(false);
    
    toast({
      title: "تم إضافة النوع",
      description: `تم إضافة ${newType.name} بنجاح`,
      duration: 2000,
    });
  };

  const handleEditType = (type: BatteryType) => {
    setEditingType(type.id);
    setFormData({
      name: type.name,
      description: type.description || "",
      defaultPrice: type.defaultPrice,
      currentQty: type.currentQty,
      averageBuyingPrice: type.averageBuyingPrice,
      lastPrice: type.lastPrice
    });
  };

  const handleUpdateType = () => {
    if (!formData.name.trim() || formData.defaultPrice <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم النوع والسعر الافتراضي",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setBatteryTypes(prev => prev.map(type => 
      type.id === editingType ? {
        ...type,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        defaultPrice: formData.defaultPrice,
        currentQty: formData.currentQty,
        averageBuyingPrice: formData.averageBuyingPrice,
        lastPrice: formData.lastPrice
      } : type
    ));

    setEditingType(null);
    setFormData({ name: "", description: "", defaultPrice: 0, currentQty: 0, averageBuyingPrice: 0, lastPrice: 0 });
    
    toast({
      title: "تم تحديث النوع",
      description: "تم تحديث بيانات النوع بنجاح",
      duration: 2000,
    });
  };

  const handleDecreaseQuantity = () => {
    const amount = parseInt(decreaseAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "خطأ في الكمية",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const typeToUpdate = batteryTypes.find(t => t.id === showDecreaseDialog);
    if (!typeToUpdate || amount > typeToUpdate.currentQty) {
      toast({
        title: "خطأ في الكمية",
        description: "الكمية المطلوبة أكبر من الكمية المتاحة",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setBatteryTypes(prev => prev.map(type => 
      type.id === showDecreaseDialog ? {
        ...type,
        currentQty: type.currentQty - amount
      } : type
    ));

    setShowDecreaseDialog(null);
    setDecreaseAmount("");
    
    toast({
      title: "تم تقليل الكمية",
      description: `تم تقليل ${amount} كيلو من ${typeToUpdate?.name}`,
      duration: 2000,
    });
  };

  const handleDeleteType = (typeId: string) => {
    setBatteryTypes(prev => prev.filter(type => type.id !== typeId));
    toast({
      title: "تم حذف النوع",
      description: "تم حذف نوع البطارية بنجاح",
      duration: 2000,
    });
  };

  const toggleTypeStatus = (typeId: string) => {
    setBatteryTypes(prev => prev.map(type => 
      type.id === typeId ? { ...type, isActive: !type.isActive } : type
    ));
    
    const type = batteryTypes.find(t => t.id === typeId);
    toast({
      title: type?.isActive ? "تم إيقاف النوع" : "تم تفعيل النوع",
      description: type?.isActive ? "تم إيقاف نوع البطارية" : "تم تفعيل نوع البطارية",
      duration: 2000,
    });
  };

  const AddEditDialog = ({ isEdit = false }: { isEdit?: boolean }) => (
    <Dialog open={isEdit ? !!editingType : showAddDialog} onOpenChange={isEdit ? () => setEditingType(null) : setShowAddDialog}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {isEdit ? "تعديل نوع البطارية" : "إضافة نوع بطارية جديد"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="typeName" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اسم النوع
            </Label>
            <Input
              id="typeName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="أدخل اسم نوع البطارية"
              className="text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          <div>
            <Label htmlFor="typeDescription" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              وصف النوع (اختياري)
            </Label>
            <Textarea
              id="typeDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="أدخل وصف نوع البطارية"
              className="text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="defaultPrice" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                السعر الافتراضي
              </Label>
              <Input
                id="defaultPrice"
                type="number"
                value={formData.defaultPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultPrice: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <Label htmlFor="currentQty" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الكمية الحالية
              </Label>
              <Input
                id="currentQty"
                type="number"
                value={formData.currentQty}
                onChange={(e) => setFormData(prev => ({ ...prev, currentQty: Number(e.target.value) }))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="avgBuyingPrice" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                متوسط سعر الشراء
              </Label>
              <Input
                id="avgBuyingPrice"
                type="number"
                value={formData.averageBuyingPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, averageBuyingPrice: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <Label htmlFor="lastPrice" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                آخر سعر شراء
              </Label>
              <Input
                id="lastPrice"
                type="number"
                value={formData.lastPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, lastPrice: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-row-reverse pt-4">
            <Button
              onClick={isEdit ? handleUpdateType : handleAddType}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "تحديث النوع" : "إضافة النوع"}
            </Button>
            <Button
              onClick={() => {
                if (isEdit) {
                  setEditingType(null);
                } else {
                  setShowAddDialog(false);
                }
                setFormData({ name: "", description: "", defaultPrice: 0, currentQty: 0, averageBuyingPrice: 0, lastPrice: 0 });
              }}
              variant="outline"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <X className="w-4 h-4 mr-2" />
              إلغاء
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
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Battery className="w-4 h-4 sm:w-5 sm:h-5" />
            إدارة أنواع البطاريات
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن نوع البطارية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 flex-row-reverse bg-purple-600 hover:bg-purple-700"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              إضافة نوع جديد
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Battery className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{batteryTypes.length}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي الأنواع
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Battery className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{batteryTypes.filter(t => t.isActive).length}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الأنواع النشطة
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Battery className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">
                  {batteryTypes.length > 0 ? Math.round(batteryTypes.reduce((sum, t) => sum + t.defaultPrice, 0) / batteryTypes.length) : 0}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  متوسط السعر
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Battery Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTypes.map(type => (
          <Card key={type.id} className={`shadow-md hover:shadow-lg transition-shadow ${!type.isActive ? 'bg-gray-50 border-gray-300' : ''}`}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {type.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-row-reverse">
                      <Badge variant={type.isActive ? "default" : "secondary"} className="text-xs">
                        {type.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                      {type.currentQty <= 10 && (
                        <Badge variant="destructive" className="text-xs">
                          مخزون منخفض
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {type.description && (
                  <p className="text-sm text-gray-600 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {type.description}
                  </p>
                )}

                {/* Current Quantity */}
                <div className="bg-blue-50 rounded p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      {type.currentQty} كيلو
                    </span>
                    <div className="flex items-center gap-1 flex-row-reverse">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الكمية الحالية
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-green-50 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-green-600">
                        {type.defaultPrice} ريال
                      </span>
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        السعر الافتراضي
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-orange-600">
                        {type.averageBuyingPrice} ريال
                      </span>
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        متوسط سعر الشراء
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-purple-600">
                        {type.lastPrice} ريال
                      </span>
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        آخر سعر شراء
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditType(type)}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-2 flex-row-reverse text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Edit3 className="w-3 h-3" />
                    تعديل
                  </Button>
                  
                  <Button
                    onClick={() => toggleTypeStatus(type.id)}
                    variant={type.isActive ? "outline" : "default"}
                    size="sm"
                    className="flex-1 text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    {type.isActive ? "إيقاف" : "تفعيل"}
                  </Button>
                </div>

                {/* Decrease Quantity Button */}
                <Button
                  onClick={() => setShowDecreaseDialog(type.id)}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2 flex-row-reverse text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  disabled={type.currentQty <= 0}
                >
                  <Minus className="w-3 h-3" />
                  تقليل الكمية
                </Button>

                <Button
                  onClick={() => handleDeleteType(type.id)}
                  variant="destructive"
                  size="sm"
                  className="w-full flex items-center gap-2 flex-row-reverse text-xs"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Trash2 className="w-3 h-3" />
                  حذف النوع
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <Battery className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد أنواع بطاريات مطابقة للبحث
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <AddEditDialog />
      
      {/* Edit Dialog */}
      {editingType && <AddEditDialog isEdit />}

      {/* Decrease Quantity Dialog */}
      <Dialog open={!!showDecreaseDialog} onOpenChange={() => setShowDecreaseDialog(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقليل كمية البطارية
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="decreaseAmount" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الكمية المباعة (كيلو)
              </Label>
              <Input
                id="decreaseAmount"
                type="number"
                value={decreaseAmount}
                onChange={(e) => setDecreaseAmount(e.target.value)}
                placeholder="أدخل الكمية المباعة"
                min="1"
                className="text-right"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            <div className="flex gap-2 flex-row-reverse">
              <Button
                onClick={handleDecreaseQuantity}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                تقليل الكمية
              </Button>
              <Button
                onClick={() => {
                  setShowDecreaseDialog(null);
                  setDecreaseAmount("");
                }}
                variant="outline"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
