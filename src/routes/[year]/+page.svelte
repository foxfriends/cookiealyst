<script lang="ts">
  import Sheet from "$lib/components/Sheet.svelte";
  import type { PageData } from "./$types";
  import CookieInfo from "./CookieInfo.svelte";

  const { data }: { data: PageData } = $props();
</script>

<main>
  <Sheet>
    <header>
      <h1>Tasting Menu {data.year}</h1>
    </header>

    <div role="list" class="list-grid">
      {#each data.cookies as cookie (cookie.id)}
        <CookieInfo {cookie} />
      {:else}
        <div>The cookies are not yet made.</div>
      {/each}
    </div>
  </Sheet>
</main>

<style>
  main {
    max-width: 60rem;
    margin: 0 auto;
  }

  header {
    margin-bottom: 6rem;
  }

  h1 {
    font-size: 2rem;
    font-family: var(--font-display);
    font-style: italic;
    text-align: center;
    text-transform: lowercase;
  }

  .list-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem 0;
  }

  @container (min-width: 400px) {
    .list-grid {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }
</style>
