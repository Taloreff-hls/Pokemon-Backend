import { getUserPokemonQuery } from "../interfaces/pokemons.interfaces";
import { getRandomPokemonReq } from "../interfaces/users.interfaces";
import { prisma } from "../utils/prisma";

export const userPokemonRepository = {
  getUserPokemons,
};

async function getUserPokemons(userId: string) {
  return await prisma.$queryRaw<getUserPokemonQuery[]>`
    SELECT "pokemon_id" FROM "UserPokemon"
    WHERE "user_id" = ${userId}
  `;
}
