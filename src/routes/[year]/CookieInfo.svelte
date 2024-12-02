<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "$lib/components/Icon.svelte";
  import type { Cookie } from "$lib/Database";

  const { cookie }: { cookie: Cookie } = $props();

  function view() {
    void goto(`/${cookie.year}/${cookie.id}`);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<section data-cookie={cookie.id} onclick={view} role="listitem">
  <picture>
    <img
      src={cookie.image_url}
      alt="Photo of &ldquo;{cookie.name}&rdquo;"
      height="200"
      width="200"
    />
  </picture>
  <div>
    <heading>
      <h2>{cookie.name}</h2>
    </heading>
    <p>{cookie.description}</p>
    <a href="/{cookie.year}/{cookie.id}">See what people are saying <Icon>east</Icon></a>
  </div>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: subgrid;
    grid-auto-rows: auto;
    grid-column-start: 1;
    grid-column-end: -1;
    gap: 0 1rem;
    cursor: pointer;
    margin: 0 auto;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
    align-self: center;
  }

  picture {
    aspect-ratio: 1 / 1;
    width: 200px;
    height: 200px;
    background-color: rgb(0 0 0 / 0.05);
    place-self: center;
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
  }

  section:where(:hover, :has(:focus)) a {
    text-decoration: underline;
    text-underline-offset: 0.35rem;
  }

  section:has(:focus) {
    box-shadow: 0 0 0.45rem rgb(0 0 0 / 0.4);
  }
</style>
