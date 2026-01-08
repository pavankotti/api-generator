"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, AlertCircle, Server, CopyIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ApiDisplay from "@/components/api/api-display"

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedApis, setGeneratedApis] = useState<any[]>([])
  const [apiKey, setApiKey] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("api_key") || ""
      : ""
  )
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)


  const updateApiKey = (value: string) => {
    setApiKey(value)
    localStorage.setItem("api_key", value)
  }

  // drop handler
  const onDrop = (acceptedFiles: File[]) => {
    setError(null)
    setFiles((prev) => [...prev, ...acceptedFiles])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const uploadAndGenerate = async () => {

    if (!files.length) return

    if (!apiKey) {
      setError("API key is required")
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedApis([])

    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
        body: formData,
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      setGeneratedApis(data.apis)
    } catch {
      setError("Failed to generate APIs")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFiles([])
    setGeneratedApis([])
    setError(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(text)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => updateApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <strong className="font-medium">demo api key:</strong>
          <div className="flex items-center rounded-md border bg-muted/50 pl-2.5 pr-1 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <span>demo-api-key-123</span>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard("demo-api-key-123")}
                    className="ml-1.5 h-6 w-6 hover:bg-background shadow-none"
                  >
                    {copiedEndpoint === "demo-api-key-123" ? (
                      <CheckIcon className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <CopyIcon className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy API Key</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          use this key in the
          <code className="mx-1 px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">x-api-key</code>
          header or in
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            api docs (swagger)
          </a>
        </p>
      </div>



      {/* dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-medium">Drag & Drop files here</p>
        <p className="text-sm text-muted-foreground">CSV / XLSX supported</p>
      </div>

      {/* file list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.name} className="p-3 flex justify-between items-center">
              <span className="text-sm">{file.name}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFile(file.name)}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={reset} disabled={loading}>
          Reset
        </Button>
        <Button onClick={uploadAndGenerate} disabled={loading || !files.length}>
          {loading ? "Generating..." : "Upload & Generate"}
        </Button>
      </div>

      {/* api result */}
      {generatedApis.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5" />
            <h2 className="text-xl font-bold">Generated APIs</h2>
          </div>
          <ApiDisplay apis={generatedApis} />
        </div>
      )}
    </div>
  )
}
