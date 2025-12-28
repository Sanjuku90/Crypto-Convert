import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // hashed password
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  verified: boolean("verified").default(false),
});

export const exchange_rates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  pair: text("pair").notNull(), // e.g., "XOF_USDT", "USDT_XOF"
  rate: decimal("rate", { precision: 12, scale: 2 }).notNull(), // Now represents XOF for 1 USD (e.g. 500.00)
  feePercent: decimal("fee_percent", { precision: 5, scale: 2 }).default("0"),
  minAmount: decimal("min_amount", { precision: 12, scale: 2 }).default("0"),
  maxAmount: decimal("max_amount", { precision: 12, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'BUY', 'SELL', 'SWAP'
  amountIn: decimal("amount_in", { precision: 12, scale: 2 }).notNull(),
  currencyIn: text("currency_in").notNull(), // 'XOF', 'USDT'
  amountOut: decimal("amount_out", { precision: 12, scale: 2 }).notNull(),
  currencyOut: text("currency_out").notNull(), // 'USDT', 'XOF'
  status: text("status").notNull().default("PENDING"), // PENDING, PROCESSING, COMPLETED, CANCELLED
  paymentMethod: text("payment_method"), // 'MOBILE_MONEY', 'CRYPTO_WALLET'
  paymentDetails: jsonb("payment_details"), // { phoneNumber: "..." } or { walletAddress: "..." }
  proofUrl: text("proof_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, verified: true }).extend({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const insertExchangeRateSchema = createInsertSchema(exchange_rates).omit({ id: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, status: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ExchangeRate = typeof exchange_rates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// API Types
export type CreateTransactionRequest = InsertTransaction;
export type UpdateTransactionStatusRequest = { status: string };
