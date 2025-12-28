import { useTransactions, useUpdateTransactionStatus } from "@/hooks/use-exchange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: transactions, isLoading } = useTransactions();
  const updateStatus = useUpdateTransactionStatus();

  const handleStatusUpdate = (id: number, status: 'COMPLETED' | 'CANCELLED' | 'PROCESSING') => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-display mb-8">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Transactions" value={transactions?.length || 0} />
        <StatCard title="En Attente" value={transactions?.filter(t => t.status === 'PENDING').length || 0} color="text-amber-600" />
        <StatCard title="Volume (FCFA)" value="Mock: 15.2M" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Transactions</CardTitle>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="p-8 text-center"><Loader2 className="animate-spin inline" /> Chargement...</div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                   <tr>
                     <th className="px-4 py-3">ID</th>
                     <th className="px-4 py-3">Utilisateur</th>
                     <th className="px-4 py-3">Montant</th>
                     <th className="px-4 py-3">Détails Paiement</th>
                     <th className="px-4 py-3">Statut</th>
                     <th className="px-4 py-3">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {transactions?.map((tx) => (
                     <tr key={tx.id} className="hover:bg-muted/10">
                       <td className="px-4 py-3 font-medium">#{tx.id}</td>
                       
                       <td className="px-4 py-3">
                         <div className="font-medium">{tx.amountIn} {tx.currencyIn}</div>
                         <div className="text-xs text-muted-foreground">→ {tx.amountOut} {tx.currencyOut}</div>
                       </td>
                       <td className="px-4 py-3 font-mono text-xs">
                         {JSON.stringify(tx.paymentDetails)}
                       </td>
                       <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                           tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                           tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                           'bg-red-100 text-red-700'
                         }`}>
                           {tx.status}
                         </span>
                       </td>
                       <td className="px-4 py-3">
                         <div className="flex gap-2">
                           {tx.status !== 'COMPLETED' && tx.status !== 'CANCELLED' && (
                             <>
                               <Button 
                                 size="sm" 
                                 className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" 
                                 onClick={() => handleStatusUpdate(tx.id, 'COMPLETED')}
                                 disabled={updateStatus.isPending}
                               >
                                 <CheckCircle className="w-4 h-4" />
                               </Button>
                               <Button 
                                 size="sm" 
                                 variant="destructive"
                                 className="h-8 w-8 p-0" 
                                 onClick={() => handleStatusUpdate(tx.id, 'CANCELLED')}
                                 disabled={updateStatus.isPending}
                               >
                                 <XCircle className="w-4 h-4" />
                               </Button>
                               {tx.status === 'PENDING' && (
                                 <Button 
                                   size="sm" 
                                   variant="outline"
                                   className="h-8 w-8 p-0" 
                                   onClick={() => handleStatusUpdate(tx.id, 'PROCESSING')}
                                   disabled={updateStatus.isPending}
                                 >
                                   <Clock className="w-4 h-4" />
                                 </Button>
                               )}
                             </>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className={`text-2xl font-bold mt-2 ${color || 'text-foreground'}`}>{value}</h3>
      </CardContent>
    </Card>
  )
}
