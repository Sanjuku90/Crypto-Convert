import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Clock, Mail, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
}

export default function PendingVerification() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLocation("/login");
      return;
    }

    const userData = JSON.parse(stored);
    setUser(userData);
    setIsLoading(false);
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const createdDate = new Date(user.createdAt);
  const formattedDate = format(createdDate, "d MMMM yyyy 'à' HH:mm", { locale: fr });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-950 dark:to-transparent py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          {/* Pending Header */}
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                  <CardTitle className="text-amber-900 dark:text-amber-100">
                    Inscription en attente de validation
                  </CardTitle>
                  <CardDescription className="text-amber-800 dark:text-amber-200">
                    Votre inscription a été reçue. Un administrateur validera votre demande dans les 24 heures.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations d'inscription</CardTitle>
              <CardDescription>
                Données soumises pour validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base font-semibold text-foreground">{user.email}</p>
                </div>
              </div>

              {/* Nom complet */}
              {(user.firstName || user.lastName) && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                  <p className="text-base font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              )}

              {/* Date de création */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Date de demande</p>
                <p className="text-base font-semibold text-foreground">{formattedDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut de validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  En attente d'approbation
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
                  <Clock className="w-3 h-3" />
                  En attente
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Information Message */}
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <CardTitle className="text-base text-blue-900 dark:text-blue-100">
                    Prochaines étapes
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Un administrateur examinera votre demande d'inscription et validera les informations que vous avez fournies. Une fois approuvée, vous recevrez un email de confirmation et pourrez accéder à votre compte avec tous les privilèges.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                localStorage.removeItem("user");
                setLocation("/");
              }}
              variant="outline"
              data-testid="button-go-home"
            >
              Retour à l'accueil
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                localStorage.removeItem("user");
                setLocation("/login");
              }}
              data-testid="button-login-again"
            >
              Connexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
