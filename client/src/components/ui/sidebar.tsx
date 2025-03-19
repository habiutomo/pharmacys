import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package2,
  ShoppingCart,
  Users,
  User,
  FileBarChart,
  Settings,
  LogOut,
  UserCircle
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: location === '/'
    },
    {
      href: '/inventory',
      label: 'Inventory',
      icon: Package2,
      active: location.includes('/inventory')
    },
    {
      href: '/point-of-sale',
      label: 'Point of Sale',
      icon: ShoppingCart,
      active: location.includes('/point-of-sale')
    },
    {
      href: '/suppliers',
      label: 'Suppliers',
      icon: Users,
      active: location.includes('/suppliers')
    },
    {
      href: '/customers',
      label: 'Customers',
      icon: User,
      active: location.includes('/customers')
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: FileBarChart,
      active: location.includes('/reports')
    },
    {
      href: '/user-management',
      label: 'User Management',
      icon: UserCircle,
      active: location.includes('/user-management')
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      active: location.includes('/settings')
    }
  ];

  return (
    <aside className={cn(
      "w-64 bg-white shadow-md z-10 flex-shrink-0 fixed h-full",
      className
    )}>
      {/* Logo */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">PharmaSys</h1>
        <p className="text-xs text-gray-500">Pharmacy Management System</p>
      </div>
      
      {/* Navigation Menu */}
      <nav className="mt-4 px-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link 
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-2 py-3 text-sm font-medium rounded-md group",
                route.active 
                  ? "text-primary-foreground bg-primary" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <route.icon className="h-6 w-6 mr-3" />
              {route.label}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 w-64 border-t border-gray-200">
        <div className="flex items-center p-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700">h</div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">habiutomo</p>
            <p className="text-xs font-medium text-gray-500">Admin</p>
          </div>
          <div className="ml-auto">
            <Link href="/logout" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100">
              <LogOut className="h-5 w-5 text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
