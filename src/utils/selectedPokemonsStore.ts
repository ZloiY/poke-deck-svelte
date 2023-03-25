import type { Pokemon } from "pokenode-ts";
import { createStore } from "./mapStore";

const { reset: resetSelctedPokemons,
  valuesArr: selectedPokemons,
  pushValue: pushPokemon,
  removeValue: removePokemon,
} = createStore<Pokemon>();
export { resetSelctedPokemons, selectedPokemons, pushPokemon, removePokemon }; 
