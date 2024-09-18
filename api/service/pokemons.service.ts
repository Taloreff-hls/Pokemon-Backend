import { pokemonRepo } from "../repository/pokemons.repo";

export const pokemonService = {
  getRandomPokemon,
};

async function getRandomPokemon(userId: string) {
  const ownedPokemonIds = await pokemonRepo.getUserPokemons(userId);
  const availablePokemons = await pokemonRepo.getRandomPokemon(ownedPokemonIds);

  if (!availablePokemons.length) {
    throw new Error("No available Pokémon found");
  }

  return availablePokemons[0];
}
