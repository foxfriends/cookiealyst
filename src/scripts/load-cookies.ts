import { Database, type Cookie } from "$lib/Database";
import { readFileSync } from "node:fs";
import TOML from "toml";
import sql from "pg-sql2";

const input = await readFileSync(process.stdin.fd, "utf8");
const { cookies } = TOML.parse(input) as { cookies: Cookie[] };
const db = await Database.connect();

const values = sql.join(
  cookies.map(
    (cookie) =>
      sql.query`(${sql.value(cookie.id)}, ${sql.value(cookie.name)}, ${sql.value(cookie.description)}, ${sql.value(cookie.year)}, ${sql.value(cookie.image_url)})`,
  ),
  ",",
);

const result = await db.query(sql.query`
  INSERT INTO cookies (id, name, description, year, image_url)
    VALUES ${values}
    ON CONFLICT (id, year) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url
`);

console.log(`${result.rowCount} cookies updated`);

db.release();
process.exit(0);
