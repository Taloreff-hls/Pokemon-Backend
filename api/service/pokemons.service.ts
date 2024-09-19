import { pokemonRepo } from "../repository/pokemons.repo";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";

export const pokemonService = {
  getPokemons,
};

async function getPokemons(options: PokemonQueryOptions) {
  return await pokemonRepo.findPokemons(options);
}
