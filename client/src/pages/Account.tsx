import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
}

export default function Account() {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-transparent dark:from-green-950 dark:to-transparent py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          {/* Confirmation Header */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
            <CardHeader>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <CardTitle className="text-green-900 dark:text-green-100">
                    Inscription validée
                  </CardTitle>
                  <CardDescription className="text-green-800 dark:text-green-200">
                    Votre compte a été créé avec succès et vos informations de connexion sont sécurisées
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de compte</CardTitle>
              <CardDescription>
                Vos données de connexion validées et sécurisées
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
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
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
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Date d'inscription</p>
                  <p className="text-base font-semibold text-foreground">{formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Compte vérifié
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Actif
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Information Message */}
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
            <CardHeader>
              <CardTitle className="text-base text-blue-900 dark:text-blue-100">
                À propos de vos opérations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Toutes les opérations que vous aviez effectuées avant la création de ce compte ont été automatiquement associées à votre profil. Vous pouvez consulter l'historique complet dans la section <strong>Historique</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-go-dashboard"
            >
              Tableau de bord
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setLocation("/history")}
              data-testid="button-go-history"
            >
              Historique
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
