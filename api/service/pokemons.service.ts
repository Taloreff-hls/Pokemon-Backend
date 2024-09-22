import { pokemonRepository } from "../repository/pokemons.repository";
import { userPokemonRepository } from "../repository/user-pokemon.repository";
import { userRepository } from "../repository/user.repository";

export const pokemonService = {
  getRandomPokemon,
  catchPokemon,
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

async function catchPokemon(userId: string, pokemonId: string) {
  const userExists = await userRepository.checkUserExists(userId);
  if (!userExists) {
    throw new Error("User not found");
  }

  await userPokemonRepository.addPokemonToUser(userId, pokemonId);
}
