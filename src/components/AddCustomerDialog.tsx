
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
}

export const AddCustomerDialog = ({ open, onClose, onCustomerAdded, initialName = "" }: AddCustomerDialogProps) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال الاسم ورقم الجوال",
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
      title: "تم إضافة العميل",
      description: `تم إضافة العميل ${name} بنجاح`,
    });

    // Reset form
    setName("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إضافة عميل جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اسم العميل
            </Label>
            <Input
              id="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم العميل"
              className="mt-1"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="customerPhone" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              رقم الجوال
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة العميل
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
