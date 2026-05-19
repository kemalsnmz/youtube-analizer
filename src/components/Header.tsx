"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin",     label: "Admin",     icon: Shield },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="GrowthIQ logo"
            width={32}
            height={32}
            className="rounded-lg shadow-md shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow"
          />
          <span className="text-white font-semibold text-base tracking-tight">
            Growth<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-orange-400">IQ</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
