import type { Comment, Cookie, Ranking, Review } from "$lib/Database";
import { error } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";
import sql from "pg-sql2";

export async function load(event: PageServerLoadEvent) {
  const { cookieId } = event.params;
  const year = Number.parseInt(event.params.year);
  if (Number.isNaN(year)) error(404, "Cookie not found");

  const cookie = await event.locals.database.one<Cookie>(
    sql.query`SELECT * FROM cookies WHERE id = ${sql.value(cookieId)} AND year = ${sql.value(year)}`,
  );
  if (!cookie) error(404, "Cookie not found");

  const reviews = await event.locals.database.many<Review & { comments: Comment }>(
    sql.query`
      SELECT reviews.*, json_agg(comments.*)
        FROM reviews
        LEFT JOIN LATERAL (
          SELECT *
            FROM comments
            WHERE comments.review_id = reviews.id
          ) comments ON true
        WHERE reviews.cookie_id = ${sql.value(cookieId)}
        GROUP BY reviews.id`,
  );

  const rankings = await event.locals.database.many<Ranking>(
    sql.query`SELECT * FROM rankings WHERE rankings.cookie_id = ${sql.value(cookieId)}`,
  );

  return { cookie, reviews, rankings };
}
