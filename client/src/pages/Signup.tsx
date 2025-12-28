import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const signupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password.length >= 6, {
  message: "Le mot de passe doit contenir au moins 6 caractères",
  path: ["password"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        toast({
          title: "Compte créé avec succès",
          description: `Bienvenue ${user.email}! Vos anciennes opérations ont été associées à votre compte.`,
        });
        setLocation("/dashboard");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message || "Cet email est déjà utilisé",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-transparent dark:from-green-950 dark:to-transparent">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez BwariExchange
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Votre prénom" 
                        {...field}
                        data-testid="input-firstname"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Votre nom" 
                        {...field}
                        data-testid="input-lastname"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="votre@email.com" 
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        {...field}
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-signup"
              >
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 space-y-3 text-sm text-center">
            <p className="text-muted-foreground">
              Déjà inscrit ?{" "}
              <Link href="/login">
                <a className="text-primary hover:underline font-medium" data-testid="link-login">
                  Se connecter
                </a>
              </Link>
            </p>
          </div>

          <div className="mt-6 p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-900 dark:text-green-100">
              <strong>Avantage:</strong> Si vous aviez effectué des opérations avant cette inscription, elles seront automatiquement reconnues et associées à votre nouveau compte une fois la création finalisée.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
