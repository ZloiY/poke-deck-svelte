<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import { fly, scale } from "svelte/transition";
  import { twMerge } from "tailwind-merge";
  import { bounceIn } from "svelte/easing";
  import { cardsGridStyle } from "src/utils/styles";

  export let pokemons: Pokemon[] = [];
  export let paginationState: PaginationState = "Initial";

  $:flyDirection = paginationState != "Initial" && paginationState == "Next" ? -5000 : 5000;
</script>

<div class="h-full relative">
  <div
    out:fly={{ duration: 3000, x: flyDirection }}
    class={twMerge("w-full mt-5", cardsGridStyle)} 
  >
   {#each pokemons as pokemon, index (pokemon.name)}
     <div in:scale={{ duration: 150, delay: 150 * index, easing: bounceIn }}>
       <slot pokemon={pokemon}/> 
     </div>
   {/each}
  </div>
</div>

