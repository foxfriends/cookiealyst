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

  function shiftUp(cookie: Cookie) {
    const index = ordered.indexOf(cookie);
    ordered.splice(index, 1);
    ordered.splice(index - 1, 0, cookie);
  }

  function shiftDown(cookie: Cookie) {
    const index = ordered.indexOf(cookie);
    ordered.splice(index, 1);
    ordered.splice(index + 1, 0, cookie);
  }
</script>

<dialog bind:this={dialog}>
  <Button icon onclick={() => dialog?.close()}><Icon>close</Icon></Button>
  <form action="?/vote" method="POST">
    <header>
      <h1>Cast Your Votes</h1>
      <p class="info">Sort the cookies in your order of preference. Optionally, leave a review.</p>
    </header>
    <div class="cookie-list">
      {#each ordered as cookie, i (cookie.id)}
        <div class="ballot">
          <input type="hidden" name="cookies[{i}]" value={cookie.id} />
          <div class="handle" draggable>
            <Button icon compact onclick={(event) => (event.preventDefault(), shiftUp(cookie))}
              ><Icon>keyboard_arrow_up</Icon></Button
            >
            <p class="counter">{i + 1}</p>
            <Icon>drag_handle</Icon>
            <Button icon compact onclick={(event) => (event.preventDefault(), shiftDown(cookie))}
              ><Icon>keyboard_arrow_down</Icon></Button
            >
          </div>
          <div class="content">
            <div class="cookie">
              <picture>
                <img
                  src={cookie.image_url}
                  alt="Photo of &ldquo;{cookie.name}&rdquo;"
                  height="64"
                  width="64"
                />
              </picture>
              <p class="title">
                {cookie.name}
              </p>
            </div>
            <textarea name="comments[{cookie.id}]" rows="2" placeholder="Leave your review" cols="0"
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
    width: max-content;

    border: none;
    box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 0.25);
    background-color: white;
    background-image: url("/paper.png");
    overflow-y: auto;
  }

  @media (min-width: 400px) {
    dialog {
      margin: 8rem auto;
      max-height: calc(100vh - 16rem);
      padding: 4rem 2rem;
    }
  }

  header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .info {
    font-size: 0.75rem;
    font-weight: 500;
    max-width: 50ch;
    text-align: center;
    text-transform: uppercase;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .action {
    margin: 0 auto;
  }

  .cookie-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ballot,
  .cookie {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .ballot {
    align-items: flex-start;
  }

  .cookie {
    align-items: center;
  }

  .title {
    font-size: 1.25rem;
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
  }

  .handle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    flex-shrink: 0;
    font-size: 1.5rem;
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
    color: rgb(0 0 0 / 0.5);
    user-select: none;
    cursor: grab;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
