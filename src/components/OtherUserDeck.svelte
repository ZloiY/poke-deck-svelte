<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import type { Deck } from "@prisma/client";
  import type { Pokemon } from "pokenode-ts";
  import { trpcAstro } from "src/api";
  import { authHeader } from "src/utils/accessTokenStore";
  import { onMount } from "svelte";
  import Spinner from "./Spinner.svelte";
  import DetailsCard from "./Cards/DetailsCard.svelte";
  import { cardsGridStyle } from "src/utils/styles";

  export let deckId = "";
  const trpcClient = trpcAstro($authHeader);
  let pokemons: Promise<Pokemon[]> = Promise.resolve([]);
  let deck: Promise<Deck & { username: string }>;

  onMount(() => {
    pokemons = trpcClient.pokemon.getPokemonDetailedList.query(deckId);
    deck = trpcClient.deck.getDeckById.query(deckId);
  });
</script>

<div
  class="mt-5 flex h-full flex-col gap-5"
>
 {#await Promise.all([pokemons, deck])}
   <div class="flex justify-center items-center">
     <Spinner className="w-60 h-60" />
   </div>
 {:then [pokemonsResolved, deckResolved]} 
   <div class="flex justify-between gap-5 text-3xl font-coiny text-white">
     <span>Owner: {deckResolved?.username ?? "..."}</span>
     <span>Deck name: {deckResolved?.name ?? "..."}</span>
     <span>
       Deck size: {deckResolved?.deckLength ?? "..."}/
       {import.meta.env.PUBLIC_DECK_MAX_SIZE}
     </span>
   </div>
     <div class={twMerge("mt-5", cardsGridStyle)}>
       {#each pokemonsResolved as pokemon (pokemon.name)}
         <DetailsCard pokemon={pokemon} />
       {/each}
     </div>
 {/await}
</div>

