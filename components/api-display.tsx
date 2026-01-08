"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import GlobalApiLink from "@/components/global-api-link"

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

interface ApiDisplayProps {
  apis: GeneratedApi[]
}

export default function ApiDisplay({ apis }: ApiDisplayProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(text)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200"
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Tabs defaultValue={apis[0]?.fileName}>
      <TabsList className="mb-4 w-full max-w-full overflow-x-auto flex-nowrap">
        {apis.map((api) => (
          <TabsTrigger key={api.fileName} value={api.fileName} className="whitespace-nowrap">
            {api.fileName}
          </TabsTrigger>
        ))}
      </TabsList>

      {apis.map((api) => (
        <TabsContent key={api.fileName} value={api.fileName} className="space-y-4">
          {api.globalApiUrl && <GlobalApiLink apiUrl={api.globalApiUrl} fileName={api.fileName} />}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints for {api.fileName}</CardTitle>
              <CardDescription>
                The following REST API endpoints have been generated based on your file structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {api.endpoints.map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getMethodColor(endpoint.method)} font-mono`}>{endpoint.method}</Badge>
                        <code className="text-sm bg-muted p-1 rounded">{endpoint.path}</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.path)}
                        className="h-8 px-2"
                      >
                        {copiedEndpoint === endpoint.path ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Definition</CardTitle>
              <CardDescription>The following schema has been inferred from your data</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(api.schema, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
