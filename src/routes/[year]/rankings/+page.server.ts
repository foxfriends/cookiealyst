import type { Cookie, Ranking } from "$lib/Database";
import sql from "pg-sql2";
import type { PageServerLoadEvent } from "./$types";
import { error } from "@sveltejs/kit";
import { getPublicRanking } from "$lib/publicRanking";

export async function load(event: PageServerLoadEvent) {
  const year = Number.parseInt(event.params.year);
  if (Number.isNaN(year)) error(404, "Cookies not found");

  const cookies = await event.locals.database.many<Cookie>(
    sql.query`SELECT * FROM cookies WHERE year = ${sql.value(year)} ORDER BY ordering ASC`,
  );

  let rankings: {
    account_id: string;
    rankings: Pick<Ranking, "cookie_id" | "ranking" | "created_at">[];
  }[] = [];
  let publicRanking: string[] = [];

  if (event.locals.account) {
    const allRankings = await event.locals.database.many<{
      account_id: string;
      rankings: Pick<Ranking, "cookie_id" | "ranking" | "created_at">[];
    }>(
      sql.query`
        SELECT a.id AS account_id, jsonb_agg(r.*) AS rankings
          FROM accounts a
          JOIN LATERAL (
            SELECT cookie_id, ranking, created_at
              FROM rankings
              WHERE account_id = a.id
              AND year = ${sql.value(year)}
              ORDER BY ranking
          ) r ON true
          GROUP BY a.id, r.created_at
          ORDER BY r.created_at
      `,
    );
    if (allRankings.some((rank) => rank.account_id === event.locals.account)) {
      rankings = allRankings;
      publicRanking = await getPublicRanking(event.locals.database, year);
    }
  }
  return { cookies, year, rankings, publicRanking };
}
