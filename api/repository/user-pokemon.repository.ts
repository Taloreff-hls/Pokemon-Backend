import { getUserPokemonQuery } from "../interfaces/pokemons.interfaces";
import { prisma } from "../utils/prisma";

export const userPokemonRepository = {
  getUserPokemons,
  checkUserOwnsPokemon,
  addPokemonToUser,
};

async function getUserPokemons(userId: string) {
  return await prisma.$queryRaw<getUserPokemonQuery[]>`
    SELECT "pokemon_id" FROM "UserPokemon"
    WHERE "user_id" = ${userId}
  `;
}

async function checkUserOwnsPokemon(userId: string, pokemonId: string) {
  const result = await prisma.userPokemon.count({
    where: {
      user_id: userId,
      pokemon_id: pokemonId,
    },
  });
  return result;
}

async function addPokemonToUser(userId: string, pokemonId: string) {
  return await prisma.userPokemon.create({
    data: {
      user_id: userId,
      pokemon_id: pokemonId,
    },
  });
}
