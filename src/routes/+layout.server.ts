import type { LayoutServerLoadEvent } from "./$types";

export async function load(event: LayoutServerLoadEvent) {
  return { account: event.locals.account };
}
