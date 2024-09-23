import { Pokemon } from "../interfaces/pokemons.interfaces";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";
import { UserPokemonId } from "../interfaces/userPokemon.interfaces";
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
  sort,
  page,
  limit,
  filters,
}: PokemonQueryOptions) {
  const { user_id } = filters || {};

  let pokemonIds: string[] = [];

  if (user_id) {
    const userPokemons = await prisma.$queryRaw<UserPokemonId[]>`
      SELECT pokemon_id FROM "UserPokemon" WHERE user_id = ${user_id}
    `;
    pokemonIds = userPokemons.map((up) => up.pokemon_id);
  }

  const query = buildPokemonQuery({
    sort,
    page,
    limit,
    filters,
    pokemonIds,
  });

  return await prisma.$queryRawUnsafe<Pokemon[]>(query);
}
