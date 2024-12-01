<script lang="ts">
  import type { PageData } from "./$types";
  import CookieInfo from "./CookieInfo.svelte";

  const { data }: { data: PageData } = $props();
  $inspect(data);
</script>

<main>
  <div class="cookielist">
    {#each data.cookies as cookie (cookie.id)}
      <CookieInfo {cookie} />
    {:else}
      <div>There are no cookies yet 😱</div>
    {/each}
  </div>
</main>

<style>
  main {
    max-width: 64rem;
    min-height: 100%;
    padding-top: 4rem;
    margin: 0 auto;
  }

  .cookielist {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
