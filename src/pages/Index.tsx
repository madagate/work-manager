
import { useState, useEffect } from "react";
import { DailyPurchases } from "@/components/DailyPurchases";
import { CustomerManagement } from "@/components/CustomerManagement";
import { StickyNotes } from "@/components/StickyNotes";
import { Navigation } from "@/components/Navigation";
import { Calendar, Users, StickyNote, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام إدارة متجر البطاريات
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة شاملة للمشتريات اليومية والعملاء
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-lg">
            <TabsTrigger 
              value="daily" 
              className="flex items-center gap-2 text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Calendar className="w-4 h-4" />
              المشتريات اليومية
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="flex items-center gap-2 text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Users className="w-4 h-4" />
              إدارة العملاء
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="flex items-center gap-2 text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <StickyNote className="w-4 h-4" />
              الملاحظات
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="flex items-center gap-2 text-right"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <BarChart className="w-4 h-4" />
              الإحصائيات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <DailyPurchases />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <StickyNotes />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الإحصائيات الشاملة
              </h2>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ستظهر الإحصائيات هنا بعد ربط قاعدة البيانات
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
