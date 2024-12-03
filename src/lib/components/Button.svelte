<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  const {
    children,
    compact = false,
    icon = false,
    ...props
  }: { compact?: boolean; icon?: boolean } & HTMLButtonAttributes = $props();
</script>

<button class:compact class:icon {...props}>{@render children?.()}</button>

<style>
  button {
    border: 1px solid rgb(0 0 0 / 0.25);
    border-radius: 2px;
    padding: 0.25rem 1rem;
    background: none;
    text-transform: uppercase;
    font-size: 0.85rem;
    font-weight: 600;
    flex-shrink: 0;
    outline: none;
  }

  button.compact {
    padding: 0 0.25rem;
    font-size: 0.75rem;
  }

  button.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 1.5rem;
    aspect-ratio: 1 / 1;
  }

  button.icon.compact {
    border-color: transparent;
  }

  button:not(:disabled):where(:hover, :focus-visible),
  button.icon.compact:not(:disabled):where(:hover, :focus-visible) {
    border-color: rgb(0 0 0 / 0.75);
  }

  button:not(:disabled) {
    cursor: pointer;
    color: inherit;
  }

  button:disabled {
    color: rgb(0 0 0 / 0.45);
  }
</style>
