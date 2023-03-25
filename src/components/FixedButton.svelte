<script lang="ts">
  import { selectedPokemons } from "src/utils/selectedPokemonsStore";
  import Check from "@icons/check.svg?component"

  export let existingPokemonsLength = 0;
  
  let hovered = false;
</script>

{#if $selectedPokemons.length > 0}
  <div
    role="button"
    on:mouseenter={() => (hovered = true)}
    on:mouseleave={() => (hovered = false)}
    on:click
    class={`fixed right-2 bottom-2
    flex justify-center items-center rounded-full h-16 w-16 bg-white text-purple-900 text-2xl cursor-pointer
    hover:bg-green-500 hover:text-white transition-all z-50
    shadow-xl`}
  >
    {#if hovered}
      <Check class="opacity-0 text-white hover:opacity-100 h-full w-full m-2" />
    {:else}
      <p class="text-lg">
        {$selectedPokemons.length + existingPokemonsLength}/
        {import.meta.env.PUBLIC_DECK_MAX_SIZE}
      </p>
    {/if}
  </div>
{/if}

