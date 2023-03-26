<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import { Motion } from "svelte-motion";
  import { twMerge } from "tailwind-merge";
  import { cardsGridStyle } from "src/utils/styles";

  export let pokemons: Pokemon[] = [];
  export let paginationState: PaginationState = "Initial";

  $:flyDirection = paginationState != "Initial" && (paginationState == "Next" ? -5000 : 5000) || 0;
</script>

<div class="h-full relative">
  <Motion let:motion 
    initial={{ x: 0 }}
    animate={{ x: flyDirection }}
    transition={{
      duration: 12.5,
      type: "spring",
      mass: 11,
      stiffness: 100,
      bounce: 20
    }}
  >
    <div
      use:motion
      class={twMerge("w-full mt-5", cardsGridStyle)} 
    >
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
         <slot pokemon={pokemon}/> 
       </div>
     </Motion>
     {/each}
    </div>
  </Motion>
</div>

