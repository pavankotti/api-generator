import FileUploader from "@/components/upload/file-uploader"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>

          <h1 className="text-3xl font-bold mb-2">
            File Upload & API Generator
          </h1>

          <p className="text-muted-foreground">
            Upload CSV or Excel to instantly get APIs
          </p>
        </div>

        <FileUploader />
      </div>
    </main>
  )
}
