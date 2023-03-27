<script lang="ts">
  import { Motion, AnimatePresence } from "svelte-motion";
  import type { Pokemon } from "pokenode-ts";
  import { twMerge } from "tailwind-merge";
  import { cardsGridStyle } from "src/utils/styles";
  import { flipState } from "src/utils/flipStore";
  import { trpcAstro } from "src/api";
  import { authHeader } from "src/utils/accessTokenStore";
  import { pushNewMessage } from "src/utils/notificationStore";
  import FlipCard from "./Cards/FlipCard.svelte";
  import Spinner from "./Spinner.svelte";
  import { onMount } from "svelte";

  export let deckId = "";
  let pokemons: Pokemon[] = [];
  let isRefetching = false;
  const trpcClient = trpcAstro($authHeader);

  const refetchPokemons = async () => {
    isRefetching = true;
    pokemons = await trpcClient.pokemon.getPokemonDetailedList.query(deckId);
    isRefetching = false;
  }

  const removePokemon = async (pokemon: Pokemon) => {
    isRefetching = true;
    const message = await trpcClient.pokemon.removePokemonFromDeck.mutate({
      deckId,
      pokemonName: pokemon.name,
    });
    pushNewMessage(message);
    if (message.state == "Success") {
      refetchPokemons();
    } else {
      isRefetching = false;
    }
  }

  onMount(() => {
    refetchPokemons();
  });

</script>
{#if isRefetching}
  <div class="absolute inset-0 backdrop-blur-md z-[100] justify-center items-center">
    <Spinner className="h-60 w-60 text-orange-500" />
  </div>
{/if}
<div class={twMerge("w-full mt-5", cardsGridStyle)}>
  {#each pokemons as pokemon, index (pokemon.name)}
   <Motion let:motion
     initial={{ opacity: 0, scale: 0 }}
     animate={{ opacity: 1, scale: 1 }}
     transition={{
       duration: 0.1,
       type: "spring",
       stiffness: 80,
       delay: index * 0.2,
     }}
   >
   <div use:motion>
     <FlipCard
       keepFlipped={$flipState}
       pokemon={pokemon}
       removeFromDeck={removePokemon}
     />
   </div>
   </Motion>
  {/each}
</div>
