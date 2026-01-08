import { type NextRequest, NextResponse } from "next/server"
import { parseFile } from "@/lib/file-parser"
import { createTable, insertData } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files provided" }, { status: 400 })
    }

    const generatedApis = []

    // Process each file
    for (const file of files) {
      // Parse the file to infer schema
      const schema = await parseFile(file)

      // Create table in database
      createTable(schema.tableName, schema.columns)

      // Insert sample data
      if (schema.sampleData.length > 0) {
        insertData(schema.tableName, schema.sampleData)
      }

      // Generate API endpoints based on the schema
      const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
      const tableName = schema.tableName

      const api = {
        fileName: file.name,
        tableName: schema.tableName,
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
            description: `Retrieve a single record from ${file.name} by ID`,
          },
          {
            method: "POST",
            path: `/api/data/${tableName}`,
            description: `Create a new record in ${file.name}`,
          },
          {
            method: "PUT",
            path: `/api/data/${tableName}/{id}`,
            description: `Update a record in ${file.name} by ID`,
          },
          {
            method: "DELETE",
            path: `/api/data/${tableName}/{id}`,
            description: `Delete a record from ${file.name} by ID`,
          },
        ],
        schema: {
          type: "object",
          properties: schema.columns.reduce(
            (acc, col) => {
              acc[col.name] = {
                type: col.type,
                nullable: col.nullable,
              }
              return acc
            },
            {} as Record<string, any>,
          ),
          required: schema.columns.filter((col) => !col.nullable).map((col) => col.name),
        },
      }

      generatedApis.push(api)
    }

    return NextResponse.json({
      success: true,
      message: "Files processed and APIs generated successfully",
      apis: generatedApis,
    })
  } catch (error) {
    console.error("Error processing upload:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process files",
      },
      { status: 500 },
    )
  }
}
