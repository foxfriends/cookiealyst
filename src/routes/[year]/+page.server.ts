import type { Cookie } from "$lib/Database";
import sql from "pg-sql2";
import type { PageServerLoadEvent } from "./$types";
import { error } from "@sveltejs/kit";

export async function load(event: PageServerLoadEvent) {
  const year = Number.parseInt(event.params.year);
  if (Number.isNaN(year)) error(404, "Cookies not found");
  const cookies = await event.locals.database.many<Cookie>(
    sql.query`SELECT * FROM cookies WHERE year = ${sql.value(year)} ORDER BY ordering ASC`,
  );
  return { cookies, year };
}
