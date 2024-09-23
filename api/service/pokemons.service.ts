import { getRandomPokemonReq } from "../interfaces/users.interfaces";
import { pokemonRepository } from "../repository/pokemons.repository";
import { userPokemonRepository } from "../repository/user-pokemon.repository";
import { userRepository } from "../repository/users.repository";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";

export const pokemonService = {
  getRandomPokemon,
  getPokemons,
};

async function getRandomPokemon(userId: string) {
  const userExists = await userRepository.checkUserExists(userId);
  if (!userExists) {
    throw new Error("User not found");
  }

  const ownedPokemonIds = await userPokemonRepository.getUserPokemons(userId);

  const listedIds = ownedPokemonIds.map((pokemon) => pokemon.pokemon_id);

  const availablePokemons = await pokemonRepository.getRandomPokemon(listedIds);

  if (!availablePokemons || availablePokemons.length === 0) {
    throw new Error("No available pokemons");
  }

  return availablePokemons[0];
}

async function getPokemons(options: PokemonQueryOptions) {
  const { filters } = options;

  const listedIds = filters?.user_id
    ? (await userPokemonRepository.getUserPokemons(filters.user_id)).map(
        (pokemon) => pokemon.pokemon_id
      )
    : undefined;

  return pokemonRepository.getPokemons(options, listedIds);
}
