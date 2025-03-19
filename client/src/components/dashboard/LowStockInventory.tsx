import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LowStockInventory() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products/low-stock'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Low Stock Inventory</CardTitle>
          <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">
            View Inventory
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-[200px]">
            Loading inventory data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Low Stock Inventory</CardTitle>
          <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">
            View Inventory
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-[200px] text-red-500">
            Error loading inventory data
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no low stock items
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Low Stock Inventory</CardTitle>
          <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">
            View Inventory
          </a>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-6">
            <p className="text-gray-500">No low stock items found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium">Low Stock Inventory</CardTitle>
        <a href="/inventory" className="text-sm text-blue-600 font-medium hover:underline">
          View Inventory
        </a>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge 
                      variant={product.stock <= product.lowStockThreshold / 2 ? 'destructive' : 'warning'}
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {product.stock <= product.lowStockThreshold / 2 ? 'Critical' : 'Low Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="link" className="text-blue-600 hover:text-blue-800 font-medium p-0">
                      Reorder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default LowStockInventory;
