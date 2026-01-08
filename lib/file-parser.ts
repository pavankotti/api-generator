import { read, utils } from "xlsx"

export interface ColumnSchema {
  name: string
  type: "string" | "number" | "boolean" | "date"
  nullable: boolean
}

export interface DataSchema {
  tableName: string
  columns: ColumnSchema[]
  sampleData: Record<string, any>[]
}

// Detect data type from values
function detectType(value: any): "string" | "number" | "boolean" | "date" {
  if (value === null || value === undefined || value === "") {
    return "string"
  }

  // Check for boolean
  if (typeof value === "boolean" || value === "true" || value === "false") {
    return "boolean"
  }

  // Check for number
  if (!isNaN(value) && !isNaN(Number.parseFloat(value))) {
    return "number"
  }

  // Check for date (ISO 8601 or common formats)
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}/, // MM-DD-YYYY
  ]
  if (datePatterns.some((pattern) => pattern.test(String(value)))) {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return "date"
    }
  }

  return "string"
}

// Infer schema from data
function inferSchema(data: Record<string, any>[]): ColumnSchema[] {
  if (data.length === 0) {
    return []
  }

  const columns = Object.keys(data[0])

  return columns.map((columnName) => {
    const types = new Set<string>()
    let nullCount = 0

    data.forEach((row) => {
      const value = row[columnName]
      if (value === null || value === undefined || value === "") {
        nullCount++
      } else {
        types.add(detectType(value))
      }
    })

    // Determine dominant type
    const dominantType = types.has("number")
      ? "number"
      : types.has("date")
        ? "date"
        : types.has("boolean")
          ? "boolean"
          : "string"

    return {
      name: columnName,
      type: dominantType as any,
      nullable: nullCount > 0,
    }
  })
}

// Parse CSV file
function parseCSV(content: string): Record<string, any>[] {
  const lines = content.split("\n").filter((line) => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim())
  const data: Record<string, any>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || null
    })

    data.push(row)
  }

  return data
}

// Parse Excel file
async function parseExcel(buffer: ArrayBuffer): Promise<Record<string, any>[]> {
  const workbook = read(buffer, { type: "array" })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]

  if (!worksheet) {
    return []
  }

  return utils.sheet_to_json(worksheet)
}

// Main parser function
export async function parseFile(file: File): Promise<DataSchema> {
  const buffer = await file.arrayBuffer()
  let data: Record<string, any>[] = []

  if (file.type === "text/csv") {
    const text = new TextDecoder().decode(buffer)
    data = parseCSV(text)
  } else if (
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    data = await parseExcel(buffer)
  }

  const tableName = file.name.split(".")[0].toLowerCase().replace(/\s+/g, "_")
  const columns = inferSchema(data)
  const sampleData = data.slice(0, 5) // Keep first 5 rows as sample

  return {
    tableName,
    columns,
    sampleData,
  }
}
