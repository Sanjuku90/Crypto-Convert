import { z } from 'zod';
import { insertTransactionSchema, insertExchangeRateSchema, transactions, exchange_rates } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  rates: {
    list: {
      method: 'GET' as const,
      path: '/api/rates',
      responses: {
        200: z.array(z.custom<typeof exchange_rates.$inferSelect>()),
      },
    },
    update: { // Admin
      method: 'POST' as const,
      path: '/api/rates',
      input: insertExchangeRateSchema,
      responses: {
        201: z.custom<typeof exchange_rates.$inferSelect>(),
      },
    }
  },
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions',
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/transactions/:id',
      responses: {
        200: z.custom<typeof transactions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/transactions',
      input: insertTransactionSchema,
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: { // Admin
      method: 'PATCH' as const,
      path: '/api/transactions/:id/status',
      input: z.object({ status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']) }),
      responses: {
        200: z.custom<typeof transactions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TransactionInput = z.infer<typeof api.transactions.create.input>;
