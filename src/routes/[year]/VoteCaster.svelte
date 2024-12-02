<script lang="ts">
  import type { Cookie } from "$lib/Database";
  import { SvelteMap } from "svelte/reactivity";
  import CookieInfo from "./CookieInfo.svelte";
  import Icon from "$lib/components/Icon.svelte";

  const { cookies }: { cookies: Cookie[] } = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  const ordered = $state(Array.from(cookies));

  export function show() {
    dialog?.showModal();
  }
</script>

<dialog bind:this={dialog}>
  <form action="?/vote" method="POST">
    {#each ordered as cookie, i (cookie.id)}
      <div class="cookie" draggable>
        <div class="handle">
          <p class="counter">{i + 1}</p>
          <Icon>drag_handle</Icon>
        </div>
        <picture>
          <img
            src={cookie.image_url}
            alt="Photo of &ldquo;{cookie.name}&rdquo;"
            height="64"
            width="64"
          />
        </picture>
        <div class="content">
          <p class="title">
            {cookie.name}
          </p>
          <textarea name="comment[{cookie.id}]" rows="2" placeholder="Leave your review"></textarea>
        </div>
      </div>
    {/each}
  </form>
</dialog>

<style>
  .cookie {
    cursor: grab;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .title {
    font-size: 1.25rem;
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
  }

  .handle {
    font-size: 1.5rem;
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 4rem;
    color: rgb(0 0 0 / 0.5);
  }

  .cookie:hover:not(:has(textarea:hover)) .handle {
    color: rgb(0 0 0);
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .cookie:active {
    cursor: grabbing;
  }

  picture {
    aspect-ratio: 1 / 1;
    width: 4rem;
    height: 4rem;
    background-color: rgb(0 0 0 / 0.05);
    overflow: hidden;
  }

  textarea {
    background: rgb(255 255 255 / 0.7);
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 0.5rem;
    resize: vertical;
  }
</style>
