<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<span class="material-symbols-outlined">{@render children()}</span>

<style>
  span {
    font-size: inherit;
    vertical-align: sub;
  }
</style>
