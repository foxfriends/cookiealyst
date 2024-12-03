import type { Handle } from "@sveltejs/kit";
import sql from "pg-sql2";
import { Database, type Session } from "$lib/Database";

export async function handle({ event, resolve }: Parameters<Handle>[0]) {
  event.locals.database = await Database.connect();

  const sessionId = event.cookies.get("session");
  let session = null;
  if (sessionId) {
    session = await event.locals.database.one<Session>(
      sql.query`
        UPDATE sessions
          SET expires_at = now() + CAST('30 days' AS INTERVAL)
          WHERE id = ${sql.value(sessionId)} AND expires_at > now()
          RETURNING *
      `,
    );
  }
  if (!session) {
    session = await event.locals.database.one<Session>(
      sql.query`INSERT INTO sessions (id) VALUES (DEFAULT) RETURNING *`,
    );
    if (!session) throw new TypeError("Failed to create empty session");
  }
  event.locals.account = session.account_id ?? null;

  event.cookies.set("session", session.id, {
    path: "/",
    expires: session.expires_at,
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });

  try {
    return await resolve(event);
  } finally {
    try {
      if (event.locals.account !== session.account_id) {
        await event.locals.database.one<Session>(
          sql.query`
            UPDATE sessions
              SET account_id = ${sql.value(event.locals.account)}
              WHERE id = ${sql.value(session.id)}
          `,
        );
      }
    } finally {
      event.locals.database.release();
    }
  }
}
