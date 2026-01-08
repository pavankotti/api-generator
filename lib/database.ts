import { Pool } from "pg"
import type { ColumnSchema } from "./file-parser"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

/* ---------------- helpers ---------------- */

function pgType(type: string) {
  if (type === "number") return "DOUBLE PRECISION"
  if (type === "boolean") return "BOOLEAN"
  if (type === "date") return "TIMESTAMP"
  return "TEXT"
}

/* ---------------- schema ---------------- */

export async function createTable(
  table: string,
  columns: ColumnSchema[]
) {
  const cols = columns
    .map(
      (c) =>
        `"${c.name}" ${pgType(c.type)}${c.nullable ? "" : " NOT NULL"}`
    )
    .join(",")

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "${table}" (
      id SERIAL PRIMARY KEY,
      ${cols}
    )
  `)
}

/* ---------------- inserts ---------------- */

export async function insertData(
  table: string,
  rows: Record<string, any>[]
) {
  for (const row of rows) {
    const keys = Object.keys(row)
    if (!keys.length) continue

    const values = Object.values(row)
    const params = keys.map((_, i) => `$${i + 1}`).join(",")

    await pool.query(
      `INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(",")})
       VALUES (${params})`,
      values
    )
  }
}

/* ---------------- reads ---------------- */

export async function getRecords(
  table: string,
  filters: Record<string, any> = {},
  limit = 100,
  offset = 0
) {
  const keys = Object.keys(filters)
  const where = keys.length
    ? "WHERE " + keys.map((k, i) => `"${k}" = $${i + 1}`).join(" AND ")
    : ""

  const values = Object.values(filters)

  const { rows } = await pool.query(
    `
    SELECT *
    FROM "${table}"
    ${where}
    ORDER BY id
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
    `,
    [...values, limit, offset]
  )

  return rows
}

export async function getRecordById(
  table: string,
  id: number
) {
  const { rows } = await pool.query(
    `SELECT * FROM "${table}" WHERE id = $1`,
    [id]
  )
  return rows[0] ?? null
}

/* ---------------- writes ---------------- */

export async function createRecord(
  table: string,
  data: Record<string, any>
) {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const params = keys.map((_, i) => `$${i + 1}`).join(",")

  const { rows } = await pool.query(
    `
    INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(",")})
    VALUES (${params})
    RETURNING *
    `,
    values
  )

  return rows[0]
}

export async function updateRecord(
  table: string,
  id: number,
  data: Record<string, any>
) {
  const keys = Object.keys(data)
  if (!keys.length) return null

  const values = Object.values(data)
  const set = keys.map((k, i) => `"${k}" = $${i + 1}`).join(",")

  const { rows } = await pool.query(
    `
    UPDATE "${table}"
    SET ${set}
    WHERE id = $${keys.length + 1}
    RETURNING *
    `,
    [...values, id]
  )

  return rows[0] ?? null
}

export async function deleteRecord(
  table: string,
  id: number
) {
  const res = await pool.query(
    `DELETE FROM "${table}" WHERE id = $1`,
    [id]
  )
  return res.rowCount === 1
}

/* ---------------- metadata ---------------- */

export async function listTables() {
  const { rows } = await pool.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `)
  return rows.map(r => r.tablename)
}

export async function getTableSchema(table: string) {
  const { rows } = await pool.query(
    `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = $1
    `,
    [table]
  )

  if (!rows.length) return null

  return {
    tableName: table,
    columns: rows.map(c => ({
      name: c.column_name,
      type: c.data_type,
    })),
  }
}
