<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<h1>{@render children()}</h1>

<style>
  h1 {
    font-size: 2rem;
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
  }
</style>
