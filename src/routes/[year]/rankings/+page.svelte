<script lang="ts">
  import Icon from "$lib/components/Icon.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import type { PageData } from "./$types";
  import { ordinal } from "$lib/ordinal";
  import Prompt from "$lib/components/Prompt.svelte";
  import Title from "$lib/components/Title.svelte";
  import Link from "$lib/components/Link.svelte";
  import AccountStatus from "$lib/components/AccountStatus.svelte";

  const { data }: { data: PageData } = $props();
  const { cookies, year, account, rankings, publicRanking } = $derived(data);
</script>

<svelte:head>
  <title>Cookiealyst | {data.year}</title>
  <meta name="description" content="Pearl's {data.year} cookie box rankings" />
</svelte:head>

<main>
  <Sheet>
    {#snippet header()}
      <AccountStatus {account} />
    {/snippet}

    <div class="page">
      <nav>
        <Link href="/"><Icon>west</Icon> Tasting Menu 2024</Link>
      </nav>

      <header>
        <Title>Tasting menu {year} rankings</Title>
      </header>

      {#if rankings.length}
        <div class="overflow">
          <table>
            <thead>
              <tr>
                <th></th>
                {#each cookies as cookie (cookie.id)}
                  <th>
                    <div class="cell">
                      <picture>
                        <img
                          src={cookie.image_url}
                          alt="Photo of &ldquo;{cookie.name}&rdquo;"
                          height="200"
                          width="200"
                        />
                      </picture>
                      <span class="cookie">{cookie.name}</span>
                    </div>
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Overall Ranking</strong></td>
                {#each cookies as cookie (cookie.id)}
                  {@const rank = publicRanking.indexOf(cookie.id)}
                  {@const worseness = (rank / (cookies.length - 1)) * 100}
                  <td
                    style="background-color: color-mix(in oklch, rgb(131 245 127), rgb(235 167 141) {worseness}%)"
                  >
                    {ordinal(rank + 1)}
                  </td>
                {/each}
              </tr>

              {#each rankings as ranking (ranking.account_id)}
                <tr>
                  <td><strong>{ranking.account_id}</strong></td>
                  {#each cookies as cookie (cookie.id)}
                    {@const rank = ranking.rankings.find((rank) => rank.cookie_id === cookie.id)}
                    {#if rank}
                      {@const worseness = (rank.ranking / (cookies.length - 1)) * 100}
                      <td
                        style="background-color: color-mix(in oklch, rgb(131 245 127), rgb(235 167 141) {worseness}%)"
                      >
                        {ordinal(rank.ranking + 1)}
                      </td>
                    {:else}
                      <td></td>
                    {/if}
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="placeholder">
          <Prompt>Sign in and cast your votes to see the global rankings</Prompt>
        </div>
      {/if}
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

  picture {
    aspect-ratio: 1 / 1;
    width: 1.5rem;
    height: 1.5rem;
    align-self: center;
  }

  img {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .cell {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }

  .cookie {
    font-family: var(--font-display);
    text-transform: lowercase;
    font-style: italic;
  }

  strong {
    font-weight: 600;
  }

  td,
  th {
    padding: 0.5rem;
    text-align: center;
  }

  .placeholder {
    text-align: center;
  }

  .overflow {
    overflow-x: auto;
    outline: 1px solid rgb(0 0 0 / 0.12);
    outline-offset: 0.25rem;
  }
</style>
