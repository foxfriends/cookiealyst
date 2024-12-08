<script lang="ts">
  import type { Cookie } from "$lib/Database";
  import Icon from "$lib/components/Icon.svelte";
  import Button from "$lib/components/Button.svelte";
  import { flip } from "svelte/animate";
  import type { ActionData } from "./$types";
  import Error from "$lib/components/Error.svelte";
  import { applyAction, enhance } from "$app/forms";

  const { cookies, form }: { cookies: Cookie[]; form?: ActionData } = $props();

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

  let dragTarget: string | undefined = $state();
  let mouseDragging = $state(false);
  let touchDragging: Touch | null = $state(null);
  let draggedY = $state(0);

  function reorderCookies(cookieId: string | undefined) {
    if (!cookieId) return;
    const draggingElement = dialog!.querySelector(`[data-cookie='${cookieId}']`);
    if (!draggingElement) return;
    const { top, height } = draggingElement.getBoundingClientRect();
    const dropY = top + height / 2;
    const droppedBefore = Array.from(dialog!.querySelectorAll("[data-cookie]"))
      .filter((element) => element instanceof HTMLDivElement)
      .filter((element) => element.dataset.cookie && element.dataset.cookie !== cookieId)
      .find((element) => {
        const { top, height } = element.getBoundingClientRect();
        const y = top + height / 2;
        return y > dropY;
      });
    const oldIndex = ordered.findIndex((cookie) => cookie.id === cookieId);
    const [cookie] = ordered.splice(oldIndex, 1);
    const newIndex = droppedBefore
      ? ordered.findIndex((cookie) => cookie.id === droppedBefore.dataset.cookie)
      : ordered.length;
    ordered.splice(newIndex, 0, cookie);
  }

  function onmousedown(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    mouseDragging = true;
    dragTarget = (event.currentTarget.closest(".ballot")! as HTMLDivElement).dataset.cookie;
  }

  function onmouseup(event: MouseEvent) {
    if (event.button === 0 && mouseDragging) {
      reorderCookies(dragTarget);
      mouseDragging = false;
      dragTarget = undefined;
      draggedY = 0;
    }
  }

  function onmousemove(event: MouseEvent) {
    if (!mouseDragging) return;
    draggedY += event.movementY;
  }

  function ontouchstart(event: TouchEvent & { currentTarget: HTMLDivElement }) {
    if (touchDragging === null && event.changedTouches.length === 1) {
      touchDragging = event.changedTouches[0]!;
      dragTarget = (event.currentTarget.closest(".ballot")! as HTMLDivElement).dataset.cookie;
    }
    event.stopPropagation();
  }

  function ontouchend(event: TouchEvent) {
    if (
      touchDragging &&
      !Array.from(event.touches).some((touch) => touch.identifier === touchDragging!.identifier)
    ) {
      reorderCookies(dragTarget);
      touchDragging = null;
      dragTarget = undefined;
      draggedY = 0;
    }
  }

  function ontouchmove(event: TouchEvent) {
    if (touchDragging === null) return;
    const previous = touchDragging;
    const current = Array.from(event.touches).find(
      (touch) => touch.identifier === previous.identifier,
    );
    if (!current) return;
    draggedY += current.clientY - previous.clientY;
    touchDragging = current;
  }
</script>

<dialog bind:this={dialog}>
  <Button icon onclick={() => dialog?.close()}><Icon>close</Icon></Button>
  <form
    action="?/vote"
    method="POST"
    use:enhance={() =>
      async ({ result }) => {
        if (result.type === "success") window.location.reload();
        else applyAction(result);
      }}
  >
    <header>
      <h1>Cast Your Votes</h1>
      <p class="info">Sort the cookies in your order of preference. Optionally, leave a review.</p>
    </header>
    <div class="cookie-list">
      {#each ordered as cookie, i (cookie.id)}
        <div
          class="ballot"
          class:dragging={dragTarget === cookie.id}
          style="--drag-y: {draggedY}px;"
          data-cookie={cookie.id}
          animate:flip={{ duration: 100 }}
        >
          <input type="hidden" name="cookies[{i}]" value={cookie.id} />
          <div class="handle" {onmousedown} {ontouchstart} role="presentation">
            <Button icon compact onclick={(event) => (event.preventDefault(), shiftUp(cookie))}>
              <Icon>keyboard_arrow_up</Icon>
            </Button>
            <p class="counter">{i + 1}</p>
            <Icon>drag_handle</Icon>
            <Button icon compact onclick={(event) => (event.preventDefault(), shiftDown(cookie))}>
              <Icon>keyboard_arrow_down</Icon>
            </Button>
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
      {#if form?.message}
        <Error>{form.message}</Error>
      {/if}
      <Button>Submit</Button>
    </div>
  </form>
</dialog>

<svelte:window {onmouseup} {onmousemove} {ontouchmove} {ontouchend} ontouchcancel={ontouchend} />

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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .cookie-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    isolation: isolate;
  }

  .ballot,
  .cookie {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .ballot.dragging {
    transform: translateY(var(--drag-y));
    z-index: 1;
    background-color: rgb(255 255 255 / 0.25);
    backdrop-filter: blur(1rem);
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
    touch-action: none;
  }

  .handle:active {
    cursor: grabbing;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-basis: 200px;
  }

  picture {
    aspect-ratio: 1 / 1;
    width: 4rem;
    height: 4rem;
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
