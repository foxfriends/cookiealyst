<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import Prompt from "$lib/components/Prompt.svelte";

  const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<article class="account-status" role="status">
  {#if data.account}
    <form action="/logout" method="POST" use:enhance>
      <Prompt>
        Welcome, <span style="text-transform: none; font-weight: 600">{data.account}</span>!
      </Prompt>
      <Button compact>Sign out</Button>
    </form>
  {:else}
    <form action="/login" method="POST" use:enhance>
      <label class="prompt" for="account_id">
        <Prompt>Enter your name to rank and review</Prompt>
      </label>
      <div class="field">
        <Input id="account_id" name="account_id" placeholder="NAME" required />
        <Button compact>Sign in</Button>
      </div>
    </form>
  {/if}
</article>

{@render children()}

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
      --color-ice: rgb(214 255 250);
      --color-snow: rgb(232 246 250);
      --font-display: "Baskerville", "Libre Baskerville", serif;
      --font-body: "Avenir", "Montserrat", sans-serif;

      font-size: 16px;
    }

    body {
      background-color: var(--color-ice);
      background-image: linear-gradient(to bottom, var(--color-snow), var(--color-ice));
      min-width: 100vw;
      min-height: 100vh;
    }
  }

  .account-status {
    max-width: 60rem;
    margin: 1rem auto;
    padding: 0 1rem;
  }

  @media (min-width: 600px) {
    .account-status {
      padding: 0 6rem;
    }
  }

  form {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: end;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .field {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: end;
    flex-wrap: wrap;
  }
</style>
