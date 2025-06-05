
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, ShoppingCart, TrendingUp, MessageSquare, Edit2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CustomerDetailsDialogProps {
  customer: any;
  open: boolean;
  onClose: () => void;
  language?: string;
}

export const CustomerDetailsDialog = ({ customer, open, onClose, language = "ar" }: CustomerDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const isRTL = language === "ar";

  const mockPurchaseHistory = [
    { date: "2024-01-15", items: "بطاريات عادية", quantity: 2, price: 150, total: 300 },
    { date: "2024-01-10", items: "بطاريات جافة", quantity: 1, price: 200, total: 200 },
    { date: "2024-01-05", items: "بطاريات زجاج", quantity: 3, price: 180, total: 540 },
    { date: "2023-12-28", items: "بطاريات تعبئة", quantity: 1, price: 250, total: 250 },
    { date: "2023-12-20", items: "رصاص", quantity: 2, price: 300, total: 600 },
  ];

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
    toast({
      title: language === "ar" ? "تم الحفظ" : "Saved",
      description: language === "ar" ? "تم حفظ بيانات العميل بنجاح" : "Customer data saved successfully",
    });
  };

  const handleCancel = () => {
    setEditedCustomer(customer);
    setIsEditing(false);
  };

  const totalPurchases = mockPurchaseHistory.reduce((sum, purchase) => sum + purchase.total, 0);
  const averagePurchase = totalPurchases / mockPurchaseHistory.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <span>{language === "ar" ? "تفاصيل العميل" : "Customer Details"}</span>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "الاسم" : "Name"}
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedCustomer?.name || ""}
                      onChange={(e) => setEditedCustomer({...editedCustomer, name: e.target.value})}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{customer?.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "رمز العميل" : "Customer Code"}
                  </label>
                  <Badge variant="secondary" className="mt-1">
                    {customer?.code || "C001"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "رقم الهاتف" : "Phone"}
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedCustomer?.phone || ""}
                      onChange={(e) => setEditedCustomer({...editedCustomer, phone: e.target.value})}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                  ) : (
                    <p>{customer?.phone || "غير محدد"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "العنوان" : "Address"}
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedCustomer?.address || ""}
                      onChange={(e) => setEditedCustomer({...editedCustomer, address: e.target.value})}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                  ) : (
                    <p>{customer?.address || "غير محدد"}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "الوصف" : "Description"}
                </label>
                {isEditing ? (
                  <Textarea
                    value={editedCustomer?.description || ""}
                    onChange={(e) => setEditedCustomer({...editedCustomer, description: e.target.value})}
                    className={isRTL ? 'text-right' : 'text-left'}
                    rows={3}
                  />
                ) : (
                  <p>{customer?.description || "لا يوجد وصف"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <div className={isRTL ? 'mr-2' : 'ml-2'}>
                    <p className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "إجمالي المشتريات" : "Total Purchases"}
                    </p>
                    <p className="text-2xl font-bold">{totalPurchases.toLocaleString()} {language === "ar" ? "ريال" : "SAR"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div className={isRTL ? 'mr-2' : 'ml-2'}>
                    <p className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "متوسط الشراء" : "Average Purchase"}
                    </p>
                    <p className="text-2xl font-bold">{Math.round(averagePurchase).toLocaleString()} {language === "ar" ? "ريال" : "SAR"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div className={isRTL ? 'mr-2' : 'ml-2'}>
                    <p className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "عدد المشتريات" : "Purchase Count"}
                    </p>
                    <p className="text-2xl font-bold">{mockPurchaseHistory.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History Table */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "تاريخ المشتريات" : "Purchase History"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "التاريخ" : "Date"}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "الصنف" : "Item"}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "الكمية" : "Quantity"}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "السعر" : "Price"}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "الإجمالي" : "Total"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseHistory.map((purchase, index) => (
                    <TableRow key={index}>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {purchase.date}
                      </TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {purchase.items}
                      </TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {purchase.quantity}
                      </TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {purchase.price.toLocaleString()}
                      </TableCell>
                      <TableCell className={`font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {purchase.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
