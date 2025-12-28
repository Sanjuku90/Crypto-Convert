import { exchange_rates, type ExchangeRate, type InsertExchangeRate, transactions, type Transaction, type InsertTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Exchange Rates
  getExchangeRates(): Promise<ExchangeRate[]>;
  createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate>;
  
  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Exchange Rates
  async getExchangeRates(): Promise<ExchangeRate[]> {
    return await db.select().from(exchange_rates);
  }

  async createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate> {
    const [newRate] = await db.insert(exchange_rates).values(rate).returning();
    return newRate;
  }

  // Transactions
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions)
      .set({ status })
      .where(eq(transactions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
