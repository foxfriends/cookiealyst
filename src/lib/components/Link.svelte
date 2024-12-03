<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  const { children, ...props }: HTMLAnchorAttributes = $props();
</script>

<a {...props}>{@render children?.()}</a>

<style>
  a {
    color: inherit;
    text-decoration: none;
    outline: none;
    text-transform: lowercase;
  }

  a:where(:hover, :focus) {
    text-decoration: underline;
    text-underline-offset: 0.35rem;
  }
</style>
