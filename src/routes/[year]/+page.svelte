<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import type { PageData } from "./$types";
  import CookieInfo from "./CookieInfo.svelte";
  import VoteCaster from "./VoteCaster.svelte";

  const { data }: { data: PageData } = $props();

  let voteCaster: VoteCaster | undefined = $state();

  function showVoteCaster() {
    voteCaster?.show();
  }
</script>

<main>
  <Sheet>
    <div class="page">
      <header>
        <h1>Tasting Menu {data.year}</h1>
      </header>

      <div class="cast">
        <Button onclick={showVoteCaster} disabled={!data.account}>Cast your votes</Button>
      </div>

      <div role="list" class="list-grid">
        {#each data.cookies as cookie (cookie.id)}
          <CookieInfo {cookie} />
        {:else}
          <div>The cookies are not yet made.</div>
        {/each}
      </div>
    </div>
  </Sheet>
</main>

<VoteCaster bind:this={voteCaster} cookies={data.cookies} />

<style>
  main {
    max-width: 60rem;
    margin: 0 auto;
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
    grid-template-columns: auto 1fr;
    gap: 4rem 0;
  }

  .page {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .cast {
    align-self: center;
  }
</style>
