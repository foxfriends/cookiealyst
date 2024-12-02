import { redirect } from "@sveltejs/kit";

export async function GET() {
  redirect(303, "/2024");
}
