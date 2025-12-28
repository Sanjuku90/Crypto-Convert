import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const input = insertUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      const user = await storage.createUser(input);
      
      // Link any unlinked transactions to this user
      await storage.linkUserTransactions(user.id, user.email);
      
      // Return user without password
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      });
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string(),
      }).parse(req.body);

      const user = await storage.getUserByPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe invalide" });
      }

      // Link any unlinked transactions to this user
      await storage.linkUserTransactions(user.id, user.email);

      // Return user without password
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        status: user.status,
      });
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Admin routes for user validation
  app.get("/api/admin/pending-users", async (req, res) => {
    try {
      const users = await storage.getPendingUsers();
      res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        createdAt: u.createdAt,
        status: u.status,
      })));
    } catch (e) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.patch("/api/admin/users/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({
        status: z.enum(["APPROVED", "REJECTED"]),
      }).parse(req.body);

      const user = await storage.updateUserStatus(id, status);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        status: user.status,
      });
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  // Exchange Rates
  app.get(api.rates.list.path, async (req, res) => {
    const rates = await storage.getExchangeRates();
    res.json(rates);
  });

  app.post(api.rates.update.path, async (req, res) => {
    try {
      const input = api.rates.update.input.parse(req.body);
      const rate = await storage.createExchangeRate(input);
      res.status(201).json(rate);
    } catch (e) {
       if (e instanceof z.ZodError) return res.status(400).json(e.errors);
       res.status(500).json({ message: "Server error" });
    }
  });

  // Transactions
  app.get(api.transactions.list.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.get(api.transactions.get.path, async (req, res) => {
     const id = parseInt(req.params.id);
     const transaction = await storage.getTransaction(id);
     if (!transaction) return res.status(404).json({ message: "Not found" });
     
     res.json(transaction);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    try {
      const input = api.transactions.create.input.parse(req.body);
      const transaction = await storage.createTransaction(input);
      res.status(201).json(transaction);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch(api.transactions.updateStatus.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = api.transactions.updateStatus.input.parse(req.body);
      const updated = await storage.updateTransactionStatus(id, status);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Seed Data
  const existingRates = await storage.getExchangeRates();
  if (existingRates.length === 0) {
    await storage.createExchangeRate({ pair: "XOF_USDT", rate: "500", feePercent: "1.5", minAmount: "5000", maxAmount: "1000000" }); 
    await storage.createExchangeRate({ pair: "USDT_XOF", rate: "600", feePercent: "1.5", minAmount: "10", maxAmount: "2000" });
    await storage.createExchangeRate({ pair: "XOF_BTC", rate: "60000000", feePercent: "2", minAmount: "10000", maxAmount: "5000000" });
  }

  return httpServer;
}
