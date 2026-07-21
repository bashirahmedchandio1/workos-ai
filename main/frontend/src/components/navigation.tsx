"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-100 font-semibold text-lg">
          <span className="text-primary">⟐</span>
          <span>WorkOS AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
            className="text-sm text-text-secondary hover:text-zinc-100 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary hover:text-zinc-100 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-text-secondary hover:text-zinc-100 transition-colors flex items-center gap-1"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-text-secondary hover:text-zinc-100 transition-colors"
              >
                Sign In
              </Link>
              <Button size="default" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            className="text-zinc-100 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="md:hidden fixed inset-0 top-16 bg-background z-40"
          >
            <div className="flex flex-col items-center gap-8 pt-16 pb-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg text-text-secondary hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <hr className="w-16 border-border" />
              {session ? (
                <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg text-text-secondary hover:text-zinc-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-lg text-text-secondary hover:text-zinc-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg text-text-secondary hover:text-zinc-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Button size="lg" asChild>
                      <Link href="/register" onClick={() => setMenuOpen(false)}>
                        Get Started Free
                      </Link>
                    </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
