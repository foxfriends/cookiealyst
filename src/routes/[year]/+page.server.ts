import type { Cookie, Ranking } from "$lib/Database";
import sql from "pg-sql2";
import type { PageServerLoadEvent, Actions } from "./$types";
import qs from "qs";
import { error, fail } from "@sveltejs/kit";
import { getPublicRanking } from "$lib/publicRanking";

export async function load(event: PageServerLoadEvent) {
  const year = Number.parseInt(event.params.year);
  if (Number.isNaN(year)) error(404, "Cookies not found");
  const cookies = await event.locals.database.many<Cookie>(
    sql.query`SELECT * FROM cookies WHERE year = ${sql.value(year)} ORDER BY ordering ASC`,
  );

  let rankings: Ranking[] = [];
  let publicRanking: string[] = [];
  if (event.locals.account) {
    rankings = await event.locals.database.many<Ranking>(
      sql.query`SELECT * FROM rankings WHERE year = ${sql.value(year)} AND account_id = ${sql.value(event.locals.account)}`,
    );
    if (rankings.length) {
      publicRanking = await getPublicRanking(event.locals.database, year);
    }
  }
  return { cookies, year, rankings, publicRanking };
}

export const actions: Actions = {
  vote: async ({ locals: { database, account }, params, request }) => {
    if (!account) return fail(403, { message: "Not logged in" });
    const year = Number.parseInt(params.year);
    if (Number.isNaN(year)) return fail(400, { message: "Invalid year" });

    const cookies = await database.many<Cookie>(
      sql.query`SELECT * FROM cookies WHERE year = ${sql.value(year)}`,
    );

    const form = qs.parse(await request.text()) as {
      cookies: string[];
      comments: Record<string, string>;
    };

    if (!form.cookies.length) return fail(400, { message: "Cookie rankings are required" });
    if (form.cookies.length !== cookies.length) {
      return fail(400, { message: "All cookies are required" });
    }
    if (!cookies.every((cookie) => form.cookies.includes(cookie.id))) {
      return fail(400, { message: "Incorrect cookies were provided for this year" });
    }

    const rankings = sql.join(
      form.cookies.map(
        (cookie, i) =>
          sql.query`(${sql.value(account)}, ${sql.value(cookie)}, ${sql.value(year)}, ${sql.value(i)})`,
      ),
      ", ",
    );

    const comments = Object.entries(form.comments)
      .map(([cookieId, comment]) => ({
        cookieId,
        comment: comment.trim(),
      }))
      .filter((review) => review.comment);

    const commentsSql = sql.join(
      comments.map(
        (review) =>
          sql.query`(${sql.value(account)}, ${sql.value(review.cookieId)}, ${sql.value(year)}, ${sql.value(review.comment)})`,
      ),
      ", ",
    );

    await database.transaction(async () => {
      await database.query(
        sql.query`DELETE FROM rankings WHERE account_id = ${sql.value(account)}`,
      );
      await database.query(
        sql.query`INSERT INTO rankings (account_id, cookie_id, year, ranking) VALUES ${rankings}`,
      );
      if (comments.length) {
        await database.query(
          sql.query`INSERT INTO reviews (account_id, cookie_id, year, comment) VALUES ${commentsSql}`,
        );
      }
    });
  },
};
