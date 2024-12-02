<script lang="ts">
  import type { Cookie } from "$lib/Database";
  import { SvelteMap } from "svelte/reactivity";
  import CookieInfo from "./CookieInfo.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Button from "$lib/components/Button.svelte";

  const { cookies }: { cookies: Cookie[] } = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  const ordered = $state(Array.from(cookies));

  export function show() {
    dialog?.showModal();
  }
</script>

<dialog bind:this={dialog}>
  <form action="?/vote" method="POST">
    <header>
      <h1>Cast Your Votes</h1>
    </header>
    <div>
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
            <textarea name="comment[{cookie.id}]" rows="2" placeholder="Leave your review" cols="0"
            ></textarea>
          </div>
        </div>
      {/each}
    </div>

    <div class="action">
      <Button>Submit</Button>
    </div>
  </form>
</dialog>

<style>
  dialog {
    margin: 2rem auto;
    max-height: calc(100vh - 4rem);
    padding: 2rem 0.5rem;

    border: none;
    box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 0.25);
    background-color: white;
    background-image: url("/paper.png");
    overflow-y: auto;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .action {
    margin: 0 auto;
  }

  @media (min-width: 400px) {
    dialog {
      margin: 8rem auto;
      max-height: calc(100vh - 16rem);
      padding: 4rem 2rem;
    }
  }

  .cookie {
    cursor: grab;
    padding: 1rem 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
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
    flex-shrink: 0;
  }

  .cookie:hover:not(:has(textarea:hover)) .handle {
    color: rgb(0 0 0);
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex-basis: 200px;
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
    flex-shrink: 0;
  }

  textarea {
    background: rgb(255 255 255 / 0.7);
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 0.5rem;
    resize: vertical;
    width: 100%;
  }

  h1 {
    font-size: 2rem;
    font-family: var(--font-display);
    font-style: italic;
    text-align: center;
    text-transform: lowercase;
  }
</style>
