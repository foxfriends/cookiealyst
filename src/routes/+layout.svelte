<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

{@render children()}

<style>
  :global {
    * {
      padding: 0;
      margin: 0;
      font-size: 1rem;
      box-sizing: border-box;
    }

    :root {
      --color-ice: rgb(214 255 250);
      --color-snow: rgb(232 246 250);
    }

    body {
      background-color: var(--color-ice);
      background-image: linear-gradient(to bottom, var(--color-snow), var(--color-ice));
      min-width: 100vw;
      min-height: 100vh;
    }
  }
</style>
