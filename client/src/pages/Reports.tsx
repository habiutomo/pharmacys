import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Calendar, Download, Filter, FileBarChart, ArrowDown, ArrowUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<"sales" | "inventory" | "category">("sales");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  const { data: salesData } = useQuery({
    queryKey: ['/api/dashboard/sales?period=monthly'],
  });
  
  const { data: categoryData } = useQuery({
    queryKey: ['/api/dashboard/categories'],
  });
  
  const { data: lowStockProducts } = useQuery({
    queryKey: ['/api/products/low-stock'],
  });
  
  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly.",
    });
    // In a real app, this would call an API endpoint
  };
  
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <Button variant="outline" className="flex items-center" onClick={handleExportReport}>
            <Download className="h-5 w-5 mr-2 text-gray-500" />
            Export Report
          </Button>
        </div>
        
        {/* Report Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="category">Category Sales Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                className="pl-9"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                className="pl-9"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        {/* Report Content */}
        {reportType === "sales" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileBarChart className="h-5 w-5 mr-2" />
                Sales Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `Rp ${value / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      activeDot={{ r: 8 }} 
                      name="Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Avg. Transaction Value</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData && salesData.map((item: any, index: number) => {
                      const prevSales = index > 0 ? salesData[index - 1].sales : null;
                      const growth = prevSales ? ((item.sales - prevSales) / prevSales) * 100 : 0;
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.month}</TableCell>
                          <TableCell>{formatCurrency(item.sales)}</TableCell>
                          <TableCell>{formatCurrency(item.sales / 4)}</TableCell>
                          <TableCell className="flex items-center">
                            {growth > 0 ? (
                              <>
                                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                                <span className="text-green-500">{growth.toFixed(1)}%</span>
                              </>
                            ) : (
                              <>
                                <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
                                <span className="text-red-500">{Math.abs(growth).toFixed(1)}%</span>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {reportType === "inventory" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileBarChart className="h-5 w-5 mr-2" />
                Inventory Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={lowStockProducts}
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="stock" 
                      fill="#3B82F6" 
                      name="Current Stock" 
                    />
                    <Bar 
                      dataKey="lowStockThreshold" 
                      fill="#F59E0B" 
                      name="Threshold" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Low Stock Threshold</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts && lowStockProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.lowStockThreshold}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-800' 
                              : product.stock <= product.lowStockThreshold / 2 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.stock === 0 
                              ? 'Out of Stock' 
                              : product.stock <= product.lowStockThreshold / 2 
                                ? 'Critical' 
                                : 'Low Stock'
                            }
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {reportType === "category" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileBarChart className="h-5 w-5 mr-2" />
                Category Sales Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" />
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill="#3B82F6" 
                      name="Sales Percentage" 
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Sales Percentage</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Products Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData && categoryData.map((category: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell>{category.percentage}%</TableCell>
                        <TableCell>{formatCurrency(504500 * (category.percentage / 100))}</TableCell>
                        <TableCell>
                          {category.category === "Pain Relief" ? 2 : 
                           category.category === "Vitamins" ? 1 : 
                           category.category === "Digestion" ? 1 : 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
