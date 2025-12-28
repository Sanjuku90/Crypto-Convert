import { useState, useEffect } from "react";
import { useRates, useCreateTransaction } from "@/hooks/use-exchange";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowDown, AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const CURRENCIES = [
  { code: "XOF", name: "Franc CFA (Mobile Money)", type: "fiat" },
  { code: "USDT", name: "Tether (TRC20)", type: "crypto" },
  { code: "BTC", name: "Bitcoin", type: "crypto" },
];

export default function NewTransaction() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: rates } = useRates();
  const createTx = useCreateTransaction();

  const [fromCurrency, setFromCurrency] = useState("XOF");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  
  // Calculate output amount
  const activeRate = rates?.find(r => r.pair === `${fromCurrency}_${toCurrency}`);
  
  const estimatedOutput = amount && activeRate 
    ? (parseFloat(amount) * parseFloat(activeRate.rate as string)).toFixed(2)
    : "0.00";

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCurrency === 'XOF' && toCurrency === 'USDT') {
      toast({ 
        title: "Indisponible", 
        description: "Les conversions XOF vers USDT seront de nouveau disponibles le 1er janvier.", 
        variant: "destructive" 
      });
      return;
    }
    if (!amount || !paymentDetails) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    try {
      await createTx.mutateAsync({
        type: fromCurrency === 'XOF' ? 'BUY' : 'SELL', // Simplified logic
        amountIn: amount,
        currencyIn: fromCurrency,
        amountOut: estimatedOutput,
        currencyOut: toCurrency,
        paymentDetails: { addressOrNumber: paymentDetails },
      });
      
      toast({ 
        title: "Transaction Créée !", 
        description: fromCurrency === 'USDT' 
          ? "Demande enregistrée. N'oubliez pas d'envoyer vos USDT à l'adresse indiquée." 
          : "Votre demande a été enregistrée avec succès.",
        className: "bg-emerald-500 text-white border-none"
      });
      
      setLocation("/history");
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message || "Une erreur est survenue", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-display mb-2">Nouvelle Conversion</h1>
        <p className="text-muted-foreground">Remplissez les informations ci-dessous pour effectuer votre échange.</p>
      </div>

      <Card className="shadow-2xl border-none ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
          <div className="flex justify-between items-center">
             <CardTitle className="text-xl">Échange Rapide</CardTitle>
             {activeRate && (
               <div className="text-sm font-medium px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                 1 {fromCurrency} ≈ {activeRate.rate} {toCurrency}
               </div>
             )}
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Amount & From */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Vous envoyez</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="text-lg font-bold h-14 pl-4"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                  />
                </div>
                <select 
                  className="h-14 px-4 rounded-xl border bg-background font-bold min-w-[120px]"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-3 z-10 relative">
              <Button 
                type="button" 
                size="icon" 
                variant="outline" 
                className="rounded-full bg-background shadow-md border hover:border-primary hover:text-primary"
                onClick={handleSwap}
              >
                <ArrowDown className="w-5 h-5" />
              </Button>
            </div>

            {/* Output & To */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Vous recevez (estimé)</label>
              <div className="flex gap-2">
                <div className="flex-1 h-14 rounded-xl bg-muted/50 border flex items-center px-4 text-lg font-bold text-slate-600 dark:text-slate-300">
                  {fromCurrency === 'XOF' && toCurrency === 'USDT' ? "Indisponible" : estimatedOutput}
                </div>
                <select 
                  className="h-14 px-4 rounded-xl border bg-background font-bold min-w-[120px]"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
              </div>
              {fromCurrency === 'XOF' && toCurrency === 'USDT' && (
                <p className="text-xs text-red-500 font-medium">
                  Cette conversion sera de nouveau disponible le 1er janvier.
                </p>
              )}
            </div>

            {/* Info Fees */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Frais de transaction inclus</p>
                <p className="opacity-90 mt-1">
                  Les frais de réseau et de service ({activeRate?.feePercent || '1'}%) sont déjà déduits du montant estimé.
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">
                {toCurrency === 'XOF' ? 'Votre numéro Mobile Money' : 'Votre adresse de réception'}
              </label>
              <Input 
                placeholder={toCurrency === 'XOF' ? 'Ex: +229 00 00 00 00' : 'Ex: T9yK...'} 
                className="h-12"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
              />
              {fromCurrency === 'USDT' && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Instruction de paiement :</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
                    Veuillez envoyer exactement <span className="font-bold">{amount || '0'} USDT (TRC20)</span> à l'adresse ci-dessous :
                  </p>
                  <div 
                    className="bg-white dark:bg-black/40 p-3 rounded border font-mono text-xs break-all select-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText("TYjqWPHHpSrkEnkfNjueLpxeYevo6fwdg4");
                      toast({ title: "Copié !", description: "L'adresse a été copiée dans le presse-papier." });
                    }}
                  >
                    TYjqWPHHpSrkEnkfNjueLpxeYevo6fwdg4
                  </div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-2">
                    * La transaction sera traitée dès confirmation sur la blockchain.
                  </p>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold shadow-xl shadow-emerald-500/20" 
              variant="gradient"
              disabled={createTx.isPending || !activeRate}
            >
              {createTx.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Confirmer la conversion"
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
      
      {!activeRate && (
        <p className="text-center text-red-500 mt-4 text-sm">
          Paire de devises non disponible actuellement. Veuillez essayer une autre combinaison.
        </p>
      )}
    </div>
  );
}
