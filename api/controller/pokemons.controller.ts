import { Request, Response } from "express";
import { pokemonService } from "../service/pokemons.service";
import { mapSortOption } from "../utils/sortOptions";

export const listPokemons = async (req: Request, res: Response) => {
  try {
    const { sort, page, limit } = req.query;

    const parsedPage = page ? +page : 1;
    const parsedLimit = limit ? +limit : 10;

    const mappedSort = sort ? mapSortOption(sort as string) : undefined;

    const filters = req.body;

    const pokemons = await pokemonService.getPokemons({
      sort: mappedSort,
      page: parsedPage,
      limit: parsedLimit,
      filters,
    });

    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pokemons" });
  }
};
