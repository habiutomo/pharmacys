import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package2, 
  AlertTriangle, 
  Clock 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  type: 'sales' | 'products' | 'lowStock' | 'expired';
  className?: string;
}

export function StatsCard({ title, value, trend, type, className }: StatsCardProps) {
  const isPositiveTrend = trend && trend.value > 0;
  
  const getIcon = (): ReactNode => {
    switch (type) {
      case 'sales':
        return <ShoppingCart className="h-6 w-6 text-blue-500" />;
      case 'products':
        return <Package2 className="h-6 w-6 text-green-500" />;
      case 'lowStock':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'expired':
        return <Clock className="h-6 w-6 text-red-500" />;
    }
  };

  const getIconBackground = (): string => {
    switch (type) {
      case 'sales':
        return 'bg-blue-100';
      case 'products':
        return 'bg-green-100';
      case 'lowStock':
        return 'bg-yellow-100';
      case 'expired':
        return 'bg-red-100';
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow p-6 relative", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              isPositiveTrend ? "text-green-500" : "text-red-500"
            )}>
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{trend.value}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          getIconBackground()
        )}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
