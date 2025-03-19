import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';

export function TopCategories() {
  const { data: categoryStats, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/categories'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Top Categories</CardTitle>
          <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          Loading category data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Top Categories</CardTitle>
          <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px] text-red-500">
          Error loading category data
        </CardContent>
      </Card>
    );
  }

  // Color mapping based on category
  const COLORS = {
    'Pain Relief': '#10B981', // green
    'Vitamins': '#F59E0B',    // yellow/amber
    'Digestion': '#8B5CF6',   // purple
    'default': '#3B82F6'      // blue
  };

  // Prepare data for the pie chart
  const data = categoryStats.map(item => ({
    name: item.category,
    value: item.percentage,
  }));

  const getColor = (name: string) => {
    return COLORS[name as keyof typeof COLORS] || COLORS.default;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Top Categories</CardTitle>
        <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Categories Legend */}
        <div className="mt-4 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span 
                  className="h-3 w-3 rounded-full block mr-2" 
                  style={{ backgroundColor: getColor(item.name) }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopCategories;
