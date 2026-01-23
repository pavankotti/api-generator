import { NextRequest, NextResponse } from "next/server"
import { parseFile } from "@/lib/file-parser"
import { createTable, insertData } from "@/lib/database"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      )
    }

    const generatedApis: any[] = []

    // process files one by one (important for DB consistency)
    for (const file of files) {
      // 1 parse excel / csv → schema
      const schema = await parseFile(file)

      // 2 create table (REAL DB CALL)
      await createTable(schema.tableName, schema.columns)

      // 3 insert sample data
      if (schema.sampleData.length > 0) {
        await insertData(schema.tableName, schema.sampleData)
      }

      // 4 build public API metadata
      const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
      const tableName = schema.tableName

      generatedApis.push({
        fileName: file.name,
        tableName,
        globalApiUrl: `${baseUrl}/api/data/${tableName}`,
        endpoints: [
          {
            method: "GET",
            path: `/api/data/${tableName}`,
            description: `Retrieve all records from ${file.name}`,
          },
          {
            method: "GET",
            path: `/api/data/${tableName}/{id}`,
            description: `Retrieve a single record by ID`,
          },
          {
            method: "POST",
            path: `/api/data/${tableName}`,
            description: `Create a new record`,
          },
          {
            method: "PUT",
            path: `/api/data/${tableName}/{id}`,
            description: `Update a record by ID`,
          },
          {
            method: "DELETE",
            path: `/api/data/${tableName}/{id}`,
            description: `Delete a record by ID`,
          },
        ],
        schema: {
          type: "object",
          properties: schema.columns.reduce((acc, col) => {
            acc[col.name] = {
              type: col.type,
              nullable: col.nullable,
            }
            return acc
          }, {} as Record<string, any>),
          required: schema.columns
            .filter((col) => !col.nullable)
            .map((col) => col.name),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Files processed and APIs generated successfully",
      apis: generatedApis,
    })
  } catch (error) {
    console.error("Upload error:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process uploaded files",
      },
      { status: 500 }
    )
  }
}
