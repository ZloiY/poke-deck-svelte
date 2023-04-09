<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import { twMerge } from "tailwind-merge";
  import type { Pokemon as PokemonDB } from "@prisma/client";
  import Add from "@icons/add.svg?component";
  import Remove from "@icons/close-circle.svg?component";
  import Delete from "@icons/delete.svg?component";
  
  import BlankCard from "./BlankCard.svelte";
  import Switcher from "../Switcher.svelte";
  import { authPayload } from "src/utils/accessTokenStore";
  import { pushPokemon, removePokemon } from "src/utils/selectedPokemonsStore";

  export let isSelected = false;
  export let disableButtons = false;
  export let pokemon: Pokemon;
  export let pokemonsInDeck: PokemonDB[] = [];
  export let selectedPokemons: Pokemon[] = [];
  export let removeFromDeck: (pokemon: Pokemon) => void;

  let spriteIndex = 0;

  const switchSprite = (direction: "prev" | "next") => () => {
    if (direction == "next") {
      const newIndex = spriteIndex + 1;
      if (newIndex >= sprites.length) {
        spriteIndex = 0;
      } else {
        spriteIndex = newIndex;
      }
    } else {
      const newIndex = spriteIndex - 1;
      if (newIndex < 0) {
        spriteIndex = sprites.length - 1;
      } else {
        spriteIndex = newIndex;
      }
    }
  };

  $:sprites = [
    pokemon?.sprites.other?.["official-artwork"].front_default,
    pokemon?.sprites.other?.dream_world.front_default,
    pokemon?.sprites.other?.dream_world.front_female,
    pokemon?.sprites.other?.home.front_default,
    pokemon?.sprites.other?.home.front_female,
    pokemon?.sprites.front_default,
    pokemon?.sprites.front_female,
  ].filter((item) => !!item);
  $:currentSprite = sprites[spriteIndex];
  $:isInDeck = !!pokemonsInDeck.find(({ name }) => name == pokemon.name) 
  $:pokemonAdded = !!selectedPokemons.find(({ name }) => name == pokemon.name)
  $:isDeckFull = selectedPokemons.length + pokemonsInDeck.length
    == +import.meta.env.PUBLIC_DECK_MAX_SIZE
</script>

<BlankCard
  className={twMerge(
    "transition-all",
    isSelected && "shadow-[0_0_15px_4px] shadow-orange-500 scale-105",
  )}
>
  {#if pokemonAdded}
    <div
      role="button"
      on:click={() => removePokemon(pokemon)}
    >
      <Remove
        class="absolute top-2 left-2 h-7 w-7 cursor-pointer text-red-500 hover:text-red-400 z-10"
      />
    </div>
  {:else if !removeFromDeck && $authPayload && !isDeckFull && !isInDeck && !disableButtons}
    <div
      role="button"
      on:click={() => pushPokemon(pokemon)}
    >
      <Add
        class="absolute top-2 left-2 h-7 w-7 cursor-pointer text-white hover:text-yellow-500 z-10"
      />
    </div>
  {/if}
  {#if removeFromDeck}
    <div
      role="button"
      on:click={() => removeFromDeck(pokemon)}
    >
      <Delete
        class="absolute top-2 left-2 h-10 w-10 cursor-pointer text-red-700 hover:text-red-400 z-10"
      />
    </div>
  {/if}
  <div class="relative h-full pb-4">
    <div class="flex h-full flex-col items-stretch justify-between gap-4 mt-2">
      <div class="flex gap-7">
        <div class="relative h-40 basis-40">
          <img src={currentSprite} alt={`${pokemon.name} image`} />
          <div
            class="absolute bottom-0 right-0 text-white scale-75"
          >
            <Switcher
              onNext={switchSprite("next")}
              onPrev={switchSprite("prev")}
            />
          </div>
        </div>
        <div class="flex flex-col items-center text-center gap-7">
          <span class="text-2xl capitalize">{pokemon.name}</span>
          <div class="flex flex-col gap-5">
            <span class="text-xl">
              Height:{" "}
              <span class="text-yellow-500">
                {pokemon.height ?? "..."}
              </span>
            </span>
            <span class="text-xl">
              Weight:{" "}
              <span class="text-yellow-500">
                {pokemon.weight ?? "..."}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <span class="text-xl">Abilities:</span>
        <div class="flex flex-wrap justify-between gap-1">
          {#each pokemon.abilities as ability (ability.ability.name)}
            <span
              class="text-lg capitalize text-yellow-500"
            >
              {ability.ability.name}
            </span>
          {/each}
        </div>
      </div>
      <div class="self-end">
        <span class="text-xl">Stats:</span>
        <div class="grid grid-cols-3 items-end gap-x-6 gap-y-4">
          {#each pokemon.stats as stat (stat.stat.name)}
            <div>
              <span>{stat.stat.name}</span>
              <div
                class={twMerge(
                  "relative flex h-5 w-20 items-center justify-center border-2 border-orange-400 bg-transparent",
                  stat.base_stat > 100 && "border-0",
                )}
              >
                <span class="z-10">{stat.base_stat}</span>
                <div
                  class={twMerge(
                    "absolute top-0 left-0 h-full bg-orange-400",
                    stat.base_stat > 100 && "bg-red-500",
                  )}
                  style:width={`${stat.base_stat}%`}
                />
              </div>
            </div>
           {/each}
        </div>
      </div>
    </div>
  </div>
</BlankCard>

