import type { Cookie, Ranking } from "$lib/Database";
import sql from "pg-sql2";
import type { PageServerLoadEvent } from "./$types";
import { error } from "@sveltejs/kit";
import { getPublicRanking } from "$lib/publicRanking";
import { ACTIVE_YEAR } from "$env/static/private";

const activeYear = Number.parseInt(ACTIVE_YEAR);

export async function load(event: PageServerLoadEvent) {
  const year = Number.parseInt(event.params.year);
  if (Number.isNaN(year)) error(404, "Cookies not found");
  const isVoteActive = year === activeYear;

  const cookies = await event.locals.database.many<Cookie>(
    sql.query`SELECT * FROM cookies WHERE year = ${sql.value(year)} ORDER BY ordering ASC`,
  );

  const rankings: {
    account_id: string;
    rankings: Pick<Ranking, "cookie_id" | "ranking" | "created_at">[];
  }[] = await event.locals.database.many<{
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
  if (
    !isVoteActive ||
    (event.locals.account && rankings.some((rank) => rank.account_id === event.locals.account))
  ) {
    const publicRanking = await getPublicRanking(event.locals.database, year);
    return { cookies, year, rankings, publicRanking };
  }
  return { cookies, year, rankings: [], publicRanking: [] };
}
