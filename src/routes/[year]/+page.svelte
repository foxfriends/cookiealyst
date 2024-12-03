<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import type { PageData } from "./$types";
  import CookieInfo from "./CookieInfo.svelte";
  import VoteCaster from "./VoteCaster.svelte";
  import { enhance } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import Prompt from "$lib/components/Prompt.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import type { Cookie } from "$lib/Database";

  const { data }: { data: PageData } = $props();

  let voteCaster: VoteCaster | undefined = $state();
  const rankedIds = $derived(data.rankings.map((ranking) => ranking.cookie_id));
  const rankedCookies = $derived(
    data.cookies.toSorted((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id)),
  );

  function showVoteCaster() {
    voteCaster?.show();
  }

  const orderings = ["default", "personal", "public"] as const;
  let ordering: (typeof orderings)[number] = $state("default");
  $effect(() => {
    if (!data.account) ordering = "default";
  });

  function nextOrdering() {
    const index = orderings.indexOf(ordering);
    ordering = orderings[(index + 1) % orderings.length];
  }

  function orderingFunction(a: Cookie, b: Cookie) {
    switch (ordering) {
      case "default":
        return a.ordering - b.ordering;
      case "personal":
        return rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id);
      case "public":
        return data.publicRankings.indexOf(a.id) - data.publicRankings.indexOf(b.id);
    }
  }

  const orderedCookies = $derived(data.cookies.toSorted(orderingFunction));
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

      <div class="list-area">
        <div class="controls">
          {#if !data.rankings.length}
            <Prompt>You can see the global rankings after voting.</Prompt>
          {/if}
          <Button onclick={nextOrdering} disabled={!data.rankings.length}>
            <div class="ordering">
              {#if ordering === "personal"}
                <Icon>person</Icon> Personal rank
              {:else if ordering === "public"}
                <Icon>public</Icon> Public rank
              {:else}
                <Icon>list</Icon> Default
              {/if}
              <Icon>keyboard_arrow_down</Icon>
            </div>
          </Button>
        </div>
        <div role="list" class="list-grid">
          {#each orderedCookies as cookie (cookie.id)}
            <CookieInfo
              {cookie}
              personalRank={rankedIds.indexOf(cookie.id) + 1}
              publicRank={data.publicRankings.indexOf(cookie.id) + 1}
            />
          {:else}
            <div>The cookies are not yet made.</div>
          {/each}
        </div>
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

  .list-area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

  .controls {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 1rem;
    justify-content: end;
  }

  .ordering {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
</style>
