<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "$lib/components/Icon.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import InfoSection from "./InfoSection.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/components/Button.svelte";
  import Review from "./Review.svelte";
  import { ordinal } from "$lib/ordinal";
  import Prompt from "$lib/components/Prompt.svelte";
  import Link from "$lib/components/Link.svelte";
  import AccountStatus from "$lib/components/AccountStatus.svelte";

  const { data }: { data: PageData } = $props();
  const { cookie, year, reviews, account, rankings, publicRanking, isVoteActive } = $derived(data);
</script>

<svelte:head>
  <title>Cookies | {cookie.name}</title>
  <meta name="description" content={cookie.description} />
</svelte:head>

<main>
  <Sheet>
    {#snippet header()}
      <AccountStatus {account} />
    {/snippet}

    <div class="page">
      <nav>
        <Link href="/{year}"><Icon>west</Icon> Tasting Menu {year}</Link>
      </nav>

      <InfoSection {cookie} />

      <section class="ranking-section">
        <h3>All rankings</h3>
        {#if rankings.length}
          <div class="rankings">
            {#each rankings as ranking (ranking.id)}
              <div class="name"><strong>{ranking.account_id}</strong></div>
              <div>{ordinal(ranking.ranking + 1)}</div>
            {/each}
            <div class="overall">
              <div><strong>Overall Ranking</strong></div>
              <div>{ordinal(publicRanking.indexOf(cookie.id) + 1)}</div>
            </div>
          </div>
        {:else}
          <Prompt>Log in and cast your votes to see the rankings</Prompt>
        {/if}
      </section>

      <hr />

      {#if isVoteActive}
        <form action="?/review" method="POST" use:enhance>
          <textarea name="comment" rows={4} placeholder="Leave a review"></textarea>
          <div class="actions">
            {#if !account}<p class="note">You must be signed in to leave a review</p>{/if}
            <Button disabled={!account}>Submit</Button>
          </div>
        </form>
      {/if}

      {#each reviews as review}
        <Review {review} {account} {rankings} />
      {/each}
    </div>
  </Sheet>
</main>

<style>
  main {
    max-width: 60rem;
    margin: 0 auto;
  }

  .page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  hr {
    width: 75%;
    margin: 0 auto;
    border: 1px solid rgb(0 0 0 / 0.12);
  }

  h3 {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.25rem;
    text-transform: lowercase;
  }

  form,
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  textarea {
    background: rgb(255 255 255 / 0.7);
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 1rem;
  }

  .actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: end;
    align-items: center;
  }

  .note {
    color: rgb(0 0 0 / 0.7);
    font-size: 0.75rem;
    font-weight: 500;
  }

  strong {
    font-weight: 600;
  }

  .rankings {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: start;
    gap: 0.25rem 2rem;
  }

  .overall {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    border-top: 1px solid rgb(0 0 0 / 0.25);
    padding-top: 0.25rem;
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
