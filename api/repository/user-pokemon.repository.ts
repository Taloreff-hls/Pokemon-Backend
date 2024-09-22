import { getUserPokemonQuery } from "../interfaces/pokemons.interfaces";
import { getRandomPokemonReq } from "../interfaces/users.interfaces";
import { prisma } from "../utils/prisma";

export const userPokemonRepository = {
  getUserPokemons,
  addPokemonToUser,
};

async function getUserPokemons(userId: string) {
  return await prisma.$queryRaw<getUserPokemonQuery[]>`
    SELECT "pokemon_id" FROM "UserPokemon"
    WHERE "user_id" = ${userId}
  `;
}

async function addPokemonToUser(userId: string, pokemonId: string) {
  return await prisma.userPokemon.create({
    data: {
      user_id: userId,
      pokemon_id: pokemonId,
    },
  });
}
