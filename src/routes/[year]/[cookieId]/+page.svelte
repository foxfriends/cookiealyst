<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "$lib/components/Icon.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const { cookie, account } = $derived(data);
</script>

<main>
  <Sheet>
    <nav>
      <a href="/"><Icon>west</Icon> Tasting Menu 2024</a>
    </nav>

    <div class="info-grid" data-cookie={data.cookie.id}>
      <picture>
        <img src={cookie.image_url} alt="Photo of {cookie.name}" width="400" />
      </picture>
      <section>
        <heading>
          <h1>{cookie.name}</h1>
        </heading>
        <p>{cookie.description}</p>
      </section>
    </div>

    <form action="/review" method="POST" use:enhance>
      <input name="cookie_id" value={cookie.id} type="hidden" />
      <input name="year" value={cookie.year} type="hidden" />

      <button disabled={!account}>Submit</button>
    </form>
  </Sheet>
</main>

<style>
  main {
    max-width: 60rem;
    margin: 0 auto;
  }

  .info-grid {
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: auto;
    gap: 0 1rem;
  }

  @container (min-width: 600px) {
    .info-grid {
      grid-template-columns: minmax(auto, 1fr) 1fr;
    }
  }

  picture {
    aspect-ratio: 1 / 1;
    min-width: 200px;
    width: 100%;
    max-width: 400px;
    background-color: rgb(0 0 0 / 0.05);
    place-self: center;
  }

  img {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  section {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-self: center;
  }

  h1 {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 3rem;
    text-transform: lowercase;
  }

  p {
    text-transform: lowercase;
  }

  a {
    color: inherit;
    text-decoration: none;
    outline: none;
    text-transform: lowercase;
  }

  a:hover {
    text-decoration: underline;
    text-underline-offset: 0.35rem;
  }

  nav {
    margin-bottom: 2rem;
  }
</style>
