// Portable PostgreSQL for local development, no system install needed.
// Data lives in ./.dev-db (git-ignored). Run with `npm run db` from the repo root.
import EmbeddedPostgres from "embedded-postgres"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

const dataDir = fileURLToPath(new URL("../.dev-db", import.meta.url))
const DB_NAME = "printshop"

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
  // UTF-8 so currency symbols such as the rupee sign can be stored
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
})

const isNew = !existsSync(`${dataDir}/PG_VERSION`)
if (isNew) {
  await pg.initialise()
}
await pg.start()

if (isNew) {
  await pg.createDatabase(DB_NAME)
  console.log(`Created database "${DB_NAME}"`)
}

console.log(
  `PostgreSQL running: postgres://postgres:postgres@localhost:5432/${DB_NAME}`
)

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)
