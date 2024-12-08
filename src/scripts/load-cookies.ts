import { Database, type Cookie } from "$lib/Database";
import { readFileSync } from "node:fs";
import TOML from "toml";
import pg from "pg";
import sql from "pg-sql2";

const input = await readFileSync(process.stdin.fd, "utf8");
const { cookies } = TOML.parse(input) as { cookies: Cookie[] };

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = await Database.connect(pool);

const values = sql.join(
  cookies.map(
    (cookie, i) =>
      sql.query`(${sql.value(cookie.id)}, ${sql.value(cookie.name)}, ${sql.value(cookie.description)}, ${sql.value(cookie.year)}, ${sql.value(cookie.image_url)}, ${sql.value(i)})`,
  ),
  ",",
);

const result = await db.query(sql.query`
  INSERT INTO cookies (id, name, description, year, image_url, ordering)
    VALUES ${values}
    ON CONFLICT (id, year) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          ordering = EXCLUDED.ordering
`);

console.log(`${result.rowCount} cookies updated`);

db.release();
pool.end();
