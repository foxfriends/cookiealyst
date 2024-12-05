<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="error">{@render children()}</div>

<style>
  .error {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgb(227 25 25);
  }
</style>
