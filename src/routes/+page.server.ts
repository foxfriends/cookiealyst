import type { Cookie } from "$lib/Database";
import type { ServerLoadEvent } from "@sveltejs/kit";
import sql from "pg-sql2";

export async function load(event: ServerLoadEvent) {
  const cookies = await event.locals.database.many<Cookie>(sql.query`SELECT * FROM cookies`);
  return { cookies };
}
