import { useTransactions, useUpdateTransactionStatus } from "@/hooks/use-exchange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Loader2, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PendingUser {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
  status: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: transactions, isLoading } = useTransactions();
  const updateStatus = useUpdateTransactionStatus();
  const [activeTab, setActiveTab] = useState<"transactions" | "users">("users");

  const { data: pendingUsers, isLoading: usersLoading } = useQuery<PendingUser[]>({
    queryKey: ["/api/admin/pending-users"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/pending-users");
      if (!res.ok) throw new Error("Failed to fetch pending users");
      return res.json();
    },
  });

  const verifyUser = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: "APPROVED" | "REJECTED" }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}/verify`, { status });
      if (!res.ok) throw new Error("Failed to verify user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
    },
  });

  const handleStatusUpdate = (id: number, status: 'COMPLETED' | 'CANCELLED' | 'PROCESSING') => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-display mb-8">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Transactions" value={transactions?.length || 0} />
        <StatCard title="En Attente" value={transactions?.filter(t => t.status === 'PENDING').length || 0} color="text-amber-600" />
        <StatCard title="Inscriptions en attente" value={pendingUsers?.length || 0} color="text-blue-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("users")}
          data-testid="button-tab-users"
        >
          <Users className="w-4 h-4 mr-2" />
          Validations d'inscription
        </Button>
        <Button
          variant={activeTab === "transactions" ? "default" : "outline"}
          onClick={() => setActiveTab("transactions")}
          data-testid="button-tab-transactions"
        >
          Transactions
        </Button>
      </div>

      {/* Users Verification Tab */}
      {activeTab === "users" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Inscriptions en attente de validation</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="p-8 text-center"><Loader2 className="animate-spin inline" /> Chargement...</div>
            ) : pendingUsers && pendingUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pendingUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/10">
                        <td className="px-4 py-3 font-medium">{user.email}</td>
                        <td className="px-4 py-3">
                          {user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-8 bg-green-600 hover:bg-green-700"
                              onClick={() => verifyUser.mutate({ userId: user.id, status: "APPROVED" })}
                              disabled={verifyUser.isPending}
                              data-testid={`button-approve-user-${user.id}`}
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={() => verifyUser.mutate({ userId: user.id, status: "REJECTED" })}
                              disabled={verifyUser.isPending}
                              data-testid={`button-reject-user-${user.id}`}
                            >
                              <XCircle className="w-3 h-3" />
                              Rejeter
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucune inscription en attente</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
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
      )}
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
