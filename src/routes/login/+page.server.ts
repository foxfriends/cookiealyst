import type { Account } from "$lib/Database";
import { error, fail, type Actions } from "@sveltejs/kit";
import sql from "pg-sql2";

export const actions: Actions = {
  default: async ({ locals, request }) => {
    if (locals.account) error(409, "Already signed in");
    const data = await request.formData();
    const account_id = data.get("account_id")?.toString() ?? null;
    if (!account_id) return fail(400, { error: "Your name is required" });

    const created = await locals.database.one<Pick<Account, "id">>(
      sql.query`INSERT INTO accounts (id) VALUES (${sql.value(account_id)}) ON CONFLICT DO NOTHING RETURNING id`,
    );

    locals.account = account_id;
    return { account: locals.account, existing: !created };
  },
};
