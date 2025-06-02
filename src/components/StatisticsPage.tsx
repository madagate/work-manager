
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Package, DollarSign, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StatisticsPageProps {
  language?: string;
}

export const StatisticsPage = ({ language = "ar" }: StatisticsPageProps) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const isRTL = language === "ar";

  // Mock data for demonstration
  const monthlyData = [
    { month: language === "ar" ? "يناير" : "Jan", purchases: 150, amount: 45000 },
    { month: language === "ar" ? "فبراير" : "Feb", purchases: 180, amount: 52000 },
    { month: language === "ar" ? "مارس" : "Mar", purchases: 200, amount: 58000 },
    { month: language === "ar" ? "أبريل" : "Apr", purchases: 170, amount: 49000 },
    { month: language === "ar" ? "مايو" : "May", purchases: 220, amount: 65000 },
    { month: language === "ar" ? "يونيو" : "Jun", purchases: 190, amount: 55000 },
  ];

  const batteryTypeData = [
    { name: language === "ar" ? "بطاريات عادية" : "Regular Batteries", value: 40, color: "#8884d8" },
    { name: language === "ar" ? "بطاريات جافة" : "Dry Batteries", value: 25, color: "#82ca9d" },
    { name: language === "ar" ? "بطاريات زجاج" : "Glass Batteries", value: 20, color: "#ffc658" },
    { name: language === "ar" ? "بطاريات تعبئة" : "Refill Batteries", value: 10, color: "#ff7300" },
    { name: language === "ar" ? "رصاص" : "Lead", value: 5, color: "#8dd1e1" },
  ];

  const topCustomers = [
    { name: "أحمد محمد", purchases: 25, amount: 12500 },
    { name: "فاطمة علي", purchases: 18, amount: 9200 },
    { name: "محمد أحمد", purchases: 15, amount: 8700 },
    { name: "سارة خالد", purchases: 12, amount: 6800 },
    { name: "عبدالله سعد", purchases: 10, amount: 5500 },
  ];

  const handleClearAllData = () => {
    if (showClearConfirm) {
      // Here you would actually clear the data
      toast({
        title: language === "ar" ? "تم مسح البيانات" : "Data Cleared",
        description: language === "ar" ? "تم مسح جميع البيانات بنجاح" : "All data has been cleared successfully",
      });
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Clear Data Button */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <TrendingUp className="w-5 h-5" />
              {language === "ar" ? "الإحصائيات العامة" : "General Statistics"}
            </CardTitle>
            <div className="space-x-2">
              {showClearConfirm && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "انقر مرة أخرى لتأكيد مسح جميع البيانات نهائياً" : "Click again to confirm permanent data deletion"}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleClearAllData}
                variant={showClearConfirm ? "destructive" : "outline"}
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Trash2 className="w-4 h-4" />
                {language === "ar" ? "تصفية البيانات" : "Clear All Data"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "إجمالي العملاء" : "Total Customers"}
                </p>
                <p className="text-2xl font-bold">152</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "إجمالي المشتريات" : "Total Purchases"}
                </p>
                <p className="text-2xl font-bold">1,210</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "إجمالي المبيعات" : "Total Sales"}
                </p>
                <p className="text-2xl font-bold text-green-600">324,200</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "ريال" : "SAR"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "متوسط السعر" : "Average Price"}
                </p>
                <p className="text-2xl font-bold">268</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "ريال/كيلو" : "SAR/kg"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Purchases Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "المشتريات الشهرية" : "Monthly Purchases"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" style={{ fontFamily: 'Tajawal, sans-serif' }} />
                <YAxis style={{ fontFamily: 'Tajawal, sans-serif' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchases" fill="#8884d8" name={language === "ar" ? "المشتريات" : "Purchases"} />
                <Bar dataKey="amount" fill="#82ca9d" name={language === "ar" ? "المبلغ" : "Amount"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Battery Types Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "توزيع أنواع البطاريات" : "Battery Types Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={batteryTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {batteryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "أفضل العملاء" : "Top Customers"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {customer.name}
                    </h4>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? `${customer.purchases} مشتريات` : `${customer.purchases} purchases`}
                    </p>
                  </div>
                </div>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="font-bold text-green-600">
                    {customer.amount.toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
