import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [pharmacyName, setPharmacyName] = useState("PharmaSys");
  const [address, setAddress] = useState("Jl. Sudirman No. 123");
  const [phone, setPhone] = useState("021-12345678");
  const [email, setEmail] = useState("contact@pharmasys.com");
  
  // Inventory settings
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [expiryWarningDays, setExpiryWarningDays] = useState("30");
  const [autoReorder, setAutoReorder] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [salesReports, setSalesReports] = useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your pharmacy details and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                    <Input 
                      id="pharmacy-name" 
                      value={pharmacyName} 
                      onChange={(e) => setPharmacyName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID</Label>
                    <Input id="tax-id" placeholder="Enter tax ID" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Settings</CardTitle>
                <CardDescription>
                  Configure inventory and stock management preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="low-stock">Default Low Stock Threshold</Label>
                    <Input 
                      id="low-stock" 
                      type="number" 
                      value={lowStockThreshold} 
                      onChange={(e) => setLowStockThreshold(e.target.value)} 
                    />
                    <p className="text-xs text-gray-500">
                      Products below this threshold will be marked as low stock
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiry-warning">Expiry Warning Days</Label>
                    <Input 
                      id="expiry-warning" 
                      type="number" 
                      value={expiryWarningDays} 
                      onChange={(e) => setExpiryWarningDays(e.target.value)} 
                    />
                    <p className="text-xs text-gray-500">
                      Products expiring within this many days will be flagged
                    </p>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-reorder">Auto Reorder</Label>
                      <Switch 
                        id="auto-reorder" 
                        checked={autoReorder} 
                        onCheckedChange={setAutoReorder} 
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Automatically create purchase orders for low stock items
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage alerts and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="mb-1 block">Email Notifications</Label>
                      <p className="text-xs text-gray-500">
                        Receive system notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="stock-alerts" className="mb-1 block">Low Stock Alerts</Label>
                      <p className="text-xs text-gray-500">
                        Get notified when product stock falls below threshold
                      </p>
                    </div>
                    <Switch 
                      id="stock-alerts" 
                      checked={stockAlerts} 
                      onCheckedChange={setStockAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="expiry-alerts" className="mb-1 block">Expiry Alerts</Label>
                      <p className="text-xs text-gray-500">
                        Get notified about products approaching expiry date
                      </p>
                    </div>
                    <Switch 
                      id="expiry-alerts" 
                      checked={expiryAlerts} 
                      onCheckedChange={setExpiryAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sales-reports" className="mb-1 block">Weekly Sales Reports</Label>
                      <p className="text-xs text-gray-500">
                        Receive weekly sales summary reports
                      </p>
                    </div>
                    <Switch 
                      id="sales-reports" 
                      checked={salesReports} 
                      onCheckedChange={setSalesReports} 
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
