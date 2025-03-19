import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileDown, 
  Filter, 
  Edit, 
  Trash2 
} from "lucide-react";
import { format } from "date-fns";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
  });
  
  const filteredProducts = searchQuery && products
    ? products.filter((product: any) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const getStockStatus = (product: any) => {
    const { stock, lowStockThreshold, expiryDate } = product;
    
    // Check if product is expired
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return { label: "Expired", variant: "destructive" };
    }
    
    // Check stock level
    if (stock === 0) {
      return { label: "Out of Stock", variant: "destructive" };
    } else if (stock <= lowStockThreshold / 2) {
      return { label: "Critical", variant: "destructive" };
    } else if (stock <= lowStockThreshold) {
      return { label: "Low Stock", variant: "warning" };
    }
    
    return { label: "In Stock", variant: "success" };
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <select className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm">
              <option value="">All Categories</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Digestion">Digestion</option>
            </select>
          </div>
        </div>
        
        {/* Products Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading inventory data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Error loading inventory data. Please try again.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product: any) => {
                      const status = getStockStatus(product);
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant as any}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {product.expiryDate 
                              ? format(new Date(product.expiryDate), 'MMM d, yyyy')
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
