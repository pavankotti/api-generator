"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  UploadCloud,
  X,
  AlertCircle,
  Server,
  CopyIcon,
  CheckIcon,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  FileSpreadsheet,
  Zap,
  Key,
  Globe,
  Play,
  FileText,
  TableIcon,
  Link2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import DataTableEditor from "@/components/upload/data-table-editor"
import type { ColumnSchema } from "@/lib/file-parser"

/* ------------------------------------------------------------------ */
/* Types                                                                 */
/* ------------------------------------------------------------------ */

type Stage = "upload" | "preview" | "result"

interface TablePreview {
  id: string
  fileName: string
  tableName: string
  columns: ColumnSchema[]
  rows: Record<string, any>[]
  totalRows: number
}

interface Relationship {
  fromTableId: string
  fromColumn: string
  toTableId: string
  toColumn: string
}

interface GeneratedApi {
  id: string
  fileName: string
  tableName: string
  adminKey: string
  readKey: string
  globalApiUrl: string
  endpoints: { method: string; path: string; description: string }[]
  schema: any
}

/* ------------------------------------------------------------------ */
/* Step indicator                                                        */
/* ------------------------------------------------------------------ */

function Steps({ stage }: { stage: Stage }) {
  const steps = [
    { key: "upload", label: "Upload" },
    { key: "preview", label: "Preview & Link" },
    { key: "result", label: "Your API" },
  ] as const

  const idx = { upload: 0, preview: 1, result: 2 }[stage]

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              i === idx
                ? "bg-primary text-primary-foreground shadow-sm"
                : i < idx
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                i < idx ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {i < idx ? "✓" : i + 1}
            </span>
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
          )}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Method badge colours                                                  */
/* ------------------------------------------------------------------ */

function MethodBadge({ method }: { method: string }) {
  const color: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    POST: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    PUT: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    DELETE: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${color[method] ?? "bg-gray-100 text-gray-700"}`}>
      {method}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Format bytes                                                          */
/* ------------------------------------------------------------------ */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ------------------------------------------------------------------ */
/* Main Component                                                        */
/* ------------------------------------------------------------------ */

export default function FileUploader() {
  const [stage, setStage] = useState<Stage>("upload")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<TablePreview[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [generatedApis, setGeneratedApis] = useState<GeneratedApi[]>([])
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  /* ---- helpers ---- */
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const CopyBtn = ({ text, className = "" }: { text: string; className?: string }) => (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 shrink-0 ${className}`}
            onClick={() => copy(text)}
          >
            {copiedText === text ? (
              <CheckIcon className="h-3 w-3 text-emerald-500" />
            ) : (
              <CopyIcon className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top"><p>Copy</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  /* ---- dropzone ---- */
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted])
      setError(null)
    }
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 5,
  })

  /* ---- stage 1 → 2: preview ---- */
  const handlePreview = async () => {
    if (files.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const results: TablePreview[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/preview", { method: "POST", body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || `Failed to parse ${file.name}`)
        results.push({ ...data, id: Math.random().toString(36).substring(7) })
      }
      
      setPreviews(results)
      if (results.length > 0) setActivePreviewId(results[0].id)
      
      // Auto-infer relationships
      inferRelationships(results)
      
      setStage("preview")
    } catch (e: any) {
      setError(e.message ?? "Failed to parse files")
    } finally {
      setLoading(false)
    }
  }

  const inferRelationships = (allPreviews: TablePreview[]) => {
    const newRels: Relationship[] = []
    allPreviews.forEach(tableA => {
      tableA.columns.forEach(col => {
        if (col.name.endsWith("_id")) {
          const targetTableName = col.name.replace("_id", "").toLowerCase()
          const targetTable = allPreviews.find(t => 
            t.tableName.toLowerCase() === targetTableName || 
            t.tableName.toLowerCase() === targetTableName + "s"
          )
          if (targetTable) {
            newRels.push({
              fromTableId: tableA.id,
              fromColumn: col.name,
              toTableId: targetTable.id,
              toColumn: "id"
            })
          }
        }
      })
    })
    setRelationships(newRels)
  }

  /* ---- stage 2 → 3: generate ---- */
  const handleGenerate = async () => {
    if (previews.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tables: previews,
          relationships: relationships,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setGeneratedApis(data.apis)
      setStage("result")
    } catch (e: any) {
      setError(e.message ?? "Failed to generate APIs")
    } finally {
      setLoading(false)
    }
  }

  /* ---- test api ---- */
  const testApi = async (api: GeneratedApi) => {
    setTesting(true)
    setTestResult(null)
    const url = `${api.globalApiUrl}?apiKey=${api.readKey}`
    try {
      const res = await fetch(url)
      const data = await res.json()
      setTestResult({ status: res.status, data, ok: res.ok, apiId: api.id })
    } catch (e: any) {
      setTestResult({ ok: false, error: e.message, apiId: api.id })
    } finally {
      setTesting(false)
    }
  }

  /* ---- reset ---- */
  const reset = () => {
    setStage("upload")
    setFiles([])
    setPreviews([])
    setRelationships([])
    setGeneratedApis([])
    setError(null)
    setTestResult(null)
  }

  const activePreview = previews.find(p => p.id === activePreviewId)

  /* ================================================================ */
  /* RENDER                                                             */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      <Steps stage={stage} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* STAGE 1: UPLOAD */}
      {stage === "upload" && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.01] shadow-lg"
                : files.length > 0
                ? "border-primary/60 bg-primary/3"
                : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/20"
            }`}
            style={{ minHeight: "260px" }}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center gap-4 py-14 px-6 text-center">
              <div className="relative">
                <div className={`flex items-center justify-center h-16 w-16 rounded-2xl border-2 transition-all duration-200 ${
                  isDragActive ? "bg-primary/15 border-primary scale-110" : "bg-muted/60 border-muted-foreground/20"
                }`}>
                  <UploadCloud className={`h-8 w-8 transition-colors duration-200 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {isDragActive ? "Drop your files here" : "Drag & drop spreadsheets here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload multiple files to link them (e.g. Orders & Customers)
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-card">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[150px]">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatBytes(f.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFile(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end">
            <Button
              size="default"
              onClick={handlePreview}
              disabled={files.length === 0 || loading}
              className="gap-2"
            >
              {loading ? "Parsing..." : `Preview Data (${files.length} ${files.length === 1 ? 'file' : 'files'})`}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 2: PREVIEW & LINK */}
      {stage === "preview" && activePreview && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {previews.map(p => (
              <Button
                key={p.id}
                variant={activePreviewId === p.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePreviewId(p.id)}
                className="gap-2"
              >
                <TableIcon className="h-3.5 w-3.5" />
                {p.fileName}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  {activePreview.tableName}
                </CardTitle>
                <CardDescription>Review and edit data for this table</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
                <Button size="sm" onClick={handleGenerate} disabled={loading} className="gap-2">
                  {loading ? "Generating..." : <><Zap className="h-4 w-4" /> Generate APIs</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {relationships.filter(r => r.fromTableId === activePreview.id).length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5" /> Inferred Relationships
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relationships.filter(r => r.fromTableId === activePreview.id).map((r, i) => {
                      const target = previews.find(p => p.id === r.toTableId)
                      return (
                        <Badge key={i} variant="secondary" className="gap-1.5 py-1 px-2">
                          <code className="text-[10px]">{r.fromColumn}</code>
                          <ChevronRight className="h-3 w-3 opacity-50" />
                          <span className="font-semibold">{target?.tableName}</span>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
              <DataTableEditor
                columns={activePreview.columns}
                rows={activePreview.rows}
                totalRows={activePreview.totalRows}
                onRowsChange={(rows) => {
                  setPreviews(prev => prev.map(p => p.id === activePreview.id ? { ...p, rows } : p))
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* STAGE 3: RESULT */}
      {stage === "result" && generatedApis.length > 0 && (
        <div className="space-y-6">
          <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900">
            <CheckIcon className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
              Successfully generated {generatedApis.length} live APIs.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {generatedApis.map((api) => (
              <Card key={api.id}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{api.tableName}</CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input readOnly value={`${api.globalApiUrl}?apiKey=${api.readKey}`} className="font-mono text-xs bg-muted/50" />
                    <CopyBtn text={`${api.globalApiUrl}?apiKey=${api.readKey}`} />
                  </div>
                  <Button onClick={() => testApi(api)} disabled={testing} variant="secondary" className="w-full gap-2">
                    {testing && testResult?.apiId === api.id ? "Testing..." : "Test API"}
                  </Button>
                  {testResult && testResult.apiId === api.id && (
                    <div className="rounded-lg border bg-muted/30 overflow-hidden">
                      <pre className="text-[10px] p-3 overflow-auto max-h-32 font-mono">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={reset} variant="outline" className="rounded-xl">
              Start New Project
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
