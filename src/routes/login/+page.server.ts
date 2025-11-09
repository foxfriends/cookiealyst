import type { Account } from "$lib/Database";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import sql from "pg-sql2";
import pg from "pg";

export const actions: Actions = {
  default: async ({ locals, request }) => {
    if (locals.account) error(409, "Already signed in");
    const data = await request.formData();
    const to = data.get("to")?.toString() ?? "/";
    const account_id = data.get("account_id")?.toString() ?? null;
    if (!account_id) return fail(400, { error: "Your name is required" });

    try {
      const account =
        (await locals.database.one<Pick<Account, "id">>(
          sql.query`SELECT id FROM accounts WHERE id = ${sql.value(account_id)}`,
        )) ??
        (await locals.database.one<Pick<Account, "id">>(
          sql.query`INSERT INTO accounts (id) VALUES (${sql.value(account_id)}) RETURNING id`,
        ));
      if (!account) throw new TypeError("Account not found or created");
      locals.account = account.id;
    } catch (error) {
      if (
        error instanceof pg.DatabaseError &&
        error.code === "23514" &&
        error.constraint === "account_id_max_length"
      ) {
        return fail(400, { action: "login" as const, message: "Name is too long" });
      }
      return fail(500, {
        action: "login" as const,
        message: (error as Error).message ?? "Something went wrong",
      });
    }
    redirect(303, to);
  },
};
