import { type Transaction, type InsertTransaction, type ExchangeRate, type InsertExchangeRate, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  getUserByPassword(email: string, password: string): Promise<User | undefined>;
  
  // Exchange Rates
  getExchangeRates(): Promise<ExchangeRate[]>;
  createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate>;
  
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  linkUserTransactions(userId: number, email?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rates: Map<number, ExchangeRate>;
  private transactions: Map<number, Transaction>;
  private userId: number;
  private rateId: number;
  private transactionId: number;

  constructor() {
    this.users = new Map();
    this.rates = new Map();
    this.transactions = new Map();
    this.userId = 1;
    this.rateId = 1;
    this.transactionId = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = {
      id,
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      createdAt: new Date(),
      verified: false,
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  async linkUserTransactions(userId: number, email?: string): Promise<void> {
    // Link all unlinked transactions to the user
    const transactions = Array.from(this.transactions.values());
    for (const tx of transactions) {
      if (!tx.userId) {
        const updated = { ...tx, userId };
        this.transactions.set(tx.id, updated);
      }
    }
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

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => 
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