import { Pokemon } from "../interfaces/pokemons.interfaces";
import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export const pokemonRepository = {
  getRandomPokemon,
};

async function getRandomPokemon(listedIds: string[]) {
  const query =
    listedIds.length > 0
      ? Prisma.sql`
    SELECT * FROM "Pokemon"
    WHERE id NOT IN (${Prisma.join(listedIds)})
    ORDER BY RANDOM()
    LIMIT 1
  `
      : Prisma.sql`
    SELECT * FROM "Pokemon"
    ORDER BY RANDOM()
    LIMIT 1
  `;

  return await prisma.$queryRaw<Pokemon[]>(query);
}
