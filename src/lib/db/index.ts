import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database client (Postgres on Railway, via postgres.js + Drizzle).
 *
 * Runs on Firebase App Hosting (Cloud Run) — many short-lived instances that
 * scale to zero. Each instance keeps a SMALL pool so we don't exhaust Postgres
 * connections when several instances are warm. For higher scale, put a pooler
 * (PgBouncer) in front and point DATABASE_URL at it.
 *
 * Initialization is LAZY: the pool is created on first query, never at import.
 * Next.js imports route modules at build time with no DATABASE_URL set, so an
 * eager connection would break the build. The instance is cached on globalThis
 * so dev hot-reloads and warm instances reuse one pool.
 */
type Db = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __summitSql?: ReturnType<typeof postgres>;
  __summitDb?: Db;
};

function initDb(): Db {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Set it locally (shell/.env) for migrations, and as an App Hosting secret for runtime.",
    );
  }
  const sql =
    globalForDb.__summitSql ??
    postgres(connectionString, {
      max: 3, // small per-instance pool; raise only behind a pooler
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, // safe when a pooler may sit in front
    });
  const instance = drizzle(sql, { schema });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__summitSql = sql;
    globalForDb.__summitDb = instance;
  }
  return instance;
}

/**
 * Lazy proxy: the first property access (e.g. `db.select`) initializes the real
 * Drizzle instance. Use it exactly like a normal Drizzle db.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = globalForDb.__summitDb ?? initDb();
    return Reflect.get(instance, prop, receiver);
  },
});

export { schema };
