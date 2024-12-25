<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import type { Cookie } from "$lib/Database";

  const { cookie }: { cookie: Cookie } = $props();
</script>

<section class="info-grid" data-cookie={cookie.id}>
  <picture>
    <img src={cookie.image_url} alt="Photo of {cookie.name}" width="400" />
  </picture>
  <div class="info">
    <heading>
      <Title>{cookie.name}</Title>
    </heading>
    <p>{cookie.description}</p>
  </div>
</section>

<style>
  .info-grid {
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: auto;
    gap: 1rem;
  }

  @container (min-width: 600px) {
    .info-grid {
      grid-template-columns: minmax(auto, 1fr) 1fr;
    }
  }

  picture {
    aspect-ratio: 1 / 1;
    min-width: 12.5rem;
    width: 100%;
    max-width: 25rem;
    align-self: center;
  }

  img {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 0.5rem;
    align-self: center;
  }

  p {
    text-transform: lowercase;
  }
</style>
