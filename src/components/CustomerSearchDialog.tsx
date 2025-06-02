
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase?: string;
}

// Mock data - سيتم استبدالها ببيانات Supabase
const mockCustomers: Customer[] = [
  { id: "1", name: "أحمد محمد", phone: "0501234567", lastPurchase: "2024-01-15" },
  { id: "2", name: "فاطمة علي", phone: "0507654321", lastPurchase: "2024-01-10" },
  { id: "3", name: "خالد أحمد", phone: "0501111111", lastPurchase: "2024-01-05" },
];

interface CustomerSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: Customer) => void;
}

export const CustomerSearchDialog = ({ open, onClose, onCustomerSelect }: CustomerSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockCustomers.filter(customer => 
      customer.name.toLowerCase().includes(term.toLowerCase()) ||
      customer.phone.includes(term)
    );
    setFilteredCustomers(filtered);
  };

  const handleAddNewCustomer = () => {
    setShowAddCustomer(true);
  };

  const handleCustomerAdded = (customer: Customer) => {
    onCustomerSelect(customer);
    setShowAddCustomer(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              البحث عن عميل
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث بالاسم أو رقم الجوال..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-10"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => onCustomerSelect(customer)}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {customer.phone}
                        </p>
                        {customer.lastPurchase && (
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            آخر شراء: {customer.lastPurchase}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لم يتم العثور على عملاء
                  </p>
                  <Button
                    onClick={handleAddNewCustomer}
                    className="flex items-center gap-2"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة عميل جديد
                  </Button>
                </div>
              )}
            </div>

            {filteredCustomers.length > 0 && (
              <Button
                onClick={handleAddNewCustomer}
                variant="outline"
                className="w-full flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="w-4 h-4" />
                إضافة عميل جديد
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddCustomerDialog
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onCustomerAdded={handleCustomerAdded}
        initialName={searchTerm}
      />
    </>
  );
};
