import type { Comment, Cookie, Ranking, Review } from "$lib/Database";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoadEvent, Actions } from "./$types";
import sql from "pg-sql2";
import { getPublicRanking } from "$lib/publicRanking";

export async function load(event: PageServerLoadEvent) {
  const { cookieId } = event.params;
  const year = Number.parseInt(event.params.year);
  if (Number.isNaN(year)) error(404, "Cookie not found");

  const cookie = await event.locals.database.one<Cookie>(
    sql.query`SELECT * FROM cookies WHERE id = ${sql.value(cookieId)} AND year = ${sql.value(year)}`,
  );
  if (!cookie) error(404, "Cookie not found");

  const reviews = await event.locals.database.many<Review & { comments: Comment[] }>(
    sql.query`
      SELECT reviews.*, COALESCE(jsonb_agg(comments.*) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comments
        FROM reviews
        LEFT JOIN LATERAL (
          SELECT *
            FROM comments
            WHERE comments.review_id = reviews.id
            ORDER BY comments.created_at ASC
          ) comments ON true
        WHERE reviews.cookie_id = ${sql.value(cookieId)}
        GROUP BY reviews.id
        ORDER BY reviews.created_at DESC`,
  );
  // Fix-up since date information within JSONB is lost
  for (const review of reviews) {
    review.comments = review.comments.map((comment) => ({
      ...comment,
      created_at: new Date(comment.created_at),
    }));
  }

  let rankings: Ranking[] = [];
  let publicRanking: string[] = [];

  if (event.locals.account) {
    const allRankings = await event.locals.database.many<Ranking>(
      sql.query`
        SELECT *
          FROM rankings
          WHERE rankings.cookie_id = ${sql.value(cookieId)}
          AND rankings.year = ${sql.value(year)}
          ORDER BY created_at ASC
      `,
    );
    if (allRankings.some((rank) => rank.account_id === event.locals.account)) {
      rankings = allRankings;
      publicRanking = await getPublicRanking(event.locals.database, year);
    }
  }
  return { cookie, year, reviews, rankings, publicRanking };
}

export const actions: Actions = {
  review: async ({ locals, request, params }) => {
    const accountId = locals.account;
    if (!accountId) return fail(400, { message: "Not logged in" });
    const body = await request.formData();
    const cookieId = params.cookieId;
    const year = Number.parseInt(params.year);
    if (Number.isNaN(year)) return fail(404, { message: "Cookie not found" });
    const comment = body.get("comment")?.toString();
    if (!comment) return fail(400, { message: "Comment is required" });
    const review = await locals.database.one<Review>(
      sql.query`
        INSERT INTO reviews (cookie_id, year, account_id, comment)
          VALUES (${sql.value(cookieId)}, ${sql.value(year)}, ${sql.value(accountId)}, ${sql.value(comment)})
          RETURNING *;
      `,
    );
    return { review };
  },

  comment: async ({ locals, request }) => {
    const accountId = locals.account;
    if (!accountId) return fail(400, { message: "Not logged in" });
    const body = await request.formData();

    const reviewIdString = body.get("review_id")?.toString();
    if (!reviewIdString) return fail(400, { message: "Review ID is required" });
    const reviewId = Number.parseInt(reviewIdString);
    if (!reviewId) return fail(400, { message: "Review ID is required" });

    const text = body.get("comment")?.toString();
    if (!text) return fail(400, { message: "Comment is required" });
    const comment = await locals.database.one<Review>(
      sql.query`
        INSERT INTO comments (review_id, account_id, comment)
          VALUES (${sql.value(reviewId)}, ${sql.value(accountId)}, ${sql.value(text)})
          RETURNING *;
      `,
    );
    return { comment };
  },
};
