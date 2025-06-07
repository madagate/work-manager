
import { useState, useEffect } from "react";
import { DailyPurchases } from "@/components/DailyPurchases";
import { StickyNotes } from "@/components/StickyNotes";
import { StatisticsPage } from "@/components/StatisticsPage";
import { BatteryTypeManagement } from "@/components/BatteryTypeManagement";
import { TaskList } from "@/components/TaskList";
import { Navigation } from "@/components/Navigation";
import { Calendar, StickyNote, BarChart, MessageCircle, Battery, Truck, Users, ShoppingCart, Receipt, Banknote, FileText, CheckSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SupplierFollowUp from "./SupplierFollowUp";
import CustomerFollowUp from "./CustomerFollowUp";
import SalesPage from "./SalesPage";
import PurchasesPage from "./PurchasesPage";
import VouchersPage from "./VouchersPage";
import TaxDeclarationPage from "./TaxDeclarationPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
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
      home: { ar: "الرئيسية", en: "Home" },
      daily: { ar: "المشتريات اليومية", en: "Daily Purchases" },
      purchases: { ar: "إدارة المشتريات", en: "Purchase Management" },
      suppliers: { ar: "متابعة الموردين", en: "Supplier Follow-up" },
      customers: { ar: "متابعة العملاء", en: "Customer Follow-up" },
      sales: { ar: "المبيعات", en: "Sales" },
      vouchers: { ar: "السندات", en: "Vouchers" },
      tax: { ar: "الإقرار الضريبي", en: "Tax Declaration" },
      battery: { ar: "أنواع البطاريات", en: "Battery Types" },
      notes: { ar: "الملاحظات", en: "Notes" },
      tasks: { ar: "المهام", en: "Tasks" },
      statistics: { ar: "الإحصائيات", en: "Statistics" }
    };
    return texts[key as keyof typeof texts][language as keyof typeof texts.home];
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
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 mb-6 sm:mb-8 bg-white shadow-lg overflow-x-auto">
            <TabsTrigger 
              value="home" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <StickyNote className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("home")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="daily" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("daily")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="purchases" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("purchases")}</span>
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
              <Receipt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("sales")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="vouchers" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Banknote className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("vouchers")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tax" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("tax")}</span>
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
              value="tasks" 
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''} min-w-0`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{getTabText("tasks")}</span>
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

          <TabsContent value="home" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Quick Access Cards */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("daily")}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Calendar className="w-5 h-5 text-blue-600" />
                    المشتريات اليومية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إدارة مشتريات اليوم الحالي
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("sales")}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Receipt className="w-5 h-5 text-green-600" />
                    المبيعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إدارة فواتير المبيعات
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("customers")}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="w-5 h-5 text-purple-600" />
                    العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    متابعة حسابات العملاء
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("suppliers")}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Truck className="w-5 h-5 text-orange-600" />
                    الموردين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    متابعة حسابات الموردين
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("tax")}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <FileText className="w-5 h-5 text-red-600" />
                    الإقرار الضريبي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    حساب وإعداد الإقرار الضريبي
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("statistics")}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BarChart className="w-5 h-5 text-indigo-600" />
                    الإحصائيات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقارير وإحصائيات المتجر
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Notes */}
            <StickyNotes compact={true} language={language} />
          </TabsContent>

          <TabsContent value="daily" className="space-y-4 sm:space-y-6">
            <DailyPurchases language={language} />
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4 sm:space-y-6">
            <PurchasesPage />
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

          <TabsContent value="tax" className="space-y-4 sm:space-y-6">
            <TaxDeclarationPage />
          </TabsContent>

          <TabsContent value="battery" className="space-y-4 sm:space-y-6">
            <BatteryTypeManagement />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 sm:space-y-6">
            <StickyNotes language={language} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
            <TaskList />
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
