import type { Handle } from "@sveltejs/kit";
import sql from "pg-sql2";
import { Database, type Session } from "$lib/Database";

export async function handle({ event, resolve }: Parameters<Handle>[0]) {
  event.locals.database = await Database.connect();

  const sessionId = event.cookies.get("session");
  if (sessionId) {
    event.locals.account = await event.locals.database.one<Pick<Session, "account_id">>(
      sql.query`
        UPDATE sessions
          SET expires_at = now() + CAST('30 days' AS INTERVAL)
          WHERE id = ${sql.value(sessionId)} AND expires_at > now()
          RETURNING account_id
      `,
    )?.account_id;
  }

  try {
    return await resolve(event);
  } finally {
    event.locals.database.release();
  }
}
