
import { useState, useEffect } from "react";
import { DailyPurchases } from "@/components/DailyPurchases";
import { CustomerManagement } from "@/components/CustomerManagement";
import { StickyNotes } from "@/components/StickyNotes";
import { CustomerStatistics } from "@/components/CustomerStatistics";
import { StatisticsPage } from "@/components/StatisticsPage";
import { Navigation } from "@/components/Navigation";
import { Calendar, Users, StickyNote, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      customers: { ar: "إدارة العملاء", en: "Customer Management" },
      notes: { ar: "الملاحظات", en: "Notes" },
      statistics: { ar: "الإحصائيات", en: "Statistics" }
    };
    return texts[key as keyof typeof texts][language as keyof typeof texts.daily];
  };

  const getMainTitle = () => {
    return language === "ar" ? "نظام إدارة متجر البطاريات" : "Battery Store Management System";
  };

  const getMainDescription = () => {
    return language === "ar" ? "إدارة شاملة للمشتريات اليومية والعملاء" : "Comprehensive management for daily purchases and customers";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation onLanguageChange={handleLanguageChange} />
      
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {getMainTitle()}
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {getMainDescription()}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={isRTL ? "rtl" : "ltr"}>
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-lg">
            <TabsTrigger 
              value="daily" 
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Calendar className="w-4 h-4" />
              {getTabText("daily")}
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Users className="w-4 h-4" />
              {getTabText("customers")}
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <StickyNote className="w-4 h-4" />
              {getTabText("notes")}
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <BarChart className="w-4 h-4" />
              {getTabText("statistics")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            {/* Sticky Notes moved to top */}
            <StickyNotes compact={true} language={language} />
            <DailyPurchases language={language} />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerManagement />
            <CustomerStatistics language={language} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <StickyNotes language={language} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <StatisticsPage language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
