import { Request, Response } from "express";
import { pokemonService } from "../service/pokemons.service";
import { SortBy, SortOrder } from "../interfaces/sort.interfaces";

export const pokemonController = {
  getRandomPokemon,
  getPokemons,
  catchPokemon,
};

async function getRandomPokemon(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;

    const pokemon = await pokemonService.getRandomPokemon(userId);

    res.status(200).json(pokemon);
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not found") {
      return res.status(400).json({ error: "User not found" });
    }
    if (err.message === "No available pokemons") {
      return res.status(200).json([]);
    }
    return res
      .status(500)
      .json({ error: "An error occurred while fetching pokemons" });
  }
}

async function getPokemons(req: Request, res: Response) {
  try {
    const { sort_by, sort_order, page, limit } = req.query;

    const parsedPage = +page!;
    const parsedLimit = +limit!;

    const sortBy = sort_by as SortBy | undefined;
    const sortOrder = sort_order as SortOrder | undefined;

    const filters = req.body;

    const pokemons = await pokemonService.getPokemons({
      sortBy,
      sortOrder,
      page: parsedPage,
      limit: parsedLimit,
      filters,
    });

    res.json(pokemons);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pokemons" });
  }
}

async function catchPokemon(req: Request, res: Response) {
  try {
    const userId = req.params.id as string;
    const { pokemonId } = req.body;

    const result = await pokemonService.catchPokemon(userId, pokemonId);

    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not found") {
      return res.status(400).json({ error: "User not found" });
    }
    if (err.message === "Pokémon not found") {
      return res.status(404).json({ error: "Pokémon not found" });
    }
    if (err.message === "Pokemon already owned") {
      return res
        .status(409)
        .json({ error: "This Pokémon is already in your collection" });
    }
    return res.status(500).json({ error: "Failed to catch Pokémon" });
  }
}
