import { Pokemon } from "../interfaces/pokemons.interfaces";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";
import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";
import { buildPokemonFilterQuery } from "../utils/queryBuilder";

export const pokemonRepository = {
  getRandomPokemon,
  getPokemons,
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

async function getPokemons({
  sortBy,
  sortOrder,
  page,
  limit,
  filters,
  pokemonIds,
}: PokemonQueryOptions) {
  const filterQuery = buildPokemonFilterQuery({ filters, pokemonIds });

  const query = Prisma.sql`
    SELECT p.*
    FROM "Pokemon" p
    ${filterQuery}
    ORDER BY ${Prisma.raw(sortBy || "name")} ${Prisma.raw(
    sortOrder?.toUpperCase() || "ASC"
  )}
    LIMIT ${limit}
    OFFSET ${(page - 1) * limit}
  `;
  const pokemons = await prisma.$queryRaw<Pokemon[]>(query);

  const countQuery = Prisma.sql`
    SELECT COUNT(*)
    FROM "Pokemon" p
    ${filterQuery}
  `;
  const total = await prisma.$queryRaw<{ count: bigint }[]>(countQuery);

  return { pokemons, total: Number(total[0]?.count || 0) };
}

async function checkPokemonExists(pokemonId: string) {
  const count = await prisma.pokemon.count({
    where: {
      id: pokemonId,
    },
  });
  return count > 0;
}
