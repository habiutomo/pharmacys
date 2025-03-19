import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertProductSchema,
  insertCategorySchema,
  insertSupplierSchema,
  insertCustomerSchema,
  insertTransactionSchema,
  insertTransactionItemSchema
} from "@shared/schema";
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware for handling validation errors
  const validateRequest = (schema: z.ZodSchema) => (req: Request, res: Response, next: Function) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  // Dashboard routes
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  app.get('/api/dashboard/sales', async (req, res) => {
    try {
      const period = req.query.period as 'daily' | 'weekly' | 'monthly' || 'daily';
      const data = await storage.getSalesData(period);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sales data' });
    }
  });

  app.get('/api/dashboard/categories', async (req, res) => {
    try {
      const stats = await storage.getCategoryStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category stats' });
    }
  });

  app.get('/api/dashboard/recent-transactions', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || '5', 10);
      const transactions = await storage.getRecentTransactions(limit);

      // Fetch customer details for each transaction
      const transactionsWithCustomers = await Promise.all(transactions.map(async (transaction) => {
        let customer = transaction.customerId ? await storage.getCustomer(transaction.customerId) : null;
        return {
          ...transaction,
          customer: customer ? { id: customer.id, name: customer.name } : null
        };
      }));

      res.json(transactionsWithCustomers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recent transactions' });
    }
  });

  // User routes
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send passwords to the client
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }));
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', validateRequest(insertUserSchema), async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      // Don't send password back to client
      const { password, ...sanitizedUser } = user;
      res.status(201).json(sanitizedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Don't send password back to client
      const { password, ...sanitizedUser } = user;
      res.json(sanitizedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Don't send password back to client
      const { password, ...sanitizedUser } = updatedUser;
      res.json(sanitizedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/products', validateRequest(insertProductSchema), async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedProduct = await storage.updateProduct(id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  app.get('/api/products/low-stock', async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      const enrichedProducts = await Promise.all(products.map(async (product) => {
        const supplier = product.supplierId ? await storage.getSupplier(product.supplierId) : null;
        return {
          ...product,
          supplier: supplier ? {
            id: supplier.id,
            name: supplier.name,
            contact: supplier.contact
          } : null,
          reorderPoint: product.lowStockThreshold,
          daysUntilStockout: Math.floor(product.stock / (product.averageDailySales || 1))
        };
      }));
      res.json(enrichedProducts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch low stock products' });
    }
  });

  app.get('/api/products/expired', async (req, res) => {
    try {
      const products = await storage.getExpiredProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expired products' });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', validateRequest(insertCategorySchema), async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedCategory = await storage.updateCategory(id, req.body);
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // Supplier routes
  app.get('/api/suppliers', async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
  });

  app.post('/api/suppliers', validateRequest(insertSupplierSchema), async (req, res) => {
    try {
      const supplier = await storage.createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create supplier' });
    }
  });

  app.get('/api/suppliers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch supplier' });
    }
  });

  app.put('/api/suppliers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedSupplier = await storage.updateSupplier(id, req.body);
      if (!updatedSupplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update supplier' });
    }
  });

  app.delete('/api/suppliers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteSupplier(id);
      if (!success) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete supplier' });
    }
  });

  // Customer routes
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  app.post('/api/customers', validateRequest(insertCustomerSchema), async (req, res) => {
    try {
      const customer = await storage.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  });

  app.get('/api/customers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  });

  app.put('/api/customers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedCustomer = await storage.updateCustomer(id, req.body);
      if (!updatedCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update customer' });
    }
  });

  app.delete('/api/customers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteCustomer(id);
      if (!success) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  });

  // Transaction routes
  app.get('/api/transactions', async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  app.post('/api/transactions', validateRequest(insertTransactionSchema), async (req, res) => {
    try {
      // Validate total matches items
      const items = req.body.items || [];
      const calculatedTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

      if (Math.abs(calculatedTotal - req.body.total) > 0.01) {
        return res.status(400).json({ error: 'Transaction total does not match items' });
      }

      // Check stock availability
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ 
            error: 'Insufficient stock',
            productId: item.productId,
            requested: item.quantity,
            available: product?.stock || 0
          });
        }
      }

      const transaction = await storage.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  app.get('/api/transactions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Get transaction items
      const items = await storage.getTransactionItems(id);

      res.json({ ...transaction, items });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  });

  app.post('/api/transaction-items', validateRequest(insertTransactionItemSchema), async (req, res) => {
    try {
      const item = await storage.createTransactionItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction item' });
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errorId = Date.now().toString(36);

    console.error(`Error ${errorId}:`, err);
    res.status(status).json({ 
      message,
      errorId,
      status,
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}