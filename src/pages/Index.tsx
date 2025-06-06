
import { useState, useEffect } from "react";
import { DailyPurchases } from "@/components/DailyPurchases";
import { StickyNotes } from "@/components/StickyNotes";
import { StatisticsPage } from "@/components/StatisticsPage";
import { BatteryTypeManagement } from "@/components/BatteryTypeManagement";
import { Navigation } from "@/components/Navigation";
import { Calendar, StickyNote, BarChart, MessageCircle, Battery, Truck, Users, ShoppingCart, Receipt, Banknote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupplierFollowUp from "./SupplierFollowUp";
import CustomerFollowUp from "./CustomerFollowUp";
import SalesPage from "./SalesPage";
import VouchersPage from "./VouchersPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [language, setLanguage] = useState("ar");

  const isRTL = language === "ar";

  // Set initial document direction and language
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const getTabText = (key: string) => {
    const texts = {
      daily: { ar: "المشتريات اليومية", en: "Daily Purchases" },
      suppliers: { ar: "متابعة الموردين", en: "Supplier Follow-up" },
      customers: { ar: "متابعة العملاء", en: "Customer Follow-up" },
      sales: { ar: "المبيعات", en: "Sales" },
      vouchers: { ar: "السندات", en: "Vouchers" },
      battery: { ar: "أنواع البطاريات", en: "Battery Types" },
      notes: { ar: "الملاحظات", en: "Notes" },
      statistics: { ar: "الإحصائيات", en: "Statistics" }
    };
    return texts[key as keyof typeof texts][language as keyof typeof texts.daily];
  };

  const getMainTitle = () => {
    return language === "ar" ? "نظام إدارة متجر البطاريات" : "Battery Store Management System";
  };

  const getMainDescription = () => {
    return language === "ar" ? "إدارة شاملة للمشتريات والمبيعات والموردين والعملاء" : "Comprehensive management for purchases, sales, suppliers and customers";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation onLanguageChange={handleLanguageChange} />
      
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {getMainTitle()}
          </h1>
          <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {getMainDescription()}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={isRTL ? "rtl" : "ltr"}>
          <TabsList className="grid w-full grid-cols-8 mb-6 sm:mb-8 bg-white shadow-lg overflow-x-auto">
            <TabsTrigger 
              value="daily" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("daily")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="suppliers" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("suppliers")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("customers")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("sales")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="vouchers" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Receipt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("vouchers")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="battery" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Battery className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("battery")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <StickyNote className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("notes")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <BarChart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("statistics")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 sm:space-y-6">
            <StickyNotes compact={true} language={language} />
            <DailyPurchases language={language} />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4 sm:space-y-6">
            <SupplierFollowUp />
          </TabsContent>

          <TabsContent value="customers" className="space-y-4 sm:space-y-6">
            <CustomerFollowUp />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4 sm:space-y-6">
            <SalesPage />
          </TabsContent>

          <TabsContent value="vouchers" className="space-y-4 sm:space-y-6">
            <VouchersPage />
          </TabsContent>

          <TabsContent value="battery" className="space-y-4 sm:space-y-6">
            <BatteryTypeManagement />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 sm:space-y-6">
            <StickyNotes language={language} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4 sm:space-y-6">
            <StatisticsPage language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
