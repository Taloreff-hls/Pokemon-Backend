import { PrismaClient } from "@prisma/client";
import { PokemonQueryOptions } from "../interfaces/sort.interfaces";

const prisma = new PrismaClient();

export const pokemonRepo = {
  findPokemons,
};

async function findPokemons({
  sort,
  page,
  limit,
  filters,
}: PokemonQueryOptions) {
  const skip = (page - 1) * limit;

  return await prisma.pokemon.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: sort ? { [sort.field]: sort.order } : undefined,
  });
}
