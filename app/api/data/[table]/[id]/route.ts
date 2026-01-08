import { type NextRequest, NextResponse } from "next/server"
import { getRecordById, updateRecord, deleteRecord } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { table: string; id: string } }) {
  try {
    const table = decodeURIComponent(params.table)
    const id = Number.parseInt(params.id)

    const record = getRecordById(table, id)

    if (!record) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch record" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { table: string; id: string } }) {
  try {
    const table = decodeURIComponent(params.table)
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const record = updateRecord(table, id, body)

    return NextResponse.json({
      success: true,
      message: "Record updated successfully",
      data: record,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update record" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { table: string; id: string } }) {
  try {
    const table = decodeURIComponent(params.table)
    const id = Number.parseInt(params.id)

    const deleted = deleteRecord(table, id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to delete record" },
      { status: 500 },
    )
  }
}
