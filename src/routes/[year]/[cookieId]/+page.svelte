<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "$lib/components/Icon.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import InfoSection from "./InfoSection.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/components/Button.svelte";

  const { data }: { data: PageData } = $props();
  const { cookie, account } = $derived(data);
</script>

<main>
  <Sheet>
    <div class="page">
      <nav>
        <a href="/"><Icon>west</Icon> Tasting Menu 2024</a>
      </nav>

      <InfoSection {cookie} />

      <hr />

      <form action="/review" method="POST" use:enhance>
        <input name="cookie_id" value={cookie.id} type="hidden" />
        <input name="year" value={cookie.year} type="hidden" />

        <textarea name="comment" rows={4} placeholder="Leave a review"></textarea>
        <div class="actions">
          {#if !account}<p class="note">You must be signed in to leave a review</p>{/if}
          <Button disabled={!account}>Submit</Button>
        </div>
      </form>
    </div>
  </Sheet>
</main>

<style>
  main {
    max-width: 60rem;
    margin: 0 auto;
  }

  .page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

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

  hr {
    width: 75%;
    margin: 0 auto;
    border: 1px solid rgb(0 0 0 / 0.12);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  textarea {
    background: rgb(255 255 255 / 0.7);
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 1rem;
  }

  .actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: end;
    align-items: center;
  }

  .note {
    color: rgb(0 0 0 / 0.7);
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
