export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Instant API Generator",
    description: "Upload CSV/Excel and get instant REST APIs",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    "/api/data/{table}": {
      get: {
        summary: "Get all records",
        parameters: [
          {
            name: "table",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "List of records" },
        },
      },
      post: {
        summary: "Create a record",
        parameters: [
          {
            name: "table",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          201: { description: "Created record" },
        },
      },
    },
    "/api/data/{table}/{id}": {
      get: {
        summary: "Get record by ID",
        parameters: [
          { name: "table", in: "path", required: true },
          { name: "id", in: "path", required: true },
        ],
        responses: {
          200: { description: "Single record" },
          404: { description: "Not found" },
        },
      },
      put: {
        summary: "Update record",
        parameters: [
          { name: "table", in: "path", required: true },
          { name: "id", in: "path", required: true },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Updated record" },
        },
      },
      delete: {
        summary: "Delete record",
        parameters: [
          { name: "table", in: "path", required: true },
          { name: "id", in: "path", required: true },
        ],
        responses: {
          200: { description: "Deleted" },
        },
      },
    },
  },
}
