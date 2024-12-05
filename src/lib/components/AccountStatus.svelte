<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { ActionData } from "../../routes/login/$types";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import Prompt from "./Prompt.svelte";

  const { account, form }: { account: string | null; form?: ActionData } = $props();
</script>

<article class="account-status" role="status">
  {#if account}
    <form action="/logout" method="POST" use:enhance>
      <input type="hidden" value={$page.url.pathname} name="to" />
      <Prompt>
        Welcome, <span style="text-transform: none; font-weight: 600">{account}</span>!
      </Prompt>
      <Button compact>Sign out</Button>
    </form>
  {:else}
    <form action="/login" method="POST" use:enhance>
      <input type="hidden" value={$page.url.pathname} name="to" />
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

<style>
  .account-status {
    padding: 1rem 0;
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
