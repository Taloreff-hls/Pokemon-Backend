import { Pokemon } from "../interfaces/pokemons.interfaces";
import { prisma } from "../utils/prisma";

export const pokemonRepository = {
  getRandomPokemon,
};

async function getRandomPokemon(listedIds: string) {
  return await prisma.$queryRaw<Pokemon[]>`
    SELECT * FROM "Pokemon"
    WHERE id NOT IN (${listedIds})
    ORDER BY RANDOM()
    LIMIT 1
  `;
}
