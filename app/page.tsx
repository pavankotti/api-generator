import FileUploader from "@/components/upload/file-uploader"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Zap } from "lucide-react"

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
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              API Docs
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-4 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Instant REST API from any spreadsheet
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Turn your data into a{" "}
            <span className="text-primary">live API</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload a CSV or Excel file, preview & edit your data, then get a fully
            functional REST API with CRUD endpoints — in seconds.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["CSV & XLSX", "Edit before publishing", "Instant REST API", "Auto schema detection", "CRUD endpoints", "API key auth"].map((f) => (
              <span key={f} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <FileUploader />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        API Generator · Data expires after 24 hours
      </footer>
    </div>
  )
}
