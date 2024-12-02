<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import type { ActionData } from "./login/$types";

  const { children, data, form }: { children: Snippet; data: LayoutData; form: ActionData } =
    $props();
</script>

<article class="account-status" role="status">
  {#if data.account}
    <form action="/logout" method="POST" use:enhance>
      <p>Welcome, {data.account}!</p>
      <button>Sign out</button>
    </form>
  {:else}
    <form action="/login" method="POST" use:enhance>
      <label for="account_id">Enter your name to rank and review</label>
      <div class="field">
        <input id="account_id" name="account_id" placeholder="NAME" required />
        <button>Sign in</button>
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
      font-size: 1rem;
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
    padding: 0 6rem;
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

  label {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
  }

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

  button {
    border: none;
    padding: 0 0.5rem;
    background: none;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
  }
</style>
