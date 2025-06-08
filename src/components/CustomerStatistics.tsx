
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerStatisticsProps {
  customers: Customer[];
  language?: string;
}

export const CustomerStatistics = ({ customers, language = "ar" }: CustomerStatisticsProps) => {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + (customer.totalAmount || 0), 0);
  const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const activeCustomers = customers.filter(customer => 
    customer.lastPurchase && new Date(customer.lastPurchase) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  const stats = [
    {
      title: language === "ar" ? "إجمالي العملاء" : "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: language === "ar" ? "العملاء النشطين" : "Active Customers",
      value: activeCustomers.toString(),
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: language === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
      value: `${totalRevenue.toLocaleString()} ${language === "ar" ? "ريال" : "SAR"}`,
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: language === "ar" ? "متوسط قيمة الطلب" : "Average Order Value",
      value: `${averageOrderValue.toFixed(2)} ${language === "ar" ? "ريال" : "SAR"}`,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
