<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<p class="prompt">
  {@render children?.()}
</p>

<style>
  .prompt {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
