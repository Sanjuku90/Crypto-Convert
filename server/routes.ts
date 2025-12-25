import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Exchange Rates
  app.get(api.rates.list.path, async (req, res) => {
    const rates = await storage.getExchangeRates();
    res.json(rates);
  });

  app.post(api.rates.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
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
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    
    // For MVP, simply return user's transactions. 
    // Admin features can be added by checking specific user IDs later.
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  });

  app.get(api.transactions.get.path, async (req, res) => {
     if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
     const id = parseInt(req.params.id);
     const transaction = await storage.getTransaction(id);
     if (!transaction) return res.status(404).json({ message: "Not found" });
     
     const userId = (req.user as any).claims.sub;
     if (transaction.userId !== userId) return res.status(403).json({ message: "Forbidden" });
     
     res.json(transaction);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    try {
      const input = api.transactions.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const transaction = await storage.createTransaction({ ...input, userId });
      res.status(201).json(transaction);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch(api.transactions.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
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
  if ((await storage.getExchangeRates()).length === 0) {
    await storage.createExchangeRate({ pair: "XOF_USDT", rate: "0.002", feePercent: "1.5", minAmount: "5000", maxAmount: "1000000" }); // 1/500 = 0.002
    await storage.createExchangeRate({ pair: "USDT_XOF", rate: "600", feePercent: "1.5", minAmount: "10", maxAmount: "2000" });
    await storage.createExchangeRate({ pair: "XOF_BTC", rate: "0.00000002", feePercent: "2", minAmount: "10000", maxAmount: "5000000" });
  }

  return httpServer;
}
