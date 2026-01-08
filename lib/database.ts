import type { ColumnSchema } from "./file-parser"

interface StoredRecord extends Record<string, any> {
  id: number
}

// In-memory database storage
const databases: Map<string, StoredRecord[]> = new Map()
let globalIdCounter = 1

// Reset database
export function resetDatabase() {
  databases.clear()
  globalIdCounter = 1
}

// Convert schema type to display type
function getSqlType(columnType: string): string {
  switch (columnType) {
    case "number":
      return "number"
    case "boolean":
      return "boolean"
    case "date":
      return "date"
    case "string":
    default:
      return "string"
  }
}

// Create table dynamically
export function createTable(tableName: string, columns: ColumnSchema[]): void {
  if (!databases.has(tableName)) {
    databases.set(tableName, [])
  }
}

// Insert data into table
export function insertData(tableName: string, rows: Record<string, any>[]): void {
  if (!databases.has(tableName)) {
    databases.set(tableName, [])
  }

  const tableData = databases.get(tableName)!
  rows.forEach((row) => {
    const record: StoredRecord = {
      ...row,
      id: globalIdCounter++,
    }
    tableData.push(record)
  })
}

// Get all records from table
export function getRecords(tableName: string, limit = 100, offset = 0): Record<string, any>[] {
  const tableData = databases.get(tableName) || []
  return tableData.slice(offset, offset + limit)
}

// Get single record by ID
export function getRecordById(tableName: string, id: number): Record<string, any> | null {
  const tableData = databases.get(tableName) || []
  return tableData.find((r) => r.id === id) || null
}

// Create record
export function createRecord(tableName: string, data: Record<string, any>): Record<string, any> {
  if (!databases.has(tableName)) {
    databases.set(tableName, [])
  }

  const tableData = databases.get(tableName)!
  const record: StoredRecord = {
    ...data,
    id: globalIdCounter++,
  }
  tableData.push(record)
  return record
}

// Update record
export function updateRecord(tableName: string, id: number, data: Record<string, any>): Record<string, any> {
  const tableData = databases.get(tableName) || []
  const index = tableData.findIndex((r) => r.id === id)

  if (index === -1) {
    return {}
  }

  const updated = { ...tableData[index], ...data, id }
  tableData[index] = updated
  return updated
}

// Delete record
export function deleteRecord(tableName: string, id: number): boolean {
  const tableData = databases.get(tableName) || []
  const index = tableData.findIndex((r) => r.id === id)

  if (index === -1) {
    return false
  }

  tableData.splice(index, 1)
  return true
}

// Get table count
export function getRecordCount(tableName: string): number {
  return databases.get(tableName)?.length || 0
}

// List all tables
export function listTables(): string[] {
  return Array.from(databases.keys())
}

// Get table schema
export function getTableSchema(tableName: string) {
  const records = databases.get(tableName) || []
  if (records.length === 0) return null

  const firstRecord = records[0]
  return {
    tableName,
    columns: Object.keys(firstRecord).map((key) => ({
      name: key,
      type: typeof firstRecord[key],
    })),
  }
}
