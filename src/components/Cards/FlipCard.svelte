<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import type { Pokemon as PokemonDB } from "@prisma/client";
  import { twMerge } from "tailwind-merge";
  import PreviewCard from "./PreviewCard.svelte";
    import DetailsCard from "./DetailsCard.svelte";

  export let selectedPokemons: Pokemon[] = [];
  export let pokemonsInDeck: PokemonDB[] = [];
  export let pokemon: Pokemon;
  export let keepFlipped: FlipState = "Preview";
  export let removeFromDeck: (pokemon: Pokemon) => void;

  $:isSelected = !![...selectedPokemons, ...pokemonsInDeck]
  .find((selectedPokemon) => selectedPokemon.name == pokemon.name);

  $:isHovered = isSelected ? "Details" : keepFlipped;
  const setHovered = (state: FlipState) => {
    isHovered = state;
  }
  const unHover = () => {
    if (keepFlipped != "Details" && !isSelected) {
      setHovered("Preview");
    }
  }
</script>

<div
  class="relative"
  on:mouseenter={() => setHovered("Details")}
  on:mouseleave={() => unHover()}
>
  <div
    class={twMerge("z-10",
    isHovered == "Preview" ? "show-preview" : "hide-preview")}
  >
    <PreviewCard pokemon={pokemon} />
  </div>
  <div
    class={twMerge("absolute top-0 z-30",
    isHovered == "Details" ? "show-details" : "hide-details")}
  >
    <DetailsCard
      pokemon={pokemon}
      selectedPokemons={selectedPokemons}
      isSelected={isSelected}
      pokemonsInDeck={pokemonsInDeck}
      removeFromDeck={removeFromDeck}
    />
  </div>
</div>

<style>
  .hide-preview {
    animation: flipPreview 0.3s ease-in;
    opacity: 0;
    transform: rotateY('180deg');
  }
  .show-preview {
    animation: flipPreview 0.3s ease-in;
    animation-direction: reverse;
    opacity: 1;
    transform: rotateY('0deg');
  }
  .hide-details {
    animation: flipDetails 0.3s ease-in;
    animation-direction: reverse;
    opacity: 0;
    transform: rotateY('180deg');
  }
  .show-details{
    animation: flipDetails 0.3s ease-in;
    opacity: 1;
    transform: rotateY('0deg');
  }
  @keyframes flipPreview {
    from {
      opacity: 1;
      perspective: 300px;
      rotateY: 0;
    }
    to {
      opacity: 0;
      perspective: 600px;
      rotateY: 180;
    }
  }
  @keyframes flipDetails {
    from {
      opacity: 0;
      perspective: 600px;
      rotateY: 180;
    }
    to {
      opacity: 1;
      perspective: 300px;
      rotateY: 0
    }
  }
</style>

