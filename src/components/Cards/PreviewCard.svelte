<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import type { Pokemon as PokemonDB } from "@prisma/client";
  import { twMerge } from "tailwind-merge";
  import BlankCard from "./BlankCard.svelte";

  export let pokemon: Pokemon | PokemonDB;
  export let className = '';
  export let notInteractive = false;
  export let nameOnSide = false;

  const imageUrl = "imageUrl" in pokemon ? pokemon.imageUrl 
  : pokemon.sprites.other?.["official-artwork"].front_default ?? "";
</script>

<BlankCard
  notInteractive={notInteractive}
  className={twMerge("text-3xl", className)}
>
  <div
    class="
    flex
    h-full
    max-w-xs flex-col
    items-center
    justify-between"
  >
    <div class="relative h-full flex justify-center items-center">
      <img
        src={imageUrl}
        alt={`${pokemon.name} image`}
        height={250}
        width={200}
      />
    </div>
    <span
      class={twMerge(
        "capitalize text-white transition-transform duration-200",
        nameOnSide && "-translate-x-16 -translate-y-16 rotate-90",
      )}
    >
      {pokemon.name}
    </span>
  </div>
</BlankCard>

