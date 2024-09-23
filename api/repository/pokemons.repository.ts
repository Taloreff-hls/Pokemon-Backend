import { Pokemon } from "../interfaces/pokemons.interfaces";
import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export const pokemonRepository = {
  getRandomPokemon,
  checkPokemonExists,
};

async function getRandomPokemon(listedIds: string[]) {
  const filter =
    listedIds.length > 0
      ? `WHERE id NOT IN (${listedIds.map((id) => `'${id}'`).join(", ")})`
      : "";

  const query = Prisma.raw(`
    SELECT * FROM "Pokemon"
    ${filter}
    ORDER BY RANDOM()
    LIMIT 1
  `);

  return await prisma.$queryRaw<Pokemon[]>(query);
}

async function checkPokemonExists(pokemonId: string) {
  const count = await prisma.pokemon.count({
    where: {
      id: pokemonId,
    },
  });
  return count > 0;
}
