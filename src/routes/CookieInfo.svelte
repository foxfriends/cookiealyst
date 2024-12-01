<script lang="ts">
  import type { Cookie } from "$lib/Database";

  const { cookie }: { cookie: Cookie } = $props();
</script>

<article data-cookie={cookie.id}>
  <heading>
    <h2>{cookie.name}</h2>
  </heading>
  <p>{cookie.description}</p>
</article>

<style>
  article {
    padding: 1rem;
    background: white;
  }
</style>
