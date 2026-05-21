import { NextRequest, NextResponse } from "next/server";
import { createTable, insertData, saveApiMetadata, RelationshipSchema } from "@/lib/database";
import { v4 as uuidv4 } from "uuid";
import type { ColumnSchema } from "@/lib/file-parser";

export const runtime = "nodejs";

const generateKey = (prefix: string) => `${prefix}_${uuidv4().replace(/-/g, "")}`;

export async function POST(request: NextRequest) {
  try {
    const { tables, relationships } = await request.json();

    if (!tables || !Array.isArray(tables)) {
      return NextResponse.json({ success: false, message: "Invalid tables data" }, { status: 400 });
    }

    // 1. Assign real table names first so we can map relationships
    const tableMapping = tables.map((t: any) => {
      const cleanName = t.fileName.split(".")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
      const uniqueId = uuidv4().split("-")[0];
      return {
        ...t,
        tempId: t.id,
        realTableName: `user_${cleanName}_${uniqueId}`,
      };
    });

    // 2. Sort tables so that parents (tables being referenced) are created first
    // Simple heuristic: if a table is referenced by another, move it to the front
    const sortedTables = [...tableMapping].sort((a, b) => {
      const aIsReferencedByB = relationships?.some((r: any) => r.toTableId === a.tempId && r.fromTableId === b.tempId);
      const bIsReferencedByA = relationships?.some((r: any) => r.toTableId === b.tempId && r.fromTableId === a.tempId);
      
      if (aIsReferencedByB) return -1;
      if (bIsReferencedByA) return 1;
      return 0;
    });

    const results = [];

    // 3. Create tables in sorted order
    for (const table of sortedTables) {
      const adminKey = generateKey("sk");
      const readKey = generateKey("pk");

      // Map frontend relationships to real backend table names
      const tableRels: RelationshipSchema[] = (relationships || [])
        .filter((r: any) => r.fromTableId === table.tempId)
        .map((r: any) => {
          const targetTable = tableMapping.find((t: any) => t.tempId === r.toTableId);
          return {
            fromColumn: r.fromColumn,
            toTable: targetTable?.realTableName || r.toTableId,
            toColumn: r.toColumn,
          };
        });

      await createTable(table.realTableName, table.columns, tableRels);

      if (table.rows.length > 0) {
        await insertData(table.realTableName, table.rows);
      }

      await saveApiMetadata({
        id: uuidv4(),
        originalName: table.fileName,
        tableName: table.realTableName,
        adminKey,
        readKey,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
      const apiPath = `/api/data/${table.realTableName}`;

      results.push({
        id: table.tempId,
        fileName: table.fileName,
        tableName: table.realTableName,
        adminKey,
        readKey,
        globalApiUrl: `${baseUrl}${apiPath}`,
        endpoints: [
          { method: "GET", path: `${apiPath}?apiKey=${readKey}`, description: "Retrieve all records" },
          { method: "POST", path: `${apiPath}?apiKey=${adminKey}`, description: "Create record" },
        ],
        schema: table.columns,
      });
    }

    return NextResponse.json({
      success: true,
      apis: results,
    });
  } catch (error) {
    console.error("Batch Generate error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Batch Failed" },
      { status: 500 }
    );
  }
}
