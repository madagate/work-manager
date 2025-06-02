
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase?: string;
}

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
  initialName?: string;
  language?: string;
}

export const AddCustomerDialog = ({ 
  open, 
  onClose, 
  onCustomerAdded, 
  initialName = "",
  language = "ar" 
}: AddCustomerDialogProps) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");

  const isRTL = language === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: language === "ar" ? "خطأ في البيانات" : "Data Error",
        description: language === "ar" ? "يرجى إدخال الاسم ورقم الجوال" : "Please enter name and phone number",
        variant: "destructive",
      });
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
    };

    onCustomerAdded(newCustomer);
    
    toast({
      title: language === "ar" ? "تم إضافة العميل" : "Customer Added",
      description: language === "ar" ? `تم إضافة العميل ${name} بنجاح` : `Customer ${name} added successfully`,
    });

    // Reset form
    setName("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "إضافة عميل جديد" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "اسم العميل" : "Customer Name"}
            </Label>
            <Input
              id="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === "ar" ? "أدخل اسم العميل" : "Enter customer name"}
              className="mt-1"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="customerPhone" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "رقم الجوال" : "Phone Number"}
            </Label>
            <Input
              id="customerPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              className="mt-1"
              dir="ltr"
            />
          </div>

          <div className={`flex gap-2 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button type="submit" className="flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "إضافة العميل" : "Add Customer"}
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
