import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10">
            <Activity className="h-4 w-4" />
          </span>
          <span>Traffic Severity AI</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground bg-white/5" }}
            inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
            className="rounded-md px-3 py-1.5 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/architecture"
            activeProps={{ className: "text-foreground bg-white/5" }}
            inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
            className="rounded-md px-3 py-1.5 transition-colors"
          >
            Architecture
          </Link>
        </nav>
      </div>
    </header>
  );
}