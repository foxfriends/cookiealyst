<script lang="ts">
  import type { Snippet } from "svelte";

  const { children, header }: { children: Snippet; header?: Snippet } = $props();
</script>

<article>
  <div class="topmargin">
    {@render header?.()}
  </div>

  {@render children()}
</article>

<style>
  article {
    background-color: white;
    background-image: url("/paper.png");
    box-shadow: 0.125rem 0.125rem 0.25rem rgb(0 0 0 / 0.6);
    padding: 3rem 1.5rem;
    container-type: inline-size;
    container-name: sheet;
  }

  .topmargin {
    height: 3rem;
  }

  @media (min-width: 600px) {
    article {
      padding: 8rem 6rem;
      padding-top: 0;
    }

    .topmargin {
      height: 8rem;
    }
  }
</style>
