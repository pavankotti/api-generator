"use client"

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header matching your main application */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs font-mono">API</span>
             </div>
             <h1 className="font-bold text-xl tracking-tight">API Documentation</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        {/* Card wrapper to maintain consistent spacing */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <SwaggerUI 
            url="/api/swagger"
            docExpansion="list" 
            defaultModelsExpandDepth={-1} // Hides the bottom Schemas section
            persistAuthorization={true} 
          />
        </div>
      </main>
    </div>
  )
}