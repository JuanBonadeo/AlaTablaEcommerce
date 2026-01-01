import { defineConfig } from "@prisma/config";

// Datasource URL is now managed here (Prisma 7+ requirement)
export default defineConfig({
  schema: "src/db/schema.prisma",
  datasources: {
    db: {
      provider: "postgresql",
      url: { fromEnvVar: "DATABASE_URL" },
    },
  },
});
