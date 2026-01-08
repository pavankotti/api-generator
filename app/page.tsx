import FileUploader from "@/components/file-uploader"
import type { Metadata } from "next"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "File Upload & API Generator",
  description: "Upload CSV and Excel files to generate APIs",
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">File Upload & API Generator</h1>
          <p className="text-muted-foreground">Upload CSV and Excel files to generate APIs based on your data</p>
        </div>

        <FileUploader />
      </div>
    </main>
  )
}
