
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Voucher {
  id: string;
  voucherNumber: string;
  date: string;
  type: "receipt" | "payment";
  entityType: "customer" | "supplier";
  entityId: string;
  entityName: string;
  amount: number;
  description: string;
  paymentMethod: string;
}

interface EditVoucherDialogProps {
  open: boolean;
  onClose: () => void;
  voucher: Voucher | null;
  onVoucherUpdated: (voucher: Voucher) => void;
}

export const EditVoucherDialog = ({ open, onClose, voucher, onVoucherUpdated }: EditVoucherDialogProps) => {
  const [formData, setFormData] = useState({
    amount: voucher?.amount || 0,
    description: voucher?.description || "",
    paymentMethod: voucher?.paymentMethod || "cash"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voucher) return;
    
    if (formData.amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    const updatedVoucher: Voucher = {
      ...voucher,
      amount: formData.amount,
      description: formData.description.trim(),
      paymentMethod: formData.paymentMethod
    };

    onVoucherUpdated(updatedVoucher);
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث السند بنجاح",
    });
    
    onClose();
  };

  if (!voucher) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تعديل {voucher.type === "receipt" ? "سند قبض" : "سند دفع"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
              رقم السند: {voucher.voucherNumber}
            </Label>
          </div>

          <div>
            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {voucher.entityType === "customer" ? "العميل" : "المورد"}: {voucher.entityName}
            </Label>
          </div>

          <div>
            <Label htmlFor="amount" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المبلغ (ريال) *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              طريقة الدفع
            </Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقداً</SelectItem>
                <SelectItem value="card" style={{ fontFamily: 'Tajawal, sans-serif' }}>بطاقة</SelectItem>
                <SelectItem value="transfer" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحويل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              البيان
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="أدخل البيان"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
