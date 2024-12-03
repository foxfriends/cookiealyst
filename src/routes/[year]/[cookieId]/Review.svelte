<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import type { Comment, Ranking, Review } from "$lib/Database";
  import { ordinal } from "$lib/ordinal";

  const {
    review,
    account,
    rankings,
  }: { review: Review & { comments: Comment[] }; rankings: Ranking[]; account?: string | null } =
    $props();

  const authorRanking = rankings.find((ranking) => ranking.account_id === review.account_id);

  const date = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true,
  });
</script>

<section
  data-review={review.id}
  data-author={review.account_id}
  data-timestamp={review.created_at.getTime()}
>
  <div class="review">
    <p class="meta">
      <strong>{review.account_id}</strong>
      {#if authorRanking}
        ranks this cookie <strong>{ordinal(authorRanking.ranking + 1)}</strong>
      {/if}
      at
      {date.format(review.created_at)}
    </p>
    <p>{review.comment}</p>
  </div>

  {#each review.comments as comment (comment.id)}
    {@const ranking = rankings.find((ranking) => ranking.account_id === comment.account_id)}
    <div class="comment">
      <p class="meta">
        <strong>{comment.account_id}</strong>
        {#if ranking}
          ranks this cookie <strong>{ordinal(ranking.ranking + 1)}</strong>
        {/if}
        at
        {date.format(new Date(comment.created_at))}
      </p>
      <p>{comment.comment}</p>
    </div>
  {/each}

  <form action="?/comment" method="POST">
    <input type="hidden" name="review_id" value={review.id} />

    <textarea name="comment" rows={2} placeholder="Reply with comment"></textarea>
    <div class="actions">
      {#if !account}<p class="note">You must be signed in to leave a comment</p>{/if}
      <Button disabled={!account}>Submit</Button>
    </div>
  </form>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .review,
  .comment {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    border: 1px solid rgb(0 0 0 / 0.12);
    flex-grow: 1;
    padding: 1rem;
  }

  .comment,
  form {
    margin-left: 8rem;
  }

  .meta {
    font-size: 0.75rem;
  }

  strong {
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  textarea {
    background: rgb(255 255 255 / 0.7);
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 1rem;
    resize: vertical;
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
