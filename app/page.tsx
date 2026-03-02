import FileUploader from "@/components/upload/file-uploader"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  Zap,
  ArrowRight,
  Clock,
  Code2,
  Database,
  Shield,
  BarChart3,
  Users,
  GraduationCap,
  Store,
  CheckCircle2,
  ChevronRight,
  Upload,
  Sparkles,
  Globe,
} from "lucide-react"

const USE_CASES = [
  {
    icon: Store,
    audience: "Small Business",
    title: "Turn your product catalog Excel into a live API",
    description:
      "Shop owner has 500 products in Excel. Connect to Webflow or Shopify via API. Price updates in Excel → website updates automatically.",
    color: "from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Code2,
    audience: "No-Code Builders",
    title: "Connect your Bubble app to any spreadsheet",
    description:
      "Bubble, Glide, FlutterFlow all need data sources. Your API becomes their database instantly. Non-devs already know Excel — why learn databases?",
    color: "from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: GraduationCap,
    audience: "Students & Devs",
    title: "Instant mock API for your projects",
    description:
      "CS student needs fake data for a college project. Upload sample CSV → get API in 30 seconds. No need to build a backend just for a demo.",
    color: "from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-900",
    iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: BarChart3,
    audience: "Data Teams",
    title: "Share data across teams without sharing raw files",
    description:
      "HR has employee data in Excel. Other teams query via API — never touch the original file. Secure, controlled access for everyone.",
    color: "from-amber-500/10 to-amber-500/5 border-amber-200 dark:border-amber-900",
    iconColor: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
  },
]

const COMPARISON = [
  { without: "Hire a developer for ₹20,000", with: "Upload CSV, get API in 30 seconds" },
  { without: "Learn Node.js / Python", with: "No coding needed" },
  { without: "Wait 2 weeks for backend", with: "Live in 30 seconds" },
  { without: "Pay monthly for a database", with: "Use Excel you already have" },
]

const FEATURES = [
  { icon: Clock, label: "30-second setup", desc: "From file upload to live API in under a minute." },
  { icon: Shield, label: "API key auth", desc: "Separate admin and read-only keys included." },
  { icon: Database, label: "Auto schema", desc: "Column types inferred automatically from your data." },
  { icon: Users, label: "Full CRUD", desc: "GET, POST, PUT, DELETE — all endpoints ready." },
]

const STEPS = [
  {
    n: "01",
    icon: Upload,
    title: "Upload your file",
    desc: "Drop a CSV or Excel spreadsheet. We parse it instantly — no manual schema setup.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Preview & edit",
    desc: "Review your data in a clean table editor. Fix typos or adjust values before going live.",
  },
  {
    n: "03",
    icon: Globe,
    title: "Get your live API",
    desc: "Copy your endpoint URL and API keys. Start making requests immediately.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-[15px]">API Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              API Docs <ChevronRight className="h-3.5 w-3.5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b">
        {/* Background grid + gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 60% 0%, hsl(221 83% 53% / 0.08) 0%, transparent 60%), radial-gradient(circle at 0% 100%, hsl(217 91% 60% / 0.06) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 py-20 lg:py-28 relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <div className="space-y-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Instant REST API from any spreadsheet
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-foreground">
                Spreadsheet <br className="hidden sm:block" />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, hsl(221 83% 53%), hsl(250 91% 65%))",
                  }}
                >
                  to live API
                </span>
                <br className="hidden sm:block" />
                in 30 seconds.
              </h1>

              {/* Sub */}
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Upload a CSV or Excel file and get a fully functional REST API with CRUD endpoints — no coding, no database, no devops.
              </p>

              {/* CTA row */}
              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="#upload"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm shadow-primary/30"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View API Docs <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-5 flex-wrap text-xs text-muted-foreground pt-1">
                {[
                  "No credit card",
                  "Works with .csv & .xlsx",
                  "API docs included",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — mock API preview */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl border bg-card/80 backdrop-blur shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/50">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono flex-1 text-center truncate">
                    GET /api/data/products?apiKey=rk_••••
                  </span>
                </div>
                {/* Response */}
                <pre className="text-xs font-mono p-5 leading-relaxed text-foreground overflow-hidden">
                  <span className="text-muted-foreground">{"{"}</span>{"\n"}
                  <span className="text-muted-foreground">{"  "}</span>
                  <span className="text-blue-500 dark:text-blue-400">"data"</span>
                  <span className="text-muted-foreground">: [</span>{"\n"}
                  <span className="text-muted-foreground">{"    {"}</span>{"\n"}
                  <span className="text-muted-foreground">{"      "}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">"id"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-600 dark:text-amber-400">1</span>
                  <span className="text-muted-foreground">,</span>{"\n"}
                  <span className="text-muted-foreground">{"      "}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">"name"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-orange-500">"Wireless Headphones"</span>
                  <span className="text-muted-foreground">,</span>{"\n"}
                  <span className="text-muted-foreground">{"      "}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">"price"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-600 dark:text-amber-400">2499</span>
                  <span className="text-muted-foreground">,</span>{"\n"}
                  <span className="text-muted-foreground">{"      "}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">"stock"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-600 dark:text-amber-400">142</span>{"\n"}
                  <span className="text-muted-foreground">{"    },"}</span>{"\n"}
                  <span className="text-muted-foreground">{"    { "}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">"id"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-600 dark:text-amber-400">2</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-emerald-600 dark:text-emerald-400">"name"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-orange-500">"Mechanical Keyboard"</span>
                  <span className="text-muted-foreground"> … </span>
                  <span className="text-muted-foreground">{"}"}</span>{"\n"}
                  <span className="text-muted-foreground">{"  ],"}</span>{"\n"}
                  <span className="text-muted-foreground">{"  "}</span>
                  <span className="text-blue-500 dark:text-blue-400">"total"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-600 dark:text-amber-400">38</span>
                  <span className="text-muted-foreground">,</span>{"\n"}
                  <span className="text-muted-foreground">{"  "}</span>
                  <span className="text-blue-500 dark:text-blue-400">"status"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-orange-500">"200 OK"</span>{"\n"}
                  <span className="text-muted-foreground">{"}"}</span>
                </pre>
                {/* Status bar */}
                <div className="border-t px-4 py-2 bg-muted/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    200 OK · 12ms
                  </span>
                  <span>application/json</span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg rotate-3">
                Generated in 30s ⚡
              </div>
              <div className="absolute -bottom-4 -left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg -rotate-2">
                Zero backend needed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-b py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">
              Three steps to your API
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="relative group">
                <div className="text-[80px] font-black text-primary/5 dark:text-primary/10 leading-none select-none absolute -top-4 -left-2">
                  {n}
                </div>
                <div className="relative space-y-3 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg tracking-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UPLOAD ===== */}
      <section id="upload" className="py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">
              Upload your file
            </h2>
            <p className="text-muted-foreground text-sm">
              CSV or Excel · Preview & edit · Get a live REST API in seconds
            </p>
          </div>
          <FileUploader />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="border-t border-b py-16 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">
              Everything you need
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-2xl border bg-card p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm tracking-tight">{label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Who is this for?</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">
              Built for everyone who works with data
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {USE_CASES.map(({ icon: Icon, audience, title, description, color, iconColor }) => (
              <div
                key={audience}
                className={`rounded-2xl border bg-gradient-to-br ${color} p-6 space-y-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{audience}</span>
                </div>
                <h3 className="font-bold text-base leading-snug tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="border-t bg-muted/20 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">The difference</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">
              Why use API Generator?
            </h2>
          </div>
          <div className="rounded-2xl border overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-2 divide-x">
              <div className="px-5 py-3.5 bg-red-50 dark:bg-red-950/20 flex items-center gap-2">
                <span className="text-sm font-bold text-red-700 dark:text-red-400 tracking-tight">Without API Generator</span>
              </div>
              <div className="px-5 py-3.5 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">With API Generator</span>
              </div>
            </div>
            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div key={i} className="grid grid-cols-2 divide-x border-t">
                <div className="px-5 py-4 flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="text-red-500 shrink-0 text-base">✗</span>
                  {row.without}
                </div>
                <div className="px-5 py-4 flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <span className="text-emerald-500 shrink-0 text-base">✓</span>
                  {row.with}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 lg:py-20 border-t">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4">
            Ready to build your API?
          </h2>
          <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
            Upload your spreadsheet and go live in under a minute. Completely free.
          </p>
          <a
            href="#upload"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/30"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t py-7 text-center text-xs text-muted-foreground bg-muted/20">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/90">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">API Generator</span>
          </div>
          <span className="text-border">·</span>
          <span>Data expires after 24 hours</span>
          <span className="text-border">·</span>
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            API Docs
          </a>
        </div>
      </footer>
    </div>
  )
}
