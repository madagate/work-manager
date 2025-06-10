
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  phone: string;
  description?: string;
  lastPurchase?: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  purchases: any[];
  balance: number;
}

interface AddSupplierDialogProps {
  open: boolean;
  onClose: () => void;
  onSupplierAdded: (supplier: Supplier) => void;
  initialName?: string;
  language?: string;
  nextSupplierCode?: string;
}

export const AddSupplierDialog = ({ 
  open, 
  onClose, 
  onSupplierAdded, 
  initialName = "",
  language = "ar",
  nextSupplierCode = "S001"
}: AddSupplierDialogProps) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const isRTL = language === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: language === "ar" ? "خطأ في البيانات" : "Data Error",
        description: language === "ar" ? "يرجى إدخال الاسم ورقم الجوال" : "Please enter name and phone number",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const newSupplier: Supplier = {
      id: Date.now().toString(),
      supplierCode: nextSupplierCode,
      name: name.trim(),
      phone: phone.trim(),
      description: description.trim() || undefined,
      totalPurchases: 0,
      totalAmount: 0,
      averagePrice: 0,
      purchases: [],
      balance: 0
    };

    onSupplierAdded(newSupplier);
    
    toast({
      title: language === "ar" ? "تم إضافة المورد" : "Supplier Added",
      description: language === "ar" ? `تم إضافة المورد ${name} برمز ${nextSupplierCode}` : `Supplier ${name} added with code ${nextSupplierCode}`,
      duration: 2000,
    });

    // Reset form
    setName("");
    setPhone("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "إضافة مورد جديد" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="supplierCode" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "رمز المورد" : "Supplier Code"}
            </Label>
            <Input
              id="supplierCode"
              value={nextSupplierCode}
              disabled
              className="mt-1 bg-gray-100"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          <div>
            <Label htmlFor="supplierName" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "اسم المورد" : "Supplier Name"}
            </Label>
            <Input
              id="supplierName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === "ar" ? "أدخل اسم المورد" : "Enter supplier name"}
              className="mt-1"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="supplierPhone" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "رقم الجوال" : "Phone Number"}
            </Label>
            <Input
              id="supplierPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              className="mt-1"
              dir="ltr"
            />
          </div>

          <div>
            <Label htmlFor="supplierDescription" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "وصف المورد" : "Supplier Description"}
            </Label>
            <Textarea
              id="supplierDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === "ar" ? "أدخل وصف للمورد (اختياري)" : "Enter supplier description (optional)"}
              className="mt-1 text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              rows={3}
            />
          </div>

          <div className={`flex gap-2 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button type="submit" className="flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "إضافة المورد" : "Add Supplier"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
