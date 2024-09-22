import { getRandomPokemonReq } from "../interfaces/users.interfaces";
import { pokemonRepository } from "../repository/pokemons.repository";
import { userPokemonRepository } from "../repository/user-pokemon.repository";
import { userRepository } from "../repository/users.repository";

export const pokemonService = {
  getRandomPokemon,
};

async function getRandomPokemon(userId: string) {
  if (typeof userId !== "string") {
    throw new Error("User ID is required and must be a string");
  }

  const userExists = await userRepository.checkUserExists(userId);
  if (!userExists) {
    throw new Error("User not found");
  }

  const ownedPokemonIds = await userPokemonRepository.getUserPokemons(userId);

  const listedIds = `('${ownedPokemonIds
    .map((pokemon) => pokemon.pokemon_id)
    .join("', '")}')`;

  const availablePokemons = await pokemonRepository.getRandomPokemon(listedIds);

  if (!availablePokemons || availablePokemons.length === 0) {
    throw new Error("No available pokemons");
  }

  return availablePokemons[0];
}
