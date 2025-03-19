import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Logout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Clear the auth token and user info
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to login page
    setLocation("/login");
  }, [setLocation, toast]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Logging out...</h1>
        <p className="text-gray-500">Please wait while we log you out.</p>
      </div>
    </div>
  );
}