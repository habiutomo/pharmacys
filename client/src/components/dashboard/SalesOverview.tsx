import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from "@/lib/utils";

type Period = 'daily' | 'weekly' | 'monthly';

export function SalesOverview() {
  const [activePeriod, setActivePeriod] = useState<Period>('daily');

  const { data: salesData, isLoading, error } = useQuery({
    queryKey: [`/api/dashboard/sales?period=${activePeriod}`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            Loading sales data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center text-red-500">
            Error loading sales data
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getLabelKey = () => {
    switch (activePeriod) {
      case 'daily':
        return 'day';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
    }
  };

  const handlePeriodChange = (period: Period) => {
    setActivePeriod(period);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        <div className="flex bg-gray-100 rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePeriodChange('daily')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-md",
              activePeriod === 'daily' ? "bg-gray-800 text-white" : "text-gray-600"
            )}
          >
            Daily
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePeriodChange('weekly')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-md",
              activePeriod === 'weekly' ? "bg-gray-800 text-white" : "text-gray-600"
            )}
          >
            Weekly
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePeriodChange('monthly')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-md",
              activePeriod === 'monthly' ? "bg-gray-800 text-white" : "text-gray-600"
            )}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
              <XAxis 
                dataKey={getLabelKey()} 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#4a5568' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#4a5568' }}
                tickFormatter={(value) => `Rp ${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))} 
                labelFormatter={(label) => `${activePeriod === 'daily' ? 'Day' : activePeriod === 'weekly' ? 'Week' : 'Month'}: ${label}`}
              />
              <Bar dataKey="sales" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default SalesOverview;
