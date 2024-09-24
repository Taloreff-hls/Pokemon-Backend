import { Prisma } from "@prisma/client";
import { Filters } from "../interfaces/sort.interfaces";

export function buildPokemonFilterQuery({
  filters,
  pokemonIds = [],
}: {
  filters?: Filters;
  pokemonIds?: string[];
}) {
  const { name, user_id } = filters || {};

  let filterQuery = Prisma.sql`WHERE 1=1`;

  if (user_id && pokemonIds.length === 0) {
    filterQuery = Prisma.sql`${filterQuery} AND 1=0`;
  } else if (user_id && pokemonIds.length > 0) {
    filterQuery = Prisma.sql`${filterQuery} AND p.id IN (${Prisma.join(
      pokemonIds
    )})`;
  }

  if (name) {
    filterQuery = Prisma.sql`${filterQuery} AND p.name ILIKE ${
      "%" + name + "%"
    }`;
  }

  return filterQuery;
}
