import { useTransactions } from "@/hooks/use-exchange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function History() {
  const { data: transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions?.filter(tx => 
    tx.id.toString().includes(search) || 
    tx.currencyIn.toLowerCase().includes(search.toLowerCase()) ||
    tx.currencyOut.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold font-display">Historique des Transactions</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-5 font-medium text-sm text-muted-foreground">
            <div className="md:col-span-2">Type & Montant</div>
            <div className="hidden md:block">Taux/Frais</div>
            <div className="hidden md:block">Date</div>
            <div className="text-right">Statut</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions && filteredTransactions.length > 0 ? (
            <div className="divide-y">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-2 md:grid-cols-5 p-4 items-center hover:bg-muted/10 transition-colors">
                  
                  {/* Type & Amount */}
                  <div className="md:col-span-2 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'BUY' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {tx.type === 'BUY' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base">
                        {tx.type === 'BUY' ? 'Achat' : 'Vente'} {tx.currencyOut}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {tx.amountIn} {tx.currencyIn} → {tx.amountOut} {tx.currencyOut}
                      </p>
                    </div>
                  </div>

                  {/* Rate info (Hidden on mobile) */}
                  <div className="hidden md:block text-sm">
                    <p className="text-foreground font-medium">Auto</p>
                    <p className="text-xs text-muted-foreground">ID: #{tx.id}</p>
                  </div>

                  {/* Date (Hidden on mobile) */}
                  <div className="hidden md:block text-sm text-muted-foreground">
                    {tx.created_at ? format(new Date(tx.created_at), "dd MMM yyyy, HH:mm", { locale: fr }) : '-'}
                  </div>

                  {/* Status */}
                  <div className="text-right">
                    <StatusBadge status={tx.status} />
                    <p className="md:hidden text-xs text-muted-foreground mt-1">
                      {tx.created_at ? format(new Date(tx.created_at), "dd/MM", { locale: fr }) : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              Aucune transaction trouvée.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };

  const labels: Record<string, string> = {
    PENDING: "En attente",
    PROCESSING: "En cours",
    COMPLETED: "Terminé",
    CANCELLED: "Annulé",
  };

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  );
}
