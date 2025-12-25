import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TransactionInput } from "@shared/routes";

// ==========================================
// RATES HOOKS
// ==========================================

export function useRates() {
  return useQuery({
    queryKey: [api.rates.list.path],
    queryFn: async () => {
      const res = await fetch(api.rates.list.path);
      if (!res.ok) throw new Error("Impossible de récupérer les taux de change");
      return api.rates.list.responses[200].parse(await res.json());
    },
    // Rates change often, refresh every minute
    refetchInterval: 60000, 
  });
}

// ==========================================
// TRANSACTIONS HOOKS
// ==========================================

export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de récupérer l'historique");
      return api.transactions.list.responses[200].parse(await res.json());
    },
  });
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: [api.transactions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.transactions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Transaction introuvable");
      return api.transactions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TransactionInput) => {
      // Coerce decimals to strings/numbers as needed by schema, mostly handled by backend
      // But ensure numbers are sent correctly
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.transactions.create.responses[400].parse(await res.json());
           throw new Error(error.message || "Erreur de validation");
        }
        throw new Error("Échec de la création de la transaction");
      }
      return api.transactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
    },
  });
}

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' }) => {
      const url = buildUrl(api.transactions.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.transactions.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Impossible de mettre à jour le statut");
      return api.transactions.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
    },
  });
}
