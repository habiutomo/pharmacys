import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import SalesOverview from "@/components/dashboard/SalesOverview";
import TopCategories from "@/components/dashboard/TopCategories";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import LowStockInventory from "@/components/dashboard/LowStockInventory";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly.",
    });
    // In a real application, this would trigger an API call to generate and download a report
  };

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/sales'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/categories'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/recent-transactions'] });
    queryClient.invalidateQueries({ queryKey: ['/api/products/low-stock'] });
    
    toast({
      title: "Dashboard Updated",
      description: "The dashboard data has been refreshed.",
    });
  };

  return (
    <MainLayout>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            Today
          </Button>
          <Button variant="outline" className="flex items-center" onClick={handleExportReport}>
            <Download className="h-5 w-5 mr-2 text-gray-500" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 h-32 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow p-6 h-32 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow p-6 h-32 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow p-6 h-32 animate-pulse"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md mb-8">
          <p className="text-red-500">Error loading dashboard data. Please try refreshing.</p>
          <Button variant="outline" className="mt-2" onClick={handleRefreshData}>
            Refresh Data
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Sales" 
            value={`Rp ${dashboardStats.totalSales.toLocaleString('id-ID')}`}
            trend={{ 
              value: dashboardStats.percentSalesChange,
              label: "from last month"
            }}
            type="sales"
          />
          <StatsCard 
            title="Total Products" 
            value={dashboardStats.totalProducts}
            trend={{ 
              value: dashboardStats.percentProductsChange,
              label: "from last month"
            }}
            type="products"
          />
          <StatsCard 
            title="Low Stock Items" 
            value={dashboardStats.lowStockCount}
            type="lowStock"
          />
          <StatsCard 
            title="Expired Items" 
            value={dashboardStats.expiredCount}
            type="expired"
          />
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SalesOverview />
        </div>
        <div>
          <TopCategories />
        </div>
      </div>
      
      {/* Recent Transactions & Low Stock Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <LowStockInventory />
      </div>
    </MainLayout>
  );
}
