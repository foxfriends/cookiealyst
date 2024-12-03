<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import { Kemeny, utils } from "votes";
  import type { PageData } from "./$types";
  import CookieInfo from "./CookieInfo.svelte";
  import VoteCaster from "./VoteCaster.svelte";
  import { enhance } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import Prompt from "$lib/components/Prompt.svelte";

  const { data }: { data: PageData } = $props();

  const publicRanks = $derived.by(() => {
    if (!data.publicRankings.length) return [];
    const matrix = new Kemeny(
      utils.matrixFromBallots(
        data.publicRankings.map(({ rankings }) => ({
          ranking: rankings.map((ranking) => [ranking.cookie_id]),
          weight: 1,
        })),
        data.cookies.map((cookie) => cookie.id),
      ),
    );
    return matrix.ranking().flat();
  });

  let voteCaster: VoteCaster | undefined = $state();
  const rankedIds = $derived(data.rankings.map((ranking) => ranking.cookie_id));
  const rankedCookies = $derived(
    data.cookies.toSorted((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id)),
  );

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
        {#if data.rankings.length}
          <Prompt>Thank you for voting.</Prompt>
        {/if}

        {#if !data.account}
          <form action="/login" class="cast" method="POST" use:enhance>
            <label for="account_id_2">
              <Prompt>Enter your name to rank and review</Prompt>
            </label>
            <div class="field">
              <Input id="account_id_2" name="account_id" placeholder="NAME" required />
              <Button compact>Sign in</Button>
            </div>
          </form>
        {:else}
          <Button onclick={showVoteCaster} disabled={!data.account}>
            {#if data.rankings.length}Change your votes{:else}Cast your votes{/if}
          </Button>
        {/if}
      </div>

      <div role="list" class="list-grid">
        {#each data.cookies as cookie (cookie.id)}
          <CookieInfo
            {cookie}
            personalRank={rankedIds.indexOf(cookie.id) + 1}
            publicRank={publicRanks.indexOf(cookie.id) + 1}
          />
        {:else}
          <div>The cookies are not yet made.</div>
        {/each}
      </div>
    </div>
  </Sheet>
</main>

<VoteCaster bind:this={voteCaster} cookies={rankedCookies} />

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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
</style>
