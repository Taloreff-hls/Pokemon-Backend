import { Pokemon } from "../interfaces/pokemons.interfaces";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";
import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";
import { buildPokemonQuery } from "../utils/queryBuilder";

export const pokemonRepository = {
  getRandomPokemon,
  getPokemons,
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

async function getPokemons({
  sortBy,
  sortOrder,
  page,
  limit,
  filters,
  pokemonIds,
}: PokemonQueryOptions) {
  const query = buildPokemonQuery({
    sortBy,
    sortOrder,
    page,
    limit,
    filters,
    pokemonIds,
  });

  return await prisma.$queryRawUnsafe<Pokemon[]>(query);
}
