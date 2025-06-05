
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Battery, Printer } from "lucide-react";

interface StatisticsPageProps {
  language?: string;
}

export const StatisticsPage = ({ language = "ar" }: StatisticsPageProps) => {
  const isRTL = language === "ar";

  const handlePrint = () => {
    window.print();
  };

  // Mock data for charts
  const monthlyData = [
    { month: 'يناير', sales: 45000, purchases: 12 },
    { month: 'فبراير', sales: 52000, purchases: 18 },
    { month: 'مارس', sales: 48000, purchases: 15 },
    { month: 'أبريل', sales: 61000, purchases: 22 },
    { month: 'مايو', sales: 55000, purchases: 19 },
    { month: 'يونيو', sales: 67000, purchases: 25 },
  ];

  const batteryDistribution = [
    { name: 'بطاريات عادية', value: 35, color: '#3b82f6' },
    { name: 'بطاريات جافة', value: 25, color: '#10b981' },
    { name: 'بطاريات زجاج', value: 20, color: '#f59e0b' },
    { name: 'بطاريات تعبئة', value: 15, color: '#ef4444' },
    { name: 'رصاص', value: 5, color: '#8b5cf6' },
  ];

  const weeklyTrend = [
    { day: 'السبت', amount: 8500 },
    { day: 'الأحد', amount: 9200 },
    { day: 'الاثنين', amount: 7800 },
    { day: 'الثلاثاء', amount: 11200 },
    { day: 'الأربعاء', amount: 9800 },
    { day: 'الخميس', amount: 10500 },
    { day: 'الجمعة', amount: 12000 },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with Print Button */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "الإحصائيات والتقارير" : "Statistics & Reports"}
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "تحليل شامل لأداء المتجر" : "Comprehensive store performance analysis"}
          </p>
        </div>
        
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2 print:hidden"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          <Printer className="w-4 h-4" />
          {language === "ar" ? "طباعة" : "Print"}
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className={isRTL ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "إجمالي المبيعات" : "Total Sales"}
                </p>
                <p className="text-2xl font-bold text-blue-600">328,000 {language === "ar" ? "ريال" : "SAR"}</p>
                <p className="text-xs text-green-600 font-medium">+12.5% من الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="h-8 w-8 text-green-600" />
              <div className={isRTL ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "عدد العملاء" : "Total Customers"}
                </p>
                <p className="text-2xl font-bold text-green-600">152</p>
                <p className="text-xs text-green-600 font-medium">+8 عملاء جدد</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <div className={isRTL ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "عدد المشتريات" : "Total Purchases"}
                </p>
                <p className="text-2xl font-bold text-orange-600">1,247</p>
                <p className="text-xs text-green-600 font-medium">+185 هذا الشهر</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Battery className="h-8 w-8 text-purple-600" />
              <div className={isRTL ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "متوسط البيع" : "Average Sale"}
                </p>
                <p className="text-2xl font-bold text-purple-600">263 {language === "ar" ? "ريال" : "SAR"}</p>
                <p className="text-xs text-green-600 font-medium">+5.2% تحسن</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "المبيعات الشهرية" : "Monthly Sales"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}
                />
                <YAxis style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toLocaleString()} ريال`, 
                    name === 'sales' ? 'المبيعات' : 'المشتريات'
                  ]}
                  labelFormatter={(label) => `الشهر: ${label}`}
                />
                <Bar dataKey="sales" fill="#3b82f6" name="sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Battery Distribution Pie Chart */}
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
                  data={batteryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {batteryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'النسبة']}
                  labelFormatter={(label) => `النوع: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {batteryDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {language === "ar" ? "اتجاه المبيعات الأسبوعية" : "Weekly Sales Trend"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}
              />
              <YAxis style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }} />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} ريال`, 'المبيعات']}
                labelFormatter={(label) => `اليوم: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "أفضل العملاء" : "Top Customers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "أحمد محمد السعيد", amount: 15420, qty: 8, avgPrice: 1928 },
                { name: "فاطمة عبدالله الخالد", amount: 12300, qty: 5, avgPrice: 2460 },
                { name: "محمد علي الشمري", amount: 10800, qty: 6, avgPrice: 1800 }
              ].map((customer, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {customer.name}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-600 mt-1">
                      <span>الكمية: {customer.qty}</span>
                      <span>متوسط السعر: {customer.avgPrice.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <span className="font-bold text-green-600 text-sm">
                    {customer.amount.toLocaleString()} ريال
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "أكثر المنتجات مبيعاً" : "Best Selling Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "بطاريات عادية", sales: 425, revenue: 85000 },
                { name: "بطاريات جافة", sales: 312, revenue: 62400 },
                { name: "بطاريات زجاج", sales: 198, revenue: 39600 }
              ].map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.sales} وحدة مباعة
                    </p>
                  </div>
                  <span className="font-bold text-blue-600 text-sm">
                    {product.revenue.toLocaleString()} ريال
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "مؤشرات الأداء" : "Performance Indicators"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>هدف المبيعات الشهرية</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>رضا العملاء</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل العائدين</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
