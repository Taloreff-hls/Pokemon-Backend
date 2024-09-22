import { PokemonQueryOptions } from "../interfaces/sort.interfaces";

export function buildPokemonQuery({
  sort,
  page,
  limit,
  filters,
  pokemonIds = [],
}: PokemonQueryOptions) {
  const skip = (page - 1) * limit;
  const { name, user_id } = filters || {};

  let query = `
    SELECT p.*
    FROM "Pokemon" p
    WHERE 1=1
  `;

  if (user_id && pokemonIds.length > 0) {
    query += ` AND p.id IN (${pokemonIds.map((pid) => `'${pid}'`).join(", ")})`;
  }

  if (name) {
    query += ` AND p.name ILIKE '%${name}%'`;
  }

  if (sort) {
    query += ` ORDER BY ${sort.field} ${sort.order.toUpperCase()}`;
  }

  query += ` LIMIT ${limit} OFFSET ${skip}`;

  return query;
}
