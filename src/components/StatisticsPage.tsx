
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Package, DollarSign, Users, Battery, Calendar } from "lucide-react";

interface StatisticsPageProps {
  language?: string;
}

export const StatisticsPage = ({ language = "ar" }: StatisticsPageProps) => {
  const isRTL = language === "ar";

  // Sample data for charts
  const monthlyData = [
    { month: 'يناير', sales: 4000, customers: 24 },
    { month: 'فبراير', sales: 3000, customers: 18 },
    { month: 'مارس', sales: 5000, customers: 32 },
    { month: 'أبريل', sales: 4500, customers: 28 },
    { month: 'مايو', sales: 6000, customers: 35 },
    { month: 'يونيو', sales: 5500, customers: 31 }
  ];

  const batteryDistribution = [
    { name: 'بطاريات عادية', value: 35, color: '#3B82F6', amount: 15500 },
    { name: 'بطاريات جافة', value: 25, color: '#10B981', amount: 11200 },
    { name: 'بطاريات زجاج', value: 20, color: '#F59E0B', amount: 8900 },
    { name: 'بطاريات تعبئة', value: 15, color: '#EF4444', amount: 6700 },
    { name: 'رصاص', value: 5, color: '#8B5CF6', amount: 2200 }
  ];

  const topCustomers = [
    { name: 'أحمد محمد', purchases: 150, amount: 4500, lastPurchase: '2024-01-15' },
    { name: 'سارة أحمد', purchases: 120, amount: 3600, lastPurchase: '2024-01-10' },
    { name: 'محمد علي', purchases: 100, amount: 3000, lastPurchase: '2024-01-08' },
    { name: 'فاطمة سالم', purchases: 95, amount: 2850, lastPurchase: '2024-01-12' },
    { name: 'عبدالله حسن', purchases: 80, amount: 2400, lastPurchase: '2024-01-14' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "إجمالي المبيعات" : "Total Sales"}
                </p>
                <p className="text-2xl font-bold text-green-600">44,600</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "ريال سعودي" : "SAR"}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "إجمالي الكمية" : "Total Quantity"}
                </p>
                <p className="text-2xl font-bold text-blue-600">545</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "كيلوجرام" : "Kg"}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "عدد العملاء" : "Total Customers"}
                </p>
                <p className="text-2xl font-bold text-purple-600">168</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "عميل نشط" : "Active"}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "متوسط السعر" : "Average Price"}
                </p>
                <p className="text-2xl font-bold text-orange-600">82</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? "ريال/كيلو" : "SAR/Kg"}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <BarChart className="w-5 h-5" />
              {language === "ar" ? "المبيعات الشهرية" : "Monthly Sales"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" style={{ fontFamily: 'Tajawal, sans-serif' }} />
                <YAxis />
                <Tooltip 
                  labelStyle={{ fontFamily: 'Tajawal, sans-serif' }}
                  contentStyle={{ fontFamily: 'Tajawal, sans-serif' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#3B82F6" name="المبيعات (ريال)" />
                <Bar dataKey="customers" fill="#10B981" name="العملاء" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Battery Distribution - Redesigned */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Battery className="w-5 h-5" />
              {language === "ar" ? "توزيع أنواع البطاريات" : "Battery Type Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batteryDistribution.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {item.name}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Badge variant="secondary" className="text-xs">
                        {item.value}%
                      </Badge>
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {item.amount.toLocaleString()} ريال
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-blue-600">
                    {batteryDistribution.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي القيمة (ريال)
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-green-600">5</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    أنواع البطاريات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Users className="w-5 h-5" />
            {language === "ar" ? "أفضل العملاء" : "Top Customers"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`p-3 text-sm font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "اسم العميل" : "Customer Name"}
                  </th>
                  <th className={`p-3 text-sm font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "الكمية (كيلو)" : "Quantity (Kg)"}
                  </th>
                  <th className={`p-3 text-sm font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "المبلغ (ريال)" : "Amount (SAR)"}
                  </th>
                  <th className={`p-3 text-sm font-semibold ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "آخر شراء" : "Last Purchase"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={customer.name} className="border-b hover:bg-gray-50">
                    <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="font-semibold text-blue-600">
                        {customer.purchases}
                      </span>
                    </td>
                    <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="font-semibold text-green-600">
                        {customer.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {customer.lastPurchase}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
