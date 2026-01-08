import { NextRequest, NextResponse } from "next/server"
import { requireApiKey } from "@/lib/auth"
import {
  getRecordById,
  updateRecord,
  deleteRecord,
  listTables,
} from "@/lib/database"

export const runtime = "nodejs"

async function isValidTable(table: string) {
  const tables = await listTables()
  return tables.includes(table)
}

export async function GET(
  req: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  const { table, id } = params

  if (!(await isValidTable(table))) {
    return NextResponse.json(
      { error: "Invalid table" },
      { status: 404 }
    )
  }

  const apiKeyError = requireApiKey(req)
  if (apiKeyError) return apiKeyError

  const record = await getRecordById(table, Number(id))

  if (!record) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(record)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  const { table, id } = params

  if (!(await isValidTable(table))) {
    return NextResponse.json(
      { error: "Invalid table" },
      { status: 404 }
    )
  }

  const apiKeyError = requireApiKey(req)
  if (apiKeyError) return apiKeyError

  const body = await req.json()
  const updated = await updateRecord(table, Number(id), body)

  if (!updated) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  const { table, id } = params

  if (!(await isValidTable(table))) {
    return NextResponse.json(
      { error: "Invalid table" },
      { status: 404 }
    )
  }

  const apiKeyError = requireApiKey(req)
  if (apiKeyError) return apiKeyError

  const success = await deleteRecord(table, Number(id))

  if (!success) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
