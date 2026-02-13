"use client";

import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/merge", label: "Merge" },
  { href: "/compress", label: "Compress" },
  { href: "/pdf-to-word", label: "PDF to Word" },
  { href: "/dashboard", label: "Dashboard", secondary: true }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight sm:text-base" onClick={() => setOpen(false)}>
          <FileText className="h-5 w-5 text-primary" />
          PDFMaster
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Button key={link.href} variant={link.secondary ? "secondary" : "ghost"} asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-background/95 px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <Button key={link.href} variant={link.secondary ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
