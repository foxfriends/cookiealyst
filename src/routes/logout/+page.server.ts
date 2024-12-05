import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ locals, request }) => {
    locals.account = null;
    const data = await request.formData();
    const to = data.get("to")?.toString() ?? "/";
    redirect(303, to);
  },
};
