import { type Transaction, type InsertTransaction, type ExchangeRate, type InsertExchangeRate } from "@shared/schema";

export interface IStorage {
  // Exchange Rates
  getExchangeRates(): Promise<ExchangeRate[]>;
  createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate>;
  
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
}

export class MemStorage implements IStorage {
  private rates: Map<number, ExchangeRate>;
  private transactions: Map<number, Transaction>;
  private rateId: number;
  private transactionId: number;

  constructor() {
    this.rates = new Map();
    this.transactions = new Map();
    this.rateId = 1;
    this.transactionId = 1;
  }

  async getExchangeRates(): Promise<ExchangeRate[]> {
    return Array.from(this.rates.values());
  }

  async createExchangeRate(insertRate: InsertExchangeRate): Promise<ExchangeRate> {
    const id = this.rateId++;
    const rate: ExchangeRate = { 
      ...insertRate, 
      id, 
      updatedAt: new Date(),
      feePercent: insertRate.feePercent ?? "0",
      minAmount: insertRate.minAmount ?? "0",
      maxAmount: insertRate.maxAmount ?? "0"
    };
    this.rates.set(id, rate);
    return rate;
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTx: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const transaction: Transaction = {
      ...insertTx,
      id,
      status: "PENDING",
      createdAt: new Date(),
      userId: insertTx.userId ?? null,
      paymentMethod: insertTx.paymentMethod ?? null,
      paymentDetails: insertTx.paymentDetails ?? null,
      proofUrl: insertTx.proofUrl ?? null
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const tx = this.transactions.get(id);
    if (!tx) return undefined;
    const updated = { ...tx, status };
    this.transactions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();