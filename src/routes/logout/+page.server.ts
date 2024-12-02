import { type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ locals }) => {
    locals.account = null;
    return {};
  },
};
