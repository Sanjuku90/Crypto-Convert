import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  ShieldCheck 
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/convert", label: "Convertir", icon: ArrowRightLeft },
    { href: "/history", label: "Historique", icon: History },
    { href: "/admin", label: "Admin", icon: ShieldCheck },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
            B
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Bwari<span className="text-primary">Exchange</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
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
              {navLinks.map((link) => (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
