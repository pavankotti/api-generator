"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Zap,
  ChevronRight,
  Lock,
  Eye,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Server,
  Shield,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

const METHOD_STYLES: Record<string, string> = {
  get: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  post: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  put: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  delete: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  patch: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
}

function MethodBadge({ method }: { method: string }) {
  const lower = method.toLowerCase()
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold font-mono border uppercase tracking-wider ${
        METHOD_STYLES[lower] ?? "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {method.toUpperCase()}
    </span>
  )
}

interface EndpointCardProps {
  method: string
  path: string
  operation: any
}

function EndpointCard({ method, path, operation }: EndpointCardProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyPath = () => {
    navigator.clipboard.writeText(path)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requiresAdmin = method.toLowerCase() !== "get"

  return (
    <div
      className={`rounded-xl border bg-card overflow-hidden transition-all duration-200 ${
        open ? "shadow-md" : "shadow-sm hover:shadow-md"
      }`}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-accent/30 transition-colors"
      >
        <MethodBadge method={method} />
        <code className="flex-1 text-sm font-mono text-foreground truncate">{path}</code>
        {requiresAdmin ? (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 shrink-0">
            <Lock className="h-3 w-3" /> Admin key
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
            <Eye className="h-3 w-3" /> Read key
          </span>
        )}
        <p className="hidden md:block text-sm text-muted-foreground flex-shrink-0 max-w-[200px] truncate">
          {operation.summary}
        </p>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-auto" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-auto" />
        )}
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t px-5 py-5 space-y-5 bg-muted/20">
          {/* Summary & description */}
          <div>
            <h3 className="font-semibold text-base">{operation.summary}</h3>
            {operation.description && (
              <p
                className="text-sm text-muted-foreground mt-1"
                dangerouslySetInnerHTML={{ __html: operation.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            )}
          </div>

          {/* Path with copy */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Request URL</p>
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 border px-3 py-2">
              <span className="text-xs font-semibold text-primary uppercase">{method}</span>
              <code className="flex-1 text-sm font-mono text-foreground">{path}</code>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={copyPath}>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Parameters */}
          {operation.parameters && operation.parameters.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Parameters</p>
              <div className="rounded-lg border overflow-hidden divide-y">
                {operation.parameters.map((param: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-card">
                    <code className="text-xs font-mono font-semibold text-foreground min-w-[100px] pt-0.5">
                      {param.name}
                    </code>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] bg-muted rounded px-1.5 py-0.5 font-mono text-muted-foreground">
                          {param.schema?.type ?? "string"}
                        </span>
                        <span className="text-[11px] bg-muted rounded px-1.5 py-0.5 text-muted-foreground capitalize">
                          in {param.in}
                        </span>
                        {param.required && (
                          <span className="text-[11px] bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded px-1.5 py-0.5 border border-red-200 dark:border-red-800">
                            required
                          </span>
                        )}
                        {param.schema?.default !== undefined && (
                          <span className="text-[11px] text-muted-foreground">
                            default: <code className="font-mono">{String(param.schema.default)}</code>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request body */}
          {operation.requestBody && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Request Body</p>
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Content-Type: <code className="font-mono">application/json</code>
                </p>
                <pre className="text-xs font-mono bg-muted/60 rounded p-3 text-muted-foreground">
                  {`{
  "column_name": "value",
  "another_column": 123
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Responses */}
          {operation.responses && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Responses</p>
              <div className="rounded-lg border overflow-hidden divide-y">
                {Object.entries(operation.responses).map(([code, resp]: [string, any]) => (
                  <div key={code} className="flex items-center gap-3 px-3 py-2.5 bg-card">
                    <span
                      className={`text-xs font-bold font-mono min-w-[40px] ${
                        code.startsWith("2")
                          ? "text-emerald-600 dark:text-emerald-400"
                          : code.startsWith("4")
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {code}
                    </span>
                    <span className="text-sm text-muted-foreground">{resp.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/swagger")
      .then((r) => r.json())
      .then((data) => {
        setSpec(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Build a flat list of endpoints grouped by path prefix
  const endpointGroups: Record<string, { method: string; path: string; operation: any }[]> = {}
  if (spec?.paths) {
    for (const [path, methods] of Object.entries(spec.paths as Record<string, any>)) {
      for (const [method, operation] of Object.entries(methods)) {
        const parts = path.split("/").filter(Boolean)
        const group = parts.length >= 2 ? parts[1] : parts[0] ?? "general"
        if (!endpointGroups[group]) endpointGroups[group] = []
        endpointGroups[group].push({ method, path, operation })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold tracking-tight hidden sm:inline">API Generator</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">API Reference</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {spec && (
              <Badge variant="secondary" className="text-xs hidden sm:flex">
                v{spec.info?.version}
              </Badge>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading API documentation…</p>
          </div>
        ) : spec ? (
          <div className="space-y-10">
            {/* Hero */}
            <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-8 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{spec.info?.title}</h1>
                  <p className="text-muted-foreground mt-1 text-sm max-w-xl"
                    dangerouslySetInnerHTML={{ __html: (spec.info?.description ?? "")
                      .replace(/\n/g, "<br/>")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                    OpenAPI {spec.openapi}
                  </Badge>
                  <Badge variant="outline">REST</Badge>
                  <Badge variant="outline">JSON</Badge>
                </div>
              </div>

              {/* Base URL */}
              {spec.servers?.[0] && (
                <div className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Base URL:</span>
                  <code className="font-mono text-foreground bg-muted/60 px-2 py-0.5 rounded text-xs border">
                    {spec.servers[0].url === "/" ? window.location.origin : spec.servers[0].url}
                  </code>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2 flex-wrap">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {spec.paths ? Object.keys(spec.paths).length : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Paths</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {spec.paths
                      ? Object.values(spec.paths as Record<string, any>).reduce(
                          (acc: number, p: any) => acc + Object.keys(p).length,
                          0
                        )
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Endpoints</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">2</p>
                  <p className="text-xs text-muted-foreground">Auth Keys</p>
                </div>
              </div>
            </div>

            {/* Auth info */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Authentication</h2>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-semibold text-sm text-amber-700 dark:text-amber-300">Admin Key</span>
                    <Badge variant="outline" className="text-[10px] ml-auto border-amber-300 text-amber-700 dark:text-amber-400">Full Access</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Required for <strong>POST</strong>, <strong>PUT</strong>, and <strong>DELETE</strong> operations. Keep this key secret.
                  </p>
                  <div className="rounded bg-muted/60 border px-3 py-1.5 font-mono text-xs text-muted-foreground">
                    ?apiKey=<span className="text-amber-600 dark:text-amber-400">your-admin-key</span>
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">Read Key</span>
                    <Badge variant="outline" className="text-[10px] ml-auto border-emerald-300 text-emerald-700 dark:text-emerald-400">Read Only</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use for <strong>GET</strong> requests. Safe to use in public-facing applications and frontends.
                  </p>
                  <div className="rounded bg-muted/60 border px-3 py-1.5 font-mono text-xs text-muted-foreground">
                    ?apiKey=<span className="text-emerald-600 dark:text-emerald-400">your-read-key</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Endpoints */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Endpoints
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {["GET", "POST", "PUT", "DELETE"].map((m) => (
                    <span key={m} className={`px-2 py-0.5 rounded font-mono font-bold border text-[11px] ${METHOD_STYLES[m.toLowerCase()]}`}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {Object.entries(endpointGroups).map(([group, endpoints]) => (
                <div key={group} className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
                    /{group}
                  </p>
                  {endpoints.map(({ method, path, operation }) => (
                    <EndpointCard
                      key={`${method}-${path}`}
                      method={method}
                      path={path}
                      operation={operation}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Back to app */}
            <div className="flex justify-center pt-4 pb-8">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Back to API Generator
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-muted-foreground">Failed to load API specification.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}