import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would validate and make an API request here
    if (username === "admin" && password === "password") {
      // Store auth token in localStorage (in a real app, this would be a JWT)
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('username', username);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to PharmaSys!",
      });
      
      // Navigate to dashboard
      setLocation("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Dark Blue */}
      <div className="hidden md:flex md:w-5/12 bg-[#121f2f] text-white flex-col items-center justify-center p-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Pill className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-3">PharmaSys</h1>
          <p className="text-lg text-center mb-12">Complete Pharmacy Management System</p>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-slate-700 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">Inventory Management</h3>
                <p className="text-slate-300 text-sm">Track your medications and supplies with ease</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-slate-700 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">Point of Sale</h3>
                <p className="text-slate-300 text-sm">Process sales quickly and efficiently</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-slate-700 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">Reporting</h3>
                <p className="text-slate-300 text-sm">Get insights into your pharmacy's performance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-slate-700 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">Supplier Management</h3>
                <p className="text-slate-300 text-sm">Manage your suppliers and orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full md:w-7/12 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-center mb-6">Enter your credentials to access your account</p>
            
            <Tabs defaultValue="login" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4" autoComplete="off">
  <input type="hidden" name="security-token" value={crypto.randomUUID()} />
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text" 
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-[#121f2f] hover:bg-[#1a2e44]">
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-gray-500 text-center">
                    Registration is managed by administrators. Please contact your system administrator to create a new account.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("login")}
                  >
                    Back to Login
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}