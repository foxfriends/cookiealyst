// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from "$lib/Database";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      database: Database;
      account: string | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
