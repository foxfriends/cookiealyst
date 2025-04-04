import pg, { type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import sql, { type SQLQuery } from "pg-sql2";

export class Database {
  static async connect(pool: pg.Pool) {
    return new Database(await pool.connect());
  }

  client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  query(query: SQLQuery): Promise<QueryResult> {
    const { text, values } = sql.compile(query);
    return this.client.query(text, values);
  }

  async one<T extends QueryResultRow>(query: SQLQuery): Promise<T | null> {
    const result = await this.query(query);
    if (result.rowCount === null) {
      throw new TypeError("Query does not return rows.");
    }
    if (result.rowCount > 1) {
      throw new TypeError("Query returned more than one row.");
    }
    return (result.rows[0] ?? null) as T | null;
  }

  async many<T extends QueryResultRow>(query: SQLQuery): Promise<T[]> {
    const result = await this.query(query);
    return result.rows as T[];
  }

  async transaction<T>(cb: () => Promise<T>): Promise<T> {
    await this.client.query("BEGIN");
    try {
      const result = await cb();
      await this.client.query("COMMIT");
      return result;
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    }
  }

  release() {
    this.client.release();
  }
}

export interface Cookie {
  id: string;
  name: string;
  description: string;
  year: number;
  image_url: string | null;
  ordering: number;
}

export interface Account {
  id: string;
  created_at: Date;
}

export interface Session {
  id: string;
  account_id: string;
  created_at: Date;
  expires_at: Date;
}

export interface Review {
  id: number;
  account_id: string;
  cookie_id: string;
  year: number;
  comment: string;
  created_at: Date;
}

export interface Ranking {
  id: number;
  account_id: string;
  cookie_id: string;
  year: number;
  ranking: number;
  created_at: Date;
}

export interface Comment {
  id: number;
  account_id: string;
  review_id: string;
  comment: string;
  created_at: Date;
}
