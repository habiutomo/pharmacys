import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, ShoppingCart, Trash2, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PointOfSale() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
  });
  
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
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

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } 
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        subtotal: product.price
      }]);
    }
    
    toast({
      title: "Item Added",
      description: `${product.name} added to cart`,
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price } 
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout Successful",
      description: `Total amount: ${formatCurrency(getTotalAmount())}`,
      variant: "success"
    });
    
    setCart([]);
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Point of Sale</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Listing */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96 text-red-500">
                <p>Error loading products. Please try again.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts && filteredProducts.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-bold">{formatCurrency(product.price)}</p>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock <= 0}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredProducts && filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Shopping Cart */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shopping Cart
              </h2>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Walk-in Customer</option>
                  {customers && customers.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No items in cart</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Cart Summary */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalAmount())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(getTotalAmount() * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(getTotalAmount() * 1.1)}</span>
                </div>
              </div>
              
              {/* Payment Buttons */}
              <div className="mt-6 space-y-2">
                <Button 
                  className="w-full flex items-center justify-center" 
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay with Card
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Cash Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
