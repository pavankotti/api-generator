"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileIcon, UploadCloud, X, AlertCircle, CheckCircle2, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import ApiDisplay from "@/components/api-display"

type FileWithPreview = {
  file: File
  id: string
}

type ProcessStatus = "idle" | "uploading" | "processing" | "success" | "error"

type ApiEndpoint = {
  method: string
  path: string
  description: string
}

type GeneratedApi = {
  fileName: string
  endpoints: ApiEndpoint[]
  schema: any
  globalApiUrl?: string
}

export default function FileUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [apiGenerationProgress, setApiGenerationProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<ProcessStatus>("idle")
  const [apiStatus, setApiStatus] = useState<ProcessStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [generatedApis, setGeneratedApis] = useState<GeneratedApi[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for only CSV and Excel files
    const filteredFiles = acceptedFiles.filter((file) => {
      const type = file.type
      return (
        type === "text/csv" ||
        type === "application/vnd.ms-excel" ||
        type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    })

    if (filteredFiles.length !== acceptedFiles.length) {
      setError("Some files were rejected. Only CSV and Excel files are allowed.")
    } else {
      setError(null)
    }

    const newFiles = filteredFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2),
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploadStatus("uploading")
    setError(null)
    setGeneratedApis([])

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(uploadInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    try {
      // Create FormData and append files
      const formData = new FormData()
      files.forEach((fileItem) => {
        formData.append("files", fileItem.file)
      })

      // Complete upload progress
      setTimeout(() => {
        clearInterval(uploadInterval)
        setUploadProgress(100)
        setUploadStatus("success")

        // Start API generation
        generateApi(formData)
      }, 2000)
    } catch (err) {
      clearInterval(uploadInterval)
      setError("Failed to upload files. Please try again.")
      setUploadStatus("error")
    }
  }

  const generateApi = async (formData: FormData) => {
    setApiStatus("processing")

    // Simulate API generation progress
    const apiInterval = setInterval(() => {
      setApiGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(apiInterval)
          return 95
        }
        return prev + 2
      })
    }, 100)

    try {
      // Send files to the API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("API generation failed")
      }

      const data = await response.json()

      const apisWithGlobalUrl = data.apis.map((api: any) => ({
        ...api,
        globalApiUrl: api.globalApiUrl,
      }))

      // Complete API generation progress
      clearInterval(apiInterval)
      setApiGenerationProgress(100)
      setApiStatus("success")

      // Set the generated APIs
      setGeneratedApis(apisWithGlobalUrl)
    } catch (err) {
      clearInterval(apiInterval)
      setError("Failed to generate API. Please try again.")
      setApiStatus("error")
    }
  }

  const resetProcess = () => {
    setFiles([])
    setUploadProgress(0)
    setApiGenerationProgress(0)
    setUploadStatus("idle")
    setApiStatus("idle")
    setError(null)
    setGeneratedApis([])
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-1">Drag & drop files here</p>
        <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
        <p className="text-xs text-muted-foreground">Supports CSV, XLS, and XLSX files</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((fileItem) => (
              <Card key={fileItem.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{fileItem.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(fileItem.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(fileItem.id)}
                  disabled={uploadStatus !== "idle"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {uploadStatus !== "idle" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">File Upload</h3>
              {uploadStatus === "success" && (
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Complete
                </span>
              )}
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>

          {apiStatus !== "idle" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">API Generation</h3>
                {apiStatus === "success" && (
                  <span className="text-sm text-green-600 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Complete
                  </span>
                )}
              </div>
              <Progress value={apiGenerationProgress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {generatedApis.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Generated APIs</h2>
          </div>
          <ApiDisplay apis={generatedApis} />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {uploadStatus === "success" && apiStatus === "success" ? (
          <Button onClick={resetProcess}>Start New Process</Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={resetProcess}
              disabled={uploadStatus !== "idle" && uploadStatus !== "error"}
            >
              Reset
            </Button>
            <Button onClick={uploadFiles} disabled={files.length === 0 || uploadStatus !== "idle"}>
              Upload & Generate API
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
