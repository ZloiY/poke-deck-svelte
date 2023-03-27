<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { onMount } from "svelte";
  import { Motion } from "svelte-motion";
  import type { Deck } from "@prisma/client";
  import type { Pokemon } from "@prisma/client";
  import Add from "@icons/add-card.svg?component";
  import Delete from "@icons/delete.svg?component";
  import Private from "@icons/private.svg?component";
  import BlankDeckCard from "./BlankDeckCard.svelte";
  import { trpcAstro } from "src/api";
  import { authHeader } from "src/utils/accessTokenStore";
  import PreviewCard from "../PreviewCard.svelte";

  export let className = "";
  export let notInteractive = false;
  export let deck: Deck & { username?: string };
  export let onClick: (deckId: string) => void;
  export let addCard: (deckId: string) => void;
  export let removeDeck: (deckId: string) => void;

  let pokemons: Promise<Pokemon[]> = Promise.resolve([]);

  onMount(() => {
    pokemons = trpcAstro($authHeader)
    .pokemon.getPokemonsByDeckId.query(deck.id)
  })
  
  let isHovered = false;

  const translateY = (index: number, amount: number) =>
    isHovered
      ? (-1 * index ** 2 + (amount - 1) * index) * -15
      : index * (notInteractive ? -4 : -10);

  const translateX = (index: number, amount: number) =>
    isHovered ? -150 + (index / (amount - 1)) * 300 : 0;

  const rotate = (index: number, amount: number) =>
    isHovered
      ? (-60 * amount) / 6 +
        ((index / (amount - 1)) * 120 * amount) /
          6
      : index * Math.ceil(Math.random() * 10 - 5);


  const goToTheDeck = () => {
    location.assign(`/pokemons/${deck.id}`)
  }

  $:firstSixOrLess = pokemons.then((pokemons) => {
    if (pokemons.length >= 6) {
      return Array.from(Array(6)).map((_, index) => {
        return pokemons[index]
      });
    } else {
      return pokemons;
    }
  })

</script>
<BlankDeckCard
  {className}
  {notInteractive}
  on:click={() => onClick?.(deck.id)}
>
  {#if !deck.isFull && addCard}
    <div
      role="button"
      on:click={() => addCard?.(deck.id)}
    >
      <Add
        class="absolute top-2 left-1 w-14 h-14 text-white hover:text-yellow-400 active:text-yellow-500 active:scale-90 cursor-pointer"
      />
    </div>
  {/if}
  {#if deck.private}
    <Private
      class={twMerge(
        "absolute top-2 right-1 text-white w-14 h-14",
        notInteractive && "top-1 right-0 w-5 h-5",
      )}
    />
  {/if}
  <div
    role="button"
    class={twMerge(
      "flex flex-col gap-5 justify-between items-center w-64 h-full",
      notInteractive && "gap-2 justify-end",
    )}
    on:click={goToTheDeck}
  >
    <div
      class={twMerge(
        "relative mt-20 w-40 h-60",
        notInteractive && "mt-0 mb-10 w-10 h-16",
      )}
      on:mouseenter={() => (isHovered = true)}
      on:mouseleave={() => (isHovered = false)}
    >
    {#await firstSixOrLess then firstSixOrLessResolved }
      {#each firstSixOrLessResolved as pokemon, index (pokemon.name)}
        <Motion let:motion
          animate={{
            y: translateY(index, firstSixOrLessResolved.length),
            x: translateX(index, firstSixOrLessResolved.length),
            rotate: rotate(index, firstSixOrLessResolved.length),
            zIndex: isHovered ? 2 : 1,
          }}
        >
          <div
            use:motion
            class="absolute"
          >
            <PreviewCard
              className={twMerge(
                "w-40 h-60 pb-0 text-xl border-2 rounded-xl border-yellow-500",
                notInteractive && "w-14 h-24 text-xs border",
              )}
              {pokemon}
              nameOnSide={isHovered}
              notInteractive
            />
          </div>
        </Motion>
      {/each}
    {/await }
    </div>
    {#if deck.username}
      <p class="text-2xl">Owner: {deck.username}</p>
    {/if}
    <p class={twMerge("text-2xl", notInteractive && "text-base")}>
      {deck.name}
    </p>
    <p class={twMerge("text-xl", notInteractive && "text-sm")}>
      {deck.deckLength}/{import.meta.env.PUBLIC_DECK_MAX_SIZE}
    </p>
  </div>
  {#if removeDeck}
    <div
      role="button"
      on:click={() => removeDeck?.(deck.id)}
    >
      <Delete
        class="absolute right-1 bottom-2 w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
      />
    </div>
  {/if}
</BlankDeckCard>

