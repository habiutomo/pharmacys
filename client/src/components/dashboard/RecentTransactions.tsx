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
import { format } from "date-fns";

export function RecentTransactions() {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/recent-transactions'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
          <a href="/point-of-sale" className="text-sm text-blue-600 font-medium hover:underline">
            View All
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-[200px]">
            Loading transactions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
          <a href="/point-of-sale" className="text-sm text-blue-600 font-medium hover:underline">
            View All
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-[200px] text-red-500">
            Error loading transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    // Check if the date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    }
    
    // Otherwise return the full date
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
        <a href="/point-of-sale" className="text-sm text-blue-600 font-medium hover:underline">
          View All
        </a>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.transactionId}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.customer ? transaction.customer.name : 'Walk-in Customer'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.total)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge 
                      variant={transaction.status === 'completed' ? 'success' : 'warning'}
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
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

export default RecentTransactions;
