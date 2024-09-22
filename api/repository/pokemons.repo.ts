import { Pokemon, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";
import { UserPokemonId } from "../interfaces/userPokemon.interfaces";
import { buildPokemonQuery } from "../utils/queryBuilder";

export const pokemonRepo = {
  findPokemons,
};

async function findPokemons({
  sort,
  page,
  limit,
  filters,
}: PokemonQueryOptions): Promise<Pokemon[]> {
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
