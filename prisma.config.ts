import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (() => {
      const url = process.env.DATABASE_URL;
      const isGenerate = process.argv.includes("generate");
      if (!url && !isGenerate) {
        throw new Error(
          "Missing DATABASE_URL. Set DATABASE_URL to run Prisma commands that connect to your database.",
        );
      }
      return url ?? "";
    })(),
  },
});
