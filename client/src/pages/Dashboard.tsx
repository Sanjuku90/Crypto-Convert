import { useTransactions, useRates } from "@/hooks/use-exchange";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dashboard() {
  const { data: transactions, isLoading: isLoadingTx } = useTransactions();
  const { data: rates } = useRates();

  const recentTransactions = transactions?.slice(0, 3) || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de vos activités récentes.
          </p>
        </div>
        <Link href="/convert">
          <Button variant="gradient" size="lg" className="shadow-emerald-500/20">
            Nouvelle Conversion <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Échangé</p>
                <h3 className="text-2xl font-bold mt-2 font-display">
                  {transactions ? transactions.length : 0} Transactions
                </h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full font-medium">
                Actif
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Current Rates Preview */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Taux du marché</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rates ? rates.slice(0, 3).map(rate => (
                <div key={rate.id} className="p-4 rounded-xl bg-muted/50 border hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm">{rate.pair.replace('_', ' → ')}</span>
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-primary">
                    {rate.rate}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Frais: {rate.feePercent}%</div>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm col-span-3">Chargement des taux...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display">Activité Récente</h2>
          <Link href="/history">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              Tout voir
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoadingTx ? (
              <div className="p-8 text-center text-muted-foreground">Chargement...</div>
            ) : recentTransactions.length > 0 ? (
              <div className="divide-y">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 
                        tx.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'BUY' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {tx.type === 'BUY' ? 'Achat' : 'Vente'} {tx.currencyOut}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.createdAt ? format(new Date(tx.createdAt), "d MMMM yyyy, HH:mm", { locale: fr }) : '-'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        {tx.amountIn} {tx.currencyIn}
                      </p>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-muted-foreground w-6 h-6" />
                </div>
                <h3 className="font-medium text-lg">Aucune transaction</h3>
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore effectué d'échange.</p>
                <Link href="/convert">
                  <Button variant="outline">Faire ma première conversion</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  );
}
