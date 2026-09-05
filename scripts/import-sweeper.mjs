// One-shot importer: copies the standalone Lead Finder's SQLite data
// (D:\sweeper\data\lead-finder.db) into the CRM's Postgres tables.
//
//   sqlite `leads`  -> `prospects`        (new uuids; ON CONFLICT (dedupe_key) DO NOTHING)
//   sqlite `sweeps` -> `prospect_sweeps`  (source uuids reused; ON CONFLICT (id) DO NOTHING)
//
// Idempotent: rerunning inserts nothing new — prospects dedupe on dedupe_key,
// sweeps keep their original ids so a replayed row conflicts on the pk.
//
// Usage:  node scripts/import-sweeper.mjs [--db <sqlite path>] [--dry]
//   --db   override the source SQLite file (default D:/sweeper/data/lead-finder.db)
//   --dry  read + map + print counts only; never connects to Postgres
//
// better-sqlite3 lives only in the sweeper repo and postgres only in this one,
// so each is loaded from its own node_modules via createRequire.

import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import fs from "node:fs";

const require = createRequire(import.meta.url);

const SWEEPER_DB_DEFAULT = "D:/sweeper/data/lead-finder.db";
const SWEEPER_MODULES = "D:/sweeper/node_modules";
const CRM_ROOT = "D:/summitautomates";
const BATCH_SIZE = 100;

// --- CLI args --------------------------------------------------------------
const argv = process.argv.slice(2);
const dry = argv.includes("--dry");
const dbFlag = argv.indexOf("--db");
const sqlitePath = dbFlag !== -1 ? argv[dbFlag + 1] : SWEEPER_DB_DEFAULT;
if (dbFlag !== -1 && !sqlitePath) {
  console.error("--db requires a path argument");
  process.exit(1);
}

// --- DATABASE_URL from the CRM's .env.local (strip surrounding quotes) -----
function readDatabaseUrl() {
  const envText = fs.readFileSync(`${CRM_ROOT}/.env.local`, "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

// --- Source rows -----------------------------------------------------------
// The sweeper seeds a fresh dev database with 24 fabricated sample leads
// (SEED_LEADS in D:\sweeper\src\server\repos\memory.ts). They are demo data,
// not real businesses — never import them.
const SEED_NAMES = new Set([
  "BrightSmile Dental Center", "Pearl Dental Clinic", "Marina Smiles Dental",
  "IronWorks Fitness Hub", "Peak Performance Gym", "Riverside CrossFit",
  "Citadel Strength & Conditioning", "Hartwell & Associates LLP",
  "Brennan Legal Group", "Coastline Injury Attorneys", "Sterling Tax Law Office",
  "Flat White Lane", "Harbour Roasters", "The Daily Grind", "Roastery No. 7",
  "Maple Leaf Plumbing Co.", "Rapid Flow Plumbing", "Northern Drain Experts",
  "Hauptstadt Immobilien", "Isar Property Partners", "Rheinblick Estates",
  "Quartz Dental Studio", "Summit Legal Advisors", "Adler Immobilien Hamburg",
]);

function readSource() {
  const Database = require(`${SWEEPER_MODULES}/better-sqlite3`);
  const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
  const all = db.prepare("SELECT * FROM leads ORDER BY created_at ASC").all();
  const leads = all.filter((l) => !SEED_NAMES.has(l.name));
  if (all.length !== leads.length) {
    console.log(`  (skipping ${all.length - leads.length} seeded sample leads)`);
  }
  // The sweeper also seeds 3 demo sweep rows (buildSeedSweeps): dentist/AE,
  // gym/GB and a failed law firm/US. Same rule — demo data stays out.
  const SEED_SWEEPS = new Set(["dentist|AE", "gym|GB", "law firm|US"]);
  const allSweeps = db.prepare("SELECT * FROM sweeps ORDER BY created_at ASC").all();
  const sweeps = allSweeps.filter((s) => !SEED_SWEEPS.has(`${s.niche}|${s.country_code}`));
  if (allSweeps.length !== sweeps.length) {
    console.log(`  (skipping ${allSweeps.length - sweeps.length} seeded sample sweeps)`);
  }
  db.close();
  return { leads, sweeps };
}

const asDate = (iso) => (iso ? new Date(iso) : null);

// sqlite `leads` row -> `prospects` insert object (keys = Postgres columns).
function mapLead(r) {
  return {
    id: randomUUID(),
    name: r.name,
    niche: r.niche,
    country_code: r.country_code,
    country_name: r.country_name,
    city: r.city,
    address: r.address,
    rating: r.rating,
    reviews: r.reviews,
    phone: r.phone,
    website: r.website,
    hours: r.hours,
    linkedin: r.linkedin,
    email: r.email,
    whatsapp: r.whatsapp,
    facebook: r.facebook,
    instagram: r.instagram,
    socials_scraped_at: asDate(r.socials_scraped_at),
    score: r.score ?? 0,
    status: r.status, // pending | enriched | failed — maps 1:1 to prospect_status
    enriched: r.enriched === 1,
    place_id: r.place_id,
    lat: r.lat,
    lng: r.lng,
    dedupe_key: r.dedupe_key,
    created_at: asDate(r.created_at),
    updated_at: asDate(r.updated_at),
  };
}

// sqlite `sweeps` row -> `prospect_sweeps` insert object. The source id (a
// uuid) is kept so reruns conflict on the pk instead of duplicating.
function mapSweep(r) {
  return {
    id: r.id,
    niche: r.niche,
    country_code: r.country_code,
    country_name: r.country_name,
    city: null,
    all_cities: false,
    status: r.status, // queued | running | done | failed — maps 1:1
    found: r.found ?? 0,
    error: r.error,
    created_at: asDate(r.created_at),
    finished_at: asDate(r.finished_at),
  };
}

const PROSPECT_COLS = [
  "id", "name", "niche", "country_code", "country_name", "city", "address",
  "rating", "reviews", "phone", "website", "hours", "linkedin", "email",
  "whatsapp", "facebook", "instagram", "socials_scraped_at", "score", "status",
  "enriched", "place_id", "lat", "lng", "dedupe_key", "created_at", "updated_at",
];

const SWEEP_COLS = [
  "id", "niche", "country_code", "country_name", "city", "all_cities",
  "status", "found", "error", "created_at", "finished_at",
];

function chunk(rows, size) {
  const out = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

// --- Main ------------------------------------------------------------------
async function main() {
  const { leads, sweeps } = readSource();
  const prospects = leads.map(mapLead);
  const sweepRows = sweeps.map(mapSweep);

  console.log(`Source: ${sqlitePath}`);
  console.log(`  leads read:  ${leads.length}`);
  console.log(`  sweeps read: ${sweeps.length}`);

  if (dry) {
    const url = readDatabaseUrl();
    console.log(`\nDry run — no writes. DATABASE_URL ${url ? "found" : "MISSING"} in .env.local.`);
    console.log(
      `Would insert up to ${prospects.length} prospects (${chunk(prospects, BATCH_SIZE).length} batches) ` +
        `and ${sweepRows.length} sweeps (${chunk(sweepRows, BATCH_SIZE).length} batches).`,
    );
    return;
  }

  const url = readDatabaseUrl();
  if (!url) throw new Error(`DATABASE_URL not found in ${CRM_ROOT}/.env.local`);

  const postgres = require(`${CRM_ROOT}/node_modules/postgres`);
  const sql = postgres(url, { max: 1 });
  try {
    let insertedProspects = 0;
    for (const batch of chunk(prospects, BATCH_SIZE)) {
      const rows = await sql`
        INSERT INTO prospects ${sql(batch, ...PROSPECT_COLS)}
        ON CONFLICT (dedupe_key) DO NOTHING
        RETURNING id`;
      insertedProspects += rows.length;
    }

    let insertedSweeps = 0;
    for (const batch of chunk(sweepRows, BATCH_SIZE)) {
      const rows = await sql`
        INSERT INTO prospect_sweeps ${sql(batch, ...SWEEP_COLS)}
        ON CONFLICT (id) DO NOTHING
        RETURNING id`;
      insertedSweeps += rows.length;
    }

    console.log("\nImport complete.");
    console.log(
      `  prospects: inserted ${insertedProspects}, skipped ${leads.length - insertedProspects} dupes`,
    );
    console.log(
      `  sweeps:    inserted ${insertedSweeps}, skipped ${sweeps.length - insertedSweeps} dupes`,
    );
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(`Import failed: ${err.message}`);
  process.exit(1);
});
