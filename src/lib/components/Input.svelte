<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  const { ...props }: HTMLInputAttributes = $props();
</script>

<input {...props} />

<style>
  input {
    border: none;
    border-bottom: 1px solid rgb(0 0 0 / 0.4);
    background: none;
    padding: 0 0.25rem;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    outline: none;
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
