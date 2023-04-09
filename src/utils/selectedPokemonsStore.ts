import type { Pokemon } from "pokenode-ts";
import { createStore } from "./mapStore";


const { reset: resetSelctedPokemons,
  valuesArr: selectedPokemons,
  pushValue: pushPokemon,
  removeValue: removePokemon,
} = createStore<Pokemon>();

if (typeof window !== 'undefined') {
  selectedPokemons.subscribe((pokemons) => {
    window.onbeforeunload = () => {
        sessionStorage.setItem("selectedPokemons", JSON.stringify(pokemons));
    };
  });
}

if (typeof window !== 'undefined') {
  window.onload = () => {
      JSON.parse(sessionStorage.getItem("selectedPokemons") ?? "")
      .map((pokemon: Pokemon) => pushPokemon(pokemon));
  }
}

export { resetSelctedPokemons, selectedPokemons, pushPokemon, removePokemon }; 
