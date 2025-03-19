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
import { Search, Plus, PhoneCall, Mail, Edit, Trash2, ShoppingBag } from "lucide-react";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['/api/customers'],
  });

  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  const filteredCustomers = searchQuery && customers
    ? customers.filter((customer: any) => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : customers;

  // Calculate purchase count per customer
  const getCustomerPurchases = (customerId: number) => {
    if (!transactions) return 0;
    return transactions.filter((transaction: any) => transaction.customerId === customerId).length;
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Customers Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading customers...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Error loading customers. Please try again.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Purchases</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer: any) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        {customer.email ? (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{customer.email}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {customer.phone ? (
                          <div className="flex items-center">
                            <PhoneCall className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{customer.address || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{getCustomerPurchases(customer.id)}</span>
                        </div>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      {filteredCustomers && filteredCustomers.length === 0
                        ? 'No customers found matching your search'
                        : 'No customers found. Add your first customer!'}
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
