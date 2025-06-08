import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { Customer } from "@/types/customer";

// Mock data - سيتم استبدالها ببيانات Supabase
const mockCustomers: Customer[] = [
  { 
    id: "1", 
    customerCode: "C001", 
    name: "أحمد محمد", 
    phone: "0501234567", 
    lastPurchase: "2024-01-15",
    totalAmount: 5000,
    averagePrice: 1250,
    purchases: [],
    totalPurchases: 4,
    totalSales: 4,
    salesCount: 4,
    lastSale: "2024-01-15",
    sales: []
  },
  { 
    id: "2", 
    customerCode: "C002", 
    name: "فاطمة علي", 
    phone: "0507654321", 
    lastPurchase: "2024-01-10",
    totalAmount: 3000,
    averagePrice: 1000,
    purchases: [],
    totalPurchases: 3,
    totalSales: 3,
    salesCount: 3,
    lastSale: "2024-01-10",
    sales: []
  },
  { 
    id: "3", 
    customerCode: "C003", 
    name: "خالد أحمد", 
    phone: "0501111111", 
    lastPurchase: "2024-01-05",
    totalAmount: 7500,
    averagePrice: 1500,
    purchases: [],
    totalPurchases: 5,
    totalSales: 5,
    salesCount: 5,
    lastSale: "2024-01-05",
    sales: []
  },
];

interface CustomerSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectCustomer?: (customer: Customer) => void;
  onCustomerSelect?: (customer: { id: string; name: string }) => void;
  searchTerm?: string;
  language?: string;
}

export const CustomerSearchDialog = ({ 
  open, 
  onClose, 
  onSelectCustomer,
  onCustomerSelect,
  searchTerm = "",
  language = "ar" 
}: CustomerSearchDialogProps) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(
    mockCustomers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const isRTL = language === "ar";

  const handleSearch = (term: string) => {
    setInternalSearchTerm(term);
    const filtered = mockCustomers.filter(customer => 
      customer.name.toLowerCase().includes(term.toLowerCase()) ||
      customer.phone.includes(term) ||
      customer.customerCode.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleAddNewCustomer = () => {
    setShowAddCustomer(true);
  };

  const handleCustomerAdded = (customer: Customer) => {
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    } else if (onCustomerSelect) {
      onCustomerSelect({ id: customer.id, name: customer.name });
    }
    setShowAddCustomer(false);
    onClose();
  };

  const handleCustomerSelection = (customer: Customer) => {
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    } else if (onCustomerSelect) {
      onCustomerSelect({ id: customer.id, name: customer.name });
    }
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "البحث عن عميل" : "Search Customer"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                placeholder={language === "ar" ? "ابحث بالاسم، رقم الجوال، أو رمز العميل..." : "Search by name, phone, or customer code..."}
                value={internalSearchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                autoFocus
              />
            </div>

            {internalSearchTerm && filteredCustomers.length === 0 && (
              <div className="text-center py-4 border rounded-lg bg-yellow-50">
                <p className="text-gray-600 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? `العميل "${internalSearchTerm}" غير موجود` : `Customer "${internalSearchTerm}" not found`}
                </p>
                <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "هل تريد إضافته كعميل جديد؟" : "Would you like to add them as a new customer?"}
                </p>
                <Button
                  onClick={handleAddNewCustomer}
                  className="flex items-center gap-2"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="w-4 h-4" />
                  {language === "ar" ? "إضافة عميل جديد" : "Add New Customer"}
                </Button>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => handleCustomerSelection(customer)}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <User className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <p className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {customer.name}
                          </p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {customer.customerCode}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {customer.phone}
                        </p>
                        {customer.lastPurchase && (
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {language === "ar" ? "آخر شراء:" : "Last purchase:"} {customer.lastPurchase}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : internalSearchTerm === "" ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "ابدأ بالكتابة للبحث عن عميل" : "Start typing to search for customers"}
                  </p>
                </div>
              ) : null}
            </div>

            {filteredCustomers.length > 0 && (
              <Button
                onClick={handleAddNewCustomer}
                variant="outline"
                className="w-full flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="w-4 h-4" />
                {language === "ar" ? "إضافة عميل جديد" : "Add New Customer"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddCustomerDialog
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onCustomerAdded={handleCustomerAdded}
        initialName={internalSearchTerm}
        language={language}
      />
    </>
  );
};
