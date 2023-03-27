<script lang="ts">
  import FilledDeckCard from "./FilledDeckCard.svelte";
  import EmptyDeckCard from "./EmptyDeckCard.svelte";
    import type { Deck } from "@prisma/client";

  export let deck: Deck & { username?: string };
  export let className = "";
  export let notInteractive = false;
  export let addCard: (deckId: string) => void;
  export let removeDeck: (deckId: string) => void;
  export let onClick: (dekcId: string) => void;
</script>

{#if deck.isEmpty}
  <EmptyDeckCard
  {deck}
  {className}
  {notInteractive}
  {addCard}
  {removeDeck}
  />
{:else}
  <FilledDeckCard 
    {deck}
    {className}
    {notInteractive}
    {onClick}
    {addCard}
    {removeDeck}
  />
{/if}
