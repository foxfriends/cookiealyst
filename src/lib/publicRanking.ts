import { Kemeny, utils } from "votes";
import type { Cookie, Database, Ranking } from "./Database";
import sql from "pg-sql2";

export async function getPublicRanking(database: Database, year: number): Promise<string[]> {
  const cookies = await database.many<Cookie>(
    sql.query`SELECT id FROM cookies WHERE year = ${sql.value(year)} ORDER BY ordering ASC`,
  );
  const allRankings = await database.many<{
    account_id: string;
    rankings: Pick<Ranking, "cookie_id" | "ranking">[];
  }>(
    sql.query`
      SELECT a.id AS account_id, jsonb_agg(r.*) AS rankings
        FROM accounts a
        JOIN LATERAL (
          SELECT cookie_id, ranking
            FROM rankings
            WHERE account_id = a.id
            AND year = ${sql.value(year)}
            ORDER BY ranking
        ) r ON true
        GROUP BY a.id
    `,
  );

  const matrix = new Kemeny(
    utils.matrixFromBallots(
      allRankings.map(({ rankings }) => ({
        ranking: rankings.map((ranking) => [ranking.cookie_id]),
        weight: 1,
      })),
      cookies.map((cookie) => cookie.id),
    ),
  );

  return matrix.ranking().flat();
}
