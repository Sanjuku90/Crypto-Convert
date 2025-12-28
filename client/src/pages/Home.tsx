import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Zap, Globe, Smartphone, Bitcoin } from "lucide-react";
import { Link } from "wouter";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32 lg:pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/50 to-transparent dark:from-emerald-900/10" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 mx-auto text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                Convertissez votre argent <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  sans frontières
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                La plateforme la plus fiable pour échanger Mobile Money et Cryptomonnaies. 
                Rapide, sécurisé et aux meilleurs taux du marché.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/dashboard">
                  <Button size="lg" variant="gradient" className="text-lg px-8">
                    Commencer maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#services">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    En savoir plus
                  </Button>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Transactions instantanées
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Support 24/7
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-16 lg:mt-0 lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {/* Abstract decorative elements */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
              
              {/* Floating Card Mockup */}
              <div className="relative glass-card rounded-2xl p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">De</p>
                      <p className="font-bold">Orange Money</p>
                    </div>
                  </div>
                  <ArrowRight className="text-muted-foreground" />
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vers</p>
                      <p className="font-bold">USDT (TRC20)</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Bitcoin className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-dashed">
                    <span className="text-muted-foreground">Montant envoyé</span>
                    <span className="font-bold text-lg">50,000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-dashed">
                    <span className="text-muted-foreground">Taux de change</span>
                    <span className="font-medium text-emerald-600">1 USDT = 650 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Reçu estimé</span>
                    <span className="font-bold text-2xl text-primary">76.92 USDT</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6" variant="gradient">
                  Confirmer l'échange
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display sm:text-4xl">Pourquoi choisir Bwari Exchange ?</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Nous simplifions l'accès aux cryptomonnaies pour tous, avec une sécurité maximale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="Ultra Rapide"
              description="Vos transactions sont traitées en quelques minutes. Fini les attentes interminables."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="100% Sécurisé"
              description="Nous utilisons les meilleures technologies de chiffrement pour protéger vos fonds et vos données."
            />
            <FeatureCard 
              icon={Globe}
              title="Accessible Partout"
              description="Convertissez votre argent où que vous soyez, depuis votre mobile ou votre ordinateur."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value="10k+" label="Utilisateurs" />
            <StatItem value="$2M+" label="Volume échangé" />
            <StatItem value="5 min" label="Temps moyen" />
            <StatItem value="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold font-display sm:text-4xl mb-6">Prêt à commencer ?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
            Créez votre compte en quelques secondes et effectuez votre première transaction dès aujourd'hui.
          </p>
          <Link href="/convert">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none text-lg px-10 rounded-full">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 bg-background border-t">
        <div className="container px-4 mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2024 Bwari Exchange. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="pt-8 pb-8 px-6 text-center">
        <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 mb-2 font-display">
        {value}
      </div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
