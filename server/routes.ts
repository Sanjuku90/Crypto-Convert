import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
