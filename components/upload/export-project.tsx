"use client"

import { useState } from "react"
import JSZip from "jszip"
import { Download, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ColumnSchema } from "@/lib/file-parser"

interface GeneratedApi {
  tableName: string
  columns: ColumnSchema[]
  rows: any[]
  fileName: string
  adminKey: string // ADDED
  readKey: string  // ADDED
}

export default function ExportProject({ api }: { api: GeneratedApi }) {
  const [isExporting, setIsExporting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const generatePrismaSchema = (): string => {
    const prismaTypes: Record<string, string> = {
      string: "String",
      number: "Int",
      boolean: "Boolean",
      date: "DateTime",
    }

    const fields = api.columns
      .map((col) => {
        const type = prismaTypes[col.type] || "String"
        const nullable = col.nullable ? "?" : ""
        return `  ${col.name} ${type}${nullable}`
      })
      .join("\n")

    return `// This schema was auto-generated from your CSV upload
// Adjust as needed for your application

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model ${api.tableName} {
  id        Int     @id @default(autoincrement())
${fields ? `${fields}\n` : ""}  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`
  }

  const generateDataJson = (): string => {
    return JSON.stringify(api.rows, null, 2)
  }

  const generateSeedScript = (): string => {
    const columnDefinitions = JSON.stringify(api.columns, null, 2)

    return `const { PrismaClient } = require("@prisma/client");
const data = require("./data.json");

const prisma = new PrismaClient();
const modelName = "${api.tableName}";
const columns = ${columnDefinitions};

function normalizeValue(value, column) {
  if (value === null || value === undefined || value === "") {
    return column.nullable ? null : value;
  }

  switch (column.type) {
    case "number": {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    case "boolean": {
      if (typeof value === "boolean") return value;
      const normalized = String(value).toLowerCase();
      return normalized === "true" || normalized === "1" || normalized === "yes";
    }
    case "date": {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : date;
    }
    default:
      return value;
  }
}

function normalizeRecord(record) {
  const normalized = {};

  for (const column of columns) {
    normalized[column.name] = normalizeValue(record[column.name], column);
  }

  return normalized;
}

async function main() {
  console.log("🌱 Seeding database...");
  for (const record of data) {
    const normalizedRecord = normalizeRecord(record);
    const idValue = normalizedRecord.id;

    if (idValue !== null && idValue !== undefined && idValue !== "" && !Number.isNaN(Number(idValue))) {
      const numericId = Number(idValue);

      await prisma[modelName].upsert({
        where: { id: numericId },
        update: normalizedRecord,
        create: normalizedRecord,
      });
      continue;
    }

    await prisma[modelName].create({
      data: normalizedRecord,
    });
  }
  console.log("✅ Seeding complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`
  }

  const generateExpressServer = (): string => {
    return `const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const TABLE_NAME = "${api.tableName}";
const ADMIN_KEY = process.env.ADMIN_API_KEY;
const READ_KEY = process.env.READ_API_KEY;

// Middleware to validate API keys
const validateApiKey = (requiredKey) => (req, res, next) => {
  const providedKey = req.query.apiKey || req.headers["x-api-key"];
  if (!providedKey || providedKey !== requiredKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// GET all records
app.get("/api/data/:table", validateApiKey(READ_KEY), async (req, res) => {
  try {
    const records = await prisma[TABLE_NAME].findMany();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single record
app.get("/api/data/:table/:id", validateApiKey(READ_KEY), async (req, res) => {
  try {
    const record = await prisma[TABLE_NAME].findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create record
app.post("/api/data/:table", validateApiKey(ADMIN_KEY), async (req, res) => {
  try {
    const record = await prisma[TABLE_NAME].create({ data: req.body });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update record
app.put("/api/data/:table/:id", validateApiKey(ADMIN_KEY), async (req, res) => {
  try {
    const record = await prisma[TABLE_NAME].update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE record
app.delete("/api/data/:table/:id", validateApiKey(ADMIN_KEY), async (req, res) => {
  try {
    await prisma[TABLE_NAME].delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});

process.on("SIGTERM", async () => {
  await prisma.\$disconnect();
  process.exit(0);
});
`
  }

  const generatePackageJson = (): string => {
    return JSON.stringify(
      {
        name: `${api.tableName}-server`,
        version: "1.0.0",
        description: `Express server for ${api.fileName}`,
        main: "index.js",
        scripts: {
          start: "node index.js",
          dev: "nodemon index.js",
        },
        prisma: {
          seed: "node prisma/seed.js",
        },
        dependencies: {
          express: "^4.18.2",
          cors: "^2.8.5",
          "@prisma/client": "^6.2.1",
          dotenv: "^16.3.1"
        },
        devDependencies: {
          nodemon: "^3.0.1",
          prisma: "^6.2.1"
        },
      },
      null,
      2
    )
  }

  const generateEnvExample = (): string => {
    return `DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
ADMIN_API_KEY="${api.adminKey}"
READ_API_KEY="${api.readKey}"
PORT=3001
`
  }

  const generateReadme = (): string => {
    return `# ${api.tableName} - Express Server

This is an auto-generated, self-hosted Express.js server for your \`${api.fileName}\` dataset.

## Step-by-Step Setup Guide

### 1. Install Dependencies
First, install the required packages:
\`\`\`bash
npm install
\`\`\`

### 2. Get a Database Connection String
You need a PostgreSQL database to host your data. We recommend using Neon (it's free and serverless):
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project.
3. On your dashboard, copy the **Connection String** (it starts with \`postgresql://...\`).

### 3. Configure your Environment Variables
1. Rename the provided \`.env.example\` file to \`.env\`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
2. Open the \`.env\` file in your code editor.
3. Replace the placeholder \`DATABASE_URL\` with the connection string you copied from Neon.
*(Note: Your Admin and Read API keys are already pre-filled for you!)*

### 4. Build the Database & Seed Your Data
Run the following command. Prisma will automatically build your tables in the cloud and securely upload your original Excel data from \`prisma/data.json\`.
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 5. Start Your Server
\`\`\`bash
npm run dev
\`\`\`
Your API is now live at **http://localhost:3001**!

---

## API Endpoints Reference

Test these endpoints in your browser or Postman.

**Read Data (Safe for public frontends):**
- \`GET /api/data/${api.tableName}?apiKey=${api.readKey}\` - Get all records
- \`GET /api/data/${api.tableName}/:id?apiKey=${api.readKey}\` - Get single record

**Modify Data (Keep this key secret):**
- \`POST /api/data/${api.tableName}?apiKey=${api.adminKey}\` - Create record
- \`PUT /api/data/${api.tableName}/:id?apiKey=${api.adminKey}\` - Update record
- \`DELETE /api/data/${api.tableName}/:id?apiKey=${api.adminKey}\` - Delete record
`
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()

      const rootDir = zip.folder("express-server")
      const prismaDir = rootDir?.folder("prisma")

      rootDir?.file("index.js", generateExpressServer())
      rootDir?.file("package.json", generatePackageJson())
      rootDir?.file(".env.example", generateEnvExample())
      rootDir?.file("README.md", generateReadme())
      prismaDir?.file("schema.prisma", generatePrismaSchema())
      prismaDir?.file("seed.js", generateSeedScript())
      prismaDir?.file("data.json", generateDataJson())

      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${api.tableName}-export.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setIsComplete(true)
      setTimeout(() => setIsComplete(false), 3000)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export project")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          Export Project
        </CardTitle>
        <CardDescription>
          Download a complete Express.js boilerplate with Prisma schema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-1">
            <p className="font-medium text-foreground">📦 Includes:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>Express.js boilerplate server</li>
              <li>Auto-generated Prisma schema</li>
              <li>API authentication with keys</li>
              <li>Ready-to-use package.json</li>
              <li>.env template & README</li>
            </ul>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting || isComplete}
            className="w-full mt-4"
            variant={isComplete ? "outline" : "default"}
          >
            {isComplete ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                Downloaded!
              </>
            ) : isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download .zip
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}