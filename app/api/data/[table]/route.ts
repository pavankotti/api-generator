import { NextRequest, NextResponse } from "next/server"
import { requireApiKey } from "@/lib/auth"
import {
  getRecords,
  createRecord,
  listTables,
} from "@/lib/database"

export const runtime = "nodejs"

// simple table name validation (basic safety)
async function isValidTable(table: string) {
  const tables = await listTables()
  return tables.includes(table)
}
export async function GET(
  req: NextRequest,
  context: { params: { table: string } }
) {
  const authError = requireApiKey(req)
  if (authError) return authError

  const { table } = await context.params

  const tables = await listTables()
  if (!tables.includes(table)) {
    return NextResponse.json(
      { error: "Invalid table" },
      { status: 404 }
    )
  }

  const { searchParams } = new URL(req.url)

  const limit = Number(searchParams.get("limit") ?? 100)
  const offset = Number(searchParams.get("offset") ?? 0)

  // everything else becomes a filter
  const filters: Record<string, any> = {}

  searchParams.forEach((value, key) => {
    if (key !== "limit" && key !== "offset") {
      filters[key] =
        value === "true" ? true :
        value === "false" ? false :
        isNaN(Number(value)) ? value : Number(value)
    }
  })

  const data = await getRecords(table, filters, limit, offset)
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const { table } = await context.params

  if (!(await isValidTable(table))) {
    return NextResponse.json(
      { error: "Invalid table" },
      { status: 404 }
    )
  }

  const apiKeyError = requireApiKey(req)
  if (apiKeyError) return apiKeyError

  const body = await req.json()
  const record = await createRecord(table, body)

  return NextResponse.json(record, { status: 201 })
}
