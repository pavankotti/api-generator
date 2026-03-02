import FileUploader from "@/components/upload/file-uploader"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Zap, ArrowRight, Clock, Code2, Database, Shield, BarChart3, Users, GraduationCap, Store } from "lucide-react"

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
  { icon: Clock, label: "30-second setup" },
  { icon: Shield, label: "API key auth" },
  { icon: Database, label: "Auto schema detection" },
  { icon: Users, label: "CRUD endpoints" },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">API Generator</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              API Docs
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 via-muted/30 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Instant REST API from any spreadsheet
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 max-w-2xl mx-auto leading-tight">
            You have data in Excel.{" "}
            <span className="text-primary">Your app needs an API.</span>{" "}
            We&rsquo;re the bridge.
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Upload a CSV or Excel file and get a fully functional REST API with CRUD endpoints in seconds — no coding required.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>

          <a href="#upload" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Upload section */}
      <section id="upload" className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Upload your file</h2>
            <p className="text-muted-foreground text-sm">
              CSV or Excel · Preview & edit · Get a live REST API in seconds
            </p>
          </div>
          <FileUploader />
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Who is this for?</p>
            <h2 className="text-2xl font-bold tracking-tight">Built for everyone who works with data</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {USE_CASES.map(({ icon: Icon, audience, title, description, color, iconColor }) => (
              <div
                key={audience}
                className={`rounded-xl border bg-gradient-to-br ${color} p-5 space-y-3 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{audience}</span>
                </div>
                <h3 className="font-semibold text-base leading-snug">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Comparison */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">The difference</p>
            <h2 className="text-2xl font-bold tracking-tight">Why use API Generator?</h2>
          </div>
          <div className="rounded-xl border overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-2 divide-x">
              <div className="px-5 py-3 bg-red-50 dark:bg-red-950/20 flex items-center gap-2">
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">Without API Generator</span>
              </div>
              <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">With API Generator</span>
              </div>
            </div>
            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div key={i} className="grid grid-cols-2 divide-x border-t">
                <div className="px-5 py-3.5 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-red-500 shrink-0">✗</span>
                  {row.without}
                </div>
                <div className="px-5 py-3.5 flex items-center gap-2 text-sm text-foreground font-medium">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  {row.with}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-3">
          <span>API Generator</span>
          <span>·</span>
          <span>Data expires after 24 hours</span>
          <span>·</span>
          <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-2">
            API Docs
          </a>
        </div>
      </footer>
    </div>
  )
}
