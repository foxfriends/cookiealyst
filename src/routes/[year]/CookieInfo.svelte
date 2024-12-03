<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "$lib/components/Icon.svelte";
  import type { Cookie } from "$lib/Database";
  import { ordinal } from "$lib/ordinal";

  const {
    cookie,
    personalRank,
    publicRank,
  }: { cookie: Cookie; personalRank: number; publicRank: number } = $props();

  function view() {
    void goto(`/${cookie.year}/${cookie.id}`);
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<section data-cookie={cookie.id} onclick={view} role="listitem">
  <div class="picture">
    <div class="ranks">
      {#if publicRank > 0}
        <div class="rank"><Icon>public</Icon> {ordinal(publicRank)}</div>
      {/if}
      {#if personalRank > 0}
        <div class="rank"><Icon>person</Icon> {ordinal(personalRank)}</div>
      {/if}
    </div>
    <picture>
      <img
        src={cookie.image_url}
        alt="Photo of &ldquo;{cookie.name}&rdquo;"
        height="200"
        width="200"
      />
    </picture>
  </div>
  <div class="content">
    <heading>
      <h2>{cookie.name}</h2>
    </heading>
    <p>{cookie.description}</p>
    <a href="/{cookie.year}/{cookie.id}">See what people are saying <Icon>east</Icon></a>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1rem;
    cursor: pointer;
    margin: 0 auto;
    width: 100%;
    grid-column-start: 1;
    grid-column-end: -1;
  }

  @container (min-width: 400px) {
    section {
      display: grid;
      grid-template-columns: subgrid;
      grid-auto-rows: auto;
      align-items: center;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
  }

  .picture {
    position: relative;
    aspect-ratio: 1 / 1;
    width: 12.5rem;
    height: 12.5rem;
  }

  .ranks {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: start;
    z-index: 1;
    gap: 0.5rem;
    inset: 0.5rem;
  }

  .rank {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(255 255 255);
    border: 1px solid rgb(0 0 0 / 0.12);
    height: 1.5rem;
    width: 7ch;
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
  }

  picture {
    inset: 0;
    position: absolute;
    background-color: rgb(0 0 0 / 0.05);
  }

  img {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  h2 {
    font-size: 2rem;
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
  }

  p {
    max-width: 50ch;
    text-transform: lowercase;
  }

  a {
    color: inherit;
    text-decoration: none;
    outline: none;
    text-transform: lowercase;
    margin-top: 1rem;
  }

  section:where(:hover, :has(:focus-visible)) a {
    text-decoration: underline;
    text-underline-offset: 0.35rem;
  }

  section:has(:focus-visible) {
    box-shadow: 0 0 0.45rem rgb(0 0 0 / 0.4);
  }
</style>
