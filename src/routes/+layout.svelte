<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import Prompt from "$lib/components/Prompt.svelte";
  import Snowflakes from "$lib/components/Snowflakes.svelte";

  const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<div class="snowfall">
  <Snowflakes />
</div>

<div class="content">
  {@render children()}
</div>

<style>
  :global {
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: var(--font-body);
      font-weight: 400;
    }

    :root {
      --font-display: "Baskerville", "Libre Baskerville", serif;
      --font-body: "Avenir", "Montserrat", sans-serif;

      font-size: 16px;
    }

    body {
      min-width: 100vw;
      min-height: 100vh;
      overflow-x: hidden;
    }
  }

  .content {
    position: relative;
    padding: 4rem 2rem;
  }

  .snowfall {
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100lvw;
    height: 100lvh;
    background-image: linear-gradient(
      to bottom,
      rgb(47 46 55),
      rgb(42 66 102) 35%,
      rgb(215 248 255)
    );
  }
</style>
