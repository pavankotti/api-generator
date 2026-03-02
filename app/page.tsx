import FileUploader from "@/components/upload/file-uploader"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  Zap,
  Upload,
  BookOpen,
  ChevronRight,
  Clock,
  Database,
  Shield,
  Code2,
  ExternalLink,
  Store,
  GraduationCap,
  BarChart3,
  Users,
} from "lucide-react"

const NAV_ITEMS = [
  { icon: Upload, label: "New API", href: "#", active: true },
  { icon: BookOpen, label: "API Docs", href: "/api/docs", external: true },
]

const SIDEBAR_STATS = [
  { icon: Clock, value: "~30s", label: "Setup time" },
  { icon: Shield, value: "Keyed", label: "Auth" },
  { icon: Database, value: "CRUD", label: "Operations" },
  { icon: Code2, value: "REST", label: "Protocol" },
]

const USE_CASES = [
  {
    icon: Store,
    audience: "Small Business",
    title: "Product catalog → live API",
    description: "Turn your Excel product list into a Webflow / Shopify data source — no backend needed.",
    accent: "blue",
  },
  {
    icon: Code2,
    audience: "No-Code Builders",
    title: "Spreadsheet → Bubble/Glide data source",
    description: "Feed data from Excel into Bubble, Glide, or FlutterFlow without writing a line of code.",
    accent: "purple",
  },
  {
    icon: GraduationCap,
    audience: "Students & Devs",
    title: "Instant mock API for projects",
    description: "Need fake data for a demo? Upload a sample CSV and get a working endpoint in 30 seconds.",
    accent: "emerald",
  },
  {
    icon: BarChart3,
    audience: "Data Teams",
    title: "Share data without sharing raw files",
    description: "Expose controlled read-only access to your spreadsheet data via a secure API key.",
    accent: "amber",
  },
]

const accentClasses: Record<string, { card: string; icon: string; badge: string }> = {
  blue: {
    card: "border-blue-200/60 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20",
    icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    badge: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    card: "border-purple-200/60 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20",
    icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    badge: "text-purple-600 dark:text-purple-400",
  },
  emerald: {
    card: "border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20",
    icon: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    badge: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    card: "border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20",
    icon: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    badge: "text-amber-600 dark:text-amber-400",
  },
}

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="app-sidebar w-64 shrink-0 flex flex-col border-r">
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-white/10 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/40">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none text-white">API Generator</p>
            <p className="text-[10px] text-white/40 mt-0.5 leading-none">CSV / Excel → REST</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.12em] px-2 pb-2">
            Workspace
          </p>
          {NAV_ITEMS.map(({ icon: Icon, label, href, active, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                active
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/50 hover:bg-white/6 hover:text-white/90"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {external && <ExternalLink className="h-3 w-3 opacity-50" />}
              {active && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
            </a>
          ))}
        </nav>

        {/* Stats grid */}
        <div className="px-3 pb-3 space-y-3 shrink-0">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2.5">Quick Stats</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SIDEBAR_STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-lg bg-white/5 border border-white/8 p-2 text-center">
                  <Icon className="h-3.5 w-3.5 text-white/40 mx-auto mb-1" />
                  <p className="text-xs font-bold text-white leading-none">{value}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] text-white/25">Data expires in 24h</p>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="h-14 flex items-center gap-2 px-6 border-b bg-background/95 backdrop-blur shrink-0">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <span>Workspace</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">New API</span>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              API Docs <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

            {/* Page title + description */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Create a New API</h1>
                <p className="text-muted-foreground text-sm mt-1.5 max-w-lg">
                  Upload a <span className="font-medium text-foreground">CSV</span> or{" "}
                  <span className="font-medium text-foreground">Excel</span> file to instantly generate a
                  fully-featured REST API with CRUD endpoints — no backend or coding required.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm shrink-0">
                <Clock className="h-3 w-3 text-primary" />
                Ready in ~30 seconds
              </div>
            </div>

            {/* ── Upload wizard ─────────────────────── */}
            <div className="rounded-2xl border bg-background shadow-sm">
              <div className="px-6 py-5 border-b">
                <h2 className="text-sm font-semibold">Upload & Configure</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Step through upload → preview → generated API
                </p>
              </div>
              <div className="px-6 py-6">
                <FileUploader />
              </div>
            </div>

            {/* ── Use-case cards ────────────────────── */}
            <section>
              <div className="mb-5">
                <h2 className="text-base font-semibold tracking-tight">Who is this for?</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Common workflows powered by API Generator</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {USE_CASES.map(({ icon: Icon, audience, title, description, accent }) => {
                  const cls = accentClasses[accent]
                  return (
                    <div
                      key={audience}
                      className={`rounded-xl border p-4 space-y-2.5 hover:shadow-sm transition-shadow ${cls.card}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cls.icon}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wide ${cls.badge}`}>{audience}</span>
                      </div>
                      <p className="font-medium text-sm leading-snug">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ── Before / After ────────────────────── */}
            <section>
              <div className="mb-5">
                <h2 className="text-base font-semibold tracking-tight">Why use API Generator?</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Before & after comparison</p>
              </div>
              <div className="rounded-xl border overflow-hidden bg-background shadow-sm">
                <div className="grid grid-cols-2 divide-x">
                  <div className="px-5 py-2.5 bg-red-50 dark:bg-red-950/20">
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">❌ Without</span>
                  </div>
                  <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/20">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ With API Generator</span>
                  </div>
                </div>
                {[
                  { without: "Hire a developer for ₹20,000", with: "Upload CSV, get API in 30 seconds" },
                  { without: "Learn Node.js / Python", with: "No coding needed" },
                  { without: "Wait 2 weeks for backend", with: "Live in 30 seconds" },
                  { without: "Pay monthly for a database", with: "Use Excel you already have" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 divide-x border-t">
                    <div className="px-5 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-red-400 shrink-0">✗</span>
                      {row.without}
                    </div>
                    <div className="px-5 py-3 flex items-center gap-2 text-xs font-medium">
                      <span className="text-emerald-500 shrink-0">✓</span>
                      {row.with}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Footer ────────────────────────────── */}
            <footer className="pb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>© API Generator</span>
              <div className="flex items-center gap-3">
                <span>Data expires after 24 hours</span>
                <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-2">
                  API Docs
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
