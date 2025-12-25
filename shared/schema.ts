import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export auth models
export * from "./models/auth";
import { users } from "./models/auth";

export const exchange_rates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  pair: text("pair").notNull(), // e.g., "XOF_USDT", "USDT_XOF"
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  feePercent: decimal("fee_percent", { precision: 5, scale: 2 }).default("0"),
  minAmount: decimal("min_amount", { precision: 12, scale: 2 }).default("0"),
  maxAmount: decimal("max_amount", { precision: 12, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
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

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const insertExchangeRateSchema = createInsertSchema(exchange_rates).omit({ id: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, status: true });

export type ExchangeRate = typeof exchange_rates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// API Types
export type CreateTransactionRequest = InsertTransaction;
export type UpdateTransactionStatusRequest = { status: string };
