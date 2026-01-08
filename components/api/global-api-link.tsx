"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyIcon, CheckIcon, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalApiLinkProps {
  apiUrl: string
  fileName: string
}

export default function GlobalApiLink({ apiUrl, fileName }: GlobalApiLinkProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Global API Access</CardTitle>
        </div>
        <CardDescription>
          Your data from <span className="font-medium">{fileName}</span> is now accessible via this global API URL
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              value={apiUrl}
              readOnly
              className="pr-10 font-mono text-sm bg-muted/50"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className={cn("transition-all", copied && "bg-green-50 text-green-600 border-green-200")}
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use this URL to access your API from any application or service
        </p>
      </CardContent>
    </Card>
  )
}
