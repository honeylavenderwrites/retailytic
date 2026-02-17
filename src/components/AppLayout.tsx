import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FlaskConical,
  Upload,
  TrendingUp,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/sales", label: "Sales Breakdown", icon: ShoppingCart },
  { path: "/customers", label: "Customer Analytics", icon: Users },
  { path: "/inventory", label: "Inventory Intel", icon: Package },
  { path: "/analytics", label: "Analytics Lab", icon: FlaskConical },
  { path: "/trends", label: "Google Trends", icon: TrendingUp },
  { path: "/data", label: "Data Management", icon: Upload },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
            R
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight text-sidebar-accent-foreground">
              Retailytics
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-md p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Ambassador Designs Inc. — Essence Division
          </h2>
          <div className="flex items-center gap-3">
            <button className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
