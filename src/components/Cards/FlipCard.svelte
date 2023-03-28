<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import type { Pokemon as PokemonDB } from "@prisma/client";
  import { Motion } from "svelte-motion";
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
  <Motion let:motion
  initial={{ opacity: 1, rotateY: 0 }}
  animate={{
    opacity: isHovered == "Preview" ? 1 : 0,
    perspective: "600px",
    rotateY: isHovered == "Preview" ? 0 : 180,
  }}
  transition={{
    duration: 0.5,
    type: "spring",
    mass: 2,
    stiffness: 60,
  }}
  >
    <div
      use:motion
      class="z-10"
    >
      <PreviewCard pokemon={pokemon} />
    </div>
  </Motion>
  <Motion let:motion
    initial={{ opacity: 0, rotateY: 180 }}
    animate={{
      opacity: isHovered == "Details" ? 1 : 0,
      perspective: "600px",
      rotateY: isHovered == "Details" ? 0 : 180,
    }}
    transition={{
      duration: 0.5,
      type: "spring",
      mass: 2,
      stiffness: 60,
    }}
  >
    <div
      use:motion
      class="absolute top-0 z-30 opacity-0"
    >
      <DetailsCard
        {isSelected}
        pokemon={pokemon}
        selectedPokemons={selectedPokemons} 
        pokemonsInDeck={pokemonsInDeck}
        removeFromDeck={removeFromDeck}
      />
    </div>
  </Motion>
</div>

