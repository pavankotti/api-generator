import { type NextRequest, NextResponse } from "next/server"
import { getRecords, getRecordCount, createRecord } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { table: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const table = decodeURIComponent(params.table)
    const records = getRecords(table, limit, offset)
    const total = getRecordCount(table)

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch records" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { table: string } }) {
  try {
    const table = decodeURIComponent(params.table)
    const body = await request.json()

    const record = createRecord(table, body)

    return NextResponse.json(
      {
        success: true,
        message: "Record created successfully",
        data: record,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create record" },
      { status: 500 },
    )
  }
}
