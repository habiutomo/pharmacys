import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory,
  suppliers, type Supplier, type InsertSupplier,
  customers, type Customer, type InsertCustomer,
  transactions, type Transaction, type InsertTransaction,
  transactionItems, type TransactionItem, type InsertTransactionItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getAllProducts(): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  getExpiredProducts(): Promise<Product[]>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getAllCategories(): Promise<Category[]>;

  // Supplier operations
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;
  getAllSuppliers(): Promise<Supplier[]>;

  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  getAllCustomers(): Promise<Customer[]>;

  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  getRecentTransactions(limit: number): Promise<Transaction[]>;

  // Transaction item operations
  createTransactionItem(item: InsertTransactionItem): Promise<TransactionItem>;
  getTransactionItems(transactionId: number): Promise<TransactionItem[]>;

  // Dashboard data
  getDashboardStats(): Promise<{
    totalSales: number;
    totalProducts: number;
    lowStockCount: number;
    expiredCount: number;
    percentSalesChange: number;
    percentProductsChange: number;
  }>;
  getSalesData(period: 'daily' | 'weekly' | 'monthly'): Promise<any[]>;
  getCategoryStats(): Promise<{ category: string; percentage: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private suppliers: Map<number, Supplier>;
  private customers: Map<number, Customer>;
  private transactions: Map<number, Transaction>;
  private transactionItems: Map<number, TransactionItem>;

  private userIdCounter: number;
  private productIdCounter: number;
  private categoryIdCounter: number;
  private supplierIdCounter: number;
  private customerIdCounter: number;
  private transactionIdCounter: number;
  private transactionItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.suppliers = new Map();
    this.customers = new Map();
    this.transactions = new Map();
    this.transactionItems = new Map();

    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.categoryIdCounter = 1;
    this.supplierIdCounter = 1;
    this.customerIdCounter = 1;
    this.transactionIdCounter = 1;
    this.transactionItemIdCounter = 1;

    // Initialize with seed data
    this.initSeedData();
  }

  private initSeedData() {
    // Add admin user
    const adminUser: InsertUser = {
      username: "habiutomo",
      password: "password123", // In a real app, this would be hashed
      fullName: "Habiutomo",
      role: "admin"
    };
    this.createUser(adminUser);

    // Add categories
    const categories: InsertCategory[] = [
      { name: "Pain Relief", description: "Pain relief medications" },
      { name: "Vitamins", description: "Vitamin supplements" },
      { name: "Digestion", description: "Digestion and gut health products" }
    ];

    categories.forEach(category => this.createCategory(category));

    // Add products
    const products: InsertProduct[] = [
      {
        name: "Paracetamol 500mg",
        sku: "MED-P500",
        description: "Pain relief tablets",
        category: "Pain Relief",
        price: 25000,
        costPrice: 15000,
        stock: 5,
        lowStockThreshold: 10,
        expiryDate: new Date(2024, 11, 30)
      },
      {
        name: "Vitamin C 1000mg",
        sku: "VIT-C1000",
        description: "Vitamin C supplements",
        category: "Vitamins",
        price: 45000,
        costPrice: 25000,
        stock: 3,
        lowStockThreshold: 5,
        expiryDate: new Date(2024, 9, 15)
      },
      {
        name: "Antacid Suspension",
        sku: "GAS-ANT120",
        description: "Antacid for heartburn relief",
        category: "Digestion",
        price: 35000,
        costPrice: 20000,
        stock: 2,
        lowStockThreshold: 5,
        expiryDate: new Date(2024, 10, 25)
      },
      {
        name: "Ibuprofen 400mg",
        sku: "MED-I400",
        description: "Anti-inflammatory pain relief",
        category: "Pain Relief",
        price: 30000,
        costPrice: 18000,
        stock: 15,
        lowStockThreshold: 10,
        expiryDate: new Date(2024, 8, 30)
      }
    ];

    products.forEach(product => this.createProduct(product));

    // Add customers
    const customers: InsertCustomer[] = [
      { name: "John Doe", email: "john@example.com", phone: "081234567890", address: "Jl. Sudirman No. 123" },
      { name: "Jane Smith", email: "jane@example.com", phone: "081234567891", address: "Jl. Thamrin No. 456" },
      { name: "Robert Johnson", email: "robert@example.com", phone: "081234567892", address: "Jl. Gatot Subroto No. 789" },
      { name: "Sarah Williams", email: "sarah@example.com", phone: "081234567893", address: "Jl. Kuningan No. 101" }
    ];

    customers.forEach(customer => this.createCustomer(customer));

    // Add transactions
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const transactions: InsertTransaction[] = [
      {
        transactionId: "TRX-6523",
        customerId: 1,
        total: 125000,
        status: "completed",
        createdAt: new Date(now.setHours(10, 45, 0, 0))
      },
      {
        transactionId: "TRX-6522",
        customerId: 2,
        total: 78500,
        status: "completed",
        createdAt: new Date(now.setHours(9, 32, 0, 0))
      },
      {
        transactionId: "TRX-6521",
        customerId: 3,
        total: 156000,
        status: "completed",
        createdAt: new Date(now.setHours(8, 15, 0, 0))
      },
      {
        transactionId: "TRX-6520",
        customerId: 4,
        total: 95000,
        status: "pending",
        createdAt: new Date(yesterday.setHours(18, 23, 0, 0))
      }
    ];

    transactions.forEach(transaction => this.createTransaction(transaction));

    // Add transaction items
    const transactionItems: InsertTransactionItem[] = [
      { transactionId: 1, productId: 1, quantity: 2, price: 25000, subtotal: 50000 },
      { transactionId: 1, productId: 2, quantity: 1, price: 45000, subtotal: 45000 },
      { transactionId: 1, productId: 4, quantity: 1, price: 30000, subtotal: 30000 },
      { transactionId: 2, productId: 1, quantity: 1, price: 25000, subtotal: 25000 },
      { transactionId: 2, productId: 3, quantity: 1, price: 35000, subtotal: 35000 },
      { transactionId: 2, productId: 4, quantity: 0.5, price: 30000, subtotal: 15000 },
      { transactionId: 3, productId: 2, quantity: 2, price: 45000, subtotal: 90000 },
      { transactionId: 3, productId: 4, quantity: 2, price: 30000, subtotal: 60000 },
      { transactionId: 4, productId: 1, quantity: 1, price: 25000, subtotal: 25000 },
      { transactionId: 4, productId: 2, quantity: 1, price: 45000, subtotal: 45000 },
      { transactionId: 4, productId: 3, quantity: 1, price: 35000, subtotal: 35000 },
    ];

    transactionItems.forEach(item => this.createTransactionItem(item));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.stock <= product.lowStockThreshold,
    );
  }

  async getExpiredProducts(): Promise<Product[]> {
    const now = new Date();
    return Array.from(this.products.values()).filter(
      (product) => product.expiryDate !== null && product.expiryDate < now,
    );
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Supplier operations
  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierIdCounter++;
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;

    const updatedSupplier = { ...supplier, ...supplierData };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  // Customer operations
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const customer: Customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, customerData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;

    const updatedCustomer = { ...customer, ...customerData };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getRecentTransactions(limit: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Transaction item operations
  async createTransactionItem(insertItem: InsertTransactionItem): Promise<TransactionItem> {
    const id = this.transactionItemIdCounter++;
    const item: TransactionItem = { ...insertItem, id };
    this.transactionItems.set(id, item);
    return item;
  }

  async getTransactionItems(transactionId: number): Promise<TransactionItem[]> {
    return Array.from(this.transactionItems.values()).filter(
      (item) => item.transactionId === transactionId,
    );
  }

  // Dashboard data
  async getDashboardStats(): Promise<{
    totalSales: number;
    totalProducts: number;
    lowStockCount: number;
    expiredCount: number;
    percentSalesChange: number;
    percentProductsChange: number;
  }> {
    const totalSales = Array.from(this.transactions.values())
      .reduce((sum, transaction) => sum + transaction.total, 0);
    
    const totalProducts = this.products.size;
    const lowStockProducts = await this.getLowStockProducts();
    const expiredProducts = await this.getExpiredProducts();

    // Mock the percent changes
    return {
      totalSales,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      expiredCount: expiredProducts.length,
      percentSalesChange: 24.5,
      percentProductsChange: 12.3
    };
  }

  async getSalesData(period: 'daily' | 'weekly' | 'monthly'): Promise<any[]> {
    // Mock sales data for the chart
    const dailyData = [
      { day: 'Mon', sales: 65000 },
      { day: 'Tue', sales: 120000 },
      { day: 'Wed', sales: 75000 },
      { day: 'Thu', sales: 90000 },
      { day: 'Fri', sales: 200000 },
      { day: 'Sat', sales: 130000 },
      { day: 'Sun', sales: 80000 }
    ];

    const weeklyData = [
      { week: 'Week 1', sales: 500000 },
      { week: 'Week 2', sales: 650000 },
      { week: 'Week 3', sales: 450000 },
      { week: 'Week 4', sales: 700000 }
    ];

    const monthlyData = [
      { month: 'Jan', sales: 2500000 },
      { month: 'Feb', sales: 1800000 },
      { month: 'Mar', sales: 2200000 },
      { month: 'Apr', sales: 2700000 },
      { month: 'May', sales: 2300000 },
      { month: 'Jun', sales: 2900000 }
    ];

    switch (period) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
    }
  }

  async getCategoryStats(): Promise<{ category: string; percentage: number }[]> {
    const categories = await this.getAllCategories();
    const allTransactionItems = Array.from(this.transactionItems.values());
    
    const categorySales: Record<string, number> = {};
    let totalSales = 0;

    for (const category of categories) {
      categorySales[category.name] = 0;
    }

    for (const item of allTransactionItems) {
      const product = await this.getProduct(item.productId);
      if (product) {
        categorySales[product.category] = (categorySales[product.category] || 0) + item.subtotal;
        totalSales += item.subtotal;
      }
    }

    // If no sales data, provide mock data
    if (totalSales === 0) {
      return [
        { category: "Pain Relief", percentage: 36 },
        { category: "Vitamins", percentage: 55 },
        { category: "Digestion", percentage: 9 }
      ];
    }

    return Object.entries(categorySales).map(([category, sales]) => ({
      category,
      percentage: Math.round((sales / totalSales) * 100)
    }));
  }
}

export const storage = new MemStorage();
