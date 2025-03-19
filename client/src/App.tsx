import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import PointOfSale from "@/pages/PointOfSale";
import Suppliers from "@/pages/Suppliers";
import Customers from "@/pages/Customers";
import Reports from "@/pages/Reports";
import UserManagement from "@/pages/UserManagement";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import { useEffect, useState } from "react";

function Router() {
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // For demo purposes, check if user is authenticated
  useEffect(() => {
    // Check if the user is logged in (in a real app, this would validate the token)
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    }
    
    // Redirect to login if not on login page and not authenticated
    const isLoginPage = location === "/login";
    const isLogoutPage = location === "/logout";
    if (!authToken && !isLoginPage && !isLogoutPage) {
      window.location.href = "/login";
    }
  }, [location]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/point-of-sale" component={PointOfSale} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/customers" component={Customers} />
      <Route path="/reports" component={Reports} />
      <Route path="/user-management" component={UserManagement} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
