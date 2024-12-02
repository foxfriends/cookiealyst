import type { Account } from "$lib/Database";
import { error, type Actions } from "@sveltejs/kit";
import sql from "pg-sql2";

export const actions: Actions = {
  default: async ({ locals, request }) => {
    locals.account = null;
    return {};
  },
};
