<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<article>{@render children()}</article>

<style>
  article {
    background-color: white;
    background-image: url("/paper.png");
    box-shadow: 0.125rem 0.125rem 0.25rem rgb(0 0 0 / 0.6);
    padding: 3rem 1.5rem;
    container-type: inline-size;
    container-name: sheet;
  }

  @media (min-width: 600px) {
    article {
      padding: 8rem 6rem;
    }
  }
</style>
