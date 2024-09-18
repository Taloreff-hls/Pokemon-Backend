import { Prisma } from "@prisma/client";
import { Pokemon } from "../interfaces/pokemons.interfaces";
import { prisma } from "../utils/prisma";

export const pokemonRepo = {
  getUserPokemons,
  getRandomPokemon,
};

async function getUserPokemons(userId: string) {
  const ownedPokemons = await prisma.userPokemon.findMany({
    where: {
      userId: userId,
    },
    select: {
      pokemonId: true,
    },
  });

  return ownedPokemons.map((p) => p.pokemonId);
}

async function getRandomPokemon(ownedPokemonIds: string[]) {
  return await prisma.$queryRaw<Pokemon[]>`
    SELECT * FROM "Pokemon"
    WHERE id NOT IN (${Prisma.join(ownedPokemonIds)})
    ORDER BY RANDOM()
    LIMIT 1
  `;
}
