import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, PhoneCall, Mail, Edit, Trash2 } from "lucide-react";

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: suppliers, isLoading, error } = useQuery({
    queryKey: ['/api/suppliers'],
  });
  
  const filteredSuppliers = searchQuery && suppliers
    ? suppliers.filter((supplier: any) => 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (supplier.contact && supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : suppliers;

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Suppliers Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading suppliers...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Error loading suppliers. Please try again.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers && filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier: any) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact || '-'}</TableCell>
                      <TableCell>
                        {supplier.email ? (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{supplier.email}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {supplier.phone ? (
                          <div className="flex items-center">
                            <PhoneCall className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{supplier.phone}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{supplier.address || '-'}</TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      {filteredSuppliers && filteredSuppliers.length === 0
                        ? 'No suppliers found matching your search'
                        : 'No suppliers found. Add your first supplier!'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
