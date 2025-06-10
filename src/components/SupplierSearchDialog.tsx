
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";

interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  phone: string;
  lastPurchase?: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    supplierCode: "S001",
    name: "مورد البطاريات الذهبية",
    phone: "0501234567",
    lastPurchase: "2024-01-15"
  },
  {
    id: "2",
    supplierCode: "S002", 
    name: "شركة البطاريات المتطورة",
    phone: "0507654321",
    lastPurchase: "2024-01-10"
  }
];

interface SupplierSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSupplierSelect: (supplier: Supplier) => void;
  searchTerm: string;
  language?: string;
}

export const SupplierSearchDialog = ({
  open,
  onClose,
  onSupplierSelect,
  searchTerm,
  language = "ar"
}: SupplierSearchDialogProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
    supplier.phone.includes(localSearchTerm) ||
    supplier.supplierCode.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  const isRTL = language === "ar";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "البحث عن مورد" : "Search Supplier"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === "ar" ? "ابحث عن مورد..." : "Search supplier..."}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pr-10"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "لم يتم العثور على موردين" : "No suppliers found"}
                </p>
                <Button
                  onClick={() => {
                    // Here you would typically open an "Add Supplier" dialog
                    onClose();
                  }}
                  className="flex items-center gap-2"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <UserPlus className="w-4 h-4" />
                  {language === "ar" ? "إضافة مورد جديد" : "Add New Supplier"}
                </Button>
              </div>
            ) : (
              filteredSuppliers.map(supplier => (
                <div
                  key={supplier.id}
                  onClick={() => onSupplierSelect(supplier)}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {supplier.name}
                      </p>
                      <p className="text-sm text-gray-600">{supplier.phone}</p>
                      <Badge variant="secondary" className="mt-1">
                        {supplier.supplierCode}
                      </Badge>
                    </div>
                    {supplier.lastPurchase && (
                      <div className="text-left">
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {language === "ar" ? "آخر توريد" : "Last Purchase"}
                        </p>
                        <p className="text-sm font-medium">{supplier.lastPurchase}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
