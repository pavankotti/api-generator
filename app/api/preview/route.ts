import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/file-parser";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const schema = await parseFile(file);

    return NextResponse.json({
      success: true,
      fileName: schema.fileName,
      tableName: schema.tableName,
      columns: schema.columns,
      rows: schema.allData.slice(0, 500),
      totalRows: schema.allData.length,
    });
  } catch (error) {
    // Circuit Breaker: Return 413 Payload Too Large for row limit breach
    if (error instanceof Error && (error as any).code === "ROW_LIMIT_EXCEEDED") {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message,
          errorCode: "ROW_LIMIT_EXCEEDED",
          rowCount: (error as any).rowCount,
        },
        { status: 413 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to parse file" },
      { status: 500 }
    );
  }
}
