<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import BlankDeckCard from "./BlankDeckCard.svelte";
  import AddCard from "@icons/add-card.svg?component";
  import Private from "@icons/delete.svg?component";
  import DeleteDeck from "@icons/delete.svg?component";
  import type { Deck } from "@prisma/client";

  export let className = "";
  export let notInteractive = false;
  export let deck: Deck & { username?: string };
  export let addCard: (deckId: string) => void;
  export let removeDeck: (deckId: string) => void;
</script>

<BlankDeckCard {className} {notInteractive}>
  {#if deck.private}
    <Private
      className={twMerge(
        "absolute top-2 left-1 w-10 h-10",
        notInteractive && "top-40 left-0",
      )}
    />
  {/if}
  <div
    on:click={() => addCard?.(deck.id)}
    class="relative flex justify-center items-center h-full w-64"
  >
    <div>
      <AddCard role="button" class="w-full h-full mx-auto" />
      {#if addCard}
        <p class="font-coiny mt-4 text-2xl text-center">
          Add cards to the deck
        </p>
      {/if}
      {#if deck.username}
        <p class="font-fredoka text-2xl text-center mt-2">
          Owner: {deck.username}
        </p>
      {/if}
    </div>
    <p
      class={twMerge(
        "absolute top-0 font-coiny text-3xl",
        notInteractive && "text-base",
      )}
    >
      {deck.name}
    </p>
  </div>
  {#if removeDeck}
    <div
      class="absolute bottom-2 right-1 w-14 h-14"
      on:click={() => removeDeck?.(deck.id)}
    >
      <DeleteDeck
        class="w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
      />
    </div>
  {/if}
</BlankDeckCard>

