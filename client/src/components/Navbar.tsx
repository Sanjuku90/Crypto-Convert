import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  LogOut
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const navLinks = [
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/convert", label: "Convertir", icon: ArrowRightLeft },
    { href: "/history", label: "Historique", icon: History },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Bwari<span className="text-primary">Exchange</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user && navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`
                flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer
                ${isActive(link.href) ? "text-primary bg-primary/10 px-3 py-1.5 rounded-lg" : "text-muted-foreground"}
              `}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" data-testid="button-login-nav">
                  Se connecter
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" data-testid="button-signup-nav">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background"
          >
            <div className="container px-4 py-4 space-y-4">
              {user && navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-lg ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="border-t pt-4 space-y-2">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground px-3">{user.email}</p>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-muted"
                      data-testid="button-logout-mobile"
                    >
                      <LogOut className="w-5 h-5" />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setIsOpen(false)}
                        data-testid="button-login-mobile"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button 
                        className="w-full" 
                        onClick={() => setIsOpen(false)}
                        data-testid="button-signup-mobile"
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
